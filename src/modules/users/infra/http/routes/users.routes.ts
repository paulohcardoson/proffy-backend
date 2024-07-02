import { Router } from "express";
import { validate } from "express-validation";

import validations from "../validations/users.validations";

import ensureAuthenticated from "@modules/users/infra/http/middlewares/ensureAuthenticated";

import UsersController from "../controllers/UsersController";

const usersRouter = Router();
const usersController = new UsersController();

usersRouter.post(
	"/create",
	validate(validations.createWithProfile),
	usersController.createWithProfile,
);

usersRouter.delete(
	"/me",
	ensureAuthenticated,
	validate(validations.delete),
	usersController.delete,
);

export default usersRouter;
