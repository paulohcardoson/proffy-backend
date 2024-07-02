import {
	APP_SERVER_HOST,
	APP_SERVER_PORT,
	S3_BUCKET_NAME,
	S3_BUCKET_REGION,
	STORAGE_DRIVER,
} from "@shared/env";

const generateAvatarURL = (avatar: string, storageDriver = STORAGE_DRIVER) => {
	switch (storageDriver) {
		case "disk": {
			return `${APP_SERVER_HOST}:${APP_SERVER_PORT}/static/${avatar}`;
		}
		case "s3": {
			return `https://${S3_BUCKET_NAME}.s3.${S3_BUCKET_REGION}.amazonaws.com/${avatar}`;
		}
	}
};

export default generateAvatarURL;
