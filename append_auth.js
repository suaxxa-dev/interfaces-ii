const fs = require('fs');
let auth = fs.readFileSync('js/auth.js', 'utf8');
auth += `\n/* ══════════════════════════════════════
   NOTIFICACIONES (Toast)
   ══════════════════════════════════════ */
window.mercaAlert = function(msg, isSuccess = false) {
    let container = document.querySelector('.merca-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'merca-toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'merca-toast';
    const icon = document.createElement('i');
    icon.className = isSuccess ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-exclamation';
    if (isSuccess) icon.style.color = '#10b981';
    const text = document.createElement('span');
    text.textContent = msg;
    toast.appendChild(icon);
    toast.appendChild(text);
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('is-hiding');
        toast.addEventListener('animationend', () => toast.remove());
    }, 3000);
};\n`;
fs.writeFileSync('js/auth.js', auth);
console.log('Appended mercaAlert');
