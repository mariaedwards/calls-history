export const validateDate = (date) => {
    if (!date) return true;

    const regex = /^(\d{2})-(\d{2})-(\d{4})$/;
    const match = date.match(regex);

    if (!match) return false;

    const month = parseInt(match[1], 10);
    const day = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);

    if (month < 1 || month > 12 || year < 1000 || year > 9999) {
        return false;
    }

    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (month === 2) {
        const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
        if (isLeap) daysInMonth[1] = 29;
    }

    return day > 0 && day <= daysInMonth[month - 1];
};
