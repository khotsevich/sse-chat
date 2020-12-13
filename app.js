const path = require('path')
const EventEmitter = require('events')
const express = require('express')

const chatEmitter = new EventEmitter()
const app = express()

app.get('/', (req, res) => {
  return res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.get('/chat', (req, res) => {
  const { message } = req.query
  chatEmitter.emit('message', message)
  return res.end()
})

app.get('/sse', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    Connection: 'keep-alive'
  })

  const onMessage = msg => res.write(`data: ${msg}\n\n`)

  chatEmitter.on('message', onMessage)

  res.on('close', () => {
    chatEmitter.off('message', onMessage)
  })
})

app.listen(5000)
