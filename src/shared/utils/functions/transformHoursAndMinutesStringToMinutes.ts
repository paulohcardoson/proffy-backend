/**
 *
 * @param time Time in HH:mm
 * @returns The time in minutes starting from midnight
 */
const transformHoursAndMinutesStringToMinutes = (time: string) => {
	const [hours, minutes] = time.split(":").map(Number);

	return hours * 60 + minutes;
};

export default transformHoursAndMinutesStringToMinutes;
