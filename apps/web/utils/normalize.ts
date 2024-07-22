export function normalizeString(input: string): string {
  const czechChars = new Map<string, string>([
    ["ě", "e"],
    ["š", "s"],
    ["č", "c"],
    ["ř", "r"],
    ["ž", "z"],
    ["ý", "y"],
    ["á", "a"],
    ["í", "i"],
    ["é", "e"],
    ["ů", "u"],
    ["ú", "u"],
    ["ť", "t"],
    ["ň", "n"],
    ["ď", "d"],
    ["ó", "o"],
    ["ü", "u"],
  ]);

  return input
    .toLowerCase()
    .replace(/[ěščřžýáíéůúťňďóü]/g, (char) => czechChars.get(char) || char);
}
