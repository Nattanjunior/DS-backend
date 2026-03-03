"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubjects = getSubjects;
exports.getSubjectById = getSubjectById;
exports.createSubject = createSubject;
exports.updateSubject = updateSubject;
exports.deleteSubject = deleteSubject;
const subjectService_js_1 = require("../services/subjectService.js");
async function getSubjects(request, reply) {
    const subjects = await subjectService_js_1.subjectService.findAll(request.query);
    return reply.send({ data: subjects });
}
async function getSubjectById(request, reply) {
    const subject = await subjectService_js_1.subjectService.findById(request.params.id);
    if (!subject) {
        return reply.status(404).send({ error: 'Matéria não encontrada' });
    }
    return reply.send({ data: subject });
}
async function createSubject(request, reply) {
    const subject = await subjectService_js_1.subjectService.create(request.body);
    return reply.status(201).send({ data: subject });
}
async function updateSubject(request, reply) {
    try {
        const subject = await subjectService_js_1.subjectService.update(request.params.id, request.body);
        return reply.send({ data: subject });
    }
    catch {
        return reply.status(404).send({ error: 'Matéria não encontrada' });
    }
}
async function deleteSubject(request, reply) {
    try {
        await subjectService_js_1.subjectService.delete(request.params.id);
        return reply.status(204).send();
    }
    catch {
        return reply.status(404).send({ error: 'Matéria não encontrada' });
    }
}
