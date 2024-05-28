import { ICacheProvider } from "../models/ICacheProvider";

class FakeCacheProvider implements ICacheProvider {
	private cache: { [key: string]: string | undefined } = {};
	private amountOfKeyReadings: { [key: string]: number } = {};

	async save(key: string, value: unknown, _ttlInSeconds?: number) {
		this.cache[key] = JSON.stringify(value);
		this.amountOfKeyReadings[key] = 0;
	}

	async recover(key: string) {
		const data = this.cache[key];

		if (!data) return null;

		const amountOfKeyReadings = this.amountOfKeyReadings[key];

		this.amountOfKeyReadings[key] = amountOfKeyReadings + 1;

		return data;
	}

	async recoverTTL(key: string) {
		const amountOfKeyReadings = this.amountOfKeyReadings[key];

		if (amountOfKeyReadings > 1) return 0;

		return 999;
	}

	async invalidate(key: string) {
		delete this.cache[key];
		delete this.amountOfKeyReadings[key];
	}
}

export default FakeCacheProvider;
