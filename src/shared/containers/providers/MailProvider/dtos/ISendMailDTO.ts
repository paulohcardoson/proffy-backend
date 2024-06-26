import { IParseMailTemplateDTO } from "@shared/containers/providers/MailTemplateProvider/dtos/IParseMailTemplateDTO";

interface IMailContact {
	name: string;
	email: string;
}

export interface ISendMailDTO {
	to: IMailContact;
	from?: IMailContact;
	subject: string;
	templateData: IParseMailTemplateDTO;
}
