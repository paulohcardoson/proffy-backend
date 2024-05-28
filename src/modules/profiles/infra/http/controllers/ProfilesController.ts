import { Request, Response } from "express";
import { container } from "tsyringe";

import FindProfileService from "@modules/profiles/services/FindProfileService";
import UpdateProfileInfoService from "@modules/profiles/services/UpdateProfileInfoService";
import UpdateProfileAvatarService from "@modules/profiles/services/UpdateProfileAvatarService";

class ProfilesController {
	async read(req: Request, res: Response) {
		const userId = req.userId as string;
		const findProfileService = container.resolve(FindProfileService);

		const profile = await findProfileService.execute({ userId });

		return res.status(200).json(profile);
	}

	async update(req: Request, res: Response) {
		const userId = req.userId as string;
		const updateProfileInfoService = container.resolve(
			UpdateProfileInfoService,
		);

		const profile = await updateProfileInfoService.execute({
			userId,
			...req.body,
		});

		return res.status(200).json(profile);
	}

	async updateAvatar(req: Request, res: Response) {
		const userId = req.userId as string;
		const { file } = req;

		const updateProfileAvatarService = container.resolve(
			UpdateProfileAvatarService,
		);

		const profile = await updateProfileAvatarService.execute({
			userId,
			avatar: file?.filename,
		});

		return res.status(200).json(profile);
	}
}

export default ProfilesController;
