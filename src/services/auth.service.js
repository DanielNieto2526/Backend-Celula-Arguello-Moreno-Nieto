const usuariosService = require('./usuarios.service');
const HttpError = require('../utils/HttpError');

async function login({ usuario, clave }) {
    if (!usuario || !clave) {
        throw new HttpError(400, 'Debe ingresar usuario/correo y contraseña');
    }

    const input = usuario.trim().toLowerCase();
    const claveTrim = clave.trim();

    const listaUsuarios = await usuariosService.listarUsuarios();

    const encontrado = listaUsuarios.find((u) => {
        const correo = (u.correo || '').toLowerCase();
        const prefijo = correo.split('@')[0];
        const matchIdentificador = correo === input || prefijo === input;
        const matchClave = u.clave === claveTrim;
        return matchIdentificador && matchClave;
    });

    if (!encontrado) {
        throw new HttpError(401, 'Credenciales inválidas. Verifica tu usuario y clave.');
    }

    // Convertir a objeto plano si es documento Mongoose
    const resultado = encontrado.toJSON ? encontrado.toJSON() : { ...encontrado };
    delete resultado.clave;
    return resultado;
}

async function registrarEstudiante(datos) {
    const correo = (datos.correo || '').trim().toLowerCase();
    if (!correo.endsWith('@urosario.edu.co')) {
        throw new HttpError(400, 'El correo debe pertenecer al dominio institucional (@urosario.edu.co).');
    }

    const nuevoUsuario = await usuariosService.crearUsuario({
        id: datos.id || `estudiante-${Date.now()}`,
        nombres: datos.nombres.trim(),
        apellidos: datos.apellidos.trim(),
        correo: correo,
        clave: datos.clave || 'conecta2026',
        rol: 'estudiante',
        carrera: (datos.carrera || '').trim(),
        semestre: Number(datos.semestre) || 1,
        semestreTexto: datos.semestreTexto || `${datos.semestre || 1}º semestre ${datos.carrera || 'Estudiante'} - Claustro`,
        telefono: datos.telefono || '',
        sede: datos.sede || 'Claustro'
    });

    const resultado = nuevoUsuario.toJSON ? nuevoUsuario.toJSON() : { ...nuevoUsuario };
    delete resultado.clave;
    return resultado;
}

module.exports = {
    login,
    registrarEstudiante
};
