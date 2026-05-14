const fs = require('fs');

let adminJs = fs.readFileSync('js/admin.js', 'utf8');

adminJs = adminJs.replace(
    `if (!session.authenticated || session.user.rol !== 'admin') {`,
    `if (!session.authenticated || !['admin_junior', 'admin_pro'].includes(session.user.rol)) {\n            window.userRol = session.user.rol;\n            if (session.user.rol === 'admin_pro') {\n                document.querySelectorAll('.admin-pro-only').forEach(el => el.style.display = '');\n            }`
);

adminJs = adminJs.replace(
    `} else if (section === 'users') {`,
    `} else if (section === 'logs' && window.userRol === 'admin_pro') {
            headerTitle.textContent = 'Auditoría';
            headerDesc.textContent = 'Historial de acciones de los administradores.';
            btnNew.style.display = 'none';
            await loadLogs();
        } else if (section === 'admins' && window.userRol === 'admin_pro') {
            headerTitle.textContent = 'Gestión de Administradores';
            headerDesc.textContent = 'Añadir y administrar roles de administradores.';
            btnNew.style.display = 'none';
            await loadAdmins();
        } else if (section === 'config' && window.userRol === 'admin_pro') {
            headerTitle.textContent = 'Configuración del Sistema';
            headerDesc.textContent = 'Configurar impuestos, moneda y ajustes globales.';
            btnNew.style.display = 'none';
            await loadConfig();
        } else if (section === 'reports' && window.userRol === 'admin_pro') {
            headerTitle.textContent = 'Reportes Financieros';
            headerDesc.textContent = 'Estadísticas de ventas y resumen financiero.';
            btnNew.style.display = 'none';
            await loadReports();
        } else if (section === 'users') {`
);

const newFunctions = `
    async function loadLogs() {
        try {
            const res = await fetch('/api/admin/logs');
            const logs = await res.json();
            const tbody = document.getElementById('logs-table-body');
            if (logs.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 20px;">No hay registros.</td></tr>';
                return;
            }
            tbody.innerHTML = logs.map(l => \`
                <tr>
                    <td>\${l.fecha}</td>
                    <td><strong>\${l.admin_nombre}</strong> <small>(\${l.admin_email})</small></td>
                    <td><span class="badge-cat">\${l.accion}</span></td>
                    <td>\${l.detalles}</td>
                </tr>
            \`).join('');
        } catch (e) {
            document.getElementById('logs-table-body').innerHTML = '<tr><td colspan="4" style="color:red; text-align:center;">Error al cargar auditoría.</td></tr>';
        }
    }

    async function loadAdmins() {
        try {
            const res = await fetch('/api/admin/users');
            const users = await res.json();
            const admins = users.filter(u => ['admin_junior', 'admin_pro'].includes(u.rol));
            const tbody = document.getElementById('admins-table-body');
            tbody.innerHTML = admins.map(u => \`
                <tr>
                    <td><strong>\${u.nombre}</strong></td>
                    <td>\${u.email}</td>
                    <td><span class="badge-role role-\${u.rol}">\${u.rol.toUpperCase()}</span> <br><small>\${u.estado || 'activo'}</small></td>
                    <td>
                        \${u.rol !== 'admin_pro' ? \`
                            \${u.estado === 'activo' ? 
                                \`<button class="btn-primary" style="background:#dc2626; padding:4px 8px; font-size:12px;" onclick="changeAdminStatus(\${u.id}, 'suspendido')">Suspender</button>\` : 
                                \`<button class="btn-primary" style="background:#16a34a; padding:4px 8px; font-size:12px;" onclick="changeAdminStatus(\${u.id}, 'activo')">Activar</button>\`
                            }
                        \` : '<em>No modificable</em>'}
                    </td>
                </tr>
            \`).join('');
        } catch (e) {}
    }

    async function loadConfig() {
        try {
            const res = await fetch('/api/admin/config');
            const config = await res.json();
            document.getElementById('c-iva').value = config.iva;
        } catch (e) {}
    }

    async function loadReports() {
        try {
            const res = await fetch('/api/admin/orders');
            const orders = await res.json();
            const totalVentas = orders.filter(o => o.estado !== 'cancelado').reduce((sum, o) => sum + o.total, 0);
            document.getElementById('reports-content').innerHTML = \`
                <div style="padding:20px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; text-align:center;">
                    <h4 style="color:#64748b; font-size:14px; text-transform:uppercase; margin-bottom:10px;">Total Ventas (No canceladas)</h4>
                    <div style="font-size:36px; font-weight:bold; color:#0f172a;">$ \${Math.round(totalVentas).toLocaleString('es-CO')}</div>
                    <p style="margin-top:10px; font-size:14px; color:#64748b;">De \${orders.filter(o => o.estado !== 'cancelado').length} pedidos confirmados/entregados.</p>
                </div>
            \`;
        } catch (e) {}
    }

    window.changeAdminStatus = async (id, status) => {
        if (!confirm('¿Seguro que deseas cambiar el estado a ' + status + '?')) return;
        try {
            const res = await fetch(\`/api/admin/users/\${id}/status\`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (res.ok) await loadAdmins();
            else mercaAlert('Error cambiando estado');
        } catch (e) {}
    };
`;

adminJs = adminJs.replace(
    `function setupEventListeners() {`,
    newFunctions + `\n    function setupEventListeners() {`
);

const adminEvents = `
        const configForm = document.getElementById('config-form');
        if (configForm) {
            configForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const iva = parseFloat(document.getElementById('c-iva').value);
                try {
                    const res = await fetch('/api/admin/config', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ iva })
                    });
                    if (res.ok) mercaAlert('Configuración guardada exitosamente', true);
                    else mercaAlert('Error al guardar configuración');
                } catch(err) { mercaAlert('Error de conexión'); }
            });
        }

        const btnNewAdmin = document.getElementById('btn-new-admin');
        if (btnNewAdmin) {
            btnNewAdmin.addEventListener('click', async () => {
                const nombre = prompt('Nombre del nuevo Admin Junior:');
                if (!nombre) return;
                const email = prompt('Correo electrónico del nuevo admin:');
                if (!email) return;
                const password = prompt('Contraseña provisional:');
                if (!password) return;

                try {
                    const res = await fetch('/api/admin/create-admin', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ nombre, email, password })
                    });
                    if (res.ok) {
                        mercaAlert('Administrador Junior creado.', true);
                        loadAdmins();
                    } else {
                        const err = await res.json();
                        mercaAlert(err.error || 'Error creando administrador');
                    }
                } catch(e) { mercaAlert('Error de red'); }
            });
        }
`;

adminJs = adminJs.replace(
    `btnNew.addEventListener('click', () => {`,
    adminEvents + `\n        btnNew.addEventListener('click', () => {`
);

adminJs = adminJs.replace(
    `\${u.rol !== 'admin' ? \`<button class="btn-icon delete" onclick="deleteUser(\${u.id})" title="Eliminar"><i class="fa-solid fa-user-xmark"></i></button>\` : ''}`,
    `\${u.rol === 'user' ? \`<button class="btn-icon delete" onclick="deleteUser(\${u.id})" title="Eliminar"><i class="fa-solid fa-user-xmark"></i></button>\` : ''}`
);

fs.writeFileSync('js/admin.js', adminJs);
console.log('admin.js updated');
