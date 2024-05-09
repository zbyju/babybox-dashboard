import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BellRing, Share, TabletSmartphone } from "lucide-react";

export default function Help() {
  const content = [
    {
      icon: <TabletSmartphone />,
      heading: "Jak nainstalovat aplikaci?",
      content: (
        <>
          Aplikace se nainstaluje tak, že:
          <ol className="ml-6 list-decimal">
            <li>
              Otevřeme jakoukoliv stránku platformy Babybox Dashboard v
              prohlížeči.
            </li>
            <li>
              Zmáčkneme tlačítko prohlížeče pro sdílení (ikona:{" "}
              <Share className="my-auto inline h-4 w-4" />)
            </li>
            <li>Vybereme položku &quot;Přidat na domovskou obrazovku&quot;</li>
            <li>Aplikaci můžeme libovolně přejmenovat a následně přidáme.</li>
            <li>
              Na obrazovce telefonu by se měla objevit ikona pro spuštění
              aplikace.
            </li>
          </ol>
        </>
      ),
    },
    {
      icon: <BellRing />,
      heading: "Jak fungují notifikace?",
      content: (
        <>
          <p>
            Notifikace jsou vytvářeny na základě uživatelsky vytvořených
            notifikačních šablon. Tyto šablony mohou být vytvořeny v sekci
            Notifikace, kliknutím na tlačítko přidat.
          </p>
          <p>
            Notifikace jsou odesílány na zadané emailové adresy a zároveň
            zobrazeny na přehledové stránce jednotlivých babyboxů dole.
          </p>
        </>
      ),
    },
    {
      icon: <BellRing />,
      heading: "Jak vytvořit notifikační šablonu?",
      content: (
        <>
          <p>
            Pro vytvoření notifikační šablony je potřeba se navigovat na stránku
            Notifikace a následně na stránku Přidat Notifikace. Zde je potřeba
            vyplnit několik věcí:
          </p>
          <ol className="ml-6 list-decimal">
            <li>
              <b>Rozsah</b> šablony - pro jaký babybox bude šablona určena.
              Můžeme určit buď všechny, nebo vybrat specifický.
            </li>
            <li>
              <b>Název</b> a <b>zpráva</b> - dodatečné informace dodané společně
              s notifikací.
            </li>
            <li>
              <b>Severita</b> - jak závažná situace je (Nizká - informace,
              Střední - Varování, Vysoká - Chyba)
            </li>
            <li>
              Podmínka pro vytvoření se skládá z <b>Proměnné</b> (dynamické
              hodnoty z babyboxu), která je <b>Porovnána</b> s <b>Hodnotou</b>.
              Například, pokud chceme notifikace pokud teplota vnitřní klesne 25
              stupňů, pak zadáme Vnitřní teplota; Menší než; 25.
            </li>
            <li>
              <b>Notifikace nové chyby</b> - pokud je vygenerovaná notifikace a
              spustí se časová prodleva do další notifikace, ale babybox se
              navrátí do dobrého stavu, ale následně problém zase nastane, pak
              je časová prodleva přeskočena. Toto nastavení je výhodné
              kombinovat s vysokými časovými prodlevami, které jsou přeskočeny,
              pokud chyba znovu nastane. Není vhodné pro notifikace o stavech,
              které budou oscilovat okolo hodnoty pro notifikaci (překračovat
              hranici pro notifikaci a zase se vracet), protože pak budou
              notifikace generovány pořád.
            </li>
            <li>
              <b>Časová prodleva</b> - doba v minutách, po kterou nejsou
              generovány nové notifikace.
            </li>
            <li>
              <b>Řada</b> - počet odeslaných dat z babyboxu, které musí splnit
              podmínku v řadě pro vygenerování notifikace.
            </li>
            <li>
              <b>Emaily</b> - seznam emailových adres, na které bude odeslaná
              notifikace (pokud není vyplněn žádný, pak je notifikace zobrazena
              v aplikaci, ale není odeslána emailem).
            </li>
          </ol>
          <p>
            Pro přidání emailu je potřeba kliknout na tlačítko přidat email.
          </p>
          <p>
            Následně je potřeba kliknout na tlačítko uložit pro vytvoření
            notifikační šablony.
          </p>
        </>
      ),
    },
  ];
  return (
    <div className="mb-10 mt-2 w-full px-4 lg:px-[16%]">
      <div>
        <Accordion type="multiple">
          {content.map((c) => (
            <AccordionItem key={c.heading} value={c.heading}>
              <AccordionTrigger className="text-2xl font-semibold">
                <div className="flex flex-row flex-wrap items-center gap-3">
                  <span className="h-6 w-6">{c.icon}</span> {c.heading}
                </div>
              </AccordionTrigger>
              <AccordionContent>{c.content}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
