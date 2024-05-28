import { inject, injectable } from "tsyringe";

import { IConnectionsRepository } from "../repositories/connections/IConnectionsRepository";
import { ICacheProvider } from "@shared/containers/providers/CacheProvider/models/ICacheProvider";

@injectable()
class CountConnectionsService {
	constructor(
		@inject("ConnectionsRepository")
		private connectionsRepository: IConnectionsRepository,

		@inject("CacheProvider")
		private cacheProvider: ICacheProvider,
	) {}

	async execute() {
		const cacheKey = "connections";
		const cacheDataTTL = await this.cacheProvider.recoverTTL(cacheKey);
		const cacheData = await this.cacheProvider.recover(cacheKey);

		if (cacheData && cacheDataTTL > 0) {
			const connectionsCount = Number(cacheData);

			return connectionsCount;
		}

		const connectionsCount = await this.countFromDatabase();
		await this.saveInCache(connectionsCount);

		return connectionsCount;
	}

	async countFromDatabase() {
		return await this.connectionsRepository.count();
	}

	async saveInCache(count: number, ttlInSeconds: number = 60 * 60) {
		return this.cacheProvider.save("connections", count, ttlInSeconds);
	}
}

export default CountConnectionsService;
