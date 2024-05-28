import dotenv from "dotenv";

dotenv.config();

// Application
export const APP_SERVER_HOST = process.env.APP_SERVER_HOST as string;
export const APP_SERVER_PORT = Number(process.env.APP_SERVER_PORT as string);
export const APP_WEB_URL = process.env.APP_WEB_URL as string;

// Database
export const DATABASE_URL = process.env.DATABASE_URL as string;

// Cache
export const CACHE_DRIVER = process.env.CACHE_DRIVER as "redis";

// Redis
export const REDIS_HOST = process.env.REDIS_HOST as string;
export const REDIS_PORT = Number(process.env.REDIS_PORT as string);
export const REDIS_USER = process.env.REDIS_USER as string;
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD as string;

// Json Web Token
export const JWT_SECRET = process.env.JWT_SECRET as string;
export const JWT_EXPIRATION_TIME = process.env.JWT_EXPIRATION_TIME as string;

// Password Recovery
export const PASSWORD_RECOVERY_TOKEN_EXPIRATION_TIME_IN_HOURS = Number(
	process.env.PASSWORD_RECOVERY_TOKEN_EXPIRATION_TIME_IN_HOURS,
);

// Mail
export const MAIL_DRIVE = process.env.MAILTRAP_USER as "etherial";

/// Maitrap
export const MAILTRAP_USER = process.env.MAILTRAP_USER as string;
export const MAILTRAP_PASSWORD = process.env.MAILTRAP_PASSWORD as string;

// Storage
export const STORAGE_DRIVER = process.env.STORAGE_DRIVER as "disk" | "s3";

/// AWS S3
export const AWS_S3_ACCESS_KEY = process.env.AWS_S3_ACCESS_KEY as string;
export const AWS_S3_ACCESS_KEY_SECRET = process.env
	.AWS_S3_ACCESS_KEY_SECRET as string;
export const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME as string;
export const S3_BUCKET_REGION = process.env.S3_BUCKET_REGION as string;
