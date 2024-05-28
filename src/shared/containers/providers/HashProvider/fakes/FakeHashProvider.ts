import { IHashProvider } from "../models/IHashProvider";

class FakeHashProvider implements IHashProvider {
	async generate(input: string) {
		return input;
	}

	async compare(toHash: string, hashed: string) {
		return toHash === hashed;
	}
}

export default FakeHashProvider;
