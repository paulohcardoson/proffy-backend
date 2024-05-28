import { Router } from "express";
import { validate } from "express-validation";
import validations from "../validations/profiles.validations";

import multer from "multer";

import uploadConfig from "@config/upload";
import ensureAuthenticated from "@modules/users/infra/http/middlewares/ensureAuthenticated";
import ProfilesController from "@modules/profiles/infra/http/controllers/ProfilesController";
import ProfilesAvatarsController from "../controllers/ProfilesAvatarsController";

const upload = multer(uploadConfig.config.multer);

const profilesRouter = Router();
const profilesController = new ProfilesController();
const profilesAvatarsController = new ProfilesAvatarsController();

profilesRouter.get("/me", ensureAuthenticated, profilesController.read);

profilesRouter.put(
	"/me",
	ensureAuthenticated,
	validate(validations.update),
	profilesController.update,
);

profilesRouter.patch(
	"/me/change-avatar",
	ensureAuthenticated,
	upload.single("avatar"),
	profilesAvatarsController.update,
);

export default profilesRouter;
