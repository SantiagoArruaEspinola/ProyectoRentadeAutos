class Cliente {

    constructor(id, nombre, cedula, telefono, email, usuario = "", password = "") {
        this.id = id;
        this.nombre = nombre;
        this.cedula = cedula;
        this.telefono = telefono;
        this.email = email;
        this.usuario = usuario;
        this.password = password;
    }
}
