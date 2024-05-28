export interface ICacheProvider {
	save: (key: string, value: unknown, ttlInSeconds?: number) => Promise<void>;
	recover: (key: string) => Promise<string | null>;
	recoverTTL: (key: string) => Promise<number>;
	invalidate: (key: string) => Promise<void>;
}
