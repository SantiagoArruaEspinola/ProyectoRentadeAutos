

function mostrarAlquileres() {

    let tabla = document.getElementById("tablaAlquileres");
    if (!tabla) return;

    tabla.innerHTML = "";

    let sesion = obtenerUsuarioSesion();
    let lista = alquileres;

    if (sesion && sesion.tipo === "Cliente") {
        lista = alquileres.filter(function(alquiler) {
            return alquiler.clienteId === sesion.clienteId;
        });
    }

    lista.forEach(function(alquiler) {
        let cliente = clientes.find(function(c) {
            return c.id === alquiler.clienteId;
        });

        let vehiculo = vehiculos.find(function(v) {
            return v.id === alquiler.vehiculoId;
        });

        tabla.innerHTML += `
            <tr>
                <td>${alquiler.id}</td>
                <td>${cliente ? cliente.nombre : "Desconocido"}</td>
                <td>${vehiculo ? vehiculo.marca + " " + vehiculo.modelo : "Desconocido"}</td>
                <td>${alquiler.fechaInicio}</td>
                <td>${alquiler.fechaDevolucion}</td>
                <td>₲ ${Number(alquiler.costoTotal).toLocaleString()}</td>
                <td>${alquiler.estado}</td>
            </tr>
        `;
    });

    if (lista.length === 0) {
        tabla.innerHTML = `<tr><td colspan="7">No hay alquileres para mostrar.</td></tr>`;
    }
}
