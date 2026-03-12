"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studyRoutes = studyRoutes;
const studyController_1 = require("../controllers/studyController");
const studySchema_1 = require("../schemas/studySchema");
const authMiddleware_1 = require("../middleware/authMiddleware");
async function studyRoutes(app) {
    app.addHook('preHandler', authMiddleware_1.authMiddleware);
    app.get('/', {
        schema: {
            querystring: studySchema_1.studyQuerySchema,
        },
    }, studyController_1.studyController.getStudies.bind(studyController_1.studyController));
    app.get('/:id', {
        schema: {
            params: studySchema_1.studyParamsSchema,
        },
    }, studyController_1.studyController.getStudyById.bind(studyController_1.studyController));
    app.post('/', {
        schema: {
            body: studySchema_1.createStudySchema,
        },
    }, studyController_1.studyController.createStudy.bind(studyController_1.studyController));
    app.put('/:id', {
        schema: {
            params: studySchema_1.studyParamsSchema,
            body: studySchema_1.updateStudySchema,
        },
    }, studyController_1.studyController.updateStudy.bind(studyController_1.studyController));
    app.delete('/:id', {
        schema: {
            params: studySchema_1.studyParamsSchema,
        },
    }, studyController_1.studyController.deleteStudy.bind(studyController_1.studyController));
}
