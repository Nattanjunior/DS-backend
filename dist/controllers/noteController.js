"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noteController = exports.NoteController = void 0;
const noteService_1 = require("../services/noteService");
class NoteController {
    async getNotes(request, reply) {
        const notes = await noteService_1.noteService.findAll(request.query);
        return reply.send({ data: notes });
    }
    async getNoteById(request, reply) {
        const note = await noteService_1.noteService.findById(request.params.id);
        if (!note) {
            return reply.status(404).send({ error: 'Nota não encontrada' });
        }
        return reply.send({ data: note });
    }
    async createNote(request, reply) {
        const note = await noteService_1.noteService.create(request.body);
        return reply.status(201).send({ data: note });
    }
    async updateNote(request, reply) {
        try {
            const note = await noteService_1.noteService.update(request.params.id, request.body);
            return reply.send({ data: note });
        }
        catch {
            return reply.status(404).send({ error: 'Nota não encontrada' });
        }
    }
    async deleteNote(request, reply) {
        try {
            await noteService_1.noteService.delete(request.params.id);
            return reply.status(204).send();
        }
        catch {
            return reply.status(404).send({ error: 'Nota não encontrada' });
        }
    }
}
exports.NoteController = NoteController;
exports.noteController = new NoteController();
