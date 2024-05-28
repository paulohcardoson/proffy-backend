import AppError from "@shared/errors/AppError";
import multer, { StorageEngine } from "multer";
import mime from "mime-types";
import path from "path";
import crypto from "crypto";

import { STORAGE_DRIVER } from "@shared/env";

interface IStorageConfig {
	driver: "s3" | "disk";
	tmpfolder: string;
	uploadsFolder: string;
	config: {
		multer: {
			storage: StorageEngine;
		};
	};
}

const tmpfolder = path.resolve(__dirname, "..", "..", "tmp");

const storageConfig: IStorageConfig = {
	driver: STORAGE_DRIVER,
	tmpfolder,
	uploadsFolder: path.resolve(tmpfolder, "uploads"),

	config: {
		multer: {
			storage: multer.diskStorage({
				destination: tmpfolder,
				filename(request, file, callback) {
					const fileHash = crypto.randomBytes(16).toString("hex");
					const fileExtension = mime.extension(file.mimetype);

					if (!fileExtension) throw new AppError("No file ex");
					const fileName = `${fileHash}-${file.originalname}`;

					return callback(null, fileName);
				},
			}),
		},
	},
};

export default storageConfig;
