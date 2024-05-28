import express, { Router } from "express";
import storageConfig from "@config/upload";

import usersRouter from "@modules/users/infra/http/routes/users.routes";
import sessionsRouter from "@modules/users/infra/http/routes/sessions.routes";
import classesRouter from "@modules/classes/infra/http/routes/classes.routes";
import profilesRouter from "@modules/profiles/infra/http/routes/profiles.routes";
import connectionsRouter from "@modules/users/infra/http/routes/connections.routes";
import passwordsRouter from "@modules/users/infra/http/routes/passwords.routes";

const appRouter = Router();

appRouter.use("/sessions", sessionsRouter);
appRouter.use("/users", usersRouter);
appRouter.use("/profiles", profilesRouter);
appRouter.use("/classes", classesRouter);
appRouter.use("/connections", connectionsRouter);

appRouter.use(passwordsRouter);
appRouter.use("/static", express.static(storageConfig.uploadsFolder));

export default appRouter;
