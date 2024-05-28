import { TValidationObject } from "@shared/types/TValidationObject";
import { Joi } from "express-validation";

type TKeys = "find" | "create";

const validations: TValidationObject<TKeys> = {
	find: {
		query: Joi.object({
			week_day: Joi.number().integer().min(1).max(7).required(),
			subject: Joi.string().required(),
			time: Joi.string()
				.regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
				.required(),
		}),
	},
	create: {
		body: Joi.object({
			subject: Joi.string().required(),
			cost: Joi.number().min(1).max(10000).required(),
			schedules: Joi.array()
				.items(
					Joi.object({
						week_day: Joi.number().integer().min(1).max(7).required(),
						from: Joi.string()
							.regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
							.required(),
						to: Joi.string()
							.regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
							.required(),
					}),
				)
				.required(),
		}),
	},
};

export default validations;
