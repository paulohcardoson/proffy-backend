import { Request, Response } from "express";
import { container } from "tsyringe";

import UpdateProfileAvatarService from "@modules/profiles/services/UpdateProfileAvatarService";

class ProfilesAvatarsController {
	async update(req: Request, res: Response) {
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

export default ProfilesAvatarsController;
