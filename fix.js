const fs = require('fs');
let lines = fs.readFileSync('js/cuenta.js', 'utf8').split('\n');

lines[159] = '            \'<p class=\"profile-dropdown-hint profile-dropdown-hint--logged\">Tu sesión está activa en esta pestaña.</p>\' +';
lines[160] = '            \'<a href=\"ayuda.html\" class=\"profile-dropdown-help\" role=\"menuitem\">Centro de información y ayuda</a>\' +';
lines[161] = '            \'<button type=\"button\" class=\"profile-dropdown-logout\" id=\"profile-logout\" role=\"menuitem\">Cerrar sesión</button>\';';
lines[325] = '            \'<h3><i class=\"fa-solid fa-box\" aria-hidden=\"true\"></i> Último pedido</h3>\' +';
lines[559] = '                    passMsg.textContent = \"✓ \" + data.message;';
lines[88] = '                    \'\" aria-label=\"Quitar una unidad\">-</button>\' +';

fs.writeFileSync('js/cuenta.js', lines.join('\n'));
console.log('Done!');
