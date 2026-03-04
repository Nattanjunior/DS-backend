"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noteRoutes = noteRoutes;
const noteController_js_1 = require("../controllers/noteController.js");
const noteSchema_js_1 = require("../schemas/noteSchema.js");
const authMiddleware_js_1 = require("../middleware/authMiddleware.js");
async function noteRoutes(app) {
    app.addHook('preHandler', authMiddleware_js_1.authMiddleware);
    app.get('/', {
        schema: {
            querystring: noteSchema_js_1.noteQuerySchema,
        },
    }, noteController_js_1.getNotes);
    app.get('/:id', {
        schema: {
            params: noteSchema_js_1.noteParamsSchema,
        },
    }, noteController_js_1.getNoteById);
    app.post('/', {
        schema: {
            body: noteSchema_js_1.createNoteSchema,
        },
    }, noteController_js_1.createNote);
    app.put('/:id', {
        schema: {
            params: noteSchema_js_1.noteParamsSchema,
            body: noteSchema_js_1.updateNoteSchema,
        },
    }, noteController_js_1.updateNote);
    app.delete('/:id', {
        schema: {
            params: noteSchema_js_1.noteParamsSchema,
        },
    }, noteController_js_1.deleteNote);
}
