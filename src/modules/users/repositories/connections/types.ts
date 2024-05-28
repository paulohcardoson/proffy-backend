import { Connection } from "@prisma/client";

export type TConnection = Connection;

export interface ICreateConnectionRequest {
	profileId: string;
}
