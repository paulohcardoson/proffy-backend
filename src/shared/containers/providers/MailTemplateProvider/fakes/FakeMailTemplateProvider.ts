import { IParseMailTemplateDTO } from "../dtos/IParseMailTemplateDTO";
import { IMailTemplateProvider } from "../models/IMailTemplateProvider";

class FakeMailTemplateProvider implements IMailTemplateProvider {
	async parse({ template }: IParseMailTemplateDTO): Promise<string> {
		return template;
	}
}

export default FakeMailTemplateProvider;
