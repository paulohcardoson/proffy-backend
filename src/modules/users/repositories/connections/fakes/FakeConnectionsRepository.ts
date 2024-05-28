import { randomUUID } from "crypto";
import { IConnectionsRepository } from "../IConnectionsRepository";
import { ICreateConnectionRequest, TConnection } from "../types";

class FakeConnectionsRepository implements IConnectionsRepository {
	private repository: TConnection[] = [];

	async create(data: ICreateConnectionRequest) {
		const connection: TConnection = {
			id: randomUUID(),
			createdAt: new Date(),
			updatedAt: new Date(),
			...data,
		};

		return connection;
	}

	async count() {
		return this.repository.length;
	}
}

export default FakeConnectionsRepository;
