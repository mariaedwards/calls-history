import { validateDate } from './validators';

describe('validateDate', () => {
    it('should return true for an empty date', () => {
        expect(validateDate('')).toBe(true);
    });

    it('should return false for incorrectly formatted dates', () => {
        expect(validateDate('31-12-2020')).toBe(false); // Wrong format, should be MM-DD-YYYY
        expect(validateDate('2020-12-31')).toBe(false); // Wrong format, should be MM-DD-YYYY
    });

    it('should validate correct dates accurately', () => {
        expect(validateDate('12-31-2020')).toBe(true); // Valid date
        expect(validateDate('01-01-2020')).toBe(true); // Valid date
    });

    it('should reject dates with invalid day, month, or year', () => {
        expect(validateDate('13-31-2020')).toBe(false); // Invalid month
        expect(validateDate('12-31-999')).toBe(false); // Invalid year
        expect(validateDate('12-32-2020')).toBe(false); // Invalid day
    });

    it('should handle leap years correctly', () => {
        expect(validateDate('02-29-2020')).toBe(true); // Leap year
        expect(validateDate('02-29-2021')).toBe(false); // Not a leap year
    });

    it('should correctly handle edge cases around leap year calculation', () => {
        expect(validateDate('02-29-1900')).toBe(false); // Not a leap year by Gregorian rules
        expect(validateDate('02-29-2000')).toBe(true); // Leap year by Gregorian rules
    });
});
