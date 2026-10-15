// Utilidades geométricas y de cálculo GPS para Madrid

export function getDistanceBetweenCoords(p1: [number, number], p2: [number, number]): number {
  const [lat1, lon1] = p1;
  const [lat2, lon2] = p2;
  const R = 6371; // Radio de la Tierra en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Interpola la posición a lo largo de una polilínea dada un porcentaje de progreso (0 - 100)
export function getInterpolatedPosition(
  coordinates: [number, number][],
  progressPct: number
): [number, number] {
  if (!coordinates || coordinates.length === 0) {
    return [40.4168, -3.7038]; // Centro Madrid por defecto
  }
  if (coordinates.length === 1 || progressPct <= 0) {
    return coordinates[0];
  }
  if (progressPct >= 100) {
    return coordinates[coordinates.length - 1];
  }

  // Calcular distancias de segmentos y acumuladas
  const segmentLengths: number[] = [];
  let totalLength = 0;

  for (let i = 0; i < coordinates.length - 1; i++) {
    const len = getDistanceBetweenCoords(coordinates[i], coordinates[i + 1]);
    segmentLengths.push(len);
    totalLength += len;
  }

  if (totalLength === 0) return coordinates[0];

  const targetDist = (progressPct / 100) * totalLength;
  let accumulated = 0;

  for (let i = 0; i < segmentLengths.length; i++) {
    const segLen = segmentLengths[i];
    if (accumulated + segLen >= targetDist || i === segmentLengths.length - 1) {
      const remaining = targetDist - accumulated;
      const t = segLen > 0 ? Math.min(Math.max(remaining / segLen, 0), 1) : 0;
      const [startLat, startLng] = coordinates[i];
      const [endLat, endLng] = coordinates[i + 1];

      const lat = startLat + t * (endLat - startLat);
      const lng = startLng + t * (endLng - startLng);
      return [lat, lng];
    }
    accumulated += segLen;
  }

  return coordinates[coordinates.length - 1];
}
