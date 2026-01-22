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
 * Calculations for fare breakdown
 */
export interface FareBreakdown {
    distanceKm: number;
    effectiveDistanceKm: number;
    rate: number;
    baseFare: number;
    driverAllowance: number;
    surgeMultiplier: number;
    surgeAmount: number;
    totalFare: number;
    isMinDistanceApplied: boolean;
}

export const DRIVER_ALLOWANCE_PER_DAY = 600;
export const MIN_DISTANCE_ONE_WAY = 130;
export const MIN_DISTANCE_ROUND_TRIP = 250;

/**
 * Calculates the final fare with all components.
 */
export const calculateFinalFare = (
    distanceKm: number,
    tripType: string,
    rate: number,
    dateTime: string | Date | undefined,
    numDays: number = 1
): FareBreakdown => {
    const isRoundTrip = tripType?.toLowerCase() === "roundtrip" || tripType === "Round Trip";
    const minDistance = isRoundTrip ? MIN_DISTANCE_ROUND_TRIP : MIN_DISTANCE_ONE_WAY;

    // Apply minimum distance logic
    const distanceToCharge = isRoundTrip ? distanceKm * 2 : distanceKm;
    const effectiveDistance = Math.max(distanceToCharge, minDistance);
    const isMinDistanceApplied = effectiveDistance > distanceToCharge;

    const baseFare = Math.round(effectiveDistance * rate);
    const driverAllowance = numDays * DRIVER_ALLOWANCE_PER_DAY;
    const surgeMultiplier = calculateSurge(dateTime);
    const surgeAmount = Math.round(baseFare * (surgeMultiplier - 1));

    const totalFare = baseFare + driverAllowance + surgeAmount;

    return {
        distanceKm: distanceToCharge,
        effectiveDistanceKm: effectiveDistance,
        rate,
        baseFare,
        driverAllowance,
        surgeMultiplier,
        surgeAmount,
        totalFare,
        isMinDistanceApplied
    };
};

/**
 * Descriptions for surges to show in UI
 */
export const getSurgeLabel = (multiplier: number): string | null => {
    if (multiplier >= 1.25) return "Peak Hour Surge applied";
    if (multiplier >= 1.15) return "Night Charges applied";
    return null;
};
