import moment from "moment";

class DateUtils {
    static calculateOlds(birthYear) {
        return moment(new Date()).year() - birthYear;
    }
    static formatTime(date) {
        return moment(date).format('HH:mm');
    }
    static formatDate(date) {
        return moment(date).format('DD/MM/YYYY');
    }
}

export default DateUtils;
