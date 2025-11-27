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




// helpers: obtener/guardar reservas en localStorage
function getReservas() {
  const raw = localStorage.getItem('reservas');
  return raw ? JSON.parse(raw) : [];
}

function saveReservas(reservas) {
  localStorage.setItem('reservas', JSON.stringify(reservas));
}

// convierte File a base64 - devuelve Promise
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result); // data:<type>;base64,...
    reader.onerror = () => reject(new Error('Error leyendo el archivo'));
    reader.readAsDataURL(file);
  });
}

// función principal: reservar (ya la llamabas desde el botón)
async function reservar() {
  const canchaEl = document.getElementById('cancha');
  const fechaEl = document.getElementById('fecha');
  const horaEl  = document.getElementById('hora');
  const fileEl  = document.getElementById('comprobante');

  const cancha = canchaEl?.value || '';
  const fecha  = fechaEl?.value || '';
  const hora   = horaEl?.value || '';

  if (!cancha || !fecha || !hora) {
    alert('Completa cancha, fecha y hora antes de reservar.');
    return;
  }

  const file = fileEl?.files?.[0] || null;
  const comprobanteBase64 = await fileToBase64(file); // puede ser null si no subieron

  const nuevaReserva = {
    id: Date.now(), // id simple
    cancha,
    fecha,
    hora,
    comprobante: comprobanteBase64 // si es null, no hay imagen
  };

  const reservas = getReservas();
  reservas.push(nuevaReserva);
  saveReservas(reservas);

  // Actualiza UI (tu función actualizarMiniReservas existente o esta alternativa)
  actualizarMiniReservas();

  // limpiar formulario
  if (fileEl) fileEl.value = '';
  const preview = document.getElementById('preview');
  if (preview) { preview.src = ''; preview.style.display = 'none'; }

  alert('Reserva guardada con comprobante (si subiste uno).');
}

// función para mostrar las reservas (adaptar si ya tienes otra)
function actualizarMiniReservas() {
  const cont = document.getElementById('miniReservas');
  if (!cont) return;

  const reservas = getReservas();
  cont.innerHTML = '';

  reservas.slice().reverse().forEach(r => { // muestra más recientes primero
    const div = document.createElement('div');
    div.className = 'mini-item';
    div.style.marginBottom = '18px';

    const title = document.createElement('strong');
    title.textContent = r.cancha;
    div.appendChild(title);

    const meta = document.createElement('div');
    meta.textContent = `${r.fecha} • ${r.hora}`;
    meta.style.marginBottom = '8px';
    div.appendChild(meta);

    if (r.comprobante) {
      const img = document.createElement('img');
      img.src = r.comprobante;
      img.style.width = '180px';
      img.style.borderRadius = '8px';
      img.style.display = 'block';
      img.style.marginBottom = '8px';
      div.appendChild(img);
    }

    cont.appendChild(div);
  });
}

// aseguramos que al cargar la página se muestren las reservas
document.addEventListener('DOMContentLoaded', function() {
  // si ya tienes cargarCanchasEnSelect() etc, mantenlos
  actualizarMiniReservas();
});


