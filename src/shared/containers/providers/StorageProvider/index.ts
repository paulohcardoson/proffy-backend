import { container } from "tsyringe";
import { IStorageProvider } from "./models/IStorageProvider";
import DiskStorageProvider from "./implementations/DiskStorageProvider";
import AmazonS3StorageProvider from "./implementations/AmazonS3StorageProvider";
import { STORAGE_DRIVER } from "@shared/env";

const providers = {
	disk: DiskStorageProvider,
	s3: AmazonS3StorageProvider,
};

container.registerInstance<IStorageProvider>(
	"StorageProvider",
	new providers[STORAGE_DRIVER](),
);
