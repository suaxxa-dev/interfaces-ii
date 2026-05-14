const initSqlJs = require('sql.js');
const fs = require('fs');
async function run() {
  const SQL = await initSqlJs();
  const fileBuffer = fs.readFileSync('mercatodo.db');
  const db = new SQL.Database(fileBuffer);
  
  // Fix the role
  db.run("UPDATE usuarios SET rol = 'admin_pro' WHERE rol = 'admin'");
  
  // Export and save
  const data = db.export();
  fs.writeFileSync('mercatodo.db', Buffer.from(data));
  console.log('Migrated admin to admin_pro');
}
run();
