const fs = require('fs');
let auth = fs.readFileSync('js/auth.js', 'utf8');

const mc = `
window.mercaConfirm = function(msg) {
    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay active';
        overlay.style.zIndex = '9999';
        const content = document.createElement('div');
        content.className = 'modal-content admin-modal';
        content.style.maxWidth = '400px';
        content.style.textAlign = 'center';
        content.innerHTML = \`<h3 style='margin-bottom:15px; color:#0f172a;'>Confirmación</h3><p style='margin-bottom:25px; color:#475569;'>\${msg}</p><div style='display:flex; gap:10px; justify-content:center;'><button id='mc-cancel' class='btn-primary' style='background:#e2e8f0; color:#475569;'>Cancelar</button><button id='mc-ok' class='btn-primary'>Aceptar</button></div>\`;
        overlay.appendChild(content);
        document.body.appendChild(overlay);
        document.getElementById('mc-cancel').onclick = () => { overlay.remove(); resolve(false); };
        document.getElementById('mc-ok').onclick = () => { overlay.remove(); resolve(true); };
    });
};
`;

auth = auth.replace('window.MERCA_CONFIG', mc + '\nwindow.MERCA_CONFIG');
fs.writeFileSync('js/auth.js', auth);
console.log('mercaConfirm added');
