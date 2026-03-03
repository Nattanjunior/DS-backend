"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studyRoutes = studyRoutes;
const studyController_js_1 = require("../controllers/studyController.js");
const studySchema_js_1 = require("../schemas/studySchema.js");
async function studyRoutes(app) {
    app.get('/', {
        schema: {
            querystring: studySchema_js_1.studyQuerySchema,
        },
    }, studyController_js_1.getStudies);
    app.get('/:id', {
        schema: {
            params: studySchema_js_1.studyParamsSchema,
        },
    }, studyController_js_1.getStudyById);
    app.post('/', {
        schema: {
            body: studySchema_js_1.createStudySchema,
        },
    }, studyController_js_1.createStudy);
    app.put('/:id', {
        schema: {
            params: studySchema_js_1.studyParamsSchema,
            body: studySchema_js_1.updateStudySchema,
        },
    }, studyController_js_1.updateStudy);
    app.delete('/:id', {
        schema: {
            params: studySchema_js_1.studyParamsSchema,
        },
    }, studyController_js_1.deleteStudy);
}
