function obtenerNuevoId(lista) {
    if (lista.length === 0) return 1;

    let mayor = 0;
    lista.forEach(function(elemento) {
        if (elemento.id > mayor) mayor = elemento.id;
    });

    return mayor + 1;
}

function obtenerUsuarioSesion() {
    let datos = localStorage.getItem("usuarioSesion");

    if (!datos) return null;

    try {
        return JSON.parse(datos);
    } catch (error) {
        localStorage.removeItem("usuarioSesion");
        return null;
    }
}

function esAdministrador() {
    let sesion = obtenerUsuarioSesion();
    return sesion && sesion.tipo === "Administrador";
}

function esCliente() {
    let sesion = obtenerUsuarioSesion();
    return sesion && sesion.tipo === "Cliente";
}

function mostrarSeccion(nombre, boton) {
    let sesion = obtenerUsuarioSesion();

    if (sesion && sesion.tipo === "Cliente") {
        let permitidas = ["vehiculos", "alquileres"];

        if (!permitidas.includes(nombre)) return;
    }

    let secciones = document.querySelectorAll(".seccion");
    secciones.forEach(function(seccion) {
        seccion.style.display = "none";
    });

    let seccion = document.getElementById(nombre);
    if (seccion) seccion.style.display = "block";

    let botones = document.querySelectorAll(".menu-btn");
    botones.forEach(function(b) {
        b.classList.remove("activo");
    });

    if (boton) boton.classList.add("activo");
}

function cerrarSesion() {
    localStorage.removeItem("usuarioSesion");
    window.location.href = "login.html";
}

function iniciarSistema() {
    let sesion = obtenerUsuarioSesion();

    if (!sesion) {
        window.location.href = "login.html";
        return;
    }

    cargarUsuarios();
    cargarClientes();
    cargarVehiculos();
    cargarAlquileres();

    let esAdmin = sesion.tipo === "Administrador";

    document.querySelectorAll(".solo-admin").forEach(function(elemento) {
        elemento.style.display = esAdmin ? "" : "none";
    });

    let titulo = document.getElementById("tituloBienvenida");
    if (titulo) {
        titulo.textContent = esAdmin ? "Panel del Administrador" : "Vehículos disponibles";
    }

    let descripcion = document.getElementById("descripcionBienvenida");
    if (descripcion) {
        descripcion.textContent = esAdmin
            ? "Administración completa del gestor de alquileres."
            : "Selecciona un vehículo para realizar tu alquiler.";
    }

    let botonNuevoAlquiler = document.getElementById("btnNuevoAlquiler");
    if (botonNuevoAlquiler) {
        botonNuevoAlquiler.style.display = esAdmin ? "" : "none";
    }

    if (esCliente()) {
        mostrarSeccion("vehiculos");
    }
}
