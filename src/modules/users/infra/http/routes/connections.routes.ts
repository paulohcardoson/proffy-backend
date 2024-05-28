import { Router } from "express";
import { validate } from "express-validation";
import validations from "../validations/connections.validations";

import ConnectionsController from "@modules/users/infra/http/controllers/ConnectionsController";

const connectionsRouter = Router();
const connectionsController = new ConnectionsController();

connectionsRouter.get("/all", connectionsController.index);

connectionsRouter.post(
	"/add",
	validate(validations.add),
	connectionsController.create,
);

export default connectionsRouter;
