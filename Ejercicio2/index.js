import { createServer } from 'http';
import staticHandler from 'serve-handler';
import ws, { WebSocketServer } from 'ws';
//serve static folder
const server = createServer((req, res) => {   // (1)
    return staticHandler(req, res, { public: './Ejercicio2/public' })
});
const wss = new WebSocketServer({ server }) // (2)
wss.on('connection', (client) => {
    console.log('Cliente conectado !')
    client.on('message', (msg) => {    // (3)
        console.log(`Message:${msg}`);
        broadcast(msg)
    })
})
function broadcast(msg) {       // (4)
    for (const client of wss.clients) {
        if (client.readyState === ws.OPEN) {
            client.send(msg)
        }
    }
}
server.listen(process.argv[2] || 8083, () => {
    console.log(`servidor escuchando peticiones...`);
})