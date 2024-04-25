import { formatDate, formatPhone, formatDuration } from './formatters';
import parsePhoneNumber from 'libphonenumber-js';

// Mock the entire libphonenumber-js module
jest.mock('libphonenumber-js', () => ({
  // Provide a factory function that returns the mock of the module
  __esModule: true, // This property is needed to correctly handle default exports
  default: jest.fn() // This replaces the default export (i.e., parsePhoneNumber)
}));

describe('formatters', () => {
  describe('formatDate', () => {
    it('should format the date correctly', () => {
      const rawDate = "2024-04-15T14:20:00Z";
      const expectedDate = new Date(rawDate).toLocaleDateString();
      expect(formatDate(rawDate)).toBe(expectedDate);
    });
  });

  describe('formatPhone', () => {
    it('should format the phone number correctly', () => {
      const rawNumber = "+1234567890";
      const formattedNumber = "INTERNATIONAL: +1 234 567 890";
      parsePhoneNumber.mockImplementation(() => ({
        format: () => formattedNumber
      }));
      expect(formatPhone(rawNumber)).toBe(formattedNumber);
    });
  });

  describe('formatDuration', () => {
    it('returns N/A for null duration', () => {
      expect(formatDuration(null)).toBe('N/A');
    });

    it('formats duration correctly in minutes and seconds', () => {
      expect(formatDuration(125)).toBe('2 min 5 sec');
      expect(formatDuration(3661)).toBe('61 min 1 sec');
    });
  });
});
