const initSqlJs = require('sql.js');
const fs = require('fs');

async function fixDb() {
  const SQL = await initSqlJs();
  const fileBuffer = fs.readFileSync('mercatodo.db');
  const db = new SQL.Database(fileBuffer);

  db.run('DELETE FROM productos');
  
  const data = db.export();
  fs.writeFileSync('mercatodo.db', Buffer.from(data));
  console.log('Productos borrados correctamente de la base de datos.');
}

fixDb();
