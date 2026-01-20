/**
 * Centralized utility for pricing and surge calculations.
 */

/**
 * Calculates the surge multiplier based on the scheduled date and time.
 * @param dateTime The scheduled travel date and time (ISO string or Date object)
 * @returns The surge multiplier (1.0, 1.15, or 1.25)
 */
export const calculateSurge = (dateTime: string | Date | undefined): number => {
    if (!dateTime) return 1;

    const dateObj = typeof dateTime === "string" ? new Date(dateTime) : dateTime;

    // Basic validation for invalid dates
    if (isNaN(dateObj.getTime())) return 1;

    const hour = dateObj.getHours();

    // Peak Hours: 8:00 AM - 11:59 AM and 5:00 PM - 9:59 PM (1.25x)
    if ((hour >= 8 && hour <= 11) || (hour >= 17 && hour <= 21)) {
        return 1.25;
    }

    // Night Hours: 10:00 PM - 5:59 AM (1.15x)
    if (hour >= 22 || hour <= 5) {
        return 1.15;
    }

    // Normal Hours (1.0x)
    return 1;
};

/**
 * Descriptions for surges to show in UI
 */
export const getSurgeLabel = (multiplier: number): string | null => {
    if (multiplier >= 1.25) return "Peak Hour Surge applied";
    if (multiplier >= 1.15) return "Night Charges applied";
    return null;
};
