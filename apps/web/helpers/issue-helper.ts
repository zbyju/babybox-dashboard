function makeValueLabelList(s: string[]): { label: string; value: string }[] {
  return s.map((s) => ({ label: s, value: s }));
}

export const priorities = makeValueLabelList([
  "Okamžitá",
  "Naléhavá",
  "Důležítá",
  "Střední",
  "Nízká",
  "Statistika",
  "Neuvedena",
]);

export const severities = makeValueLabelList([
  "Kritická",
  "Významná",
  "Mírná",
  "Kosmetická",
  "Statistika",
  "Neuvedena",
]);

export const types = [
  "Motorová jednotka",
  "Klimatizační jednotka",
  "Kamera",
  "Router",
  "Počítač",
  "Rozvaděč",
  "Babybox",
  "Datová síť",
  "Teplota",
  "Obsluha",
  "Mechanický problém",
] as const;

export type IssueType = (typeof types)[number];

export const getSubtypes = function (type: string) {
  if (typeof type !== "string") return [];
  const mapTypeSubtypes = new Map<IssueType, string[]>([
    [
      "Motorová jednotka",
      ["Software", "Hardware", "Síťové připojení", "Email", "Návrh na výměnu"],
    ],
    [
      "Klimatizační jednotka",
      ["Software", "Hardware", "Síťové připojení", "Email", "Návrh na výměnu"],
    ],
    [
      "Kamera",
      [
        "Vypadává",
        "Email",
        "Nastavení",
        "Rychlost",
        "Návrh na výměnu",
        "Návrh na vylepšení",
      ],
    ],
    [
      "Router",
      [
        "Vypadává",
        "Spolehlivost",
        "Nastavení",
        "Návrh na výměnu",
        "Návrh na zlepšení",
      ],
    ],
    [
      "Počítač",
      [
        "Spouštení",
        "Restart",
        "Monitorovací software",
        "Nastavovací software",
        "Chybějící software",
        "Návrh na výměnu",
      ],
    ],
    [
      "Rozvaděč",
      [
        "Skříň",
        "Chlazení",
        "Pojistka",
        "Restart",
        "Akumulátor",
        "GSM",
        "Diodové pole",
      ],
    ],
    ["Babybox", ["Návrh na výměnu"]],
    ["Datová síť", ["Výpadek", "Firewall"]],
    ["Teplota", ["Teplota plášť", "Klimatizace", "Teplotní čidlo"]],
    ["Obsluha", ["Chyba", "Námět", "Stížnost"]],
    ["Mechanický problém", ["Přední dvířka", "Servisní dvířka", "Vanička"]],
  ]);

  const lowerCaseMapTypeSubtypes = new Map(
    Array.from(mapTypeSubtypes, ([key, value]) => [key.toLowerCase(), value]),
  );
  const key = type.toLowerCase();
  return makeValueLabelList(lowerCaseMapTypeSubtypes.get(key) || []);
};

