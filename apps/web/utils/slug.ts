export function toSlug(s: string): string {
  const charMap: Map<string, string> = new Map([
    ["č", "c"],
    ["ď", "d"],
    ["ě", "e"],
    ["ň", "n"],
    ["ř", "r"],
    ["š", "s"],
    ["ť", "t"],
    ["ů", "u"],
    ["ú", "u"],
    ["ý", "y"],
    ["ž", "z"],
    ["á", "a"],
    ["í", "i"],
    ["é", "e"],
    ["ó", "o"],
  ]);

  let slug = s.toLowerCase();
  slug = Array.from(slug)
    .map((char) => charMap.get(char) || char)
    .join("");
  slug = slug.replace(/\s+/g, "-");
  slug = slug.replace(/[^a-z0-9-]/g, "");

  return slug;
}
