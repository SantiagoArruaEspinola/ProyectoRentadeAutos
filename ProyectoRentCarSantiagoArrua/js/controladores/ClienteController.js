let clientes = [];
let clienteRepository = new ClienteRepository();

function guardarClientes() {
    clienteRepository.guardarTodos(clientes);
}

function cargarClientes() {
    let registrosGuardados = clienteRepository.obtenerTodos();
    let datos = registrosGuardados.length ? JSON.stringify(registrosGuardados) : null;

    if (datos) {
        let datosClientes = JSON.parse(datos);
        clientes = datosClientes.map(function(c) {
            return new Cliente(
                c.id,
                c.nombre,
                c.cedula,
                c.telefono,
                c.email,
                c.usuario || "",
                c.password || ""
            );
        });
    } else {
        clientes = [];
    }

    mostrarClientes();
}

function mostrarClientes() {
    let tabla = document.getElementById("tablaClientes");
    if (!tabla) return;

    tabla.innerHTML = "";

    clientes.forEach(function(cliente) {
        let alquileresCliente = alquileres.filter(function(a) {
            return a.clienteId === cliente.id;
        });

        tabla.innerHTML += `
            <tr>
                <td>${cliente.id}</td>
                <td>${cliente.nombre}</td>
                <td>${cliente.cedula}</td>
                <td>${cliente.telefono}</td>
                <td>${cliente.email}</td>
                <td>${cliente.usuario || "Sin cuenta"}</td>
                <td>${alquileresCliente.length}</td>
                <td>
                    <button class="btn-principal" onclick="verAlquileresCliente(${cliente.id})">
                        Ver alquileres
                    </button>
                    <button class="btn-principal" onclick="eliminarCliente(${cliente.id})">
                        Eliminar
                    </button>
                </td>
            </tr>
        `;
    });
}

function abrirFormularioCliente() {
    if (!esAdministrador()) {
        alert("Solo el administrador puede registrar clientes desde el panel.");
        return;
    }

    let datos = pedirDatosCliente();
    if (!datos) return;

    registrarCliente(datos);
}

function pedirDatosCliente() {
    let nombre = prompt("Ingrese el nombre:");
    if (!nombre) return null;

    let cedula = prompt("Ingrese la cédula:");
    if (!cedula) return null;

    let telefono = prompt("Ingrese el teléfono:");
    if (!telefono) return null;

    let email = prompt("Ingrese el email:");
    if (!email) return null;

    let usuario = prompt("Ingrese el usuario para iniciar sesión:");
    if (!usuario) return null;

    let password = prompt("Ingrese la contraseña del cliente:");
    if (!password) return null;

    return {
        nombre: nombre,
        cedula: cedula,
        telefono: telefono,
        email: email,
        usuario: usuario,
        password: password
    };
}

function registrarCliente(datos) {
    let existeCedula = clientes.some(function(cliente) {
        return cliente.cedula === datos.cedula;
    });

    if (existeCedula) {
        alert("Ya existe un cliente con esa cédula.");
        return false;
    }

    let usuarioExiste = usuarioDisponible(datos.usuario);

    if (!usuarioExiste) {
        alert("Ese nombre de usuario ya está en uso.");
        return false;
    }

    let nuevoCliente = new Cliente(
    obtenerNuevoId(clientes),
        datos.nombre,
        datos.cedula,
        datos.telefono,
        datos.email,
        datos.usuario,
        datos.password
    );

    clientes.push(nuevoCliente);
    guardarClientes();
    mostrarClientes();

    return true;
}

function usuarioDisponible(usuario) {
    let nombreUsuario = usuario.toLowerCase();

    let existeAdmin = usuarios.some(function(u) {
        return u.usuario.toLowerCase() === nombreUsuario;
    });

    let existeCliente = clientes.some(function(c) {
        return c.usuario && c.usuario.toLowerCase() === nombreUsuario;
    });

    return !existeAdmin && !existeCliente;
}

function registrarClienteDesdeLogin(datos) {
    let lista = clienteRepository.obtenerTodos();

    let existeCedula = lista.some(function(cliente) {
        return cliente.cedula === datos.cedula;
    });

    if (existeCedula) {
        return { exito: false, mensaje: "Ya existe un cliente con esa cédula." };
    }

    let datosUsuarios = localStorage.getItem("usuarios");
    let listaUsuarios = datosUsuarios ? JSON.parse(datosUsuarios) : [];
    let nombreUsuario = datos.usuario.toLowerCase();

    let existeUsuario = listaUsuarios.some(function(u) {
        return u.usuario.toLowerCase() === nombreUsuario;
    }) || lista.some(function(c) {
        return c.usuario && c.usuario.toLowerCase() === nombreUsuario;
    });

    if (existeUsuario) {
        return { exito: false, mensaje: "Ese nombre de usuario ya está en uso." };
    }

    let mayor = 0;
    lista.forEach(function(cliente) {
        if (cliente.id > mayor) mayor = cliente.id;
    });

    let nuevoCliente = {
        id: mayor + 1,
        nombre: datos.nombre,
        cedula: datos.cedula,
        telefono: datos.telefono,
        email: datos.email,
        usuario: datos.usuario,
        password: datos.password
    };

    lista.push(nuevoCliente);
    clienteRepository.guardarTodos(lista);

    return { exito: true };
}

function eliminarCliente(id) {
    if (!esAdministrador()) {
        alert("Solo el administrador puede eliminar clientes.");
        return;
    }

    let tieneAlquileres = alquileres.some(function(alquiler) {
        return alquiler.clienteId === id;
    });

    if (tieneAlquileres) {
        alert("No se puede eliminar un cliente que tiene alquileres registrados.");
        return;
    }

    if (!confirm("¿Está seguro de eliminar este cliente?")) return;

    clientes = clientes.filter(function(cliente) {
        return cliente.id !== id;
    });

    guardarClientes();
    mostrarClientes();
}

function verAlquileresCliente(id) {
    if (!esAdministrador()) return;

    let cliente = clientes.find(function(c) {
        return c.id === id;
    });

    if (!cliente) return;

    mostrarSeccion("alquileres");

    let tabla = document.getElementById("tablaAlquileres");
    tabla.innerHTML = "";

    alquileres.filter(function(alquiler) {
        return alquiler.clienteId === id;
    }).forEach(function(alquiler) {
        let vehiculo = vehiculos.find(function(v) {
            return v.id === alquiler.vehiculoId;
        });

        tabla.innerHTML += `
            <tr>
                <td>${alquiler.id}</td>
                <td>${cliente.nombre}</td>
                <td>${vehiculo ? vehiculo.marca + " " + vehiculo.modelo : "Desconocido"}</td>
                <td>${alquiler.fechaInicio}</td>
                <td>${alquiler.fechaDevolucion}</td>
                <td>₲ ${Number(alquiler.costoTotal).toLocaleString()}</td>
                <td>${alquiler.estado}</td>
            </tr>
        `;
    });
}
