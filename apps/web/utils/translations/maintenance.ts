export function translateMaintenanceState(str: string): string {
  switch (str) {
    case "open":
      return "Otevřený";
    case "completed":
      return "Ukončený";
    default:
      return "Neznámý";
  }
}
