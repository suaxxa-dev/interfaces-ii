const fs = require('fs');

const css = `
/* Toast Notification System */
.merca-toast-container {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 99999;
    display: flex;
    flex-direction: column;
    gap: 10px;
    pointer-events: none;
}
.merca-toast {
    background-color: var(--text-color, #1a202c);
    color: #fff;
    padding: 14px 24px;
    border-radius: 8px;
    font-family: inherit;
    font-size: 15px;
    font-weight: 500;
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    display: flex;
    align-items: center;
    gap: 12px;
    animation: mercaToastIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    pointer-events: auto;
}
.merca-toast.is-hiding {
    animation: mercaToastOut 0.3s ease forwards;
}
.merca-toast i {
    font-size: 20px;
    color: var(--primary-color, #f97316);
}
@keyframes mercaToastIn {
    from { opacity: 0; transform: translateY(100%); }
    to { opacity: 1; transform: translateY(0); }
}
@keyframes mercaToastOut {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(100%); }
}
`;

fs.appendFileSync('css/mainpage.css', css);
console.log('Appended Toast CSS!');
