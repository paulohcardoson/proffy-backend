import { container } from "tsyringe";

import { IProfilesRepository } from "@modules/profiles/repositories/profiles/IProfilesRepository";
import { IConnectionsRepository } from "@modules/users/repositories/connections/IConnectionsRepository";
import { IUsersRepository } from "@modules/users/repositories/users/IUsersRepository";
import { IClassesRepository } from "@modules/classes/repositories/classes/IClassesRepository";
import { IClassesSchedulesRepository } from "@modules/classes/repositories/classes-schedules/IClassesSchedulesRepository";
import { IPasswordRecoveryTokensRepository } from "@modules/users/repositories/password-recovery-tokens/IPasswordRecoveryTokensRepository";

import ProfilesRepository from "@modules/profiles/infra/database/repositories/ProfilesRepository";
import ClassesRepository from "@modules/classes/infra/database/repositories/ClassesRepository";
import UsersRepository from "@modules/users/infra/database/repositories/UsersRepository";
import ConnectionsRepository from "@modules/users/infra/database/repositories/ConnectionsRepository";
import ClassesSchedulesRepository from "@modules/classes/infra/database/repositories/ClassesSchedulesRepository";
import PasswordRecoveryTokensRepository from "@modules/users/infra/database/repositories/PasswordRecoveryTokensRepository";

container.registerSingleton<IUsersRepository>(
	"UsersRepository",
	UsersRepository,
);

container.registerSingleton<IPasswordRecoveryTokensRepository>(
	"PasswordRecoveryTokensRepository",
	PasswordRecoveryTokensRepository,
);

container.registerSingleton<IProfilesRepository>(
	"ProfilesRepository",
	ProfilesRepository,
);

container.registerSingleton<IClassesRepository>(
	"ClassesRepository",
	ClassesRepository,
);

container.registerSingleton<IClassesSchedulesRepository>(
	"ClassesSchedulesRepository",
	ClassesSchedulesRepository,
);

container.registerSingleton<IConnectionsRepository>(
	"ConnectionsRepository",
	ConnectionsRepository,
);
