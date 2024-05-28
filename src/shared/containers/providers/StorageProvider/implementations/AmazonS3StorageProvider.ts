import aws from "aws-sdk";

import mime from "mime-types";
import path from "path";
import fs from "fs/promises";

import { IStorageProvider } from "../models/IStorageProvider";
import uploadConfig from "@config/upload";

class AmazonS3StorageProvider implements IStorageProvider {
	private s3: aws.S3;
	private bucketName = process.env.S3_BUCKET_NAME as string;

	constructor() {
		aws.config.update({
			region: process.env.AWS_DEFAULT_REGION,
		});

		this.s3 = new aws.S3({
			apiVersion: "2006-03-01",
		});
	}

	async saveFile(file: string) {
		const filePath = path.resolve(uploadConfig.tmpfolder, file);

		const fileContent = await fs.readFile(filePath);
		const fileContentType = mime.contentType(file);

		if (!fileContentType) {
			throw new Error("Extension failure.");
		}

		await this.s3
			.putObject({
				Bucket: this.bucketName,
				Key: file,
				ACL: "public-read",
				Body: fileContent,
				ContentType: fileContentType,
			})
			.promise();

		return file;
	}

	async deleteFile(file: string) {
		await this.s3
			.deleteObject({
				Bucket: this.bucketName,
				Key: file,
			})
			.promise();
	}
}

export default AmazonS3StorageProvider;
