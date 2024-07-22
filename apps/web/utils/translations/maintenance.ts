export function translateMaintenanceState(str: string): string {
  switch (str) {
    case "open":
      return "Otevřený";
    case "finished":
      return "Ukončený";
    default:
      return "Neznámý";
  }
}
