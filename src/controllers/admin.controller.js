const adminService = require('../services/admin.service');

async function obtenerTodasLasSolicitudes(req, res, next) {
    try {
        const solicitudes = await adminService.obtenerTodasLasSolicitudesAdmin();
        res.status(200).json(solicitudes);
    } catch (error) {
        next(error);
    }
}

async function obtenerPendientes(req, res, next) {
    try {
        const pendientes = await adminService.obtenerSolicitudesPendientes();
        res.status(200).json(pendientes);
    } catch (error) {
        next(error);
    }
}

async function obtenerGestion(req, res, next) {
    try {
        const tutores = await adminService.obtenerTutoresParaGestion();
        res.status(200).json(tutores);
    } catch (error) {
        next(error);
    }
}

async function aprobar(req, res, next) {
    try {
        const tutor = await adminService.aprobarTutor(req.params.id, req.body);
        res.status(200).json(tutor);
    } catch (error) {
        next(error);
    }
}

async function rechazar(req, res, next) {
    try {
        const motivo = req.body?.motivo || 'No cumple con los requisitos académicos mínimos';
        const tutor = await adminService.rechazarTutor(req.params.id, motivo);
        res.status(200).json(tutor);
    } catch (error) {
        next(error);
    }
}

async function alternarEstado(req, res, next) {
    try {
        const { activo } = req.body;
        const tutor = await adminService.alternarEstadoTutor(req.params.id, activo);
        res.status(200).json(tutor);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    obtenerTodasLasSolicitudes,
    obtenerPendientes,
    obtenerGestion,
    aprobar,
    rechazar,
    alternarEstado
};
