const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const http = require('http')
const socketIo = require('socket.io')
const session = require('express-session')
const bcrypt = require('bcrypt')
const AdmZip = require('adm-zip')
const { ExcelProcessor } = require('./helpers/excelProcessor')
const { generar } = require('./actions/generar')
const { getExcelDownloadsFolder } = require('./helpers/helper')
const logger = require('./helpers/logger')
const chalk = require('chalk')

const app = express()
const server = http.createServer(app)
const io = socketIo(server)

const PORT = process.env.PORT || 3000

// Configuración de autenticación
const AUTH_USERNAME = process.env.AUTH_USERNAME || 'admin'
const AUTH_PASSWORD_HASH = process.env.AUTH_PASSWORD 
  ? bcrypt.hashSync(process.env.AUTH_PASSWORD, 10)
  : bcrypt.hashSync('cambiar-este-password-123', 10)
const SESSION_SECRET = process.env.SESSION_SECRET || 'cambiar-este-secret-xyz789'

// Configurar multer para subir archivos
const upload = multer({
  dest: 'data/',
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    if (ext !== '.xlsx' && ext !== '.xls' && ext !== '.csv') {
      return cb(new Error('Solo se permiten archivos Excel (.xlsx, .xls) o CSV'))
    }
    cb(null, true)
  }
})

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Configurar sesiones
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}))

// Middleware de autenticación
const requireAuth = (req, res, next) => {
  if (req.session && req.session.authenticated) {
    return next()
  }
  res.redirect('/login')
}

// Servir archivos estáticos solo para rutas autenticadas
app.use('/public', requireAuth, express.static('public'))

// Ruta de login (GET)
app.get('/login', (req, res) => {
  if (req.session && req.session.authenticated) {
    return res.redirect('/')
  }
  res.sendFile(path.join(__dirname, 'public', 'login.html'))
})

// Ruta de login (POST)
app.post('/login', async (req, res) => {
  const { username, password } = req.body
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña requeridos' })
  }
  
  try {
    const validUsername = username === AUTH_USERNAME
    const validPassword = await bcrypt.compare(password, AUTH_PASSWORD_HASH)
    
    if (validUsername && validPassword) {
      req.session.authenticated = true
      req.session.username = username
      res.json({ success: true })
    } else {
      res.status(401).json({ error: 'Credenciales inválidas' })
    }
  } catch (error) {
    logger.error('Error en login:', error)
    res.status(500).json({ error: 'Error del servidor' })
  }
})

// Ruta de logout
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      logger.error('Error al cerrar sesión:', err)
      return res.status(500).json({ error: 'Error al cerrar sesión' })
    }
    res.json({ success: true })
  })
})

// Ruta principal (protegida)
app.get('/', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// Ruta para subir archivo y procesar (protegida)
app.post('/upload', requireAuth, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se subió ningún archivo' })
  }

  const socketId = req.body.socketId
  const clientSocket = io.sockets.sockets.get(socketId)

  try {
    // Renombrar archivo para que tenga la extensión correcta
    const ext = path.extname(req.file.originalname)
    const newPath = req.file.path + ext
    fs.renameSync(req.file.path, newPath)

    // Emitir evento de inicio
    if (clientSocket) {
      clientSocket.emit('progress', {
        type: 'info',
        message: `Procesando archivo: ${req.file.originalname}`
      })
    }

    // Crear instancia del procesador Excel
    const excelProcessor = new ExcelProcessor('../data')
    
    // Configurar el procesador para emitir eventos de progreso
    const originalLogRowInfo = excelProcessor.logRowInfo.bind(excelProcessor)
    let currentRowData = {}
    
    excelProcessor.logRowInfo = function(currentRow, totalRows, row) {
      // Guardar datos de la fila actual
      currentRowData = {
        currentRow,
        totalRows,
        emisor: row[0],
        receptor: row[2],
        monto: row[3],
        pago: row[4],
        tipo: row[5]
      }
      
      if (clientSocket) {
        clientSocket.emit('progress', {
          type: 'row-start',
          ...currentRowData
        })
      }
      originalLogRowInfo(currentRow, totalRows, row)
    }
    
    // Interceptar el logger para capturar éxitos y errores
    const originalError = logger.error.bind(logger)
    const originalInfo = logger.info.bind(logger)
    
    logger.info = function(...args) {
      const message = args[0]
      if (typeof message === 'string' && message.includes('✓ Fila') && message.includes('procesada y factura confirmada')) {
        if (clientSocket && currentRowData.currentRow) {
          clientSocket.emit('progress', {
            type: 'row-success',
            ...currentRowData
          })
        }
      }
      originalInfo(...args)
    }
    
    logger.error = function(...args) {
      const message = args[0]
      if (typeof message === 'string' && message.includes('❌ Error en fila')) {
        if (clientSocket && currentRowData.currentRow) {
          clientSocket.emit('progress', {
            type: 'row-error',
            ...currentRowData,
            errorMessage: args[0]
          })
        }
      }
      originalError(...args)
    }

    // Ejecutar procesamiento
    const resultados = await excelProcessor.ejecutar(generar)
    
    // Restaurar logger
    logger.info = originalInfo
    logger.error = originalError

    // Limpiar archivo temporal
    fs.unlinkSync(newPath)

    // Crear ZIP con los PDFs generados
    let zipPath = null
    let pdfCount = 0
    
    if (resultados && resultados.length > 0) {
      try {
        const runDate = excelProcessor.runDate
        const downloadsFolder = getExcelDownloadsFolder(runDate)
        
        // Verificar que la carpeta existe y tiene archivos
        if (fs.existsSync(downloadsFolder)) {
          const files = fs.readdirSync(downloadsFolder).filter(file => file.endsWith('.pdf'))
          pdfCount = files.length
          
          if (files.length > 0) {
            logger.info(chalk.cyan(`\n📦 Comprimiendo ${files.length} archivos PDF...`))
            
            if (clientSocket) {
              clientSocket.emit('progress', {
                type: 'info',
                message: `Comprimiendo ${files.length} facturas PDF...`
              })
            }
            
            // Crear el archivo zip
            const zip = new AdmZip()
            
            // Agregar todos los archivos PDF al zip
            files.forEach(file => {
              const filePath = path.join(downloadsFolder, file)
              zip.addLocalFile(filePath)
            })
            
            // Guardar el zip en la carpeta downloads con el nombre de la fecha
            zipPath = path.join(process.cwd(), 'data', 'downloads', `facturas_${runDate}.zip`)
            zip.writeZip(zipPath)
            
            logger.info(chalk.green(`✓ Archivo ZIP creado: ${zipPath}`))
            logger.info(chalk.green(`✓ Total de archivos: ${files.length}`))
            
            if (clientSocket) {
              clientSocket.emit('progress', {
                type: 'info',
                message: `✓ ZIP creado con ${files.length} facturas PDF`
              })
            }
          }
        }
      } catch (error) {
        logger.error(chalk.red('❌ Error al crear ZIP:'), error)
        if (clientSocket) {
          clientSocket.emit('progress', {
            type: 'error',
            message: `Error al crear ZIP: ${error.message}`
          })
        }
      }
    }

    // Detalle de filas que fallaron (para el resumen ejecutivo)
    const erroresDetalle = excelProcessor.errores || []
    const totalFilasProcesadas = excelProcessor.data
      ? excelProcessor.data.length
      : resultados.length + erroresDetalle.length

    // Enviar resultado final
    if (clientSocket) {
      clientSocket.emit('progress', {
        type: 'complete',
        message: `Proceso completado: ${resultados.length} facturas generadas`,
        resultados,
        zipAvailable: zipPath !== null,
        zipFile: zipPath ? path.basename(zipPath) : null,
        pdfCount: pdfCount,
        totalFilas: totalFilasProcesadas,
        errores: erroresDetalle
      })
    }

    res.json({
      success: true,
      message: `Se procesaron ${resultados.length} facturas exitosamente`,
      facturas: resultados,
      zipFile: zipPath ? path.basename(zipPath) : null,
      pdfCount: pdfCount,
      totalFilas: totalFilasProcesadas,
      errores: erroresDetalle
    })

  } catch (error) {
    logger.error('Error al procesar archivo:', error)
    
    // Limpiar archivo si existe
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path)
    }

    if (clientSocket) {
      clientSocket.emit('progress', {
        type: 'error',
        message: error.message
      })
    }

    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Ruta para descargar CSV de resultados (protegida)
app.get('/download-results', requireAuth, (req, res) => {
  const { fecha, detalle, valor } = req.query
  
  if (!fecha || !detalle || !valor) {
    return res.status(400).json({ error: 'Datos incompletos' })
  }

  // Crear CSV desde los resultados
  const csvContent = `Fecha,Detalle,Monto\n${fecha},${detalle},${valor}`
  
  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', `attachment; filename=facturas_${Date.now()}.csv`)
  res.send(csvContent)
})

// Ruta para descargar ZIP con PDFs de facturas
app.get('/download-pdfs/:filename', requireAuth, (req, res) => {
  const { filename } = req.params
  
  // Validar que sea un archivo zip
  if (!filename.endsWith('.zip')) {
    return res.status(400).json({ error: 'Archivo inválido' })
  }
  
  const filePath = path.join(process.cwd(), 'data', 'downloads', filename)
  
  // Verificar que el archivo existe
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Archivo no encontrado' })
  }
  
  res.download(filePath, filename, (err) => {
    if (err) {
      logger.error('Error al descargar ZIP:', err)
      res.status(500).json({ error: 'Error al descargar archivo' })
    }
  })
})

// Ruta para descargar resultados como CSV
app.post('/export-results', requireAuth, (req, res) => {
  const { facturas } = req.body
  
  if (!facturas || !Array.isArray(facturas)) {
    return res.status(400).json({ error: 'No hay facturas para exportar' })
  }

  // Crear contenido CSV
  let csvContent = 'Fecha,Detalle,Monto\n'
  facturas.forEach(factura => {
    csvContent += `${factura.fecha || 'N/A'},${factura.detalle || 'N/A'},${factura.valor || 'N/A'}\n`
  })

  const filename = `facturas_${new Date().toISOString().split('T')[0]}_${Date.now()}.csv`
  
  res.setHeader('Content-Type', 'text/csv; charset=utf-8')
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
  res.send('\ufeff' + csvContent) // BOM para Excel
})

// WebSocket para comunicación en tiempo real
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id)
  
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id)
  })
})

server.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════╗
║                                                      ║
║   🚀 Facturador AFIP Web                            ║
║                                                      ║
║   Servidor corriendo en:                            ║
║   http://localhost:${PORT}                              ║
║                                                      ║
║   Presiona Ctrl+C para detener                      ║
║                                                      ║
╚══════════════════════════════════════════════════════╝
  `)
})
