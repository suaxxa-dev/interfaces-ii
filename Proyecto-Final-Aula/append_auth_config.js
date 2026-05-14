const fs = require('fs');
let auth = fs.readFileSync('js/auth.js', 'utf8');
auth += `\n/* ══════════════════════════════════════
   CONFIGURACIÓN DEL SISTEMA
   ══════════════════════════════════════ */
window.MERCA_CONFIG = { iva: 19 };
async function loadSystemConfig() {
    try {
        const res = await fetch('/api/config');
        if (res.ok) window.MERCA_CONFIG = await res.json();
    } catch (e) {}
}
loadSystemConfig();\n`;
fs.writeFileSync('js/auth.js', auth);
console.log('Done');
