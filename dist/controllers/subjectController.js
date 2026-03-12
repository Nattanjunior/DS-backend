"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subjectController = exports.SubjectController = void 0;
const subjectService_1 = require("../services/subjectService");
class SubjectController {
    async getSubjects(request, reply) {
        const userId = request.user?.userId;
        const subjects = userId
            ? await subjectService_1.subjectService.findByUserId(userId)
            : await subjectService_1.subjectService.findAll();
        return reply.send({ data: subjects });
    }
    async getSubjectById(request, reply) {
        const subject = await subjectService_1.subjectService.findById(request.params.id);
        if (!subject) {
            return reply.status(404).send({ error: 'Matéria não encontrada' });
        }
        return reply.send({ data: subject });
    }
    async createSubject(request, reply) {
        const userId = request.user?.userId;
        const subject = await subjectService_1.subjectService.create(request.body, userId);
        return reply.status(201).send({ data: subject });
    }
    async updateSubject(request, reply) {
        try {
            const subject = await subjectService_1.subjectService.update(request.params.id, request.body);
            return reply.send({ data: subject });
        }
        catch {
            return reply.status(404).send({ error: 'Matéria não encontrada' });
        }
    }
    async deleteSubject(request, reply) {
        try {
            await subjectService_1.subjectService.delete(request.params.id);
            return reply.status(204).send();
        }
        catch {
            return reply.status(404).send({ error: 'Matéria não encontrada' });
        }
    }
}
exports.SubjectController = SubjectController;
exports.subjectController = new SubjectController();
