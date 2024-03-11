import moment from "moment";

class DateUtils {
    static calculateOlds(birthYear) {
        return moment(new Date()).year() - birthYear;
    }
}

export default DateUtils;
