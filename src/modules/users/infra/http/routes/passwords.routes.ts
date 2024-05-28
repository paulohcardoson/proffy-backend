import { Router } from "express";

import ResetPasswordController from "../controllers/ResetPasswordController";
import ForgotPasswordController from "../controllers/ForgotPasswordController";
import validations from "../validations/passwords.validations";
import { validate } from "express-validation";
import UpdatePasswordController from "../controllers/UpdatePasswordController";
import ensureAuthenticated from "../middlewares/ensureAuthenticated";

const passwordsRouter = Router();

const updatePasswordController = new UpdatePasswordController();
const forgotPasswordController = new ForgotPasswordController();
const resetPasswordController = new ResetPasswordController();

passwordsRouter.post(
	"/change-password",
	ensureAuthenticated,
	validate(validations.changePassword),
	updatePasswordController.create,
);

passwordsRouter.post(
	"/forgot-password",
	validate(validations.forgotPassword),
	forgotPasswordController.create,
);

passwordsRouter.post(
	"/reset-password",
	validate(validations.resetPassword),
	resetPasswordController.create,
);

export default passwordsRouter;
