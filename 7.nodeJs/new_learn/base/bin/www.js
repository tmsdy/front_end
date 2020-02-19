const http = require('http')

const PORT = 4000
const serverHandle = require('../app')

const server = http.createServer(serverHandle)

server.listen(PORT, () => {
    console.log(`server is listening ${PORT}`)
})
