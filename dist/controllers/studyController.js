"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudies = getStudies;
exports.getStudyById = getStudyById;
exports.createStudy = createStudy;
exports.updateStudy = updateStudy;
exports.deleteStudy = deleteStudy;
const studyService_js_1 = require("../services/studyService.js");
async function getStudies(request, reply) {
    const studies = await studyService_js_1.studyService.findAll(request.query);
    return reply.send({ data: studies });
}
async function getStudyById(request, reply) {
    const study = await studyService_js_1.studyService.findById(request.params.id);
    if (!study) {
        return reply.status(404).send({ error: 'Estudo não encontrado' });
    }
    return reply.send({ data: study });
}
async function createStudy(request, reply) {
    const study = await studyService_js_1.studyService.create(request.body);
    return reply.status(201).send({ data: study });
}
async function updateStudy(request, reply) {
    try {
        const study = await studyService_js_1.studyService.update(request.params.id, request.body);
        return reply.send({ data: study });
    }
    catch {
        return reply.status(404).send({ error: 'Estudo não encontrado' });
    }
}
async function deleteStudy(request, reply) {
    try {
        await studyService_js_1.studyService.delete(request.params.id);
        return reply.status(204).send();
    }
    catch {
        return reply.status(404).send({ error: 'Estudo não encontrado' });
    }
}
