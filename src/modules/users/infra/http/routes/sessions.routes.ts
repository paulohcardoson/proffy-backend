import { Router } from "express";
import { validate } from "express-validation";
import validations from "../validations/sessions.validations";

import SessionsController from "@modules/users/infra/http/controllers/SessionsController";

const sessionsRouter = Router();
const sessionsController = new SessionsController();

sessionsRouter.post(
	"/create",
	validate(validations.create),
	sessionsController.create,
);

export default sessionsRouter;
