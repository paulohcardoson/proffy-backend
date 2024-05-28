import { container } from "tsyringe";
import { ICacheProvider } from "./models/ICacheProvider";
import RedisCacheProvider from "./implementations/RedisCacheProvider";
import { CACHE_DRIVER } from "@shared/env";

const drivers = {
	redis: RedisCacheProvider,
};

container.registerInstance<ICacheProvider>(
	"CacheProvider",
	new drivers[CACHE_DRIVER](),
);
