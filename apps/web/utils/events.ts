export function translateEvent(str: string): string {
  switch (str) {
    case "Heating On":
      return "Zapnuto vyhřívání";
    case "Heating Off":
      return "Vypnuto vyhřívání";
    case "Cooling On":
      return "Zapnuto chlazení";
    case "Cooling Off":
      return "Vypnuto chlazení";
  }
  return "Neznámá událost";
}
