import { formatTime, getTodayISO, getTomorrowISO } from './time.js';
describe('Time', () => {
    describe('formatTime', () => {
        it('should format time correctly', () => {
            const dateStr = '2023-10-01T12:34:56';
            const expected = '12:34';
            const result = formatTime(dateStr);
            expect(result).toBe(expected);
        })
    })
    describe('getTodayISO', () => {
        it('should return today\'s date in ISO format', () => {
            const today = new Date();
            const expected = today.toISOString().split("T")[0];
            const result = getTodayISO(); 
            expect(result).toBe(expected);
        });
    })
    describe('getTomorrowISO', () => {
        it('should return tomorrow\'s date in ISO format', () => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const expected = tomorrow.toISOString().split("T")[0];
            const result = getTomorrowISO();
            expect(result).toBe(expected);
        });
    })
});
