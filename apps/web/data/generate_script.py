import unicodedata
import random
from datetime import datetime, timedelta

# Modify the generation function to remove accent characters
def remove_accents(input_str):
    nfkd_form = unicodedata.normalize('NFKD', input_str)
    return "".join([c for c in nfkd_form if not unicodedata.combining(c)])

def generate_babyboxes_no_accents():
    base_timestamp = datetime.now()
    cities = [
        "Praha", "Ústí nad Labem", "Brno", "Ostrava", "Plzeň", "Liberec",
        "Olomouc", "České Budějovice", "Hradec Králové", "Pardubice", 
        "Zlín", "Havířov", "Kladno", "Most", "Opava", "Frýdek-Místek",
        "Karviná", "Jihlava", "Teplice", "Děčín", "Chomutov", "Jablonec nad Nisou",
        "Mladá Boleslav", "Prostějov", "Přerov", "Třebíč", "Ústí nad Orlicí",
        "Hodonín", "Český Těšín", "Kutná Hora", "Klatovy", "Valašské Meziříčí",
        "Svitavy", "Litoměřice", "Orlová", "Cheb", "Jirkov", "Žďár nad Sázavou",
        "Blansko", "Znojmo", "Beroun", "Uherské Hradiště", "Mělník", "Louny",
        "Náchod", "Vsetín", "Litvínov", "Nový Jičín", "Česká Lípa", "Krnov"
    ]
    
    babyboxes = []
    for i in range(50):
        city = random.choice(cities)
        cities.remove(city)  
        
        if random.random() < 0.1:
            timestamp = base_timestamp - timedelta(hours=random.randint(1, 24))
        else:
            timestamp = base_timestamp - timedelta(minutes=random.randint(1, 10))
        
        babybox = {
            "slug": remove_accents(city.lower().replace(" ", "-")),
            "name": city,
            "lastData": {
                "timestamp": timestamp.strftime("%H:%M:%S %d-%m-%Y"),
                "voltage": {
                    "in": round(random.uniform(14.0, 15.0), 2),
                    "battery": round(random.uniform(11.5, 12.5), 2)
                },
                "temperature": {
                    "inside": round(random.uniform(20.0, 30.0), 2),
                    "outside": round(random.uniform(20.0, 35.0), 2),
                    "casing": round(random.uniform(20.0, 30.0), 2),
                    "top": round(random.uniform(15.0, 50.0), 2),
                    "bottom": round(random.uniform(15.0, 40.0), 2)
                }
            }
        }
        
        babyboxes.append(babybox)
        
    return babyboxes

# Generate the babyboxes with no accents
babyboxes_no_accents = generate_babyboxes_no_accents()

# Save the output as a TypeScript file
output_path = "babyboxes.ts"
with open(output_path, "w") as file:
    file.write("export const babyboxes = ")
    file.write(str(babyboxes_no_accents))
    file.write(";")
