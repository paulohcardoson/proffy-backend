import { MAIL_DRIVE } from "@shared/env";

interface IMailConfig {
	driver: "etherial";
}

const mailConfig: IMailConfig = {
	driver: MAIL_DRIVE,
};

export default mailConfig;
