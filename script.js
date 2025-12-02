// ============================================
// SCRIPT.JS COMPLETO - SISTEMA DE RESERVAS
// ============================================

// Datos de ejemplo para reservas
const reservasData = [
    { id: 1, tipo: 'Futbol', nombre: 'cancha futbol 1', fecha: '25-11-2017', horaInicio: '03:00', horaFin: '03:00', estado: 'RESERVADA' },
    { id: 2, tipo: 'Futbol', nombre: 'cancha futbol 1', fecha: '16-12-2017', horaInicio: '07:00', horaFin: '03:00', estado: 'RESERVADA' },
    { id: 3, tipo: 'Futbol', nombre: 'cancha futbol 1', fecha: '16-12-2017', horaInicio: '23:00', horaFin: '03:00', estado: 'RESERVADA' },
    { id: 4, tipo: 'Futbol', nombre: 'cancha futbol 1', fecha: '16-12-2017', horaInicio: '14:00', horaFin: '03:00', estado: 'RESERVADA' },
    { id: 5, tipo: 'Futbol', nombre: 'cancha futbol 1', fecha: '16-12-2017', horaInicio: '17:00', horaFin: '18:00', estado: 'RESERVADA' },
    { id: 6, tipo: 'Futbol', nombre: 'cancha futbol 1', fecha: '19-12-2017', horaInicio: '18:00', horaFin: '11:00', estado: 'COMPLETADA' },
    { id: 7, tipo: 'Futbol', nombre: 'cancha futbol 1', fecha: '19-12-2017', horaInicio: '19:00', horaFin: '21:00', estado: 'COMPLETADA' },
    { id: 8, tipo: 'Futbol', nombre: 'cancha futbol 1', fecha: '20-12-2017', horaInicio: '21:00', horaFin: '22:00', estado: 'COMPLETADA' }
];

// USUARIOS Y CONTRASEÑAS
const usuarios = {
    'admin': '1234',
    'usuario': 'pass123',
    'test': 'test'
};

// Usuario administrador
const adminUser = 'admin';

// ============================================
// FUNCIONES PARA RESERVAS
// ============================================

// Función para cargar reservas en la tabla
function loadReservas() {
    const tbody = document.getElementById('reservasBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    reservasData.forEach(reserva => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${reserva.id}</td>
            <td>${reserva.tipo}</td>
            <td>${reserva.nombre}</td>
            <td>${reserva.fecha}</td>
            <td>${reserva.horaInicio}</td>
            <td>${reserva.horaFin}</td>
            <td><button class="btn-eliminar" onclick="eliminarReserva(${reserva.id})">${reserva.estado}</button></td>
        `;
        tbody.appendChild(tr);
    });
}

// Función para cargar reservas en tabla admin
function loadReservasAdmin() {
    const tbody = document.getElementById('tablaReservasAdmin');
    if (!tbody) return;
    
    // Aquí puedes cargar datos desde el servidor o usar datos locales
    console.log('Tabla de reservas admin cargada');
}

// Función para ir a reservas
function goToReservas() {
    window.location.href = 'misreservas.html';
}

// Función para verificar login
function checkLogin() {
    window.location.href = 'home.html';
}

// Función para eliminar reserva
function eliminarReserva(id) {
    if (confirm('¿Desea eliminar esta reserva?')) {
        const index = reservasData.findIndex(r => r.id === id);
        if (index > -1) {
            reservasData.splice(index, 1);
            loadReservas();
            alert('Reserva eliminada exitosamente');
        }
    }
}

// ============================================
// MANEJO DE FORMULARIOS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ========== FORMULARIO DE LOGIN ==========
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Validar usuario y contraseña
            if (usuarios[username] && usuarios[username] === password) {
                // Si es admin, redirigir al panel de administrador
                if (username === adminUser) {
                    alert('¡Bienvenido Administrador!');
                    window.location.href = 'admin.html';
                } else {
                    alert('¡Login exitoso! Bienvenido ' + username);
                    window.location.href = 'misreservas.html';
                }
            } else {
                alert('Usuario o contraseña incorrectos');
            }
        });
    }

    // ========== FORMULARIO DE REGISTRO ==========
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Registro exitoso. Ahora puedes iniciar sesión.');
            window.location.href = 'home.html';
        });
    }

    // ========== FORMULARIO DE CANCHAS (ADMIN) ==========
    const formCancha = document.getElementById('formCancha');
    if (formCancha) {
        formCancha.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Cancha agregada exitosamente');
            formCancha.reset();
        });
    }

    // ========== FORMULARIO DE HORAS (ADMIN) ==========
    const formHoras = document.getElementById('formHoras');
    if (formHoras) {
        formHoras.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Hora agregada exitosamente');
            formHoras.reset();
        });
    }

    // ========== FORMULARIO DE RESERVA (ADMIN) ==========
    const formReserva = document.getElementById('formReserva');
    if (formReserva) {
        formReserva.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Reserva realizada exitosamente');
            formReserva.reset();
        });
    }

    // ========== FORMULARIO EMPRESA ==========
    const formEmpresa = document.getElementById('formEmpresa');
    if (formEmpresa) {
        formEmpresa.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Empresa registrada exitosamente');
            formEmpresa.reset();
        });
    }

    // ========== FORMULARIO TI ==========
    const formTI = document.getElementById('formTI');
    if (formTI) {
        formTI.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Usuario TI registrado exitosamente');
            formTI.reset();
        });
    }

    // Cargar reservas admin si existe la tabla
    loadReservasAdmin();
});

