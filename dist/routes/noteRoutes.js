"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noteRoutes = noteRoutes;
const noteController_1 = require("../controllers/noteController");
const noteSchema_1 = require("../schemas/noteSchema");
const authMiddleware_1 = require("../middleware/authMiddleware");
async function noteRoutes(app) {
    app.addHook('preHandler', authMiddleware_1.authMiddleware);
    app.get('/', {
        schema: {
            querystring: noteSchema_1.noteQuerySchema,
        },
    }, noteController_1.noteController.getNotes.bind(noteController_1.noteController));
    app.get('/:id', {
        schema: {
            params: noteSchema_1.noteParamsSchema,
        },
    }, noteController_1.noteController.getNoteById.bind(noteController_1.noteController));
    app.post('/', {
        schema: {
            body: noteSchema_1.createNoteSchema,
        },
    }, noteController_1.noteController.createNote.bind(noteController_1.noteController));
    app.put('/:id', {
        schema: {
            params: noteSchema_1.noteParamsSchema,
            body: noteSchema_1.updateNoteSchema,
        },
    }, noteController_1.noteController.updateNote.bind(noteController_1.noteController));
    app.delete('/:id', {
        schema: {
            params: noteSchema_1.noteParamsSchema,
        },
    }, noteController_1.noteController.deleteNote.bind(noteController_1.noteController));
}
