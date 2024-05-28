export interface IHashProvider {
	generate: (input: string) => Promise<string>;
	compare: (toHash: string, hashed: string) => Promise<boolean>;
}
