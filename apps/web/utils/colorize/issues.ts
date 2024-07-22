export function colorizeIssueType(str: string): string {
  switch (str) {
    case "Motorová jednotka":
      return "#059669";
    case "Klimatizační jednotka":
      return "#65a30d";
    case "Kamera":
      return "#9333ea";
    case "Router":
      return "#db2777";
    case "Počítač":
      return "#c026d3";
    case "Rozvaděč":
      return "#4f46e5";
    case "Babybox":
      return "#2563eb";
    case "Datová síť":
      return "#e11d48";
    case "Teplota":
      return "#ea580c";
    case "Obsluha":
      return "#dc2626";
    case "Mechanický problém":
      return "#0284c7";
    default:
      return "#71717a";
  }
}

export function colorizeIssueSubtype(str: string): string {
  switch (str) {
    case "Software":
      return "#c026d3";
    case "Hardware":
      return "#10b981";
    case "Síťové připojení":
      return "#9333ea";
    case "Email":
      return "#9333ea";
    case "Návrh na výměnu":
      return "#dc2626";
    case "Vypadává":
      return "#e11d48";
    case "Nastavení":
      return "#c026d3";
    case "Rychlost":
      return "#65a30d";
    case "Návrh na vylepšení":
      return "#65a30d";
    case "Spolehlivost":
      return "#65a30d";
    case "Spouštění":
      return "#c026d3";
    case "Restart":
      return "#c026d3";
    case "Monitorovací software":
      return "#c026d3";
    case "Nastavovací software":
      return "#c026d3";
    case "Chybějicí software":
      return "#dc2626";
    case "Skříň":
      return "#10b981";
    case "Chlazení":
      return "#0d9488";
    case "Pojistka":
      return "#0d9488";
    case "Akumulátor":
      return "#0d9488";
    case "GSM":
      return "#0d9488";
    case "Diodové pole":
      return "#0d9488";
    case "Výpadek":
      return "#e11d48";
    case "Firewall":
      return "#9333ea";
    case "Teplota plášť":
      return "#0d9488";
    case "Klimatizace":
      return "#0d9488";
    case "Teplotní čidlo":
      return "#0d9488";
    case "Chyba":
      return "#dc2626";
    case "Námět":
      return "#65a30d";
    case "Stížnost":
      return "#dc2626";
    case "Přední dvířka":
      return "#10b981";
    case "Servisní dvířka":
      return "#10b981";
    case "Vanička":
      return "#10b981";
    default:
      return "#71717a";
  }
}

export function colorizePriority(str: string): string {
  switch (str) {
    case "Okamžitá":
      return "#dc2626";
    case "Naléhavá":
      return "#ea580c";
    case "Důležítá":
      return "#ca8a04";
    case "Střední":
      return "#15803d";
    case "Nízká":
      return "#22c55e";
    case "Statistika":
      return "#4f46e5";
    default:
      return "#71717a";
  }
}

export function colorizeSeverity(str: string): string {
  switch (str) {
    case "Kritická":
      return "#dc2626";
    case "Významná":
      return "#ea580c";
    case "Mírná":
      return "#ca8a04";
    case "Kosmetická":
      return "#22c55e";
    case "Statistika":
      return "#4f46e5";
    default:
      return "#71717a";
  }
}

export function colorizeStatus(str: string): string {
  switch (str) {
    case "created":
      return "#0d9488";
    case "open":
      return "#2563eb";
    case "planned":
      return "#7c3aed";
    case "in_progress":
      return "#c026d3";
    case "closed":
      return "#dc2626";
    case "solved":
      return "#16a34a";
    default:
      return "";
  }
}
