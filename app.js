var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var fs = require('fs')
var path = require('path')
var colors = JSON.parse(fs.readFileSync('colors.json'))
var clix = JSON.parse(fs.readFileSync('clix.json'))
var users = JSON.parse(fs.readFileSync('users.json'))
var port = process.env.PORT || 80

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/index.html'))
})
app.get('/favicon.ico', function (req, res) {
  res.sendFile(path.join(__dirname, '/favicon.ico'))
})
app.get('/favicon.png', function (req, res) {
  res.sendFile(path.join(__dirname, '/favicon.png'))
})
function forEachIndex (arr, ind) {
  for (var i = 0; i < arr.length; ++i) { if (arr[i].includes(ind) === true) { return i } }
}
function wFile (p, file) {
  fs.writeFileSync(file, JSON.stringify(p, null, 2), 'utf8', { if (err) { return console.log(err) } })
}
io.on('connection', function (socket) {
  console.log('CLIENT CONNECTED WITH IP: ' + socket.request.connection.remoteAddress.split(':').splice(0, 1)[0])
  io.emit('connecto', {cl: clix, co: colors})
  socket.on('shutdown', function () {
    wFile(clix, clix.json)
    wFile(colors, colors.json)
    process.exit()
  })
  socket.on('clicko', function (data) {
    var nuuid = 'n' + data.uuid
    var user = users[nuuid]
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
    if (pc !== user.clan && pc !== 6) {
      clixIndex = forEachIndex(clix, data.i)
      if (clixIndex === 0) {
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
    if (pc === user.clan) {
      clixIndex = forEachIndex(clix, data.i)
      clix[clixIndex].splice(clix[clixIndex].indexOf(data.i), 1)
      clix[clixIndex + 1].push(data.i)
      clixIndex = forEachIndex(clix, data.i)
      io.emit('clicka', {ind: data.i, am: clixIndex})
    }
    if (pc === 6) {
      colors[user.clan].push(data.i)
      clix[1].push(data.i)
      io.emit('clickc', {ind: data.i, co: user.clan})
    }
  })
})
setInterval(function () {
  wFile(clix, clix.json); wFile(colors, colors.json)
}, 60000)
http.listen(port, function () {
  console.log('SERVER LISTENING ON PORT ' + port)
})
