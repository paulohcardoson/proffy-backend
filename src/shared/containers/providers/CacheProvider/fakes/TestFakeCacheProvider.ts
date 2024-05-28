import { inject, injectable } from "tsyringe";
import { ICacheProvider } from "../models/ICacheProvider";
import { IDateManagerProvider } from "../../DateManagerProvider/models/IDateManagerProvider";

interface ICacheData {
	[key: string]: string;
}

interface ICacheTTLData {
	[key: string]: Date;
}

@injectable()
class FakeCacheProvider implements ICacheProvider {
	private cache: ICacheData = {};
	private cacheExpirationDate: ICacheTTLData = {};

	constructor(
		@inject("DateManagerProvider")
		private dateManagerProvider: IDateManagerProvider,
	) {}

	async save(key: string, value: unknown, ttlInSeconds?: number) {
		this.cache[key] = JSON.stringify(value);

		const currentDate = new Date();
		this.cacheExpirationDate[key] = this.dateManagerProvider.addSeconds(
			currentDate,
			ttlInSeconds || 9999,
		);
	}

	async recover(key: string) {
		const data = this.cache[key];

		if (!data) return null;

		return data;
	}

	async recoverTTL(key: string) {
		const expirationDate = this.cacheExpirationDate[key];

		if (!expirationDate) return -1;

		const currentDate = new Date();
		const ttl = this.dateManagerProvider.getTimesDifferenceInSeconds(
			expirationDate,
			currentDate,
		);

		return ttl;
	}

	async invalidate(key: string) {
		delete this.cache[key];
		delete this.cacheExpirationDate[key];
	}
}

export default FakeCacheProvider;
