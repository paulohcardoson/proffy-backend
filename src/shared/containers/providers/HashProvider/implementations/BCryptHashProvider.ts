import { IHashProvider } from "../models/IHashProvider";
import { hash, compare } from "bcrypt";

class BCryptHashProvider implements IHashProvider {
	async generate(input: string) {
		return await hash(input, 8);
	}

	async compare(toHash: string, hashed: string) {
		return await compare(toHash, hashed);
	}
}

export default BCryptHashProvider;
