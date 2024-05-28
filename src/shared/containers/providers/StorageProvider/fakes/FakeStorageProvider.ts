import { IStorageProvider } from "../models/IStorageProvider";

class FakeStorageProvider implements IStorageProvider {
	private storage: string[] = [];

	async saveFile(file: string) {
		this.storage.push(file);

		return file;
	}

	async deleteFile(file: string) {
		const findIndex = this.storage.findIndex((_file) => _file === file);

		this.storage.splice(findIndex);
	}
}

export default FakeStorageProvider;
