export function colorizeMaintenanceState(str: string): string {
  switch (str) {
    case "open":
      return "#2563eb";
    case "completed":
      return "#16a34a";
    default:
      return "";
  }
}
