import { TValidationObject } from "@shared/types/TValidationObject";
import { Joi } from "express-validation";

type TKeys = "create" | "createWithProfile" | "delete";

const validations: TValidationObject<TKeys> = {
	create: {
		body: Joi.object({
			email: Joi.string().email().required(),
			password: Joi.string().min(8).required(),
		}),
	},
	createWithProfile: {
		body: Joi.object({
			email: Joi.string().email().required(),
			password: Joi.string().min(8).required(),
			name: Joi.string().min(3).required(),
			phone_number: Joi.string().required(),
			bio: Joi.string().min(10).max(256).required(),
		}),
	},
	delete: {
		body: Joi.object({
			password: Joi.string().min(8).required(),
		}),
	},
};

export default validations;
