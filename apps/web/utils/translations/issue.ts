export function translateIssueState(state: string): string {
  switch (state) {
    case "created":
      return "Vytvořena";
    case "open":
      return "Otevřená";
    case "planned":
      return "Naplánovaná";
    case "in_progress":
      return "V řešení";
    case "closed":
      return "Uzavřená";
    case "solved":
      return "Vyřešená";
    default:
      return "Neznámý stav";
  }
}
