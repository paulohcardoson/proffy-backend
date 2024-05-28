import handlebars from "handlebars";
import { IParseMailTemplateDTO } from "../dtos/IParseMailTemplateDTO";
import { IMailTemplateProvider } from "../models/IMailTemplateProvider";

class HandlebarsMailTemplateProvider implements IMailTemplateProvider {
	async parse({ template, variables }: IParseMailTemplateDTO): Promise<string> {
		const render = handlebars.compile(template);

		return render(variables);
	}
}

export default HandlebarsMailTemplateProvider;
