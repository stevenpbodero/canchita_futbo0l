// REGISTRO
function register() {
    let name = document.getElementById("regName").value;
    let email = document.getElementById("regEmail").value;
    let pass = document.getElementById("regPass").value;

    if (!name || !email || !pass) {
        alert("Completa todos los campos");
        return;
    }

    let user = { name, email, pass, reservas: [] };
    localStorage.setItem("user", JSON.stringify(user));

    alert("Registro exitoso");
    window.location.href = "index.html";
}

// LOGIN
function login() {
    let email = document.getElementById("loginEmail").value;
    let pass = document.getElementById("loginPass").value;

    let user = JSON.parse(localStorage.getItem("user"));

    if (!user || email !== user.email || pass !== user.pass) {
        alert("Datos incorrectos");
        return;
    }

    localStorage.setItem("logged", "true");
    window.location.href = "home.html";
}

// PROTEGER PÁGINAS
if (location.pathname.includes("home") || location.pathname.includes("misreservas")) {
    if (!localStorage.getItem("logged")) {
        location.href = "index.html";
    }
}

// RESERVAR
function reservar() {
    let cancha = document.getElementById("cancha").value;
    let fecha = document.getElementById("fecha").value;
    let hora = document.getElementById("hora").value;

    if (!fecha || !hora) {
        alert("Completa todos los campos");
        return;
    }

    let user = JSON.parse(localStorage.getItem("user"));

    user.reservas.push({ cancha, fecha, hora });

    localStorage.setItem("user", JSON.stringify(user));

    alert("Reserva registrada");
}

// VER RESERVAS
if (location.pathname.includes("misreservas")) {
    let list = document.getElementById("resList");
    let user = JSON.parse(localStorage.getItem("user"));

    user.reservas.forEach(r => {
        list.innerHTML += `
            <div class="reserva-item">
                <strong>${r.cancha}</strong><br>
                Fecha: ${r.fecha}<br>
                Hora: ${r.hora}
            </div>
        `;
    });
}

// LOGOUT
function logout() {
    localStorage.removeItem("logged");
    window.location.href = "index.html";
}
// Animación rápida en los botones al hacer clic
document.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
        btn.style.transform = "scale(0.95)";
        setTimeout(() => btn.style.transform = "scale(1)", 150);
    });
});
