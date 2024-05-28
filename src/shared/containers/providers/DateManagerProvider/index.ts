import { container } from "tsyringe";

import { IDateManagerProvider } from "./models/IDateManagerProvider";
import DayJsDateManagerProvider from "./implementations/DayJsDateManagerProvider";

container.registerInstance<IDateManagerProvider>(
	"DateManagerProvider",
	new DayJsDateManagerProvider(),
);
