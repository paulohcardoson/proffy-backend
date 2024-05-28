import { TValidationObject } from "@shared/types/TValidationObject";
import { Joi } from "express-validation";

type TKeys = "create";

const validations: TValidationObject<TKeys> = {
	create: {
		body: Joi.object({
			email: Joi.string().email().required(),
			password: Joi.string().min(8).required(),
		}),
	},
};

export default validations;
