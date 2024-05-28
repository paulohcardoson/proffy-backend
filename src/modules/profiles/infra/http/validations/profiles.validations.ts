import { TValidationObject } from "@shared/types/TValidationObject";
import { Joi } from "express-validation";

type TKeys = "update";

const validations: TValidationObject<TKeys> = {
	update: {
		body: Joi.object({
			name: Joi.string().min(3).required(),
			phoneNumber: Joi.string().required(),
			bio: Joi.string().min(10).max(256).required(),
		}),
	},
};

export default validations;
