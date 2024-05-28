import { TValidationObject } from "@shared/types/TValidationObject";
import { Joi } from "express-validation";

type TKeys = "changePassword" | "forgotPassword" | "resetPassword";

const validations: TValidationObject<TKeys> = {
	changePassword: {
		body: Joi.object({
			oldPassword: Joi.string().min(8).required(),
			newPassword: Joi.string().min(8).required(),
		}),
	},
	forgotPassword: {
		body: Joi.object({
			email: Joi.string().email().required(),
		}),
	},
	resetPassword: {
		body: Joi.object({
			token: Joi.string().uuid().required(),
			password: Joi.string().min(8).required(),
		}),
	},
};

export default validations;
