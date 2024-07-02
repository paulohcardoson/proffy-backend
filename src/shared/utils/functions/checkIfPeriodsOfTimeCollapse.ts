import { IPeriod } from "@modules/classes/types/IPeriod";

const checkIfPeriodsOfTimeCollapse = (period: IPeriod, _period: IPeriod) => {
	if (period.from >= _period.from && period.from <= _period.to) return true;
	if (period.from <= _period.from && period.to >= _period.from) return true;

	return false;
};

export default checkIfPeriodsOfTimeCollapse;
