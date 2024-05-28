import { container } from "tsyringe";
import MailtrapMailProvider from "./implementations/MailtrapMailProvider";
import { IMailProvider } from "./model/IMailProvider";

container.registerInstance<IMailProvider>(
	"MailProvider",
	container.resolve(MailtrapMailProvider),
);
