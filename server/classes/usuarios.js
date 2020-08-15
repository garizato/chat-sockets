class Usuarios {

    constructor() {
        this.integrantes = [];
    }

    //Agregar un integrante al chat
    addIntegrante(id, nombre, sala) {
        let integrante = { id, nombre, sala };

        this.integrantes.push(integrante);

        return this.integrantes;
    }

    //Consultar un integrante
    getIntegrante(id) {
        let integrante = this.integrantes.filter(integrante => integrante.id === id)[0];

        return integrante;
    }

    getIntegrantes() {
        return this.integrantes;
    }

    getIntegrantesxSala(sala) {
        return this.integrantes.filter(integrante => integrante.sala === sala);
    }

    deleteIntegrante(id) {

        let integranteDeleted = this.getIntegrante(id);

        this.integrantes = this.integrantes.filter(integrante => integrante.id != id);

        return integranteDeleted;
    }

}

module.exports = {
    Usuarios
};