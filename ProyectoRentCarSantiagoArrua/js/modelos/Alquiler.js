class Alquiler {

    constructor(
        id,
        clienteId,
        vehiculoId,
        fechaInicio,
        fechaDevolucion,
        costoTotal
    ) {
        this.id = id;
        this.clienteId = clienteId;
        this.vehiculoId = vehiculoId;
        this.fechaInicio = fechaInicio;
        this.fechaDevolucion = fechaDevolucion;
        this.costoTotal = costoTotal;
        this.estado = "Alquilado";
        this.fechaRealDevolucion = "";
    }
}
