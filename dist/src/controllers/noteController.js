"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotes = getNotes;
exports.getNoteById = getNoteById;
exports.createNote = createNote;
exports.updateNote = updateNote;
exports.deleteNote = deleteNote;
const noteService_js_1 = require("../services/noteService.js");
async function getNotes(request, reply) {
    const notes = await noteService_js_1.noteService.findAll(request.query);
    return reply.send({ data: notes });
}
async function getNoteById(request, reply) {
    const note = await noteService_js_1.noteService.findById(request.params.id);
    if (!note) {
        return reply.status(404).send({ error: 'Nota não encontrada' });
    }
    return reply.send({ data: note });
}
async function createNote(request, reply) {
    const note = await noteService_js_1.noteService.create(request.body);
    return reply.status(201).send({ data: note });
}
async function updateNote(request, reply) {
    try {
        const note = await noteService_js_1.noteService.update(request.params.id, request.body);
        return reply.send({ data: note });
    }
    catch {
        return reply.status(404).send({ error: 'Nota não encontrada' });
    }
}
async function deleteNote(request, reply) {
    try {
        await noteService_js_1.noteService.delete(request.params.id);
        return reply.status(204).send();
    }
    catch {
        return reply.status(404).send({ error: 'Nota não encontrada' });
    }
}
