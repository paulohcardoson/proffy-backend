import { ICreateConnectionRequest, TConnection } from "./types";

export interface IConnectionsRepository {
	create: (data: ICreateConnectionRequest) => Promise<TConnection>;
	count: () => Promise<number>;
}
