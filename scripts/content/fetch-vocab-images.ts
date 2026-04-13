/**
 * Generate Level 1 vocabulary image URLs.
 *
 * Default (no --search): static.photos — fast, no API key.
 * With --search + UNSPLASH_ACCESS_KEY: Unsplash search API (slower; respect UNSPLASH_DELAY_MS).
 *   Skips Unsplash photo IDs already used in the same run to reduce duplicate images across terms.
 *
 * Output: src/data/vocab-images-generated.ts (vocabImagesGenerated)
 * Manual URLs: src/data/vocab-images-overrides.ts (merged in vocab-images.ts; overrides always win)
 *
 * Usage:
 *   npm run vocab:images                      — fill missing generated keys (static)
 *   npm run vocab:images -- --force           — regenerate entire generated file (static)
 *   npm run vocab:images -- --search --force — regenerate all from Unsplash (needs key)
 *   npm run vocab:images -- --search --refetch "Old,City"
 *
 * Skips terms that already have a manual URL in vocab-images-overrides.ts unless --refetch lists them.
 *
 * Env: VOCAB_IMAGE_SIZE, UNSPLASH_ACCESS_KEY (or UNSPLASH_CLIENT_ID), UNSPLASH_DELAY_MS
 */

import * as fs from "fs";
import * as path from "path";
import { config as loadDotenv } from "dotenv";

loadDotenv({ path: path.join(__dirname, "../../.env.local") });
loadDotenv({ path: path.join(__dirname, "../../.env") });

import { LEVEL1_PUBLIC_VOCAB_UNITS } from "../../src/data/public-level1-vocab";

const OUT_FILE = path.join(__dirname, "../../src/data/vocab-images-generated.ts");
const OVERRIDES_FILE = path.join(__dirname, "../../src/data/vocab-images-overrides.ts");

/** Unsplash Access Key for --search mode. */
const ACCESS_KEY =
  process.env.UNSPLASH_ACCESS_KEY?.trim() ||
  process.env.UNSPLASH_CLIENT_ID?.trim() ||
  process.env.UNSPLASH_ACCESS_KEY_ID?.trim() ||
  process.env.PIXABAY_API_KEY?.trim();

const DEFAULT_DELAY_MS = 500;
const DELAY_MS = (() => {
  const raw = process.env.UNSPLASH_DELAY_MS?.trim() || process.env.PIXABAY_DELAY_MS?.trim();
  if (!raw) return DEFAULT_DELAY_MS;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n >= 0 ? n : DEFAULT_DELAY_MS;
})();

const DEFAULT_SIZE = process.env.VOCAB_IMAGE_SIZE?.trim() || "1024x576";

// ---------------------------------------------------------------------------
// Terms with no useful Unsplash visual — fall back to static.photos.
// ---------------------------------------------------------------------------
const SKIP_TERMS = new Set([
  // Pronouns
  "I", "You", "He", "She", "It", "We", "They",
  "Me", "Him", "Her", "Us", "Them",
  // Possessive adjectives
  "My", "Your", "His", "Its", "Our", "Their",
  // Contractions
  "I'm", "You're", "He's", "She's", "It's", "We're", "They're",
  "I'll", "You'll", "He'll", "I've", "You've",
  // Prepositions (covered by static.photos category)
  "In", "At", "On", "In front of", "Behind", "Between",
  "Next to", "Across from",
  // Abstract adverbs of frequency
  "Never", "Rarely", "Sometimes", "Usually", "Always",
  // Grammar / filler terms
  "Next", "Half",
]);

// ---------------------------------------------------------------------------
// Unsplash: optional per-term search strings (takes precedence over category context).
// ---------------------------------------------------------------------------
const SEARCH_QUERIES: Record<string, string> = {
  // ── Unit 1: Personal Information ────────────────────────────────────────
  "Man": "one man portrait adult male person outdoor candid",
  "Men": "group of men male friends walking together diverse adults",
  "Woman": "one woman portrait adult female person outdoor candid",
  "Women": "group of women female friends together diverse adults",
  "Name": "hello name tag badge introduction meeting",
  "City": "city skyline downtown buildings urban aerial",
  "Country": "countryside landscape rural farm",
  "Address": "house number mailbox home residential street",
  "Street": "residential street houses sidewalk neighborhood row houses",
  "Phone number": "smartphone calling mobile phone texting",
  "State": "United States map state geography region",
  "Zip code": "postal mail envelope mailbox letters delivery",
  "Job": "person working office workplace laptop professional",
  "Age": "birthday candles child age number celebration",
  "Birthday": "birthday cake candles party celebration",
  "Years old": "child birthday candles holding number smile",
  "Married": "wedding rings married couple ceremony",
  "Divorced": "two wedding rings separate table",
  "Old": "elderly person portrait senior smiling aged",
  "Favorite": "person choosing item store",
  "Toast": "toast bread breakfast sliced",
  "Cold": "person tissue runny nose sick",
  "Check": "check payment banking",
  "Turkey": "turkey bird thanksgiving",
  "Raise": "employee getting paycheck raise",
  "Break": "coffee break rest pause work",
  "Title": "business card job title",
  "Light": "lamp on table desk",
  "Counter": "kitchen counter granite",
  "Deck": "wood deck porch outdoor house",
  "Server": "restaurant server waiter",
  "Host": "restaurant host welcome guests",
  "Principal": "school principal educator",
  "Single": "single person relationship status",
  "Partner": "two colleagues working together",
  "Group": "group of people sitting together",
  "Physical": "doctor examining patient checkup",
  "Right": "turn right street sign",
  "Left": "turn left street sign",
  "Front": "front door house entrance",
  "Back": "back door house rear",
  "Over": "bridge over river above",
  "Under": "under table below",
  "Around": "person walking around block",
  "Straight": "straight hair hairstyle",
  "Agent": "real estate agent house showing",
  "Package": "package box delivery mail",
  "Can": "canned food tin",
  "Paper": "paper sheet school classroom",
  "Book": "book school textbook reading",
  "Pen": "pen ballpoint writing school",
  "Notebook": "notebook spiral school",
  "Textbook": "textbook school education",
  "Workbook": "workbook school exercises",
  "Board": "whiteboard blackboard classroom",
  "Marker": "whiteboard marker pen",
  "Eraser": "eraser chalkboard school",
  "Desk": "student desk classroom",
  "Chair": "chair classroom office",
  "Teacher": "teacher classroom school",
  "Student": "student classroom learning",
  "Classmate": "students classroom together",
  "Fat": "nutrition label fat food",
  "Sugar": "sugar bowl white granulated",
  "Salt": "salt shaker kitchen",
  "Pepper": "black pepper grinder kitchen",
  "Oil": "olive oil cooking bottle kitchen",
  "Head": "head face portrait person",
  "Arms": "arms human body",
  "Chest": "chest torso human body",
  "Pain": "person holding stomach in pain",
  "Cut": "bandage cut finger first aid",
  "Resume": "resume document job interview",
  "Application": "person filling out job application",

  // ── Unit 2-9: Aggressively specific queries for literal objects ───────────────
  "Morning": "sunrise morning sky bright sun macro",
  "Afternoon": "sun shining blue sky mid-day clear",
  "Evening": "sunset sky evening dusk clouds",
  "Night": "dark night sky stars moon clear",
  "Time": "analog alarm clock face isolated white background close up",
  "Schedule": "daily planner agenda notebook open desk close up macro",
  "Calendar": "wall calendar page macro close up isolated",
  "Appointment": "doctor appointment planner write pen close up macro",
  "Half": "clock showing half past hour close up macro",
  "Hour": "analog clock face isolated close up macro",
  "Minute": "clock minute hand macro close up isolated",
  "Breakfast": "bowl of cereal milk isolated white table breakfast",
  "Lunch": "sandwich plate simple white table lunch isolated",
  "Dinner": "plate of food meat vegetables simple dinner isolated",
  "Shower": "shower head running water bathroom macro close up",
  "O'clock": "wall clock face hour simple isolated white background",
  "Mother": "mother holding smiling child simple background portrait",
  "Son": "father holding son smiling portrait simple background",
  "Daughter": "mother hugging daughter portrait isolated background",
  "Cousin": "two children cousins hugging smiling portrait",
  "Uncle": "uncle child family outdoors portrait simple",
  "Aunt": "aunt niece family smiling portrait simple background",
  "Grandmother": "grandmother smiling portrait grey hair isolated simple",
  "Grandfather": "grandfather smiling portrait simple background",
  "Child": "single child smiling portrait simple background isolated",
  "Children": "group of happy children smiling together simple background",
  "Mother-in-law": "senior woman smiling portrait simple background",
  "Father-in-law": "senior man smiling portrait casual isolated",
  "Sister-in-law": "smiling young woman portrait simple background",
  "Brother-in-law": "smiling young man portrait casual simple background",
  "Members": "family group three people smiling simple background",
  "Relationship": "hands holding together care relationship isolated",
  "Hair": "healthy long hair brush back head isolated",
  "Eyes": "macro close up human eye blue green iris",
  "Short": "short person standing height measurement simple background",
  "Long": "long measuring tape simple background macro isolated",
  "Wavy": "wavy female hair back head simple background",
  "Curly": "curly hair texture portrait simple background",
  "Bald": "bald man portrait head simple bright background",
  "Brown": "brunette brown hair portrait back head simple background",
  "Red": "red ginger hair woman portrait back head simple",
  "Black": "black hair woman back head simple background",
  "Blond": "blonde hair portrait back simple background",
  "Gray": "grey white hair senior person simple background",
  "Tall": "tall building looking up simple sky height",
  "Young": "young adult face smiling simple background portrait",
  "Thin": "thin book spine close up macro",
  "Heavy": "heavy metal weight dumbbell close up isolated",
  "Candidate": "political candidate speaking at podium isolated",
  "Ballot": "paper ballot document closeup isolated",
  "Voter": "person putting ballot in voting box isolated",
  "Election": "vote button pin close up isolated election",
  "Campaign": "political campaign yard sign outdoors lawn",
  "Political Party": "democrat republican political vote buttons close up",
  "Doctor's office": "doctor stethoscope desk patient room bright clean",
  "Dentist's office": "empty dentist dental chair clinic bright clean interior",
  "Hospital": "hospital building red cross exterior day",
  "Hotel": "hotel building exterior entrance sign clear day",
  "House": "suburban house exterior simple clear day bright front",
  "Park": "empty park bench green grass trees sunny day",
  "Playground": "empty playground slide swings park outdoor sunny",
  "Supermarket": "empty supermarket grocery store aisle shelves",
  "Bank": "bank building exterior columns day clear",
  "Library": "library bookshelf row books indoor clear",
  "School": "school building exterior yellow bus clear day",
  "Pharmacy": "pharmacy counter green cross sign clear",
  "Post Office": "mailbox post office blue letter clear day",
  "Fire Department": "fire station building red fire truck garage exterior",
  "Police Station": "police car lights clear day building exterior",
  "RMV": "dmv waiting room interior chairs desk empty",
  "Bus Stop": "bus station stop bench empty sign outdoor",
  "Station": "train station platform empty tracks clear day building",
  "Public Transportation": "public transit train bus subway clear bright",
  "City Hall": "city hall government building exterior pillars day",
  "Clinic": "medical clinic building exterior day clear",
  "Museum": "museum building exterior columns steps clear day architecture",
  "Restaurant": "restaurant outdoor patio empty tables chairs bright day",
  "Store": "retail store front windows exterior street clear building",
  "Gym": "gym empty fitness equipment treadmills interior bright",
  "Airport": "airport terminal plane large windows clear building",
  "Church": "church building exterior steeple sky cross day",
  "Gas station": "gas station pump nozzle macro close up clear",
  "Laundromat": "laundromat interior empty washing machines",
  "Transportation": "yellow school bus isolated clear road",
  "Medical Care": "stethoscope clip board doctor desk close up",
  "Education": "chalkboard blackboard chalk eraser school clear",
  "Shopping": "shopping cart red empty isolated white background",
  "Housing": "suburban house exterior simple clear day",
  "Call": "smartphone screen incoming call close up isolated",
  "Message": "smartphone chat bubble hand messaging close up macro",
  "Voicemail": "play button voicemail audio recording close up macro",
  "Email": "email envelope icon laptop screen close up",
  "Thanks": "thank you card envelope desk isolated macro",
  "Meal": "roast turkey thanksgiving dinner table isolated simple",
  "Indigenous": "native american traditional dress portrait clear",
  "Pilgrim": "pilgrim hat thanksgiving decor isolated white background",
  "Shirt": "folded shirt clothing isolated white background studio",
  "Suit": "business suit jacket isolated flat white background",
  "Sweater": "knitted sweater folded isolated white background simple",
  "Dress": "summer dress hanging hanger isolated white background",
  "Shoes": "pair of sneakers shoes isolated white background side view",
  "Coat": "winter coat hanging isolated full white background",
  "Skirt": "pleated skirt clothing isolated white background",
  "Pants": "blue jeans pants folded isolated white background",
  "Socks": "pair of socks isolated white studio background",
  "Hat": "baseball cap hat isolated white studio background",
  "Gloves": "winter gloves pair isolated white studio background",
  "Scarf": "winter scarf folded isolated white studio background",
  "Belt": "leather belt buckle isolated white studio background",
  "Tie": "necktie rolled isolated flat lay white background",
  "Jacket": "leather jacket casual isolated white background",
  "Electronics": "assorted electronics isolated tablet phone laptop",
  "Computer": "laptop computer open screen isolated white background",
  "Car": "sedan car side view isolated clear white background",
  "Cellphone": "smartphone black screen isolated white background",
  "Receipt": "shopping receipt paper print macro close up isolated",
  "Tax": "tax form document pen macro close up isolated",
  "Price": "price tag label blank isolated white background string",
  "Cash": "dollar bills money fanned out isolated white background",
  "Credit Card": "blank credit card isolated macro close up studio",
  "ATM": "atm machine keypad slot close up clear",
  "Withdraw": "hand taking cash from atm machine slot macro",
  "Deposit": "check envelope deposit bank slip close up",
  "Account": "bank statement graph paper pen macro close up",
  "Balance": "calculator money desk balance sheet macro",
  "Budget": "budget planner book calculator macro isolated",
  "Savings": "piggy bank coin slot isolated white background",
  "Coin": "shiny gold coin isolated white background macro",
  "Bill": "hundred dollar bill isolated white background flat lay",
  "Wallet": "leather wallet money folded isolated white background",
  "Large": "large elephant isolated white background",
  "Big": "big yellow school bus isolated white background",
  "Medium": "medium size coffee cup disposable isolated",
  "Small": "small cute kitten isolated white background",
  "New": "new shiny shoes with price tag isolated",
  "Used": "old dirty worn out shoes isolated white background",
  "Christmas Tree": "decorated christmas tree isolated bright background",
  "Ornaments": "red christmas ornament bauble isolated white background",
  "Lights": "christmas fairy lights string isolated macro",
  "Santa": "santa claus hat isolated white background studio",
  "Gift": "wrapped gift box bow isolated white studio background",
  "Landlord": "house keys handing over isolated white background",
  "Manager": "property manager clipboard handing keys isolated",
  "Tenant": "signing apartment lease key chain isolated",
  "Apartment": "modern apartment building exterior clear bright day",
  "Rent": "rent check written payment envelope close up macro",
  "Lease": "lease rental agreement contract paper pen macro",
  "Mortgage": "house model piggy bank coin real estate macro",
  "Utilities": "utility bill paper envelope electricity macro",
  "Maintenance": "wrench hammer tools isolated white background macro",
  "Heat": "thermostat wall dial heating close up set macro",
  "Water": "kitchen faucet water running clear simple macro",
  "Electricity": "white light switch wall standard close up macro",
  "Garbage": "garbage bin outdoor green plastic isolated bright",
  "Move in": "cardboard moving box isolated white background studio",
  "Eviction": "padlock chain door close up macro eviction",
  "Room": "empty white room wooden floor bright clear interior",
  "Bathroom": "bathroom white sink mirror clean bright modern",
  "Kitchen": "modern kitchen white cabinets empty clear bright",
  "Bedroom": "made bed white pillows simple modern bedroom",
  "Living room": "living room empty sofa white wall interior bright",
  "Basement": "basement stairs incomplete unfinished room clear",
  "Attic": "attic roof wooden beams empty bright",
  "Roof": "house roof asphalt shingles clear close up macro",
  "Door": "front door closed isolated simple flat",
  "Stairs": "wooden staircase white wall simple interior",
  "Garage": "garage door closed exterior white simple",
  "Yard": "green grass backyard empty neat clear",
  "Hallway": "empty hallway doors white walls interior clear",
  "Dining room": "empty dining table wooden chairs simple bright",
  "Floor": "hardwood floor texture simple clean empty",
  "Window": "window glass frame daylight bright empty",
  "Fence": "wooden picket fence white isolated clear day",
  "Plant": "potted indoor house plant isolated white background",
  "Lamp": "table lamp white shade isolated bright background",
  "Bed": "double bed made white sheets pillows isolated",
  "Closet": "empty open closet white shelves hanging rod",
  "Refrigerator": "modern white refrigerator fridge isolated",
  "Sofa": "grey sofa couch isolated white background studio",
  "TV": "flat screen television black blank screen isolated",
  "Washer": "washing machine closed door front load isolated white",
  "Dryer": "clothes dryer machine isolated bright white background",
  "Dishwasher": "dishwasher open door empty racks white background",
  "Microwave": "microwave oven door closed isolated white background",
  "Stove": "kitchen gas stove isolated white background",
  "Oven": "kitchen oven closed isolated white background simple",
  "Sink": "stainless steel kitchen sink faucet white background isolated",
  "Toilet": "white bathroom toilet bowl isolated closed lid",
  "Bathtub": "white empty bathtub isolated studio background",
  "Mirror": "bathroom mirror silver frame isolated reflection",
  "Towel": "folded soft towel stack isolated white background",
  "Table": "empty wooden dining table isolated white background",
  "Pillow": "white fluffy pillow isolated studio background",
  "Blanket": "folded soft blanket fleece isolated white background",
  "Trash can": "metal trash can step pedal isolated white background",
  "Vacuum": "upright vacuum cleaner isolated white studio background",
  "Homemaker": "kitchen apron folded isolated white background simple",
  "Mechanic": "car engine wrench mechanic hands close up macro",
  "Nurse": "stethoscope on blue nurse scrubs uniform macro",
  "Dentist": "dentist teeth mirror tool dentist clinic macro close up",
  "Painter": "paint brush wet paint can yellow macro isolated",
  "Plumber": "pipe wrench pipe fitting isolated white background studio",
  "Electrician": "wire cutter electrical tape isolated white background",
  "Cashier": "cash register isolated white background terminal",
  "Chef": "white chef hat isolated white studio background",
  "Driver": "steering wheel dashboard car interior macro isolated view",
  "Firefighter": "red fire extinguisher isolated white background",
  "Police Officer": "police badge metal isolated white background macro",
  "Construction Worker": "yellow hard hat safety helmet isolated white studio",
  "Farmer": "pitchfork hay bale farm simple background isolated",
  "Janitor": "mop yellow bucket cleaning isolated studio background",
  "Receptionist": "office desk bell ring isolated macro close up",
  "Pharmacist": "pharmacy medicine pill bottles counter macro isolated",
  "Doctor": "stethoscope heart isolated white background macro medical",
  "Waiter": "waiter serving tray isolated white background empty",
  "Baker": "rolling pin flour kitchen tools isolated flat lay macro",
  "Pay": "paycheck paper document isolated white background macro",
  "Salary": "stack of dollar bills isolated white background simple",
  "Benefits": "health insurance card isolated white background macro",
  "Full-time": "wall clock showing 9 to 5 full time office isolated",
  "Part-time": "clock showing 4 hours part time simple isolated",
  "Boss": "leather executive office chair isolated white background",
  "Interview": "resume folder interview table clean isolated",
  "Shift": "employee schedule board calendar macro close up",
  "Overtime": "coffee cup desk clock working late macro",
  "Promotion": "staircase arrow going up promotion simple minimal",
  "Coworker": "two coffee cups meeting table office simple",
  "Uniform": "folded working uniform shirt isolated white background",
  "Safety": "safety goggles goggles glasses isolated white background",
  "Training": "training manual book pen desk macro close up",
  "Skill": "swiss army knife multi tool isolated white background",
  "Strength": "heavy iron kettlebell dumbbell isolated white background",
  "Teamwork": "jigsaw puzzle pieces fitting together isolated macro",
  "Problem-Solving": "completed rubiks cube isolated white studio background",
  "Communication": "two speech bubbles blank isolated flat lay",
  "Leadership": "one red chess pawn surrounded by white pawns isolated",
  "Creative": "colorful paint palette brushes isolated white background",
  "Flexible": "yoga mat rolled studio background flexible",
  "Organized": "neatly arranged office supplies isolated white background organized",
  "Dependable": "strong metal lock padlock isolated white background dependable",
  "Honest": "scales of justice wooden gavel isolated honest",
  "Hard-Working": "sweaty brow hammer nails hard work isolated",
  "Respectful": "two hands shaking handshake isolated white background respectful",
  "Hands": "open human hand palm isolated white background",
  "Stomach": "stomach anatomy model medical isolated white background",
  "Fingers": "five human fingers hand isolated white background macro",
  "Legs": "human legs walking isolated white background walking legs",
  "Foot": "human foot bare side view isolated white background",
  "Toes": "human toes bare foot isolated white background macro",
  "Ears": "human ear profile macro close up isolated",
  "Mouth": "human mouth smiling lips close up isolated macro",
  "Nose": "human nose profile close up medical isolated",
  "Tooth": "single white tooth anatomical model isolated dentistry",
  "Teeth": "white straight teeth smiling close up dental macro",
  "Throat": "neck throat human anatomy diagram medical isolated",
  "Dry cough": "person covering mouth coughing close up studio isolated",
  "Fever": "glass digital thermometer high fever isolated macro white",
  "Headache": "person holding forehead headache migraine pain studio",
  "Runny nose": "tissue box single tissue isolated white background macro",
  "Sore Throat": "throat lozenges packet isolated soft studio lighting",
  "Sneezing": "person sneezing into tissue paper close up studio",
  "Prescription": "orange prescription pill bottle label empty isolated",
  "Reliever": "ibuprofen pain reliever pills scattered isolated white",
  "Syrup": "cough syrup bottle medicine measuring spoon isolated macro",
  "Lozenges": "cough drop lozenge unwrapped isolated white background",
  "Pills": "round white medication pills isolated white background macro",
  "Tablets": "blister pack of medical tablets isolated white background",
  "Vaccine": "medical syringe needle clear liquid isolated macro white",
  "Allergy": "ragweed pollen allergy flower close up isolated macro",
  "Flu": "sick person bed resting tissue close up bright",
  "Infection": "bacteria microbe 3d render medical isolated",
  "Sprain": "ankle wrapped medical elastic bandage sprain isolated close-up",
  "Medical center": "medical clinic building exterior day red cross",
  "Elevators": "elevator stainless steel doors closed building interior",
  "Lobby": "hospital waiting room chairs lobby bright empty clear",
  "Checkup": "stethoscope on medical chart clipboard macro doctor",
  "Insurance": "health insurance blue card mock up isolated",
  "Surgery": "surgical scalpel blade metal isolated medical macro",
  "Muscles": "biceps flexing arm muscle isolated macro strong",
  "Weight": "cast iron barbell weight plate isolated studio white",
  "Heart": "red anatomical heart model medical isolated white background",
  "Vegetables": "assorted fresh vegetables pile isolated flat white background",
  "Fruits": "mixed fresh fruit bowl isolated white background studio",
  "Whole grains": "dry oats grains wooden spoon macro close up isolated",
  "Protein": "raw chicken breast protein isolated white background",
  "Dairy": "pour milk glass splash isolated white background dairy",
  "Junk food": "fast food french fries burger isolated white background",
  "Cereal": "corn flakes breakfast cereal bowl milk isolated white",
  "Bread": "sliced loaf of white bread isolated white studio",
  "Nuts": "mixed nuts walnuts almonds cashew bowl isolated white",
  "Walnuts": "walnut shell halves close up macro isolated white",
  "Peanuts": "peanuts in shell pile isolated close up macro",
  "Almonds": "pile of almonds nut raw close up isolated white background",
  "Eggs": "brown chicken eggs carton macro close up isolated white",
  "Milk": "milk white liquid glass clear isolated white background",
  "Cheese": "block of cheddar cheese yellow isolated white background",
  "Yogurt": "plain white yogurt bowl spoon cup isolated macro",
  "Chicken": "raw whole chicken meat isolated white background fresh",
  "Beef": "raw red beef steak meat isolated white background flat lay",
  "Pork": "raw pork chop meat isolated white studio clear",
  "Fish": "raw salmon fillet fish meat isolated white background",
  "Tuna": "canned tuna tin open fish metal isolated macro",
  "Rice": "uncooked white rice grains wooden spoon macro isolated",
  "Beans": "dry black beans pile macro close up isolated white background",
  "Soup": "bowl of hot vegetable soup isolated white background studio",
  "Tomatoes": "fresh raw red tomato macro isolated white background",
  "Carrots": "fresh raw orange carrot whole isolated white background",
  "Avocados": "avocado sliced half green pit isolated white background macro",
  "Broccoli": "broccoli floret green fresh isolated white background macro",
  "Cucumber": "fresh smooth green cucumber whole isolated white background",
  "Corn": "yellow corn cob husk fresh isolated macro white background",
  "Celery": "green celery stalk fresh raw vegetable isolated white",
  "Lettuce": "iceberg lettuce head green leafy isolated white background",
  "Spinach": "raw green spinach leaves fresh isolated white background macro",
  "Salad": "mixed leafy green salad bowl isolated white background",
  "Garlic": "whole raw garlic bulb cloves white isolated studio macro",
  "Ketchup": "red tomato ketchup squeeze bottle blank label isolated",
  "Mustard": "yellow mustard squeeze bottle blank isolated white",
  "Jam": "red strawberry jam glass jar isolated white studio",
  "Jelly": "grape jelly preserve jar isolated macro studio",
  "Peanut butter": "peanut butter glass jar blank label isolated studio",
  "Apples": "raw whole red apple fresh isolated white studio background",
  "Oranges": "fresh whole orange citrus fruit isolated white studio macro",
  "Bananas": "yellow banana single fruit fresh isolated white background",
  "Pears": "green pear fruit whole fresh isolated studio",
  "Watermelon": "watermelon slice red fresh seeded isolated white background",
  "Melon": "cantaloupe melon sliced yellow fresh isolated white",
  "Strawberry": "single red shiny strawberry fruit isolated macro white",
  "Pineapple": "whole spiky pineapple tropical fruit fresh studio isolated",
  "Blueberry": "fresh blue blueberries pile macro isolated white background",
  "French Fries": "french fries paper boat cardboard box isolated white",
  "Hamburger": "cheeseburger isolated plain studio white background burger",
  "Pasta": "spaghetti pasta bowl tomato sauce isolated simple macro",
  "Sandwich": "ham cheese sandwich triangle isolated white background studio",
  "Crackers": "saltine crackers salty snack pile isolated white background macro",
  "Cookies": "chocolate chip cookie single isolated white background studio macro",
  "Ice Cream": "vanilla ice cream scoop cone isolated white studio clean",
  "Cake": "slice of chocolate cake plate isolated white background",
  "Candy": "wrapped hard candy sweets colorful isolated white background",
  "Potato Chips": "ripple potato chips crispy snack pile isolated white",
  "Bottled water": "clear plastic water bottle blank label isolated macro",
  "Juice": "orange juice orange liquid glass isolated simple studio",
  "Soda": "aluminum red soda can drink blank isolated white background",
  "Jar": "empty glass jar metal lid isolated white studio",
  "Bag": "brown paper grocery shopping bag isolated white background",
  "Box": "closed cardboard shipping box brown isolated white background",
  "Nutrition": "nutrition facts panel label wrapper block close up macro",
  "Carbohydrates": "carbohydrates bread pasta grains plate isolated simple",
  "Calories": "calculator apple diet scale isolated calories macro",
  "Menu": "restaurant open menu printed board cafe isolated close up",
  "Food label": "nutrition label sticker package macro isolated close up",
  "Habits": "daily habit tracker habit paper checkmark list isolated desk",
};

// Category label → extra keywords for Unsplash when SEARCH_QUERIES[term] is absent.
const CATEGORY_SEARCH_CONTEXT: Record<string, string> = {
  "Personal Information": "",
  /** Terms use SEARCH_QUERIES; keep empty so we don’t stack similar keywords on every query. */
  "Time of Day": "",
  "People": "",
  "Pronouns": "english learning people conversation",
  "Contractions": "english learning writing",
  "Possessive Adjectives": "english grammar learning",
  "Numbers": "numbers counting digits",
  "Classroom": "classroom school education",
  "Other": "education learning",
  "Days and Months": "calendar season schedule",
  "Routines": "daily routine morning schedule",
  "Family": "family home relatives",
  "Descriptions (Physical)": "portrait hair face appearance",
  "Adjectives": "appearance description people",
  "Civic Vocabulary": "voting election democracy ballot",
  "Community Places": "city building community urban",
  "Community Services / Needs": "community services city public",
  "Messages": "smartphone phone messaging communication",
  "Adverbs of Location": "direction street map navigation",
  "Prepositions (Location)": "map room spatial english learning",
  "Adverbs of Frequency": "time clock habit always",
  "Thanksgiving": "thanksgiving autumn holiday feast",
  "Clothing": "clothing fashion apparel outfit",
  "Products": "technology electronics shopping",
  "Shopping & Finance": "shopping store payment money retail",
  "Quantifiers": "shopping size comparison retail",
  "Christmas": "christmas winter holiday decorations",
  "Housing & Rental": "apartment house keys rental",
  "Parts of House": "house interior room home architecture",
  "Domestic Things": "home interior furniture living room kitchen",
  "Prepositions of Location": "room table spatial english learning",
  "Occupations": "job worker profession workplace",
  "Workforce Terminology": "office work paycheck employment",
  "Strengths": "teamwork professional skills workplace",
  "Strength Adjectives": "professional teamwork office qualities",
  "Body Parts": "human body anatomy health",
  "Symptoms": "health sick illness doctor",
  "Medicine": "medicine pharmacy pills prescription",
  "Illness": "flu cold sick health",
  "Emergency & Facilities": "hospital emergency medical building",
  "Other Medical": "doctor clinic medical appointment",
  "Exercise": "exercise fitness gym workout",
  "Food Groups": "healthy food plate nutrition vegetables",
  "Grains & Breakfast": "breakfast cereal morning food",
  "Dairy & Eggs": "dairy milk cheese eggs food",
  "Meats & Proteins": "meat cooking food protein kitchen",
  "Staples": "rice beans pantry cooking food",
  "Vegetables": "vegetables fresh produce market",
  "Condiments & Seasoning": "spices kitchen cooking condiments",
  "Fruits": "fruit fresh colorful produce",
  "Prepared Foods": "meal sandwich pasta food plate",
  "Sweets & Snacks": "dessert sweets snack candy",
  "Drinks": "beverage drink bottle juice",
  "Containers": "jar can packaging kitchen food",
  "Other Wellness": "nutrition health food grocery",
};

export function buildSearchQuery(term: string, category: string): string | null {
  if (SKIP_TERMS.has(term)) return null;
  if (SEARCH_QUERIES[term]) return SEARCH_QUERIES[term];
  const context = CATEGORY_SEARCH_CONTEXT[category] ?? "";
  return context ? `${term} ${context}`.trim() : term;
}

// ---------------------------------------------------------------------------
// static.photos (default provider)
// ---------------------------------------------------------------------------
const TERM_SLUG_OVERRIDES: Record<string, string> = {
  Name: "people",
  City: "cityscape",
  Country: "travel",
  Address: "estate",
  Street: "cityscape",
  "Phone number": "technology",
  State: "travel",
  "Zip code": "finance",
  Job: "workspace",
  Age: "people",
  Birthday: "holiday",
  "Years old": "people",
  Married: "people",
  Divorced: "people",
  Single: "people",
  Toast: "food",
  Cold: "medical",
  Check: "finance",
  Turkey: "food",
  Raise: "finance",
  Break: "workspace",
  Title: "office",
  Light: "indoor",
  Counter: "indoor",
  Deck: "outdoor",
  Server: "restaurant",
  Host: "restaurant",
  Principal: "education",
  Partner: "people",
  Group: "people",
  Physical: "medical",
  Right: "outdoor",
  Left: "outdoor",
  Front: "estate",
  Back: "estate",
  Over: "nature",
  Under: "indoor",
  Around: "outdoor",
  Straight: "people",
  Agent: "estate",
  Package: "retail",
  Can: "food",
  Paper: "education",
  Book: "education",
  Pen: "education",
  Notebook: "education",
  Textbook: "education",
  Workbook: "education",
  Board: "education",
  Marker: "education",
  Eraser: "education",
  Desk: "education",
  Chair: "indoor",
  Teacher: "education",
  Student: "education",
  Classmate: "education",
  Fat: "food",
  Sugar: "food",
  Salt: "food",
  Pepper: "food",
  Oil: "food",
  Head: "medical",
  Arms: "medical",
  Chest: "medical",
  Pain: "medical",
  Cut: "medical",
  Experience: "office",
  Resume: "office",
  Application: "office",
};

const CATEGORY_TO_STATIC_SLUG: Record<string, string> = {
  "Personal Information": "people",
  "Time of Day": "nature",
  People: "people",
  Pronouns: "people",
  Contractions: "education",
  "Possessive Adjectives": "education",
  Numbers: "education",
  Classroom: "education",
  Other: "minimal",
  "Days and Months": "season",
  Routines: "indoor",
  Family: "people",
  "Descriptions (Physical)": "people",
  Adjectives: "minimal",
  "Civic Vocabulary": "legal",
  "Community Places": "cityscape",
  "Community Services / Needs": "cityscape",
  Messages: "technology",
  "Adverbs of Location": "outdoor",
  "Prepositions (Location)": "indoor",
  "Adverbs of Frequency": "minimal",
  Thanksgiving: "holiday",
  Clothing: "retail",
  Products: "technology",
  "Shopping & Finance": "retail",
  Quantifiers: "retail",
  Christmas: "holiday",
  "Housing & Rental": "estate",
  "Parts of House": "indoor",
  "Domestic Things": "indoor",
  "Prepositions of Location": "indoor",
  Occupations: "office",
  "Workforce Terminology": "workspace",
  Strengths: "people",
  "Strength Adjectives": "workspace",
  "Body Parts": "medical",
  Symptoms: "medical",
  Medicine: "medical",
  Illness: "medical",
  "Emergency & Facilities": "medical",
  "Other Medical": "medical",
  Exercise: "wellness",
  "Food Groups": "food",
  "Grains & Breakfast": "food",
  "Dairy & Eggs": "food",
  "Meats & Proteins": "food",
  Staples: "food",
  Vegetables: "food",
  "Condiments & Seasoning": "food",
  Fruits: "food",
  "Prepared Foods": "food",
  "Sweets & Snacks": "food",
  Drinks: "food",
  Containers: "indoor",
  "Other Wellness": "wellness",
};

function hashTermToIndex(term: string, category: string): number {
  let h = 2166136261;
  const s = `${category}::${term}`;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) % 256;
}

function buildStaticUrl(term: string, category: string): string {
  const slug =
    TERM_SLUG_OVERRIDES[term] ?? CATEGORY_TO_STATIC_SLUG[category] ?? "nature";
  const idx = hashTermToIndex(term, category);
  return `https://static.photos/${slug}/${DEFAULT_SIZE}/${idx}.webp`;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Maps unit numbers like "2", "6", "7" to the slug used in LEVEL1_PUBLIC_VOCAB_UNITS.
 * Units 6 and 7 share a single slug "unit-6-7".
 */
function unitNumberToSlug(n: string): string {
  const num = n.trim();
  if (num === "6" || num === "7") return "unit-6-7";
  return `unit-${num}`;
}

export function getAllTermsWithContext(unitSlugs?: Set<string>, themeFilter?: string): Array<{ term: string; category: string }> {
  const seen = new Set<string>();
  const items: Array<{ term: string; category: string }> = [];
  const themeQuery = themeFilter?.toLowerCase();

  for (const unit of LEVEL1_PUBLIC_VOCAB_UNITS) {
    if (unitSlugs && !unitSlugs.has(unit.slug)) continue;
    for (const categoryGroup of unit.categories) {
      if (themeQuery && !categoryGroup.label.toLowerCase().includes(themeQuery)) {
        continue;
      }
      for (const card of categoryGroup.cards) {
        if (!seen.has(card.term)) {
          seen.add(card.term);
          items.push({ term: card.term, category: categoryGroup.label });
        }
      }
    }
  }

  return items;
}

function parseRecordFromTsFile(filePath: string): Record<string, string> {
  if (!fs.existsSync(filePath)) return {};
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const result: Record<string, string> = {};
    for (const match of content.matchAll(/"([^"]+)":\s*"([^"]+)"/g)) {
      result[match[1]] = match[2];
    }
    return result;
  } catch {
    return {};
  }
}

function loadExistingGenerated(): Record<string, string> {
  return parseRecordFromTsFile(OUT_FILE);
}

function loadManualOverrides(): Record<string, string> {
  return parseRecordFromTsFile(OVERRIDES_FILE);
}

function writeVocabImagesGeneratedFile(results: Record<string, string>): void {
  const entries = Object.entries(results)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([term, url]) => `  ${JSON.stringify(term)}: ${JSON.stringify(url)},`)
    .join("\n");

  const output = `// Auto-generated by scripts/content/fetch-vocab-images.ts
// Run: npm run vocab:images. Manual URLs: vocab-images-overrides.ts
export const vocabImagesGenerated: Record<string, string> = {
${entries}
};
`;

  fs.writeFileSync(OUT_FILE, output, "utf-8");
}

interface UnsplashPhoto {
  id: string;
  urls: {
    raw?: string;
    full?: string;
    regular?: string;
    small?: string;
  };
}

/**
 * Picks an image for `query`, avoiding Unsplash photo IDs already used in this run
 * (stops “same #1 result” when searches overlap). May request a second page if needed.
 */
async function fetchUnsplashImage(
  query: string,
  usedPhotoIds: Set<string>
): Promise<{ url: string; id: string } | null> {
  if (!ACCESS_KEY) return null;

  const fetchPage = async (page: number): Promise<UnsplashPhoto[]> => {
    const url = new URL("https://api.unsplash.com/search/photos");
    url.searchParams.set("query", query);
    url.searchParams.set("per_page", "30");
    url.searchParams.set("page", String(page));
    url.searchParams.set("content_filter", "high");
    url.searchParams.set("orientation", "landscape");

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Client-ID ${ACCESS_KEY}`,
        "Accept-Version": "v1",
      },
    });

    if (response.status === 429) {
      throw new Error(`Unsplash rate limit exceeded. Wait or check quota.`) as Error & {
        isRateLimit: boolean;
      };
    }

    if (!response.ok) {
      throw new Error(`Unsplash API error ${response.status}: ${response.statusText}`);
    }

    const data = (await response.json()) as { results?: UnsplashPhoto[] };
    return data.results ?? [];
  };

  let firstPageForFallback: UnsplashPhoto[] = [];

  for (let page = 1; page <= 2; page++) {
    const results = await fetchPage(page);
    if (page === 1) firstPageForFallback = results;
    if (results.length === 0) break;

    for (const photo of results) {
      if (!photo.id) continue;
      const idStr = String(photo.id);
      const imageUrl = photo.urls?.regular || photo.urls?.small || photo.urls?.full || photo.urls?.raw;
      if (!imageUrl) continue;
      if (!usedPhotoIds.has(idStr)) {
        usedPhotoIds.add(idStr);
        return { url: imageUrl, id: idStr };
      }
    }
  }

  const fallback = firstPageForFallback[0];
  if (!fallback?.id) return null;
  const fallbackStr = String(fallback.id);
  const fallbackUrl = fallback.urls?.regular || fallback.urls?.small || fallback.urls?.full || fallback.urls?.raw;
  if (!fallbackUrl) return null;

  console.warn(
    `  [vocab:images] No unused photo for "${query.slice(0, 80)}${query.length > 80 ? "…" : ""}" — reusing Unsplash id ${fallbackStr}`
  );
  usedPhotoIds.add(fallbackStr);
  return { url: fallbackUrl, id: fallbackStr };
}

async function resolveUrl(
  term: string,
  category: string,
  useSearch: boolean,
  usedPhotoIds: Set<string>
): Promise<string | null> {
  if (!useSearch) {
    return buildStaticUrl(term, category);
  }
  const query = buildSearchQuery(term, category);
  if (query === null) {
    return buildStaticUrl(term, category);
  }
  let picked = await fetchUnsplashImage(query, usedPhotoIds);
  if (!picked && query !== term) {
    await sleep(DELAY_MS);
    picked = await fetchUnsplashImage(term, usedPhotoIds);
  }
  return picked?.url ?? buildStaticUrl(term, category);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const forceAll = args.includes("--force");
  const useSearch = args.includes("--search");
  const refetchArg =
    args.find((a) => a.startsWith("--refetch="))?.replace("--refetch=", "") ??
    (args.includes("--refetch") ? args[args.indexOf("--refetch") + 1] ?? "" : "");
  const refetchTerms = refetchArg ? new Set(refetchArg.split(",").map((t) => t.trim())) : new Set<string>();

  // --units 2,3,4  or  --units=2,3,4  — filter to specific unit numbers
  const unitsArg =
    args.find((a) => a.startsWith("--units="))?.replace("--units=", "") ??
    (args.includes("--units") ? args[args.indexOf("--units") + 1] ?? "" : "");
  const unitSlugs = unitsArg
    ? new Set(unitsArg.split(",").map((n) => unitNumberToSlug(n)))
    : undefined;

  const themeFilter =
    args.find((a) => a.startsWith("--theme="))?.replace("--theme=", "") ??
    (args.includes("--theme") ? args[args.indexOf("--theme") + 1] ?? "" : "");

  if (useSearch && !ACCESS_KEY) {
    console.error("Error: --search requires UNSPLASH_ACCESS_KEY in .env");
    process.exit(1);
  }

  const allTerms = getAllTermsWithContext(unitSlugs, themeFilter);
  const existing = loadExistingGenerated();
  const manualOverrides = loadManualOverrides();

  if (unitSlugs) {
    console.log(`--units: scoped to ${[...unitSlugs].join(", ")} (${allTerms.length} terms).\n`);
  }

  let toProcess: Array<{ term: string; category: string }>;

  if (forceAll) {
    toProcess = allTerms;
    console.log(
      `--force: regenerating ${allTerms.length} terms (${useSearch ? "Unsplash" : "static.photos"}).\n`
    );
  } else if (refetchTerms.size > 0) {
    toProcess = allTerms.filter((t) => refetchTerms.has(t.term));
    const notFound = [...refetchTerms].filter((r) => !allTerms.find((t) => t.term === r));
    if (notFound.length > 0) {
      console.warn(`Warning: these terms were not found in vocab data: ${notFound.join(", ")}`);
    }
    console.log(`--refetch: updating ${toProcess.length} term(s).\n`);
  } else {
    toProcess = allTerms.filter((t) => !existing[t.term]);
    console.log(`Found ${allTerms.length} unique vocabulary terms.`);
    console.log(`Already in generated file: ${Object.keys(existing).length}. New: ${toProcess.length}.\n`);
  }

  if (!forceAll && refetchTerms.size === 0) {
    toProcess = toProcess.filter(({ term }) => {
      if (manualOverrides[term] && !refetchTerms.has(term)) {
        return false;
      }
      return true;
    });
  }

  if (toProcess.length === 0 && !forceAll && refetchTerms.size === 0) {
    console.log(
      "Nothing to do. Use --force to regenerate all, or --refetch \"Term1,Term2\" for specific terms."
    );
    return;
  }

  if (toProcess.length === 0 && refetchTerms.size > 0) {
    console.log("Nothing to process after filtering (check term names).");
    return;
  }

  console.log(
    useSearch
      ? `Unsplash delay: ${DELAY_MS}ms between requests (set UNSPLASH_DELAY_MS to tune).\n`
      : `Using static.photos (no API). Size: ${DEFAULT_SIZE} (VOCAB_IMAGE_SIZE).\n`
  );

  let results: Record<string, string>;

  if (forceAll && !unitSlugs) {
    // Full regeneration — start fresh
    results = {};
  } else {
    // Scoped (by units or refetch) — keep everything already generated and overwrite only the targeted terms
    results = { ...existing };
  }

  let found = 0;
  let errors = 0;

  const list = toProcess;
  /** One run = one set of Unsplash IDs so we don’t reuse the same stock photo across terms. */
  const usedUnsplashPhotoIds = new Set<string>();

  for (let i = 0; i < list.length; i++) {
    const { term, category } = list[i];
    const queryNote = useSearch ? ` (query: "${buildSearchQuery(term, category) ?? "SKIP"}")` : "";
    process.stdout.write(`[${i + 1}/${list.length}] "${term}" [${category}]${queryNote} ... `);

    try {
      const imageUrl = await resolveUrl(term, category, useSearch, usedUnsplashPhotoIds);
      if (imageUrl) {
        results[term] = imageUrl;
        found++;
        console.log("✓");
      } else {
        errors++;
        console.log("—");
      }
    } catch (err) {
      const e = err as Error & { isRateLimit?: boolean };
      if (e.isRateLimit) {
        const waitMs = 3_600_000;
        console.log(
          `\n  Hourly quota hit. Pausing ${Math.round(waitMs / 60_000)} min, then retry this term…`
        );
        await sleep(waitMs);
        try {
          const imageUrl = await resolveUrl(term, category, useSearch, usedUnsplashPhotoIds);
          if (imageUrl) {
            results[term] = imageUrl;
            found++;
            console.log("✓ (after cooldown)");
          } else {
            results[term] = buildStaticUrl(term, category);
            found++;
            console.log("✓ (static fallback)");
          }
        } catch (retryErr) {
          errors++;
          console.log(`✗ ${retryErr instanceof Error ? retryErr.message : String(retryErr)}`);
          results[term] = buildStaticUrl(term, category);
        }
      } else {
        errors++;
        console.log(`✗ ${err instanceof Error ? err.message : String(err)}`);
        results[term] = buildStaticUrl(term, category);
      }
    }

    writeVocabImagesGeneratedFile(results);

    if (i < list.length - 1 && useSearch) {
      await sleep(DELAY_MS);
    }
  }

  console.log(`
Done!
  ✓ URLs written: ${Object.keys(results).length}
  ✗ Errors (with fallback where possible): ${errors}
  Output: ${OUT_FILE}
`);
}

if (typeof require !== "undefined" && require.main === module) {
  main().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
}
