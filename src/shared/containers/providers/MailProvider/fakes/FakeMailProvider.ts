import { ISendMailDTO } from "../dtos/ISendMailDTO";
import { IMailProvider } from "../model/IMailProvider";

type TEmail = ISendMailDTO;

class FakeMailProvider implements IMailProvider {
	private emailsSent: TEmail[] = [];

	async sendMail(data: ISendMailDTO) {
		this.emailsSent.push(data);
	}
}

export default FakeMailProvider;
