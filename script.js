/* -----------------------
   Datos iniciales en localStorage
   ----------------------- */
(function initStorage() {
  // usuarios: array de usuarios {user, pass, email}
  if (!localStorage.getItem('usuarios')) {
    const defaultUsers = [
      { user: 'admin', pass: 'admin123', email: 'admin@playzone.local' }
    ];
    localStorage.setItem('usuarios', JSON.stringify(defaultUsers));
  }

  // canchas: array de strings (nombre)
  if (!localStorage.getItem('canchas')) {
    localStorage.setItem('canchas', JSON.stringify(['Fútbol Sintético','Vóley','Basket']));
  }

  // reservas: array global {user, cancha, fecha, hora, id}
  if (!localStorage.getItem('reservas')) {
    localStorage.setItem('reservas', JSON.stringify([]));
  }
})();

/* -----------------------
   Helpers
   ----------------------- */
function getUsuarios() { return JSON.parse(localStorage.getItem('usuarios') || '[]'); }
function saveUsuarios(u){ localStorage.setItem('usuarios', JSON.stringify(u)); }

function getCanchas(){ return JSON.parse(localStorage.getItem('canchas') || '[]'); }
function saveCanchas(c){ localStorage.setItem('canchas', JSON.stringify(c)); }

function getReservas(){ return JSON.parse(localStorage.getItem('reservas') || '[]'); }
function saveReservas(r){ localStorage.setItem('reservas', JSON.stringify(r)); }

function currentUser(){ return sessionStorage.getItem('playzone_user') || null; }

/* -----------------------
   Autenticación
   ----------------------- */
function login(e){
  if (e) e.preventDefault();
  const user = document.getElementById('loginUser')?.value?.trim();
  const pass = document.getElementById('loginPass')?.value?.trim();

  if (!user || !pass) return alert('Completa usuario y contraseña');

  const usuarios = getUsuarios();
  const found = usuarios.find(u => (u.user === user || u.email === user) && u.pass === pass);

  if (!found) return alert('Usuario o contraseña incorrectos');

  // guardar sesión en sessionStorage (se borra al cerrar navegador)
  sessionStorage.setItem('playzone_user', found.user);
  // marcar logged para compatibilidad con páginas previas
  localStorage.setItem('logged', 'true');

  // redirigir a home
  location.href = 'home.html';
}

function register(e){
  if (e) e.preventDefault();
  const user = document.getElementById('regUser')?.value?.trim();
  const email = document.getElementById('regEmail')?.value?.trim();
  const pass = document.getElementById('regPass')?.value?.trim();

  if (!user || !pass) return alert('Completa usuario y contraseña');

  const usuarios = getUsuarios();
  if (usuarios.some(u => u.user === user || (email && u.email === email))) {
    return alert('Usuario o correo ya registrado');
  }

  usuarios.push({ user, pass, email: email || '' });
  saveUsuarios(usuarios);

  alert('Registro exitoso. Ya puedes iniciar sesión.');
  location.href = 'index.html';
}

function logout(){
  sessionStorage.removeItem('playzone_user');
  localStorage.removeItem('logged');
  location.href = 'index.html';
}

/* -----------------------
   Protección simple de páginas
   ----------------------- */
(function protectPages(){
  const path = location.pathname.split('/').pop();
  const protectedPages = ['home.html','misreservas.html'];
  if (protectedPages.includes(path)) {
    if (!sessionStorage.getItem('playzone_user') && localStorage.getItem('logged') !== 'true') {
      location.href = 'index.html';
    }
  }
})();

/* -----------------------
   Gestión de canchas
   ----------------------- */
function cargarCanchasEnSelect(){
  const sel = document.getElementById('cancha');
  if (!sel) return;
  const canchas = getCanchas();
  sel.innerHTML = '';
  if (canchas.length === 0) {
    sel.innerHTML = '<option value="">No hay canchas</option>';
    return;
  }
  canchas.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    sel.appendChild(opt);
  });
}

// cuando se carga la página reservar -> mini lista
function actualizarMiniReservas(){
  const cont = document.getElementById('miniReservas');
  if (!cont) return;
  const reservas = getReservas().filter(r => r.user === currentUser());
  cont.innerHTML = '';
  reservas.slice(0,5).forEach(r => {
    const d = document.createElement('div');
    d.className = 'reserva-item';
    d.innerHTML = `<strong>${r.cancha}</strong><div>${r.fecha} • ${r.hora}</div>`;
    cont.appendChild(d);
  });
}

/* -----------------------
   Reservas
   ----------------------- */
function reservar(){
  const cancha = document.getElementById('cancha')?.value;
  const fecha = document.getElementById('fecha')?.value;
  const hora = document.getElementById('hora')?.value;

  if (!cancha) return alert('Selecciona una cancha');
  if (!fecha || !hora) return alert('Selecciona fecha y hora');

  // Prevent double booking for the same cancha at same date/time
  const reservas = getReservas();
  const clash = reservas.find(r => r.cancha === cancha && r.fecha === fecha && r.hora === hora);
  if (clash) return alert('Ya existe una reserva para esa cancha en esa fecha/hora');

  const reserva = {
    id: Date.now(),
    user: currentUser() || 'invitado',
    cancha, fecha, hora
  };
  reservas.push(reserva);
  saveReservas(reservas);

  alert('Reserva registrada correctamente');
  actualizarMiniReservas();
}

/* -----------------------
   Mostrar mis reservas en misreservas.html
   ----------------------- */
(function cargarMisReservas(){
  if (!document.getElementById('resList')) return;
  const cont = document.getElementById('resList');
  cont.innerHTML = '';
  const reservas = getReservas().filter(r => r.user === currentUser());
  if (reservas.length === 0) {
    cont.innerHTML = '<p>No tienes reservas.</p>';
    return;
  }
  reservas.forEach(r => {
    const div = document.createElement('div');
    div.className = 'reserva-item glass';
    div.innerHTML = `
      <h4>${r.cancha}</h4>
      <p>Fecha: ${r.fecha} · Hora: ${r.hora}</p>
      <button onclick="cancelarReserva(${r.id})" class="btn-cancel">Cancelar</button>
    `;
    cont.appendChild(div);
  });
})();

/* -----------------------
   Cancelar reserva
   ----------------------- */
function cancelarReserva(id){
  if (!confirm('¿Eliminar esta reserva?')) return;
  let reservas = getReservas();
  reservas = reservas.filter(r => r.id !== id);
  saveReservas(reservas);
  location.reload();
}

/* -----------------------
   ADMIN: agregar cancha desde admin.html (si la tienes)
   ----------------------- */
function agregarCanchaDesdeAdmin(nombre){
  if (!nombre) return;
  const canchas = getCanchas();
  canchas.push(nombre);
  saveCanchas(canchas);
}

/* -----------------------
   Cargar canchas en todas las páginas relevantes al iniciar
   ----------------------- */
document.addEventListener('DOMContentLoaded', function(){
  cargarCanchasEnSelect();
  actualizarMiniReservas();
});
