export const fivePointIndices = [16, 17, 18, 19, 20, 21, 22, 23];

export function calculateFactorScores(responses: number[]) {
  const scores: Record<string, number> = {};

  // Example scoring logic: average the fivePointIndices
  // Replace with your real math
  const fivePointScores = fivePointIndices.map(i => responses[i] || 0);
  const avg = fivePointScores.length
    ? fivePointScores.reduce((a, b) => a + b, 0) / fivePointScores.length
    : 0;

  scores["fivePointAvg"] = avg;

  return scores;
}
