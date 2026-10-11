

function generarInformeFechas() {

    let desde =
        document.getElementById("fechaDesde").value;

    let hasta =
        document.getElementById("fechaHasta").value;

    if (!desde || !hasta) {

        alert(
            "Debe seleccionar ambas fechas."
        );

        return;
    }

    if (desde > hasta) {

        alert(
            "La fecha desde no puede ser posterior a la fecha hasta."
        );

        return;
    }

    let resultado =
        alquileres.filter(function(alquiler) {

            return (
                alquiler.fechaInicio <= hasta &&
                alquiler.fechaDevolucion >= desde
            );
        });

    let contenedor =
        document.getElementById(
            "resultadoInformeFechas"
        );

    contenedor.innerHTML = "";

    resultado.forEach(function(alquiler) {

        let cliente =
            clientes.find(function(c) {
                return c.id === alquiler.clienteId;
            });

        let vehiculo =
            vehiculos.find(function(v) {
                return v.id === alquiler.vehiculoId;
            });

        if (vehiculo) {

            contenedor.innerHTML += `
                <p>
                    <strong>Vehículo:</strong>
                    ${vehiculo.marca} ${vehiculo.modelo}
                    |
                    <strong>Cliente:</strong>
                    ${cliente
                        ? cliente.nombre
                        : "Desconocido"}
                    |
                    <strong>Desde:</strong>
                    ${alquiler.fechaInicio}
                    |
                    <strong>Hasta:</strong>
                    ${alquiler.fechaDevolucion}
                </p>
            `;
        }
    });

    if (resultado.length === 0) {

        contenedor.innerHTML =
            "<p>No existen alquileres en ese período.</p>";
    }
}

function generarInformeVencidos() {

    let hoy =
        new Date()
        .toISOString()
        .split("T")[0];

    let vencidos =
        alquileres.filter(function(alquiler) {

            return (
                alquiler.estado === "Alquilado" &&
                alquiler.fechaDevolucion < hoy
            );
        });

    let contenedor =
        document.getElementById(
            "resultadoInformeVencidos"
        );

    contenedor.innerHTML = "";

    vencidos.forEach(function(alquiler) {

        let cliente =
            clientes.find(function(c) {
                return c.id === alquiler.clienteId;
            });

        let vehiculo =
            vehiculos.find(function(v) {
                return v.id === alquiler.vehiculoId;
            });

        contenedor.innerHTML += `
            <p>
                <strong>Cliente:</strong>
                ${cliente
                    ? cliente.nombre
                    : "Desconocido"}

                |

                <strong>Vehículo:</strong>
                ${vehiculo
                    ? vehiculo.marca + " " + vehiculo.modelo
                    : "Desconocido"}

                |

                <strong>Vencimiento:</strong>
                ${alquiler.fechaDevolucion}
            </p>
        `;
    });

    if (vencidos.length === 0) {

        contenedor.innerHTML =
            "<p>No existen alquileres vencidos.</p>";
    }
}
