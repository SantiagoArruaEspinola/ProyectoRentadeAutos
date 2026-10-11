let vehiculos = [];
let vehiculoRepository = new VehiculoRepository();


function guardarVehiculos() {

    vehiculoRepository.guardarTodos(vehiculos);
}


function cargarVehiculos() {

    let registrosGuardados = vehiculoRepository.obtenerTodos();
    let datos = registrosGuardados.length ? JSON.stringify(registrosGuardados) : null;

    if (datos) {

        let datosVehiculos = JSON.parse(datos);

        vehiculos = datosVehiculos.map(function(v) {

            let vehiculo = new Vehiculo(
                v.id,
                v.tipo,
                v.marca,
                v.modelo,
                v.anio,
                v.color,
                v.asientos,
                v.chapa,
                v.costoDia
            );

            vehiculo.disponible = v.disponible;

            return vehiculo;
        });

    } else {

        crearVehiculosIniciales();
    }

    mostrarVehiculos();
}


function crearVehiculosIniciales() {

    vehiculos = [

        new Vehiculo(
            1,
            "Auto",
            "Toyota",
            "Corolla",
            2023,
            "Blanco",
            5,
            "ABC123",
            250000
        ),

        new Vehiculo(
            2,
            "Auto",
            "Honda",
            "Civic",
            2022,
            "Negro",
            5,
            "DEF456",
            300000
        ),

        new Vehiculo(
            3,
            "Auto",
            "Ford",
            "Mustang",
            2021,
            "Rojo",
            4,
            "GHI789",
            500000
        ),

        new Vehiculo(
            4,
            "Auto",
            "Volkswagen",
            "Golf",
            2020,
            "Azul",
            5,
            "JKL321",
            280000
        ),

        new Vehiculo(
            5,
            "Moto",
            "Honda",
            "CB500",
            2023,
            "Rojo",
            2,
            "MOT123",
            150000
        ),

        new Vehiculo(
            6,
            "Moto",
            "Yamaha",
            "MT03",
            2022,
            "Negro",
            2,
            "MOT456",
            180000
        ),

        new Vehiculo(
            7,
            "Bicicleta",
            "Trek",
            "Marlin 5",
            2023,
            "Azul",
            1,
            "BIC123",
            80000
        )
    ];

    guardarVehiculos();
}


function obtenerImagenVehiculo(vehiculo) {

    return `https://carapi.trustcar.info/getImage?make=${vehiculo.marca}&model=${vehiculo.modelo}`;
}


function mostrarVehiculos(lista = vehiculos) {

    let sesion = obtenerUsuarioSesion();

    if (sesion && sesion.tipo === "Cliente") {
        lista = lista.filter(function(vehiculo) {
            return vehiculo.disponible;
        });
    }

    let catalogo =
        document.getElementById("catalogoVehiculos");

    if (!catalogo) {
        return;
    }

    catalogo.innerHTML = "";

    lista.forEach(function(vehiculo) {

        let claseDisponibilidad =
            vehiculo.disponible
                ? "disponible"
                : "alquilado";

        let textoDisponibilidad =
            vehiculo.disponible
                ? "Disponible"
                : "Alquilado";

        catalogo.innerHTML += `
            <div class="vehiculo-card">

                <img
                    src="${obtenerImagenVehiculo(vehiculo)}"
                    alt="${vehiculo.marca} ${vehiculo.modelo}"
                    onerror="imagenNoEncontrada(this)"
                >

                <div class="vehiculo-info">

                    <h3>
                        ${vehiculo.marca}
                        ${vehiculo.modelo}
                    </h3>

                    <p>Tipo: ${vehiculo.tipo}</p>
                    <p>Año: ${vehiculo.anio}</p>
                    <p>Color: ${vehiculo.color}</p>
                    <p>Asientos: ${vehiculo.asientos}</p>
                    <p>Chapa: ${vehiculo.chapa}</p>

                    <p class="${claseDisponibilidad}">
                        ${textoDisponibilidad}
                    </p>

                    <p class="precio">
                        ₲ ${vehiculo.costoDia.toLocaleString()} / día
                    </p>

                    ${
                        vehiculo.disponible
                            ?
                            `<button
                                class="btn-principal"
                                onclick="abrirFormularioAlquiler(${vehiculo.id})">
                                Alquilar
                            </button>`
                            :
                            ""
                    }

                </div>
            </div>
        `;
    });
}


function abrirFormularioVehiculo() {

    if (!esAdministrador()) {
        alert("Solo el administrador puede agregar vehículos.");
        return;
    }

    let tipo = prompt("Tipo (Auto, Moto o Bicicleta):");
    if (!tipo) return;

    let marca = prompt("Marca:");
    if (!marca) return;

    let modelo = prompt("Modelo:");
    if (!modelo) return;

    let anio = parseInt(prompt("Año de fabricación:"));
    let color = prompt("Color:");
    let asientos = parseInt(prompt("Cantidad de asientos:"));
    let chapa = prompt("Número de chapa:");
    let costoDia = parseInt(prompt("Costo de alquiler por día:"));

    if (isNaN(anio) || !color || isNaN(asientos) || !chapa || isNaN(costoDia) || costoDia <= 0) {
        alert("Los datos del vehículo no son válidos.");
        return;
    }

    let nuevoVehiculo = new Vehiculo(
        obtenerNuevoId(vehiculos),
        tipo,
        marca,
        modelo,
        anio,
        color,
        asientos,
        chapa,
        costoDia
    );

    vehiculos.push(nuevoVehiculo);
    guardarVehiculos();
    mostrarVehiculos();

    alert("Vehículo agregado correctamente.");
}

function imagenNoEncontrada(imagen) {

    imagen.src = "https://via.placeholder.com/500x300?text=Vehiculo";
}


function filtrarVehiculos() {

    let texto =
        document.getElementById("txtBuscar")
        .value
        .toLowerCase();

    let tipo =
        document.getElementById("filtroTipo").value;

    let disponibilidad =
        document.getElementById("filtroDisponibilidad").value;

    let resultado = vehiculos.filter(function(vehiculo) {

        let coincideTexto =
            vehiculo.marca.toLowerCase().includes(texto) ||
            vehiculo.modelo.toLowerCase().includes(texto) ||
            vehiculo.color.toLowerCase().includes(texto);

        let coincideTipo =
            tipo === "" ||
            vehiculo.tipo === tipo;

        let coincideDisponibilidad =
            disponibilidad === "" ||
            (
                disponibilidad === "disponible" &&
                vehiculo.disponible
            ) ||
            (
                disponibilidad === "alquilado" &&
                !vehiculo.disponible
            );

        return (
            coincideTexto &&
            coincideTipo &&
            coincideDisponibilidad
        );
    });

    mostrarVehiculos(resultado);
}
