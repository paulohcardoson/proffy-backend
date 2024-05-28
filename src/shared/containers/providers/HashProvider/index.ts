import { container } from "tsyringe";
import BCryptHashProvider from "./implementations/BCryptHashProvider";
import { IHashProvider } from "./models/IHashProvider";

container.registerInstance<IHashProvider>(
	"HashProvider",
	new BCryptHashProvider(),
);
