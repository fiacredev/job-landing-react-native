export interface Coordinates {
  latitude: number;
  longitude: number;
}

export const calculateETA = (
  pickup: Coordinates,
  drop: Coordinates,
  averageSpeed: number = 40 // km/h default
): number => {
  const R = 6371; // earth radius in KM

  const toRadians = (deg: number) => deg * (Math.PI / 180);

  const dLat = toRadians(drop.latitude - pickup.latitude);
  const dLon = toRadians(drop.longitude - pickup.longitude);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(pickup.latitude)) *
      Math.cos(toRadians(drop.latitude)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  const etaMinutes = (distance / averageSpeed) * 60;

  return Math.round(etaMinutes);
};