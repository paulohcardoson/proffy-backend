import { Router } from "express";
import { validate } from "express-validation";

import validations from "../validations/classes.validations";

import ensureAuthenticated from "@modules/users/infra/http/middlewares/ensureAuthenticated";

import ClassesController from "@modules/classes/infra/http/controllers/ClassesController";

const classesRouter = Router();
const classesController = new ClassesController();

classesRouter.post(
	"/create",
	ensureAuthenticated,
	validate(validations.create),
	classesController.create,
);

classesRouter.get("/", validate(validations.find), classesController.index);

export default classesRouter;
