"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studyController = exports.StudyController = void 0;
const studyService_1 = require("../services/studyService");
class StudyController {
    async getStudies(request, reply) {
        const studies = await studyService_1.studyService.findAll(request.query);
        return reply.send({ data: studies });
    }
    async getStudyById(request, reply) {
        const study = await studyService_1.studyService.findById(request.params.id);
        if (!study) {
            return reply.status(404).send({ error: 'Estudo não encontrado' });
        }
        return reply.send({ data: study });
    }
    async createStudy(request, reply) {
        const study = await studyService_1.studyService.create(request.body);
        return reply.status(201).send({ data: study });
    }
    async updateStudy(request, reply) {
        try {
            const study = await studyService_1.studyService.update(request.params.id, request.body);
            return reply.send({ data: study });
        }
        catch {
            return reply.status(404).send({ error: 'Estudo não encontrado' });
        }
    }
    async deleteStudy(request, reply) {
        try {
            await studyService_1.studyService.delete(request.params.id);
            return reply.status(204).send();
        }
        catch {
            return reply.status(404).send({ error: 'Estudo não encontrado' });
        }
    }
}
exports.StudyController = StudyController;
exports.studyController = new StudyController();
