export const getMsUntilNextHeartbeat = () => {
  const now = new Date();
  const minutes = now.getMinutes();
  const nextInterval = Math.ceil((minutes + 0.1) / 5) * 5; // Next :00, :05, :10...

  const nextHeartbeat = new Date(now);
  nextHeartbeat.setMinutes(nextInterval, 0, 0); // Set to next 5m mark

  return nextHeartbeat.getTime() - now.getTime();
};
