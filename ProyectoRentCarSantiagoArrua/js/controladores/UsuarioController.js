let usuarios = [];
let usuarioRepository = new UsuarioRepository();

function guardarUsuarios() {
    usuarioRepository.guardarTodos(usuarios);
}

function cargarUsuarios() {
    let registrosGuardados = usuarioRepository.obtenerTodos();
    let datos = registrosGuardados.length ? JSON.stringify(registrosGuardados) : null;

    if (datos) {
        let datosUsuarios = JSON.parse(datos);

        // En Usuarios solamente se guardan administradores.
        usuarios = datosUsuarios.map(function(u) {
            return new Usuario(
                u.id,
                u.nombre,
                u.usuario,
                u.password
            );
        });
    } else {
        usuarios = [];
    }

    let administrador = usuarios.find(function(u) {
        return u.usuario.toLowerCase() === "admin";
    });

    if (!administrador) {
        usuarios.unshift(new Usuario(
            obtenerNuevoId(usuarios),
            "Administrador",
            "admin",
            "1234"
        ));
        guardarUsuarios();
    }

    mostrarUsuarios();
}

function mostrarUsuarios() {
    let tabla = document.getElementById("tablaUsuarios");

    if (!tabla) {
        return;
    }

    tabla.innerHTML = "";

    usuarios.forEach(function(usuario) {
        tabla.innerHTML += `
            <tr>
                <td>${usuario.id}</td>
                <td>${usuario.nombre}</td>
                <td>${usuario.usuario}</td>
                <td>
                    <button class="btn-principal" onclick="eliminarUsuario(${usuario.id})">
                        Eliminar
                    </button>
                </td>
            </tr>
        `;
    });
}

function abrirFormularioUsuario() {
    if (!esAdministrador()) {
        alert("Solo el administrador puede administrar usuarios.");
        return;
    }

    let nombre = prompt("Ingrese el nombre del administrador:");
    if (!nombre) return;

    let usuario = prompt("Ingrese el nombre de usuario:");
    if (!usuario) return;

    let password = prompt("Ingrese la contraseña:");
    if (!password) return;

    let existe = usuarios.some(function(u) {
        return u.usuario.toLowerCase() === usuario.toLowerCase();
    });

    if (existe) {
        alert("Ese nombre de usuario ya existe.");
        return;
    }

    let existeCliente = clientes.some(function(c) {
        return c.usuario && c.usuario.toLowerCase() === usuario.toLowerCase();
    });

    if (existeCliente) {
        alert("Ese nombre de usuario ya pertenece a un cliente.");
        return;
    }

    let nuevoUsuario = new Usuario(
        obtenerNuevoId(usuarios),
        nombre,
        usuario,
        password
    );

    usuarios.push(nuevoUsuario);
    guardarUsuarios();
    mostrarUsuarios();
    alert("Usuario administrador registrado correctamente.");
}

function eliminarUsuario(id) {
    if (!esAdministrador()) {
        alert("Solo el administrador puede eliminar usuarios.");
        return;
    }

    if (usuarios.length === 1) {
        alert("Debe existir al menos un administrador.");
        return;
    }

    let usuario = usuarios.find(function(u) {
        return u.id === id;
    });

    if (usuario && usuario.usuario === "admin") {
        alert("El administrador principal no puede eliminarse.");
        return;
    }

    if (!confirm("¿Está seguro de eliminar este administrador?")) {
        return;
    }

    usuarios = usuarios.filter(function(usuario) {
        return usuario.id !== id;
    });

    guardarUsuarios();
    mostrarUsuarios();
}
