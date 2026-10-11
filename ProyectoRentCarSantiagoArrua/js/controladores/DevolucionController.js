

function mostrarDevoluciones() {

    let tabla =
        document.getElementById("tablaDevoluciones");

    if (!tabla) {
        return;
    }

    tabla.innerHTML = "";

    alquileres.forEach(function(alquiler) {

        if (alquiler.estado !== "Alquilado") {
            return;
        }

        let cliente =
            clientes.find(function(c) {
                return c.id === alquiler.clienteId;
            });

        let vehiculo =
            vehiculos.find(function(v) {
                return v.id === alquiler.vehiculoId;
            });

        tabla.innerHTML += `
            <tr>
                <td>${alquiler.id}</td>

                <td>
                    ${cliente
                        ? cliente.nombre
                        : "Desconocido"}
                </td>

                <td>
                    ${vehiculo
                        ? vehiculo.marca + " " + vehiculo.modelo
                        : "Desconocido"}
                </td>

                <td>${alquiler.fechaDevolucion}</td>

                <td>
                    <button
                        class="btn-principal"
                        onclick="registrarDevolucion(${alquiler.id})">
                        Devolver
                    </button>
                </td>
            </tr>
        `;
    });
}

function registrarDevolucion(id) {

    let confirmar =
        confirm(
            "¿Confirmar devolución del vehículo?"
        );

    if (!confirmar) {
        return;
    }

    let alquiler =
        alquileres.find(function(a) {
            return a.id === id;
        });

    if (!alquiler) {
        return;
    }

    if (alquiler.estado === "Devuelto") {
        alert("Este alquiler ya fue devuelto.");
        return;
    }

    alquiler.estado = "Devuelto";

    let hoy = new Date();

    let anio =
        hoy.getFullYear();

    let mes =
        String(hoy.getMonth() + 1)
        .padStart(2, "0");

    let dia =
        String(hoy.getDate())
        .padStart(2, "0");

    alquiler.fechaRealDevolucion =
        anio + "-" + mes + "-" + dia;

    let vehiculo =
        vehiculos.find(function(v) {
            return v.id === alquiler.vehiculoId;
        });

    if (vehiculo) {
        vehiculo.disponible = true;
    }

    guardarAlquileres();
    guardarVehiculos();

    mostrarAlquileres();
    mostrarDevoluciones();
    mostrarVehiculos();

    alert(
        "Vehículo devuelto correctamente."
    );
}
