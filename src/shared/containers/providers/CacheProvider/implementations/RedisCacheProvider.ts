import { createClient } from "redis";
import { ICacheProvider } from "../models/ICacheProvider";
import cacheConfig from "@config/cache";

class RedisCacheProvider implements ICacheProvider {
	private client = createClient(cacheConfig.config.redis);

	constructor() {
		this.client.connect();
	}

	async save(key: string, value: unknown, ttlInSeconds?: number) {
		const parsedData = JSON.stringify(value);

		await this.client.set(key, parsedData, {
			EX: ttlInSeconds,
		});
	}

	async recover(key: string) {
		const data = await this.client.get(key);

		if (!data) return null;

		return data;
	}

	async recoverTTL(key: string) {
		const ttl = await this.client.ttl(key);

		return ttl;
	}

	async invalidate(key: string) {
		await this.client.del(key);
	}
}

export default RedisCacheProvider;
