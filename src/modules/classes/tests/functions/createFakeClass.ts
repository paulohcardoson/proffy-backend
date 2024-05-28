import CreateClassService from "@modules/classes/services/CreateClassService";
import { IClassesRepository } from "@modules/classes/repositories/classes/IClassesRepository";
import { IProfilesRepository } from "@modules/profiles/repositories/profiles/IProfilesRepository";

export const fakeClassData = {
	subject: "Matemática",
	cost: 80,
};

const createFakeClass = async (
	userId: string,
	profilesRepository: IProfilesRepository,
	classesRepository: IClassesRepository,
) => {
	const createClassService = new CreateClassService(
		profilesRepository,
		classesRepository,
	);

	return await createClassService.execute({ userId, ...fakeClassData });
};

export default createFakeClass;
