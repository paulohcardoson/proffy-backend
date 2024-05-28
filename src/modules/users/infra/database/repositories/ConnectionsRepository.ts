import { ICreateConnectionRequest } from "../../../repositories/connections/types";
import { IConnectionsRepository } from "@modules/users/repositories/connections/IConnectionsRepository";
import prisma from "@shared/containers/prisma";

class ConnectionsRepository implements IConnectionsRepository {
	private repository = prisma.connection;

	async create(data: ICreateConnectionRequest) {
		return await this.repository.create({ data });
	}

	async count() {
		return await this.repository.count();
	}
}

export default ConnectionsRepository;
