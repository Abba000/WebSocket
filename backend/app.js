const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
const WebSocket = require('ws');
const db = require('./database');
const tokenFijo = 'mi_token_secreto';

app.use(bodyParser.json());

// Ruta GET para mostrar un mensaje simple
app.get('/', (req, res) => {
    res.send('¡Hola, mundo!');
});

// Crear un servidor WebSocket
const wss = new WebSocket.Server({ noServer: true });

// Mantener un conjunto de conexiones WebSocket activas
const clients = new Map();
let nextClientId = 1;

// Manejar conexiones entrantes al servidor WebSocket
wss.on('connection', (ws) => {
    console.log('Cliente WebSocket conectado.');

    const clientId = nextClientId++;
    clients.set(clientId, ws);

    ws.on('message', (message) => {
        console.log(`Mensaje recibido del cliente ${clientId}: ${message}`);
    });

    ws.on('close', () => {
        console.log(`Cliente ${clientId} desconectado.`);
        clients.delete(clientId);
    });
});

// Agregar el servidor WebSocket como un middleware
app.server = app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

// Agregar el servidor WebSocket como un middleware para conexiones WebSocket
app.server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

app.post('/webhook', (req, res) => {
    const receivedData = req.body;

    // Verifica si se proporcionó un token en la URL
    const tokenProvided = req.query.token;

    // Compara el token proporcionado con el token fijo
    if (tokenProvided === tokenFijo) {
        // Si los tokens coinciden, procede con la inserción de datos en la tabla 
        // Verifica que los datos recibidos contengan los campos necesarios (temperatura, humedad, timestamp)
        if (receivedData.id && receivedData.temperatura && receivedData.humedad && receivedData.timestamp) {
            // Realiza la inserción en la tabla 
            const sql = 'INSERT INTO prueba (id, temperatura, humedad, timestamp) VALUES (?, ?, ?, ?)';
            const values = [receivedData.id, receivedData.temperatura, receivedData.humedad, receivedData.timestamp];

            db.query(sql, values, (err, result) => {
                if (err) {
                    console.error('Error al insertar datos en la tabla prueba:', err);
                    res.status(500).send('Error en el servidor');
                    return;
                }

                console.log('Datos insertados en la tabla prueba:', result);

                // Envía el mensaje a todos los clientes WebSocket conectados
                const message = `${JSON.stringify(receivedData)}`;
                clients.forEach((client, id) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(message);
                    }
                });

                res.status(200).send('Datos insertados en la tabla prueba');
            });
        } else {
            // Si los datos no contienen los campos necesarios devuelve un error de validación
            res.status(400).send('Datos de solicitud no válidos');
        }
    } else {
        // Si el token no coincide devuelve un error de autenticación
        res.status(401).send('Acceso no autorizado');
    }
});

// Ruta GET para obtener los datos de la tabla 'prueba'
app.get('/prueba', (req, res) => {
    // Ejecuta consulta SQL 
    db.query('SELECT * FROM prueba', (err, results) => {
      if (err) {
        console.error('Error al obtener los registros de prueba:', err);
        res.status(500).send('Error en el servidor');
        return;
      }
      res.json(results); // Envia resultados 
    });
});