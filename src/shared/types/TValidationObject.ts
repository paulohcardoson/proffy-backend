import { schema } from "express-validation";

export type TValidationObject<T extends string> = {
	[key in T]: schema;
};
