"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subjectRoutes = subjectRoutes;
const subjectController_1 = require("../controllers/subjectController");
const subjectSchema_1 = require("../schemas/subjectSchema");
const authMiddleware_1 = require("../middleware/authMiddleware");
async function subjectRoutes(app) {
    app.addHook('preHandler', authMiddleware_1.authMiddleware);
    app.get('/', {
        schema: {
            querystring: subjectSchema_1.subjectQuerySchema,
        },
    }, subjectController_1.subjectController.getSubjects.bind(subjectController_1.subjectController));
    app.get('/:id', {
        schema: {
            params: subjectSchema_1.subjectParamsSchema,
        },
    }, subjectController_1.subjectController.getSubjectById.bind(subjectController_1.subjectController));
    app.post('/', {
        schema: {
            body: { type: "object",
                required: ["name"],
                properties: {
                    name: { type: "string" }
                }
            }
        }
    }, subjectController_1.subjectController.createSubject.bind(subjectController_1.subjectController));
    app.put('/:id', {
        schema: {
            params: subjectSchema_1.subjectParamsSchema,
            body: subjectSchema_1.updateSubjectSchema,
        },
    }, subjectController_1.subjectController.updateSubject.bind(subjectController_1.subjectController));
    app.delete('/:id', {
        schema: {
            params: subjectSchema_1.subjectParamsSchema,
        },
    }, subjectController_1.subjectController.deleteSubject.bind(subjectController_1.subjectController));
}
