import AppError from "@shared/errors/AppError";
import createFakeUser, { fakeUserData } from "./functions/createFakeUser";

import FakeUsersRepository from "@modules/users/repositories/users/fakes/FakeUsersRepository";
import FakePasswordRecoveryTokensRepository from "../repositories/password-recovery-tokens/fakes/FakePasswordRecoveryTokensRepository.ts";

import FakeHashProvider from "@shared/containers/providers/HashProvider/fakes/FakeHashProvider";
import FakeMailProvider from "@shared/containers/providers/MailProvider/fakes/FakeMailProvider";

import SendForgotPasswordEmailService from "@modules/users/services/SendForgotPasswordEmailService";
import CreateSessionService from "../services/CreateSessionService";
import DeleteUserService from "../services/DeleteUserService";
import ResetPasswordService from "../services/ResetPasswordService";
import CreateUserService from "../services/CreateUserService";
import UpdatePasswordService from "../services/UpdatePasswordService";
import FakeDateManagerProvider from "@shared/containers/providers/DateManagerProvider/fakes/FakeDateManagerProvider";

// Repositories
let fakeUsersRepository: FakeUsersRepository;
let fakePasswordRecoveryTokensRepository: FakePasswordRecoveryTokensRepository;

// Providers
let fakeHashProvider: FakeHashProvider;
let fakeMailProvider: FakeMailProvider;
let fakeDateManagerProvider: FakeDateManagerProvider;

// Services
let createUserService: CreateUserService;
let deleteUserService: DeleteUserService;
let createSessionService: CreateSessionService;
let updatePasswordService: UpdatePasswordService;
let sendForgotPasswordEmailService: SendForgotPasswordEmailService;
let resetPasswordService: ResetPasswordService;

describe("Users Tests", () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository();
		fakePasswordRecoveryTokensRepository =
			new FakePasswordRecoveryTokensRepository();

		fakeHashProvider = new FakeHashProvider();
		fakeMailProvider = new FakeMailProvider();
		fakeDateManagerProvider = new FakeDateManagerProvider();

		createUserService = new CreateUserService(
			fakeUsersRepository,
			fakeHashProvider,
		);
		deleteUserService = new DeleteUserService(
			fakeUsersRepository,
			fakeHashProvider,
		);
		createSessionService = new CreateSessionService(
			fakeUsersRepository,
			fakeHashProvider,
		);
		updatePasswordService = new UpdatePasswordService(
			fakeUsersRepository,
			fakeHashProvider,
		);
		sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
			fakeUsersRepository,
			fakePasswordRecoveryTokensRepository,
			fakeMailProvider,
		);
		resetPasswordService = new ResetPasswordService(
			fakeUsersRepository,
			fakePasswordRecoveryTokensRepository,
			fakeHashProvider,
			fakeDateManagerProvider,
		);
	});

	it("Should create a user.", async () => {
		const user = await createFakeUser(fakeUsersRepository);

		expect(user).toHaveProperty("id");
	});

	it("Should not create a user, because email is already registred.", async () => {
		await createUserService.execute(fakeUserData);

		expect(createUserService.execute(fakeUserData)).rejects.toBeInstanceOf(
			AppError,
		);
	});

	it("Should create a session.", async () => {
		await createFakeUser(fakeUsersRepository);

		const session = await createSessionService.execute(fakeUserData);

		expect(typeof session).toBe("string");
	});

	it("Should not create a session because user doesn't exist.", async () => {
		await createFakeUser(fakeUsersRepository);

		expect(
			createSessionService.execute({
				...fakeUserData,
				email: "non-existent@test.com",
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it("Should not create a session because the password is incorrect.", async () => {
		await createFakeUser(fakeUsersRepository);

		expect(
			createSessionService.execute({
				...fakeUserData,
				password: "wrong-password",
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it("Should not delete user because user doesn't exist.", async () => {
		await createFakeUser(fakeUsersRepository);

		expect(
			deleteUserService.execute({
				id: "non-existent-id",
				password: fakeUserData.password,
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it("Should not delete user because the password is incorrect.", async () => {
		const user = await createFakeUser(fakeUsersRepository);

		expect(
			deleteUserService.execute({ id: user.id, password: "wrong-password" }),
		).rejects.toBeInstanceOf(AppError);
	});

	// Password change
	it("Should change password.", async () => {
		const user = await createFakeUser(fakeUsersRepository);

		expect(
			updatePasswordService.execute({
				userId: user.id,
				oldPassword: user.password,
				newPassword: "new-password",
			}),
		).resolves.toBeUndefined();
	});

	it("Should not change password because user doesn't exist.", async () => {
		expect(
			updatePasswordService.execute({
				userId: "non-existing-user-id",
				oldPassword: "user-password",
				newPassword: "new-password",
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it("Should not change password because old password is incorrect.", async () => {
		const user = await createFakeUser(fakeUsersRepository);

		expect(
			updatePasswordService.execute({
				userId: user.id,
				oldPassword: "wrong-old-password",
				newPassword: "new-password",
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it("Should not change password because old and new passwords are the same", async () => {
		const user = await createFakeUser(fakeUsersRepository);

		expect(
			updatePasswordService.execute({
				userId: user.id,
				oldPassword: fakeUserData.password,
				newPassword: fakeUserData.password,
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	// Password recovery
	it("Should send password recovery to email address.", async () => {
		const { id, email } = await createFakeUser(fakeUsersRepository);

		const sendEmailFunction = jest.spyOn(fakeMailProvider, "sendMail");
		const generateTokenFunction = jest.spyOn(
			fakePasswordRecoveryTokensRepository,
			"generate",
		);

		await sendForgotPasswordEmailService.execute({ email });

		expect(sendEmailFunction).toHaveBeenCalled();
		expect(generateTokenFunction).toHaveBeenCalledWith(id);
	});

	it("Should not send password recovery to email address, because email isn't registered.", async () => {
		await createFakeUser(fakeUsersRepository);

		expect(
			sendForgotPasswordEmailService.execute({
				email: "non-existent-user-email@test.com",
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it("Should change user password.", async () => {
		const user = await createFakeUser(fakeUsersRepository);

		const { token } = await fakePasswordRecoveryTokensRepository.generate(
			user.id,
		);

		const userNewPassword = "new-password";

		await resetPasswordService.execute({ token, password: userNewPassword });

		const updatedUser = await fakeUsersRepository.findByEmail(user.email);

		const passwordsMatch = await fakeHashProvider.compare(
			userNewPassword,
			updatedUser.password,
		);

		expect(passwordsMatch).toBe(true);
	});

	it("Should not change user password, because token is invalid.", async () => {
		const user = await createFakeUser(fakeUsersRepository);

		await fakePasswordRecoveryTokensRepository.generate(user.id);

		expect(
			resetPasswordService.execute({
				token: "invalid-token",
				password: "new-password",
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it("Should not change user password, because token has already expired.", async () => {
		const user = await createFakeUser(fakeUsersRepository);

		const { token } = await fakePasswordRecoveryTokensRepository.generate(
			user.id,
		);

		const currentDate = new Date();

		// Skip two hours
		currentDate.setHours(currentDate.getHours() + 2);
		jest.useFakeTimers().setSystemTime(currentDate);

		const userNewPassword = "new-password";

		expect(
			resetPasswordService.execute({ token, password: userNewPassword }),
		).rejects.toBeInstanceOf(AppError);
	});

	// Delete user
	it("Should delete user", async () => {
		const user = await createFakeUser(fakeUsersRepository);

		expect(
			deleteUserService.execute({
				id: user.id,
				password: fakeUserData.password,
			}),
		).resolves.toBeUndefined();
	});
});
