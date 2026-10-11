
class AlquilerRepository {
    constructor() { this.clave = "alquileres"; }
    obtenerTodos() {
        let datos = localStorage.getItem(this.clave);
        return datos ? JSON.parse(datos) : [];
    }
    guardarTodos(registros) {
        localStorage.setItem(this.clave, JSON.stringify(registros));
    }
    buscarPorId(id) {
        return this.obtenerTodos().find(function(registro) { return registro.id === id; });
    }
    agregar(registro) {
        let registros = this.obtenerTodos();
        registros.push(registro);
        this.guardarTodos(registros);
        return registro;
    }
    eliminar(id) {
        let registros = this.obtenerTodos().filter(function(registro) { return registro.id !== id; });
        this.guardarTodos(registros);
        return registros;
    }
}
