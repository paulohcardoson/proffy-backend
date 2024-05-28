export interface IDateManagerProvider {
	addHours: (date: Date, hours: number) => Date;
	addSeconds: (date: Date, seconds: number) => Date;
	getTimesDifferenceInSeconds: (end: Date, start: Date) => number;
	getTimesDifferenceInHours: (end: Date, start: Date) => number;
}
