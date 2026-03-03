"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subjectRoutes = subjectRoutes;
const subjectController_js_1 = require("../controllers/subjectController.js");
const subjectSchema_js_1 = require("../schemas/subjectSchema.js");
async function subjectRoutes(app) {
    app.get('/', {
        schema: {
            querystring: subjectSchema_js_1.subjectQuerySchema,
        },
    }, subjectController_js_1.getSubjects);
    app.get('/:id', {
        schema: {
            params: subjectSchema_js_1.subjectParamsSchema,
        },
    }, subjectController_js_1.getSubjectById);
    app.post('/', {
        schema: {
            body: subjectSchema_js_1.createSubjectSchema,
        },
    }, subjectController_js_1.createSubject);
    app.put('/:id', {
        schema: {
            params: subjectSchema_js_1.subjectParamsSchema,
            body: subjectSchema_js_1.updateSubjectSchema,
        },
    }, subjectController_js_1.updateSubject);
    app.delete('/:id', {
        schema: {
            params: subjectSchema_js_1.subjectParamsSchema,
        },
    }, subjectController_js_1.deleteSubject);
}
