const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utils/utils');

const usuarios = new Usuarios();

io.on('connection', (client) => {

    client.on('entrarChat', (peticion, callback) => {

        if (!peticion.nombre || !peticion.sala) {
            return callback({
                ok: false,
                message: "El nombre y la sala son necesarios"
            });
        }

        client.join(peticion.sala);

        usuarios.addIntegrante(client.id, peticion.nombre, peticion.sala);

        client.broadcast.to(peticion.sala).emit('listaIntegrantes', usuarios.getIntegrantesxSala(peticion.sala));
        client.broadcast.to(peticion.sala).emit('crearMensaje', crearMensaje('Administrador', `${ peticion.nombre } se unió al chat`));
        callback(usuarios.getIntegrantesxSala(peticion.sala));
    });

    client.on('crearMensaje', (data, callback) => {
        let integrante = usuarios.getIntegrante(client.id);

        let mensaje = crearMensaje(integrante.nombre, data.mensaje);
        client.broadcast.to(integrante.sala).emit('crearMensaje', mensaje);
        callback(mensaje);
    });

    client.on('disconnect', () => {
        let integranteDeleted = usuarios.deleteIntegrante(client.id);
        if (integranteDeleted) {
            client.broadcast.to(integranteDeleted.sala).emit('crearMensaje', crearMensaje('Administrador', `${ integranteDeleted.nombre } abandonó el chat`));
            client.broadcast.to(integranteDeleted.sala).emit('listaIntegrantes', usuarios.getIntegrantesxSala(integranteDeleted.sala));
        }
    });

    //Mensajes Privados
    client.on('mensajePrivado', data => {

        let integrante = usuarios.getIntegrante(client.id);

        client.broadcast.to(data.destinatario).emit('mensajePrivado', crearMensaje(integrante.nombre, data.mensaje));
    });

});