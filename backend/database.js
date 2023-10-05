const mysql = require('mysql2');

// Configura la conexión a la base de datos
const connection = mysql.createConnection({
  host: 'localhost',      // Cambia esto al host de tu base de datos
  user: 'root',     // Cambia esto a tu nombre de usuario de MySQL
  password: '42337856', // Cambia esto a tu contraseña de MySQL
  database: 'db_tp3'      // Cambia esto al nombre de tu base de datos
});

// Conexión a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    throw err;
  }
  console.log('Conexión a la base de datos MySQL exitosa.');
});

module.exports = connection; // Exporta la conexión para su uso 