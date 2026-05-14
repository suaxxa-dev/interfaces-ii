const fs = require('fs');
const files = ['js/producto.js', 'js/mainpage.js', 'js/catalogo.js', 'js/carrito.js', 'js/cuenta.js'];

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/session\.rol === 'admin'/g, "['admin', 'admin_pro', 'admin_junior'].includes(session.rol)");
    fs.writeFileSync(f, content);
});
console.log('Fixed adminLink visibility properly');
