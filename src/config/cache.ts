import { RedisClientOptions } from "redis";
import { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } from "@shared/env";

interface ICacheConfig {
	driver: "redis";

	config: {
		redis: RedisClientOptions;
	};
}

const cacheConfig: ICacheConfig = {
	driver: "redis",

	config: {
		redis: {
			url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
			password: REDIS_PASSWORD,
		},
	},
};

export default cacheConfig;
