import { IDateManagerProvider } from "../models/IDateManagerProvider";
import dayjs from "dayjs";

class DayJsDateManagerProvider implements IDateManagerProvider {
	addHours(date: Date, hours: number) {
		return dayjs(date).add(hours, "hours").toDate();
	}

	addSeconds(date: Date, seconds: number) {
		return dayjs(date).add(seconds, "seconds").toDate();
	}

	getTimesDifferenceInSeconds(end: Date, start: Date) {
		return dayjs(end).diff(start, "seconds");
	}

	getTimesDifferenceInHours(end: Date, start: Date) {
		return dayjs(end).diff(start, "hours");
	}
}

export default DayJsDateManagerProvider;
