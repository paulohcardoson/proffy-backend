import { Router } from "express";
import { validate } from "express-validation";

import validations from "../validations/classes.validations";

import ensureAuthenticated from "@modules/users/infra/http/middlewares/ensureAuthenticated";

import ClassesController from "../controllers/ClassesController";
import ClassesWithScheduleController from "@modules/classes/infra/http/controllers/ClassesWithScheduleController";

const classesRouter = Router();

const classesController = new ClassesController();
const classesWithScheduleController = new ClassesWithScheduleController();

classesRouter.post(
	"/create",
	ensureAuthenticated,
	validate(validations.createWithSchedule),
	classesWithScheduleController.create,
);

classesRouter.get("/", validate(validations.find), classesController.index);

export default classesRouter;
