from datasets import load_dataset
import pandas as pd
import json
import random
from datetime import datetime

# Load dataset
print("Loading dataset...")
ds = load_dataset("Data-Gouv-ML/liste-des-festivals-en-france", "festivals-global-festivals-_-pl")
split_name = list(ds.keys())[0]
df = pd.DataFrame(ds[split_name])

# Clean columns
df.columns = [c.lstrip('\ufeff') for c in df.columns]

# Filter rows with coordinates
df = df.dropna(subset=['Géocodage xy', 'Nom du festival'])

# Shuffle to get a representative selection
df = df.sample(frac=1, random_state=42).reset_index(drop=True)

# Unsplash Images
images_parties = [
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80"
]
images_art = [
    "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80"
]
images_community = [
    "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1531058020387-3be344559be6?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&auto=format&fit=crop&q=80"
]
images_tech = [
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80"
]

def get_image(category):
    if category == 'parties':
        return random.choice(images_parties)
    elif category == 'art':
        return random.choice(images_art)
    elif category == 'tech':
        return random.choice(images_tech)
    else:
        return random.choice(images_community)

events = []
count = 0

for _, row in df.iterrows():
    if count >= 300:
        break
        
    try:
        title = row['Nom du festival']
        geom = row['Géocodage xy']
        
        parts = geom.split(',')
        if len(parts) != 2:
            continue
        lat = float(parts[0].strip())
        lng = float(parts[1].strip())
        
        # Verify valid coordinates
        if not (-90 <= lat <= 90) or not (-180 <= lng <= 180):
            continue
            
        discipline = row.get('Discipline dominante', '')
        if not discipline:
            discipline = 'Pluridisciplinaire'
            
        # Map discipline to category
        disc_lower = discipline.lower()
        if 'musique' in disc_lower:
            category = 'parties'
        elif any(x in disc_lower for x in ['spectacle vivant', 'cinéma', 'livre', 'littérature', 'arts visuels', 'arts numériques']):
            category = 'art'
        elif 'pluridisciplinaire' in disc_lower or 'divers' in disc_lower:
            category = 'community'
        else:
            category = 'community'
            
        # Map period to realistic dates in 2026
        period = str(row.get('Période principale de déroulement du festival', '')).lower()
        
        if 'saison' in period or 'juillet' in period or 'août' in period or 'juin' in period or 'septembre' in period:
            # Summer: random date between June 21 and Sept 5
            month = random.choice([6, 7, 8])
            if month == 6:
                day = random.randint(21, 30)
            elif month == 7:
                day = random.randint(1, 31)
            else:
                day = random.randint(1, 31)
        elif 'avant-saison' in period or 'mars' in period or 'avril' in period or 'mai' in period:
            # Spring/Winter: random date between Jan 1 and June 20
            month = random.choice([1, 2, 3, 4, 5])
            day = random.randint(1, 28)
        elif 'après-saison' in period or 'octobre' in period or 'novembre' in period or 'décembre' in period:
            # Autumn/Winter: random date between Sept 6 and Dec 31
            month = random.choice([9, 10, 11, 12])
            day = random.randint(1, 28)
        else:
            # Random date throughout the year
            month = random.randint(1, 12)
            day = random.randint(1, 28)
            
        hour = random.choice([10, 14, 18, 20])
        minute = random.choice([0, 30])
        
        date_str = f"2026-{month:02d}-{day:02d}T{hour:02d}:{minute:02d}"
        
        # Mapped location fields
        city = row.get('Commune principale de déroulement', 'France')
        venue = row.get('Adresse postale', '')
        if not venue or pd.isna(venue):
            venue = f"{row.get('Nom de la voie', '')} {row.get('Commune principale de déroulement', '')}".strip()
        if not venue:
            venue = f"{city}, France"
            
        organizer = row.get('Site internet du festival', '')
        if not organizer or pd.isna(organizer) or organizer == 'null':
            organizer = "Association " + title
            
        desc = f"Bienvenue au festival '{title}' ! Cet événement culturel de premier plan se déroule à {city} et met à l'honneur la discipline '{discipline}'. "
        if row.get('Année de création du festival'):
            desc += f"Créé en {row.get('Année de création du festival')}, le festival attire des passionnés de toute la région. "
        desc += "Découvrez les artistes, profitez de l'ambiance et explorez la commune et ses environs."
        
        evt = {
            "id": f"evt-french-{count}",
            "title": title,
            "description": desc,
            "category": category,
            "date": date_str,
            "price": random.choice([0, 5, 10, 15, 25]),
            "venue": venue,
            "city": city,
            "lat": lat,
            "lng": lng,
            "organizer": organizer,
            "rating": round(random.uniform(4.2, 5.0), 1),
            "image": get_image(category),
            "reviews": [],
            "status": "approved" # Official events are auto-approved
        }
        events.append(evt)
        count += 1
        
    except Exception as e:
        print("Skipping row due to error:", e)

# Save to JSON
with open("french_festivals.json", "w", encoding="utf-8") as f:
    json.dump(events, f, indent=2, ensure_ascii=False)

print(f"Successfully processed {len(events)} festivals and wrote to french_festivals.json")
