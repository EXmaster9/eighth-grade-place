var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var fs = require('fs')
var colors = JSON.parse(fs.readFileSync('colors.json'))
var clix = JSON.parse(fs.readFileSync('clix.json'))
var port = process.env.PORT || 80

app.get('/', function (req, res) {
  res.sendFile('index.html')
})
app.get('/favicon.ico', function (req, res) {
  res.sendFile('favicon.ico')
})
app.get('/favicon.png', function (req, res) {
  res.sendFile('favicon.png')
})
function forEachIndex (arr, ind) {
  for (var i = 0; i < arr.length; ++i) { if (arr[i].includes(ind) === true) { return i } }
}
function wFile (p, file) {
  fs.writeFileSync(file, JSON.stringify(p, null, 2), 'utf8', { if (err) { return console.log(err) } })
}
io.on('connection', function (socket) {
  console.log('CLIENT CONNECTED WITH IP: ' + socket.request.connection.remoteAddress.split(':').slice(3)[0])
  io.emit('connecto', {cl: clix, co: colors})
  socket.on('shutdown', function () {
    wFile(clix, clix.json)
    wFile(colors, colors.json)
    process.exit()
  })
  socket.on('clicko', function (data) {
    var userco
    if (data.uc == null) {
      userco = 0 // Math.round(Math.random() * (5 - 0) + 0)
    } else {
      userco = data.uc
    }
    var pc
    var clixIndex
    switch (forEachIndex(colors, data.i)) {
      case 0:
        pc = 0
        break
      case 1:
        pc = 1
        break
      case 2:
        pc = 2
        break
      case 3:
        pc = 3
        break
      case 4:
        pc = 4
        break
      case 5:
        pc = 5
        break
      default:
        pc = 6
    }
    if (pc !== userco && pc !== 6) {
      try {
        if (colors[userco].includes(data.i + 100) || colors[userco].includes(data.i - 100) || colors[userco].includes(data.i + 1) || colors[userco].includes(data.i - 1)) {
          clixIndex = forEachIndex(clix, data.i)
          if (clixIndex === 1) {
            clix[0].splice(clix[0].indexOf(data.i), 1)
            colors[forEachIndex(colors, data.i)].splice(colors[forEachIndex(colors, data.i)].indexOf(data.i), 1)
            io.emit('clickc', {ind: data.i, co: 6})
          } else {
            clix[clixIndex].splice(clix[clixIndex].indexOf(data.i), 1)
            clix[clixIndex - 1].push(data.i)
            clixIndex = forEachIndex(clix, data.i)
            io.emit('clicka', {ind: data.i, am: clixIndex})
          }
        }
      } catch (err) {}
    }
    if (pc === userco) {
      try {
        clixIndex = forEachIndex(clix, data.i)
        if (clixIndex === undefined) { clixIndex = 998 }
        clix[clixIndex].splice(clix[clixIndex].indexOf(data.i), 1)
        clix[clixIndex + 1].push(data.i)
        clixIndex = forEachIndex(clix, data.i)
        io.emit('clicka', {ind: data.i, am: clixIndex})
      } catch (err) {}
    }
    if (pc === 6) {
      try {
        if (colors[userco].includes(data.i + 100) || colors[userco].includes(data.i - 100) || colors[userco].includes(data.i + 1) || colors[userco].includes(data.i - 1)) {
          colors[userco].push(data.i)
          clix[1].push(data.i)
          io.emit('clickc', {ind: data.i, co: userco})
        }
      } catch (err) {}
    }
  })
})
setInterval(function () {
  wFile(clix, 'clix.json'); wFile(colors, 'colors.json')
  console.log('WORLD FILES SAVED AT ' + Date().toUpperCase())
}, 60000)
http.listen(port, function () {
  console.log('SERVER LISTENING ON PORT ' + port)
})
