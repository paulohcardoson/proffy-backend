import { TValidationObject } from "@shared/types/TValidationObject";
import { Joi } from "express-validation";

type TKeys = "add";

const validations: TValidationObject<TKeys> = {
	add: {
		body: Joi.object({
			profile_id: Joi.string().uuid().required(),
		}),
	},
};

export default validations;
