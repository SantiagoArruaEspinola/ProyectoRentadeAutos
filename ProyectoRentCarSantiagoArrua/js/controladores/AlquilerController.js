
let alquileres = [];
let alquilerRepository = new AlquilerRepository();

function guardarAlquileres() {
    alquilerRepository.guardarTodos(alquileres);
}

function cargarAlquileres() {
    let datosAlquileres = alquilerRepository.obtenerTodos();


    alquileres = datosAlquileres.map(function(a) {
        let alquiler = new Alquiler(a.id, a.clienteId, a.vehiculoId,
            a.fechaInicio, a.fechaDevolucion, a.costoTotal);


        alquiler.estado = a.estado || "Alquilado";


        alquiler.fechaRealDevolucion = a.fechaRealDevolucion || "";
        
        return alquiler;
    });
    mostrarAlquileres();
    mostrarDevoluciones();
}

function calcularFechaFin(fechaInicio, dias) {

    let fecha =
        new Date(fechaInicio + "T00:00:00");

    fecha.setDate(
        fecha.getDate() + dias
    );

    let anio =
        fecha.getFullYear();

    let mes =
        String(fecha.getMonth() + 1)
        .padStart(2, "0");

    let dia =
        String(fecha.getDate())
        .padStart(2, "0");

    return anio + "-" + mes + "-" + dia;
}

function validarFecha(fecha) {
    if (!fecha) {
        alert("Debe ingresar una fecha de inicio.");
        return false;
    }

    let formato = /^\d{4}-\d{2}-\d{2}$/;

    if (!formato.test(fecha)) {
        alert("La fecha debe tener el formato AAAA-MM-DD.");
        return false;
    }

    let partes = fecha.split("-");
    let anio = Number(partes[0]);
    let mes = Number(partes[1]);
    let dia = Number(partes[2]);

    let fechaIngresada = new Date(anio, mes - 1, dia);

    if (
        fechaIngresada.getFullYear() !== anio ||
        fechaIngresada.getMonth() !== mes - 1 ||
        fechaIngresada.getDate() !== dia
    ) {
        alert("La fecha ingresada no es válida.");
        return false;
    }

    return true;
}

function validarDias(dias) {
    if (dias === "" || dias === null || String(dias).trim() === "") {
        alert("Debe ingresar la cantidad de días.");
        return false;
    }

    let cantidad = Number(dias);

    if (!Number.isInteger(cantidad) || cantidad <= 0) {
        alert("Los días deben ser un número entero mayor que cero.");
        return false;
    }

    return true;
}

function crearAlquiler(clienteId,vehiculoId,fechaInicio,dias) {

    let vehiculo =
        vehiculos.find(function(v) {
            return v.id === vehiculoId;
        });

    if (!vehiculo) {

        alert("Vehículo no encontrado.");

        return null;
    }

    if (!validarFecha(fechaInicio)) {
        return null;
    }

    if (!validarDias(dias)) {
        return null;
    }

    dias = Number(dias);

    let fechaDevolucion =
        calcularFechaFin(
            fechaInicio,
            dias
        );

    let costoTotal =
        vehiculo.costoDia * dias;

    let nuevoAlquiler =new Alquiler(obtenerNuevoId(alquileres),clienteId,vehiculoId,fechaInicio,fechaDevolucion,costoTotal);

    alquileres.push(nuevoAlquiler);

    vehiculo.disponible = false;

    guardarAlquileres();
    guardarVehiculos();

    return nuevoAlquiler;
}

function abrirFormularioAlquiler(idVehiculo) {
    let sesion = obtenerUsuarioSesion();

    if (!sesion) {
        alert("Debe iniciar sesión.");
        window.location.href = "login.html";
        return;
    }

    if (idVehiculo === undefined || idVehiculo === null || String(idVehiculo).trim() === "") {
        alert("No se recibió el ID del vehículo.");
        return;
    }

    let id = Number(idVehiculo);

    if (!Number.isInteger(id)) {
        alert("El ID del vehículo no es válido.");
        return;
    }

    let vehiculo = vehiculos.find(function(v) {
        return Number(v.id) === id;
    });

    if (!vehiculo) {
        alert("Vehículo no encontrado.");
        return;
    }

    continuarAlquiler(vehiculo, sesion);
}


function abrirFormularioAlquilerManual() {
    let sesion = obtenerUsuarioSesion();

    if (!sesion) {
        alert("Debe iniciar sesión.");
        window.location.href = "login.html";
        return;
    }

    if (sesion.tipo === "Cliente") {
        alert("Para alquilar, seleccione un vehículo del catálogo.");
        return;
    }

    let respuesta = prompt("Ingrese el ID del vehículo:");

    if (respuesta === null) {
        return;
    }

    respuesta = respuesta.trim();

    if (respuesta === "" || !/^\\d+$/.test(respuesta)) {
        alert("Debe ingresar un ID de vehículo válido.");
        return;
    }

    abrirFormularioAlquiler(Number(respuesta));
}


function continuarAlquiler(vehiculo, sesion) {
    let clienteId;

    if (sesion.tipo === "Cliente") {
        clienteId = sesion.clienteId;

        if (clienteId === undefined || clienteId === null || clienteId === "") {
            alert("La cuenta no está asociada a un cliente.");
            return;
        }
    } else {
        if (clientes.length === 0) {
            alert("Primero debe registrar un cliente.");
            return;
        }

        let listaClientes = "";

        clientes.forEach(function(cliente) {
            listaClientes += cliente.id + " - " + cliente.nombre + "\\n";
        });

        let respuestaCliente = prompt(
            "Seleccione el cliente ingresando su ID:\\n\\n" + listaClientes
        );

        if (respuestaCliente === null) {
            return;
        }

        respuestaCliente = respuestaCliente.trim();

        if (respuestaCliente === "" || !/^\\d+$/.test(respuestaCliente)) {
            alert("Debe ingresar un ID de cliente válido.");
            return;
        }

        clienteId = Number(respuestaCliente);

        let clienteExiste = clientes.some(function(c) {
            return Number(c.id) === clienteId;
        });

        if (!clienteExiste) {
            alert("Cliente no encontrado.");
            return;
        }
    }

    let fechaInicio = prompt("Ingrese la fecha de inicio (AAAA-MM-DD):");

    if (fechaInicio === null) {
        return;
    }

    fechaInicio = fechaInicio.trim();

    if (!validarFecha(fechaInicio)) {
        return;
    }

    let dias = prompt("¿Cuántos días desea alquilar?");

    if (dias === null) {
        return;
    }

    if (!validarDias(dias)) {
        return;
    }

    dias = Number(dias);

    let alquiler = crearAlquiler(
        clienteId,
        Number(vehiculo.id),
        fechaInicio,
        dias
    );

    if (alquiler) {
        alert("Alquiler registrado correctamente.");
        mostrarAlquileres();
        mostrarDevoluciones();
        mostrarVehiculos();
    }
}
