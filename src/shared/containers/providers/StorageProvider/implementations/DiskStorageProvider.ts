import fs, { promises as fsPromises } from "fs";
import path from "path";

import { IStorageProvider } from "../models/IStorageProvider";
import storageConfig from "@config/upload";

class DiskStorageProvider implements IStorageProvider {
	async saveFile(file: string) {
		const uploadFilePath = path.resolve(storageConfig.tmpfolder, file);

		await fsPromises.rename(
			path.resolve(storageConfig.tmpfolder, file),
			path.resolve(storageConfig.uploadsFolder, file),
		);

		return uploadFilePath;
	}

	async deleteFile(file: string) {
		const filePath = path.resolve(storageConfig.uploadsFolder, file);
		const fileExists = fs.existsSync(filePath);

		if (!fileExists) return;

		await fsPromises.rm(filePath);
	}
}

export default DiskStorageProvider;
