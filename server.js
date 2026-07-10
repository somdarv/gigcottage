const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

// Production entry point (Passenger runs this as the Node app on cPanel).
// Always production here — `next dev` is only used locally via `npm run dev`.
const port = process.env.PORT || 3000
const app = next({ dev: false })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res, parse(req.url, true))
  }).listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
  })
})
