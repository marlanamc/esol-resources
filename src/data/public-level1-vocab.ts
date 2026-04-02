import type {
  VocabularyContent,
  VocabularyWordListContent,
  VocabularyWordListGroup,
} from "@/types/activity";

type RawTerm =
  | string
  | {
      term: string;
      englishDefinition: string;
      spanishDefinition: string;
      example?: string;
      fillBlankSentence?: string; // NEW: Custom pedagogical sentence for fill-in-the-blank
    };

type RawUnit = {
  slug: string;
  title: string;
  theme: string;
  categories: Array<{
    label: string;
    terms: RawTerm[];
  }>;
};

export type PublicLevel1VocabularyCard = {
  term: string;
  definition: string;
  englishDefinition: string;
  spanishDefinition: string;
  example: string;
  fillBlankSentence?: string; // NEW: Custom pedagogical sentence for fill-in-the-blank
  category: string;
};

// NEW: Theme-based organization for cleaner navigation
export type VocabTheme = {
  id: string; // e.g., "me-and-my-identity"
  title: string; // e.g., "Me & My Identity"
  description: string; // Short description of what's covered
  icon: string; // emoji for visual recognition
  categories: string[]; // Original categories included in this theme
  cards: PublicLevel1VocabularyCard[];
  estimatedMinutes: number; // Learning time estimate
};

export type PublicLevel1VocabularyUnit = {
  slug: string;
  title: string;
  theme: string;
  categories: Array<{
    label: string;
    spanishLabel: string;
    cards: PublicLevel1VocabularyCard[];
  }>;
  themes?: VocabTheme[]; // NEW: Thematic groupings (optional for backward compatibility)
  content: VocabularyContent;
  totalCards: number;
};

const RAW_LEVEL1_UNITS: RawUnit[] = [
  {
    slug: "unit-1",
    title: "Unit 1: Getting to Know You",
    theme: "Personal Daily Life",
    categories: [
      { label: "Personal Information", terms: [
        { term: "Name", englishDefinition: "the words people use to identify you, including your first name and last name", spanishDefinition: "las palabras que se usan para identificarte, incluyendo tu nombre y apellido", example: "My name is Ana Garcia.", fillBlankSentence: "What is your first _____?" },
        { term: "City", englishDefinition: "a large town where people live and work", spanishDefinition: "una ciudad donde la gente vive y trabaja", example: "I live in the city of Boston.", fillBlankSentence: "I live in the _____ of Boston." },
        { term: "Country", englishDefinition: "a nation, such as the United States or Mexico", spanishDefinition: "un país, como Estados Unidos o México", example: "My country is El Salvador.", fillBlankSentence: "My _____ is El Salvador." },
        { term: "Address", englishDefinition: "the place where you live or receive mail", spanishDefinition: "la dirección del lugar donde vives o recibes correo", example: "Please write your address on the form.", fillBlankSentence: "Please write your _____ on this form." },
        { term: "Street", englishDefinition: "the road where a house or building is located", spanishDefinition: "la calle donde está una casa o edificio", example: "Our apartment is on Main Street.", fillBlankSentence: "My apartment is on Oak _____." },
        { term: "Phone number", englishDefinition: "the set of numbers people use to call you", spanishDefinition: "el número que las personas usan para llamarte", example: "My phone number is on the paper.", fillBlankSentence: "What is your _____ _____?" },
        { term: "State", englishDefinition: "one of the main regions of a country, such as Massachusetts", spanishDefinition: "uno de los estados o regiones principales de un país", example: "Massachusetts is the state where I live.", fillBlankSentence: "I live in the _____ of Massachusetts." },
        { term: "Zip code", englishDefinition: "the postal code used for mail in an area", spanishDefinition: "el código postal que se usa para el correo en un área", example: "The zip code for this address is 02118.", fillBlankSentence: "The _____ _____ for this area is 02118." },
        { term: "Job", englishDefinition: "the work a person does to earn money", spanishDefinition: "el trabajo que una persona hace para ganar dinero", example: "My job is cleaning offices.", fillBlankSentence: "My _____ is teaching mathematics." },
        { term: "Age", englishDefinition: "how many years a person has lived", spanishDefinition: "la edad; cuántos años tiene una persona", example: "Her age is thirty-two.", fillBlankSentence: "His _____ is twenty-eight." },
        { term: "Birthday", englishDefinition: "the day each year when you were born", spanishDefinition: "el día del año en que naciste", example: "My birthday is in July.", fillBlankSentence: "My _____ is December 15." },
        { term: "Years old", englishDefinition: "used to say a person's age in years", spanishDefinition: "se usa para decir la edad de una persona en años", example: "I am twenty-five years old.", fillBlankSentence: "My daughter is five _____ _____." },
        { term: "Single", englishDefinition: "not married", spanishDefinition: "soltero o soltera; no casado", example: "She is single.", fillBlankSentence: "He is _____ and does not have children." },
        { term: "Married", englishDefinition: "having a husband or wife", spanishDefinition: "casado o casada", example: "She is married and has two children.", fillBlankSentence: "She is _____ and has two children." },
        { term: "Divorced", englishDefinition: "no longer married after ending a marriage", spanishDefinition: "divorciado o divorciada; ya no casado", example: "He is divorced.", fillBlankSentence: "After twenty years, they are _____." },
      ] },
      { label: "Time of Day", terms: [
        { term: "Morning", englishDefinition: "the early part of the day before noon", spanishDefinition: "la mañana; la parte temprana del día antes del mediodía", example: "I study English in the morning.", fillBlankSentence: "I drink coffee every _____." },
        { term: "Afternoon", englishDefinition: "the part of the day after noon and before evening", spanishDefinition: "la tarde; la parte del día después del mediodía", example: "We have class in the afternoon.", fillBlankSentence: "We have a meeting in the _____." },
        { term: "Evening", englishDefinition: "the later part of the day before night", spanishDefinition: "la tarde-noche; la parte final del día antes de dormir", example: "I cook dinner in the evening.", fillBlankSentence: "I like to walk in the _____." },
        { term: "Night", englishDefinition: "the dark part of the day when people usually sleep", spanishDefinition: "la noche; la parte oscura del día", example: "The children sleep at night.", fillBlankSentence: "The stars come out at _____." },
      ] },
      { label: "People", terms: [
        { term: "Man", englishDefinition: "an adult male person", spanishDefinition: "un hombre; una persona adulta de sexo masculino", example: "The man is my teacher.", fillBlankSentence: "The _____ in the blue shirt is my neighbor." },
        { term: "Men", englishDefinition: "more than one adult male person", spanishDefinition: "hombres; más de un hombre", example: "The men are waiting outside.", fillBlankSentence: "The _____ in this class are from Mexico." },
        { term: "Woman", englishDefinition: "an adult female person", spanishDefinition: "una mujer; una persona adulta de sexo femenino", example: "The woman is my neighbor.", fillBlankSentence: "The _____ at the desk is my supervisor." },
        { term: "Women", englishDefinition: "more than one adult female person", spanishDefinition: "mujeres; más de una mujer", example: "The women are in the office.", fillBlankSentence: "The _____ are discussing the project." },
      ] },
      { label: "Pronouns", terms: [
        { term: "I", englishDefinition: "the word a speaker uses to talk about himself or herself", spanishDefinition: "yo; la palabra que usa una persona para hablar de sí misma", example: "I am a student.", fillBlankSentence: "_____ am a student from El Salvador." },
        { term: "You", englishDefinition: "the word used to talk to another person or people", spanishDefinition: "tú, usted, ustedes; la palabra que se usa para hablar con otra persona", example: "You are in my class.", fillBlankSentence: "_____ are a good teacher." },
        { term: "He", englishDefinition: "the word used for a male person", spanishDefinition: "él; la palabra que se usa para un hombre o niño", example: "He is my brother.", fillBlankSentence: "_____ works as a mechanic." },
        { term: "She", englishDefinition: "the word used for a female person", spanishDefinition: "ella; la palabra que se usa para una mujer o niña", example: "She is my friend.", fillBlankSentence: "_____ is a nurse at the hospital." },
        { term: "It", englishDefinition: "the word used for a thing, animal, or idea", spanishDefinition: "eso o ello; la palabra que se usa para una cosa, animal o idea", example: "It is my book.", fillBlankSentence: "_____ is a nice day today." },
        { term: "We", englishDefinition: "the word used for the speaker and another person or people", spanishDefinition: "nosotros o nosotras; la palabra para un grupo que te incluye", example: "We are ready.", fillBlankSentence: "_____ are learning English together." },
        { term: "They", englishDefinition: "the word used for other people or things", spanishDefinition: "ellos o ellas; la palabra para otras personas o cosas", example: "They are my classmates.", fillBlankSentence: "_____ live in the city." },
      ] },
      { label: "Contractions", terms: [
        { term: "I'm", englishDefinition: "the short form of I am", spanishDefinition: "la forma corta de I am; significa yo soy o yo estoy", example: "I'm from Brazil.", fillBlankSentence: "_____ a teacher in this school." },
      ] },
      { label: "Possessive Adjectives", terms: [
        { term: "My", englishDefinition: "used to show something belongs to me", spanishDefinition: "mi; se usa para mostrar que algo me pertenece", example: "My book is blue.", fillBlankSentence: "_____ family lives in Massachusetts." },
        { term: "Your", englishDefinition: "used to show something belongs to you", spanishDefinition: "tu o su; se usa para mostrar que algo te pertenece", example: "Your name is on the list.", fillBlankSentence: "What is _____ address?" },
        { term: "His", englishDefinition: "used to show something belongs to a man or boy", spanishDefinition: "su, de él; se usa para mostrar que algo le pertenece a un hombre", example: "His phone is on the table.", fillBlankSentence: "_____ job is as an accountant." },
        { term: "Her", englishDefinition: "used to show something belongs to a woman or girl", spanishDefinition: "su, de ella; se usa para mostrar que algo le pertenece a una mujer", example: "Her bag is black.", fillBlankSentence: "_____ birthday is in March." },
        { term: "Our", englishDefinition: "used to show something belongs to us", spanishDefinition: "nuestro o nuestra; se usa para mostrar que algo nos pertenece", example: "Our class starts at nine.", fillBlankSentence: "_____ classroom is on the second floor." },
        { term: "Their", englishDefinition: "used to show something belongs to them", spanishDefinition: "su, de ellos o de ellas; se usa para mostrar que algo les pertenece", example: "Their house is small.", fillBlankSentence: "_____ children go to school downtown." },
      ] },
      { label: "Numbers", terms: [
        { term: "One", englishDefinition: "the number 1", spanishDefinition: "uno; el número 1", example: "I have one pencil.", fillBlankSentence: "There is _____ person in the office." },
        { term: "Two", englishDefinition: "the number 2", spanishDefinition: "dos; el número 2", example: "She has two children.", fillBlankSentence: "I have _____ brothers and one sister." },
        { term: "Three", englishDefinition: "the number 3", spanishDefinition: "tres; el número 3", example: "We need three chairs.", fillBlankSentence: "The class has _____ sections." },
        { term: "Four", englishDefinition: "the number 4", spanishDefinition: "cuatro; el número 4", example: "There are four books on the desk.", fillBlankSentence: "She works _____ days a week." },
        { term: "Five", englishDefinition: "the number 5", spanishDefinition: "cinco; el número 5", example: "Class starts in five minutes.", fillBlankSentence: "My job pays _____ dollars per hour." },
        { term: "Six", englishDefinition: "the number 6", spanishDefinition: "seis; el número 6", example: "I work six days a week.", fillBlankSentence: "I work _____ days a week." },
        { term: "Seven", englishDefinition: "the number 7", spanishDefinition: "siete; el número 7", example: "My son is seven years old.", fillBlankSentence: "My daughter is _____ years old." },
        { term: "Eight", englishDefinition: "the number 8", spanishDefinition: "ocho; el número 8", example: "There are eight students here.", fillBlankSentence: "There are _____ chairs in this room." },
        { term: "Nine", englishDefinition: "the number 9", spanishDefinition: "nueve; el número 9", example: "The bus comes at nine.", fillBlankSentence: "I wake up at _____ o'clock." },
        { term: "Ten", englishDefinition: "the number 10", spanishDefinition: "diez; el número 10", example: "I have ten dollars.", fillBlankSentence: "This book costs _____ dollars." },
      ] },
      { label: "Classroom", terms: [
        { term: "Paper", englishDefinition: "thin material used for writing or printing", spanishDefinition: "papel; material delgado que se usa para escribir o imprimir", example: "Write your answer on the paper.", fillBlankSentence: "Please give me a piece of _____." },
        { term: "Book", englishDefinition: "something with pages that you read", spanishDefinition: "un libro; algo con páginas que lees", example: "Open your book to page three.", fillBlankSentence: "The _____ is on the shelf." },
        { term: "Pen", englishDefinition: "a tool used for writing with ink", spanishDefinition: "bolígrafo o pluma; un objeto para escribir con tinta", example: "Please use a pen.", fillBlankSentence: "I write with a _____." },
        { term: "Notebook", englishDefinition: "a book of blank or lined pages for writing notes", spanishDefinition: "cuaderno; libro con páginas para escribir apuntes", example: "My notebook is in my bag.", fillBlankSentence: "Write your answers in your _____." },
        { term: "Textbook", englishDefinition: "a school book used in class", spanishDefinition: "un libro de texto; un libro escolar que se usa en clase", example: "The textbook is on the desk.", fillBlankSentence: "The _____ has fifteen chapters." },
        { term: "Workbook", englishDefinition: "a practice book with exercises and questions", spanishDefinition: "cuaderno de ejercicios; libro con práctica y preguntas", example: "Finish page five in the workbook.", fillBlankSentence: "Complete the exercises in the _____." },
        { term: "Board", englishDefinition: "the large surface in a classroom where a teacher writes", spanishDefinition: "pizarra o tablero; la superficie grande donde escribe el maestro", example: "The answer is on the board.", fillBlankSentence: "Please look at the _____." },
      ] },
      { label: "Other", terms: [
        { term: "Food", englishDefinition: "things people eat", spanishDefinition: "comida; cosas que la gente come", example: "My favorite food is rice.", fillBlankSentence: "What is your favorite _____?" },
        { term: "Favorite", englishDefinition: "liked more than other things", spanishDefinition: "favorito o favorita; lo que más te gusta", example: "Blue is my favorite color.", fillBlankSentence: "What is your _____ sport?" },
        { term: "Old", englishDefinition: "having lived many years or not new", spanishDefinition: "viejo o mayor; con muchos años o no nuevo", example: "My grandfather is old.", fillBlankSentence: "This car is very _____." },
      ] },
    ],
  },
  {
    slug: "unit-2",
    title: "Unit 2: Daily Life in the Community",
    theme: "Daily routines, family, and classroom language",
    categories: [
      { label: "Days and Months", terms: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "Week", "Month", "Today", "Tomorrow", "Yesterday", "Next"] },
      { label: "Routines", terms: ["Time", "Schedule", "Calendar", "Appointment", "Half", "Hour", "Minute", "Breakfast", "Lunch", "Dinner", "Shower", "O'clock"] },
      { label: "Family", terms: ["Father", "Mother", "Sister", "Brother", "Son", "Daughter", "Cousin", "Uncle", "Aunt", "Niece", "Nephew", "Grandmother", "Grandfather", "Husband", "Wife", "Parent", "Child", "Children", "Mother-in-law", "Father-in-law", "Sister-in-law", "Brother-in-law", "Members", "Relationship"] },
      { label: "Classroom", terms: ["Paper", "Book", "Pen", "Notebook", "Textbook", "Workbook", "Pencil sharpener", "Board", "Marker", "Eraser", "Desk", "Chair", "Teacher", "Student", "Classmate", "Partner", "Group"] },
      { label: "Descriptions (Physical)", terms: ["Hair", "Eyes"] },
      { label: "Adjectives", terms: ["Short", "Long", "Straight", "Wavy", "Curly", "Bald", "Brown", "Red", "Black", "Blond", "Gray", "Tall", "Young", "Old", "Thin", "Heavy"] },
    ],
  },
  {
    slug: "unit-3",
    title: "Unit 3: Community Participation",
    theme: "Places, services, messages, and directions",
    categories: [
      { label: "Civic Vocabulary", terms: ["Candidate", "Ballot", "Voter", "Election", "Campaign", "Political Party"] },
      { label: "Community Places", terms: ["Doctor's office", "Dentist's office", "Hospital", "Hotel", "House", "Park", "Playground", "Supermarket", "Bank", "Library", "Post Office", "Fire Department", "Police Station", "RMV", "Bus Stop", "Station", "Public Transportation", "City Hall", "Clinic", "School", "Museum", "Restaurant", "Store", "Pharmacy", "Gym", "Airport", "Laundromat"] },
      { label: "Community Services / Needs", terms: ["Transportation", "Medical Care", "Education", "Shopping", "Housing"] },
      { label: "Messages", terms: ["Call", "Message", "Voicemail", "Email"] },
      { label: "Adverbs of Location", terms: ["Left", "Right", "Straight", "Around"] },
      { label: "Prepositions (Location)", terms: ["In", "At", "On", "In front of", "Behind", "Between", "Next to", "Across from"] },
      { label: "Adverbs of Frequency", terms: ["Never", "Rarely", "Sometimes", "Usually", "Always"] },
      { label: "Thanksgiving", terms: ["Thanks", "Meal", "Turkey", "Indigenous", "Pilgrim"] },
    ],
  },
  {
    slug: "unit-4",
    title: "Unit 4: Consumer Smarts",
    theme: "Clothing, products, and shopping",
    categories: [
      { label: "Clothing", terms: ["T-shirt", "Shirt", "Suit", "Sweater", "Cap", "Dress", "Socks", "Hat", "Shoes", "Sneakers", "Blouse", "Coat", "Skirt", "Belt", "Pants", "Shorts"] },
      { label: "Products", terms: ["Electronics", "Computer", "Car", "Cellphone"] },
      { label: "Shopping & Finance", terms: ["Receipt", "Tax", "Price", "Cash", "Credit Card", "Debit Card", "Check", "Money Order", "Signature", "ATM", "Withdraw", "Deposit", "Online", "Return", "Exchange", "Refund"] },
      { label: "Quantifiers", terms: ["Large", "Big", "Medium", "Small", "New", "Used", "Old"] },
      { label: "Christmas", terms: ["Christmas Tree", "Ornaments", "Lights", "Santa", "Gift"] },
    ],
  },
  {
    slug: "unit-5",
    title: "Unit 5: Housing",
    theme: "Home, rental, and household vocabulary",
    categories: [
      { label: "Housing & Rental", terms: ["Landlord", "Manager", "Agent", "Real Estate", "Tenant", "Leak", "Broken Window", "Clogged Toilet", "Complaint", "House", "Home", "Apartment", "Condominium", "Unit", "Rent", "Lease", "Fee", "Security deposit", "Laundry", "Mortgage", "Down payment", "Utilities", "Gas", "Water", "Electric", "Heat"] },
      { label: "Parts of House", terms: ["Room", "Bathroom", "Kitchen", "Bedroom", "Living room", "Hall", "Floor", "Basement", "Attic", "Roof", "Chimney", "Door", "Front", "Back", "Lock", "Stairs", "Porch", "Deck", "Garage", "Driveway", "Yard", "Garden"] },
      { label: "Domestic Things", terms: ["Window", "End table", "Coffee table", "Plant", "Lamp", "Light", "Painting", "Rug", "Carpet", "Bathtub", "Sink", "Toilet", "Curtain", "Bed", "Closet", "Bedtable", "Car", "Chair", "Refrigerator", "Microwave", "Oven", "Counter", "Cabinet", "Sofa", "Armchair", "TV", "Fireplace", "Washer", "Dryer"] },
      { label: "Prepositions of Location", terms: ["In", "On", "Next to", "Between", "Under", "Over"] },
    ],
  },
  {
    slug: "unit-6-7",
    title: "Units 6 & 7: Workforce Preparation and Career Awareness",
    theme: "Jobs, work language, and strengths",
    categories: [
      { label: "Occupations", terms: ["Homemaker", "Mechanic", "Office assistant", "Administrative assistant", "Secretary", "Receptionist", "Manager", "Server", "Busser", "Cook", "Prep Cook", "Chef", "Dishwasher", "Host", "Custodian", "Cashier", "Principal", "Doctor", "Nurse", "Dentist", "Teacher", "Painter", "Plumber", "Electrician", "Construction worker", "Housekeeper", "Driver", "Landscaper", "Salesperson", "Business owner"] },
      { label: "Workforce Terminology", terms: ["Pay", "Salary", "Benefits", "Full-time", "Part-time", "Title", "Experience", "Break", "Hired", "Fired", "Laid off", "Job", "Employee", "Paycheck", "Uniform", "Boss", "Interview", "Employer", "Taxes", "Application", "Schedule", "Vacation", "Sick leave", "Insurance", "Resume", "Raise"] },
      { label: "Strengths", terms: ["Skill", "Strength", "Teamwork", "Problem-Solving", "Communication", "Leadership"] },
      { label: "Strength Adjectives", terms: ["Creative", "Flexible", "Organized", "Dependable", "Honest", "Hard-Working", "Respectful"] },
    ],
  },
  {
    slug: "unit-8",
    title: "Unit 8: Health",
    theme: "Body parts, symptoms, and medical care",
    categories: [
      { label: "Body Parts", terms: ["Head", "Arms", "Chest", "Hands", "Stomach", "Back", "Fingers", "Legs", "Foot", "Feet", "Toes", "Neck", "Eyes", "Ears", "Mouth", "Nose", "Tooth", "Teeth", "Throat"] },
      { label: "Symptoms", terms: ["Pain", "Cut", "Dry cough", "Fever", "Headache", "Runny nose", "Sore Throat", "Sneezing", "Backache", "Toothache", "Chills", "Sweats", "Fatigue", "Dizziness", "Itch", "Rash", "Swelling", "Nausea", "Stress"] },
      { label: "Medicine", terms: ["Prescription", "Reliever", "Syrup", "Lozenges", "Pills", "Tablets", "Vaccine"] },
      { label: "Illness", terms: ["Allergy", "Cold", "Flu", "Infection", "Sprain"] },
      { label: "Emergency & Facilities", terms: ["Hospital", "Medical center", "Elevators", "Lobby"] },
      { label: "Other Medical", terms: ["Appointment", "Checkup", "Insurance", "Physical", "Surgery"] },
      { label: "Exercise", terms: ["Muscles", "Weight", "Heart"] },
    ],
  },
  {
    slug: "unit-9",
    title: "Unit 9: Holistic Wellness",
    theme: "Food, nutrition, and healthy habits",
    categories: [
      { label: "Food Groups", terms: ["Vegetables", "Fruits", "Whole grains", "Protein", "Dairy", "Junk food"] },
      { label: "Grains & Breakfast", terms: ["Cereal", "Bread", "Toast", "Nuts", "Walnuts", "Peanuts", "Almonds"] },
      { label: "Dairy & Eggs", terms: ["Eggs", "Milk", "Cheese", "Yogurt"] },
      { label: "Meats & Proteins", terms: ["Chicken", "Beef", "Pork", "Turkey", "Fish", "Tuna"] },
      { label: "Staples", terms: ["Rice", "Beans", "Soup"] },
      { label: "Vegetables", terms: ["Tomatoes", "Carrots", "Avocados", "Broccoli", "Cucumber", "Corn", "Celery", "Lettuce", "Spinach", "Salad"] },
      { label: "Condiments & Seasoning", terms: ["Oil", "Salt", "Pepper", "Garlic", "Ketchup", "Mustard", "Jam", "Jelly", "Peanut butter"] },
      { label: "Fruits", terms: ["Apples", "Oranges", "Bananas", "Pears", "Watermelon", "Melon", "Strawberry", "Pineapple", "Blueberry"] },
      { label: "Prepared Foods", terms: ["French Fries", "Hamburger", "Pasta", "Sandwich", "Crackers"] },
      { label: "Sweets & Snacks", terms: ["Cookies", "Ice Cream", "Cake", "Candy", "Potato Chips"] },
      { label: "Drinks", terms: ["Bottled water", "Juice", "Soda"] },
      { label: "Containers", terms: ["Can", "Jar", "Bag", "Box", "Package"] },
      { label: "Other Wellness", terms: ["Food", "Nutrition", "Sugar", "Fat", "Carbohydrates", "Calories", "Menu", "Food label", "Restaurant", "Supermarket", "Habits"] },
    ],
  },
];

function slugify(value: string): string {
  return value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function normalizeTerm(term: string): string {
  return term.trim().toLowerCase().replace(/\s+/g, " ");
}

function categoryHint(category: string): string {
  const label = category.toLowerCase();
  if (label.includes("classroom")) return "a classroom vocabulary word";
  if (label.includes("family")) return "a family vocabulary word";
  if (label.includes("pronoun")) return "a pronoun";
  if (label.includes("contraction")) return "a contraction";
  if (label.includes("possessive")) return "a possessive adjective";
  if (label.includes("number")) return "a number word";
  if (label.includes("people")) return "a word for a person";
  if (label.includes("time")) return "a time word";
  if (label.includes("month") || label.includes("day")) return "a calendar word";
  if (label.includes("routine")) return "a daily routine word";
  if (label.includes("community places")) return "a place in the community";
  if (label.includes("services")) return "a community service word";
  if (label.includes("message")) return "a communication word";
  if (label.includes("preposition")) return "a location word";
  if (label.includes("adverb")) return "a frequency or direction word";
  if (label.includes("clothing")) return "a clothing word";
  if (label.includes("shopping")) return "a shopping or money word";
  if (label.includes("housing")) return "a housing word";
  if (label.includes("parts of house")) return "a part of a home";
  if (label.includes("domestic")) return "a household word";
  if (label.includes("occupation")) return "a job word";
  if (label.includes("workforce")) return "a work word";
  if (label.includes("strength")) return "a word about skills or strengths";
  if (label.includes("body")) return "a body part word";
  if (label.includes("symptom")) return "a health symptom word";
  if (label.includes("medicine")) return "a medicine word";
  if (label.includes("illness")) return "an illness word";
  if (label.includes("exercise")) return "an exercise or body health word";
  if (label.includes("food")) return "a food word";
  if (label.includes("fruit")) return "a fruit word";
  if (label.includes("vegetable")) return "a vegetable word";
  if (label.includes("drink")) return "a drink word";
  if (label.includes("container")) return "a container word";
  return `a word from the ${category} category`;
}

function categoryHintSpanish(category: string): string {
  const label = category.toLowerCase();
  if (label.includes("classroom")) return "una palabra del salón de clases";
  if (label.includes("family")) return "una palabra de la familia";
  if (label.includes("pronoun")) return "un pronombre";
  if (label.includes("contraction")) return "una contracción";
  if (label.includes("possessive")) return "un adjetivo posesivo";
  if (label.includes("number")) return "una palabra de número";
  if (label.includes("people")) return "una palabra para una persona";
  if (label.includes("time")) return "una palabra de tiempo";
  if (label.includes("month") || label.includes("day")) return "una palabra del calendario";
  if (label.includes("routine")) return "una palabra de la rutina diaria";
  if (label.includes("community places")) return "un lugar en la comunidad";
  if (label.includes("services")) return "una palabra de servicios comunitarios";
  if (label.includes("message")) return "una palabra de comunicación";
  if (label.includes("preposition")) return "una palabra de ubicación";
  if (label.includes("adverb")) return "una palabra de frecuencia o dirección";
  if (label.includes("clothing")) return "una palabra de ropa";
  if (label.includes("shopping")) return "una palabra de compras o dinero";
  if (label.includes("housing")) return "una palabra de vivienda";
  if (label.includes("parts of house")) return "una parte de la casa";
  if (label.includes("domestic")) return "una palabra del hogar";
  if (label.includes("occupation")) return "una palabra de trabajo u ocupación";
  if (label.includes("workforce")) return "una palabra del trabajo";
  if (label.includes("strength")) return "una palabra sobre habilidades o fortalezas";
  if (label.includes("body")) return "una palabra de parte del cuerpo";
  if (label.includes("symptom")) return "una palabra de síntomas de salud";
  if (label.includes("medicine")) return "una palabra de medicina";
  if (label.includes("illness")) return "una palabra de enfermedad";
  if (label.includes("exercise")) return "una palabra de ejercicio o salud del cuerpo";
  if (label.includes("food")) return "una palabra de comida";
  if (label.includes("fruit")) return "una palabra de fruta";
  if (label.includes("vegetable")) return "una palabra de verdura";
  if (label.includes("drink")) return "una palabra de bebida";
  if (label.includes("container")) return "una palabra de recipiente";
  return `una palabra de la categoría ${category}`;
}

function categoryLabelSpanish(label: string): string {
  const map: Record<string, string> = {
    "Personal Information": "Información personal",
    "Time of Day": "Partes del día",
    "People": "Personas",
    "Pronouns": "Pronombres",
    "Contractions": "Contracciones",
    "Possessive Adjectives": "Adjetivos posesivos",
    "Numbers": "Números",
    "Classroom": "Salón de clases",
    "Other": "Otras palabras",
    "Days and Months": "Días y meses",
    "Routines": "Rutinas",
    "Family": "Familia",
    "Descriptions (Physical)": "Descripciones físicas",
    "Adjectives": "Adjetivos",
    "Civic Vocabulary": "Vocabulario cívico",
    "Community Places": "Lugares de la comunidad",
    "Community Services / Needs": "Servicios y necesidades",
    "Messages": "Mensajes",
    "Adverbs of Location": "Adverbios de lugar",
    "Prepositions (Location)": "Preposiciones de lugar",
    "Adverbs of Frequency": "Adverbios de frecuencia",
    "Thanksgiving": "Acción de Gracias",
    "Clothing": "Ropa",
    "Products": "Productos",
    "Shopping & Finance": "Compras y finanzas",
    "Quantifiers": "Cuantificadores",
    "Christmas": "Navidad",
    "Housing & Rental": "Vivienda y alquiler",
    "Parts of House": "Partes de la casa",
    "Domestic Things": "Objetos del hogar",
    "Prepositions of Location": "Preposiciones de lugar",
    "Occupations": "Ocupaciones",
    "Workforce Terminology": "Vocabulario del trabajo",
    "Strengths": "Fortalezas",
    "Strength Adjectives": "Adjetivos de fortaleza",
    "Body Parts": "Partes del cuerpo",
    "Symptoms": "Síntomas",
    "Medicine": "Medicina",
    "Illness": "Enfermedades",
    "Emergency & Facilities": "Emergencias y lugares",
    "Other Medical": "Otras palabras médicas",
    "Exercise": "Ejercicio",
    "Food Groups": "Grupos de alimentos",
    "Grains & Breakfast": "Granos y desayuno",
    "Dairy & Eggs": "Lácteos y huevos",
    "Meats & Proteins": "Carnes y proteínas",
    "Staples": "Alimentos básicos",
    "Vegetables": "Verduras",
    "Condiments & Seasoning": "Condimentos y sazón",
    "Fruits": "Frutas",
    "Prepared Foods": "Comidas preparadas",
    "Sweets & Snacks": "Dulces y bocadillos",
    "Drinks": "Bebidas",
    "Containers": "Recipientes",
    "Other Wellness": "Otras palabras de bienestar",
  };

  return map[label] ?? label;
}

const SIMPLE_TERM_DEFINITIONS: Record<string, { en: string; es: string }> = {
  "Sunday": { en: "a day of the week", es: "un día de la semana" },
  "Monday": { en: "a day of the week", es: "un día de la semana" },
  "Tuesday": { en: "a day of the week", es: "un día de la semana" },
  "Wednesday": { en: "a day of the week", es: "un día de la semana" },
  "Thursday": { en: "a day of the week", es: "un día de la semana" },
  "Friday": { en: "a day of the week", es: "un día de la semana" },
  "Saturday": { en: "a day of the week", es: "un día de la semana" },
  "January": { en: "a month of the year", es: "un mes del año" },
  "February": { en: "a month of the year", es: "un mes del año" },
  "March": { en: "a month of the year", es: "un mes del año" },
  "April": { en: "a month of the year", es: "un mes del año" },
  "May": { en: "a month of the year", es: "un mes del año" },
  "June": { en: "a month of the year", es: "un mes del año" },
  "July": { en: "a month of the year", es: "un mes del año" },
  "August": { en: "a month of the year", es: "un mes del año" },
  "September": { en: "a month of the year", es: "un mes del año" },
  "October": { en: "a month of the year", es: "un mes del año" },
  "November": { en: "a month of the year", es: "un mes del año" },
  "December": { en: "a month of the year", es: "un mes del año" },
  "Week": { en: "seven days together", es: "siete días juntos; una semana" },
  "Month": { en: "about four weeks together", es: "un grupo de semanas; un mes" },
  "Today": { en: "this day", es: "este día; hoy" },
  "Tomorrow": { en: "the day after today", es: "el día después de hoy; mañana" },
  "Yesterday": { en: "the day before today", es: "el día antes de hoy; ayer" },
  "Next": { en: "coming after this", es: "lo que viene después" },
  "Time": { en: "what we use to know when something happens", es: "lo que usamos para saber cuándo pasa algo" },
  "Schedule": { en: "a plan that shows times and activities", es: "un plan que muestra horas y actividades" },
  "Calendar": { en: "a chart or book with days and dates", es: "un calendario con días y fechas" },
  "Appointment": { en: "a planned time to meet someone", es: "una cita o tiempo planeado para reunirse con alguien" },
  "Half": { en: "one of two equal parts", es: "una de dos partes iguales; la mitad" },
  "Hour": { en: "60 minutes", es: "60 minutos; una hora" },
  "Minute": { en: "a short unit of time", es: "una unidad corta de tiempo; un minuto" },
  "Breakfast": { en: "the first meal of the day", es: "la primera comida del día; el desayuno" },
  "Lunch": { en: "a meal in the middle of the day", es: "la comida del mediodía; el almuerzo" },
  "Dinner": { en: "the main meal in the evening", es: "la comida principal de la tarde o noche; la cena" },
  "Shower": { en: "washing your body with water", es: "lavarse el cuerpo con agua; una ducha" },
  "O'clock": { en: "used to tell the exact hour", es: "se usa para decir la hora exacta" },
  "Father": { en: "a male parent", es: "un padre; un papá" },
  "Mother": { en: "a female parent", es: "una madre; una mamá" },
  "Sister": { en: "a girl or woman in your family with the same parents", es: "una hermana" },
  "Brother": { en: "a boy or man in your family with the same parents", es: "un hermano" },
  "Son": { en: "a male child", es: "un hijo" },
  "Daughter": { en: "a female child", es: "una hija" },
  "Cousin": { en: "the child of your aunt or uncle", es: "el hijo o la hija de tu tía o tío; un primo o prima" },
  "Uncle": { en: "the brother of your parent or the husband of your aunt", es: "un tío" },
  "Aunt": { en: "the sister of your parent or the wife of your uncle", es: "una tía" },
  "Niece": { en: "the daughter of your brother or sister", es: "la hija de tu hermano o hermana; una sobrina" },
  "Nephew": { en: "the son of your brother or sister", es: "el hijo de tu hermano o hermana; un sobrino" },
  "Grandmother": { en: "the mother of your mother or father", es: "la madre de tu madre o padre; la abuela" },
  "Grandfather": { en: "the father of your mother or father", es: "el padre de tu madre o padre; el abuelo" },
  "Husband": { en: "a married man", es: "un hombre casado; el esposo" },
  "Wife": { en: "a married woman", es: "una mujer casada; la esposa" },
  "Parent": { en: "a mother or father", es: "una madre o un padre" },
  "Child": { en: "a young person; a son or daughter", es: "un niño o una niña; un hijo o hija" },
  "Children": { en: "more than one child", es: "más de un niño; niños o hijos" },
  "Mother-in-law": { en: "your spouse's mother", es: "la madre de tu esposo o esposa; la suegra" },
  "Father-in-law": { en: "your spouse's father", es: "el padre de tu esposo o esposa; el suegro" },
  "Sister-in-law": { en: "the sister of your spouse or the wife of your sibling", es: "la hermana de tu esposo o esposa, o la esposa de tu hermano" },
  "Brother-in-law": { en: "the brother of your spouse or the husband of your sibling", es: "el hermano de tu esposo o esposa, o el esposo de tu hermana" },
  "Members": { en: "people who belong to a group or family", es: "personas que pertenecen a un grupo o familia; miembros" },
  "Relationship": { en: "the family connection between people", es: "la conexión o relación entre personas" },
  "Teacher": { en: "a person who teaches", es: "una persona que enseña; un maestro o maestra" },
  "Student": { en: "a person who learns in a class", es: "una persona que aprende en una clase; un estudiante" },
  "Classmate": { en: "another student in your class", es: "otro estudiante de tu clase; un compañero de clase" },
  "Partner": { en: "the person you work with", es: "la persona con quien trabajas; un compañero" },
  "Group": { en: "several people or things together", es: "varias personas o cosas juntas; un grupo" },
  "Pencil sharpener": { en: "a tool that makes a pencil point sharp", es: "una herramienta para sacar punta a un lápiz" },
  "Marker": { en: "a pen with thick ink", es: "un marcador o rotulador" },
  "Eraser": { en: "something used to remove pencil marks", es: "algo que se usa para borrar marcas de lápiz; una goma" },
  "Desk": { en: "a table used for school or work", es: "una mesa usada para estudiar o trabajar; un escritorio o pupitre" },
  "Chair": { en: "something you sit on", es: "algo donde te sientas; una silla" },
  "Hair": { en: "the hair on your head", es: "el pelo o cabello" },
  "Eyes": { en: "the body parts you use to see", es: "las partes del cuerpo que usas para ver; los ojos" },
  "Short": { en: "not long or not tall", es: "no largo o no alto; corto o bajo" },
  "Long": { en: "not short", es: "no corto; largo" },
  "Wavy": { en: "with soft curves", es: "con ondas suaves; ondulado" },
  "Curly": { en: "with many curls", es: "con muchos rizos; rizado" },
  "Bald": { en: "with little or no hair", es: "con poco o nada de pelo; calvo" },
  "Brown": { en: "a color like chocolate or wood", es: "un color como el chocolate o la madera; marrón o café" },
  "Red": { en: "the color of blood or a stop sign", es: "el color de la sangre o una señal de alto; rojo" },
  "Black": { en: "the darkest color", es: "el color más oscuro; negro" },
  "Blond": { en: "light yellow hair color", es: "color de pelo amarillo claro; rubio" },
  "Gray": { en: "a color between black and white", es: "un color entre negro y blanco; gris" },
  "Tall": { en: "having a lot of height", es: "con mucha altura; alto" },
  "Young": { en: "not old", es: "no viejo; joven" },
  "Thin": { en: "not heavy; not wide", es: "no pesado o no ancho; delgado" },
  "Heavy": { en: "weighing a lot", es: "que pesa mucho; pesado" },
  "Candidate": { en: "a person who wants to win an election", es: "una persona que quiere ganar una elección; un candidato" },
  "Ballot": { en: "the paper or form used to vote", es: "el papel o formulario usado para votar; la boleta" },
  "Voter": { en: "a person who votes", es: "una persona que vota; un votante" },
  "Election": { en: "the process of choosing a leader by voting", es: "el proceso de elegir un líder por votación; una elección" },
  "Campaign": { en: "the work to help a candidate win", es: "el trabajo para ayudar a un candidato a ganar; una campaña" },
  "Political Party": { en: "a group with the same political ideas", es: "un grupo con ideas políticas parecidas; un partido político" },
  "Doctor's office": { en: "a place where you go to see a doctor", es: "un lugar donde vas para ver a un doctor" },
  "Dentist's office": { en: "a place where you go to see a dentist", es: "un lugar donde vas para ver al dentista" },
  "Hospital": { en: "a place where sick people get medical care", es: "un lugar donde las personas enfermas reciben atención médica; un hospital" },
  "Hotel": { en: "a place where people stay when they travel", es: "un lugar donde la gente se queda cuando viaja; un hotel" },
  "House": { en: "a place where people live", es: "un lugar donde vive la gente; una casa" },
  "Park": { en: "an outdoor place with grass, trees, or playgrounds", es: "un lugar al aire libre con pasto, árboles o juegos; un parque" },
  "Playground": { en: "a place where children play", es: "un lugar donde juegan los niños; un patio de juegos" },
  "Supermarket": { en: "a large store where you buy food", es: "una tienda grande donde compras comida; un supermercado" },
  "Bank": { en: "a place where people keep or use money", es: "un lugar donde la gente guarda o usa dinero; un banco" },
  "Library": { en: "a place where people borrow books", es: "un lugar donde la gente presta libros; una biblioteca" },
  "Post Office": { en: "a place where you send or get mail", es: "un lugar donde envías o recibes correo; la oficina de correos" },
  "Fire Department": { en: "the service that helps in fires", es: "el servicio que ayuda en incendios; los bomberos" },
  "Police Station": { en: "the building used by the police", es: "el edificio usado por la policía; la estación de policía" },
  "RMV": { en: "the office for driver's licenses and car papers", es: "la oficina para licencias y papeles del carro" },
  "Bus Stop": { en: "the place where you wait for the bus", es: "el lugar donde esperas el autobús; la parada de autobús" },
  "Station": { en: "a place where buses or trains stop", es: "un lugar donde paran buses o trenes; una estación" },
  "Public Transportation": { en: "buses, trains, and other travel for everyone", es: "buses, trenes y otro transporte para todos; transporte público" },
  "City Hall": { en: "the main government building in a city", es: "el edificio principal del gobierno de una ciudad; el ayuntamiento" },
  "Clinic": { en: "a small medical center", es: "un centro médico pequeño; una clínica" },
  "School": { en: "a place where people learn", es: "un lugar donde la gente aprende; una escuela" },
  "Museum": { en: "a place where people see old or special things", es: "un lugar donde la gente ve cosas antiguas o especiales; un museo" },
  "Restaurant": { en: "a place where people buy and eat meals", es: "un lugar donde la gente compra y come comida; un restaurante" },
  "Store": { en: "a place where people buy things", es: "un lugar donde la gente compra cosas; una tienda" },
  "Pharmacy": { en: "a place where you get medicine", es: "un lugar donde consigues medicina; una farmacia" },
  "Gym": { en: "a place where people exercise", es: "un lugar donde la gente hace ejercicio; un gimnasio" },
  "Airport": { en: "a place where airplanes arrive and leave", es: "un lugar donde llegan y salen aviones; un aeropuerto" },
  "Laundromat": { en: "a place where people wash clothes", es: "un lugar donde la gente lava ropa; una lavandería" },
  "Transportation": { en: "ways to travel from one place to another", es: "formas de ir de un lugar a otro; transporte" },
  "Medical Care": { en: "help from doctors and nurses", es: "ayuda de doctores y enfermeras; atención médica" },
  "Education": { en: "learning in school or class", es: "aprender en la escuela o en clase; educación" },
  "Shopping": { en: "buying things from stores", es: "comprar cosas en tiendas; ir de compras" },
  "Housing": { en: "places where people live", es: "lugares donde vive la gente; vivienda" },
  "Call": { en: "to talk to someone by phone", es: "hablar con alguien por teléfono; llamar" },
  "Message": { en: "words sent to another person", es: "palabras enviadas a otra persona; un mensaje" },
  "Voicemail": { en: "a phone message you hear later", es: "un mensaje de voz que escuchas después" },
  "Email": { en: "a message sent by computer or phone", es: "un mensaje enviado por computadora o teléfono; un correo electrónico" },
  "Left": { en: "the direction opposite of right", es: "la dirección opuesta de derecha; izquierda" },
  "Right": { en: "the direction opposite of left", es: "la dirección opuesta de izquierda; derecha" },
  "Straight": { en: "forward, without turning", es: "hacia adelante, sin doblar; derecho" },
  "Around": { en: "in a circle or to the other side", es: "en círculo o al otro lado; alrededor" },
  "In": { en: "inside", es: "adentro; en" },
  "At": { en: "in or near a place", es: "en un lugar o cerca de él" },
  "On": { en: "touching the top of something", es: "tocando la parte de arriba de algo; sobre" },
  "In front of": { en: "before something; on the forward side", es: "delante de algo" },
  "Behind": { en: "at the back of something", es: "detrás de algo" },
  "Between": { en: "in the middle of two things", es: "en medio de dos cosas; entre" },
  "Next to": { en: "beside", es: "al lado de" },
  "Across from": { en: "on the other side, facing", es: "al otro lado, enfrente de" },
  "Never": { en: "not at any time", es: "en ningún momento; nunca" },
  "Rarely": { en: "not often", es: "no muy seguido; rara vez" },
  "Sometimes": { en: "at some times, but not always", es: "a veces" },
  "Usually": { en: "most of the time", es: "la mayor parte del tiempo; usualmente" },
  "Always": { en: "every time", es: "todo el tiempo; siempre" },
  "Thanks": { en: "words you say when you are grateful", es: "palabras que dices cuando estás agradecido; gracias" },
  "Meal": { en: "food you eat at one time", es: "comida que comes en un momento; una comida" },
  "Turkey": { en: "a large bird often eaten on holidays", es: "un ave grande que muchas veces se come en días festivos; pavo" },
  "Indigenous": { en: "from the first people of a place", es: "de los primeros pueblos de un lugar; indígena" },
  "Pilgrim": { en: "one of the early English settlers in America", es: "uno de los primeros colonos ingleses en América; peregrino" },
  "Electronics": { en: "machines or tools that use electricity", es: "máquinas o herramientas que usan electricidad; electrónicos" },
  "Computer": { en: "an electronic machine for work or learning", es: "una máquina electrónica para trabajar o aprender; una computadora" },
  "Car": { en: "a vehicle people drive on roads", es: "un vehículo que la gente maneja en la calle; un carro" },
  "Cellphone": { en: "a phone you carry with you", es: "un teléfono que llevas contigo; un celular" },
  "Receipt": { en: "the paper that shows what you bought and paid for", es: "el papel que muestra lo que compraste y pagaste; un recibo" },
  "Tax": { en: "extra money paid to the government", es: "dinero extra que se paga al gobierno; impuesto" },
  "Price": { en: "how much something costs", es: "cuánto cuesta algo; el precio" },
  "Cash": { en: "money in bills or coins", es: "dinero en billetes o monedas; efectivo" },
  "Credit Card": { en: "a card you use to buy now and pay later", es: "una tarjeta que usas para comprar ahora y pagar después" },
  "Debit Card": { en: "a card that uses money from your bank account", es: "una tarjeta que usa dinero de tu cuenta bancaria" },
  "Check": { en: "a paper used to pay money from a bank account", es: "un papel que se usa para pagar dinero desde una cuenta bancaria; cheque" },
  "Money Order": { en: "a paper payment bought with cash", es: "un pago en papel que se compra con efectivo; giro postal" },
  "Signature": { en: "your written name", es: "tu nombre escrito a mano; firma" },
  "ATM": { en: "a machine where you get money from your bank", es: "una máquina donde sacas dinero del banco; cajero automático" },
  "Withdraw": { en: "to take money out of a bank", es: "sacar dinero del banco; retirar" },
  "Deposit": { en: "to put money into a bank", es: "poner dinero en el banco; depositar" },
  "Online": { en: "using the internet", es: "usando internet; en línea" },
  "Return": { en: "to take something back to the store", es: "llevar algo de vuelta a la tienda; devolver" },
  "Exchange": { en: "to give one thing back and get another", es: "devolver una cosa y recibir otra; cambiar" },
  "Refund": { en: "money you get back after returning something", es: "dinero que te devuelven después de regresar algo; reembolso" },
  "Christmas Tree": { en: "a tree used for Christmas decoration", es: "un árbol usado para decorar en Navidad" },
  "Ornaments": { en: "small decorations for a tree or home", es: "decoraciones pequeñas para un árbol o una casa; adornos" },
  "Lights": { en: "things that shine and give light", es: "cosas que brillan y dan luz; luces" },
  "Santa": { en: "the holiday man who brings gifts in stories", es: "el hombre de la Navidad que trae regalos en las historias; Santa Claus" },
  "Gift": { en: "something you give to another person", es: "algo que das a otra persona; un regalo" },
  "Landlord": { en: "the person who owns the place you rent", es: "la persona que es dueña del lugar que rentas; el propietario" },
  "Manager": { en: "the person in charge", es: "la persona encargada; el gerente" },
  "Agent": { en: "a person who helps with buying or renting homes", es: "una persona que ayuda con comprar o rentar casas; agente" },
  "Real Estate": { en: "houses, apartments, and land for sale or rent", es: "casas, apartamentos y terrenos para venta o renta; bienes raíces" },
  "Tenant": { en: "a person who rents a home", es: "una persona que renta una casa o apartamento; inquilino" },
  "Leak": { en: "water coming out where it should not", es: "agua saliendo de donde no debe; fuga" },
  "Broken Window": { en: "a window with damaged glass", es: "una ventana con vidrio dañado; ventana rota" },
  "Clogged Toilet": { en: "a toilet blocked so water cannot go down", es: "un inodoro tapado para que el agua no baje" },
  "Complaint": { en: "words you say when something is wrong", es: "palabras que dices cuando algo está mal; una queja" },
  "Home": { en: "the place where you live", es: "el lugar donde vives; el hogar" },
  "Apartment": { en: "a home inside a larger building", es: "una vivienda dentro de un edificio más grande; apartamento" },
  "Condominium": { en: "an apartment that someone owns", es: "un apartamento que alguien es dueño; condominio" },
  "Unit": { en: "one home or apartment space in a building", es: "un espacio de vivienda en un edificio; unidad" },
  "Rent": { en: "money paid to live in a place", es: "dinero pagado para vivir en un lugar; renta" },
  "Lease": { en: "a paper agreement to rent a place", es: "un contrato para rentar un lugar; contrato de arrendamiento" },
  "Fee": { en: "money you must pay for a service", es: "dinero que debes pagar por un servicio; cuota" },
  "Security deposit": { en: "money paid at the start of renting that may be returned later", es: "dinero pagado al principio de una renta que puede devolverse después; depósito de seguridad" },
  "Laundry": { en: "clothes that need washing or are being washed", es: "ropa para lavar o que se está lavando; la lavandería" },
  "Mortgage": { en: "a loan used to buy a house", es: "un préstamo usado para comprar una casa; hipoteca" },
  "Down payment": { en: "the first money paid when buying a house or car", es: "el primer dinero pagado al comprar una casa o carro; enganche" },
  "Utilities": { en: "services like water, gas, and electricity", es: "servicios como agua, gas y electricidad; utilidades o servicios" },
  "Gas": { en: "fuel used for cooking, heat, or cars", es: "combustible usado para cocinar, calentar o mover carros; gas" },
  "Water": { en: "the liquid people drink and use every day", es: "el líquido que la gente bebe y usa cada día; agua" },
  "Electric": { en: "using electricity", es: "que usa electricidad; eléctrico" },
  "Heat": { en: "warm air or warmth in a building", es: "aire caliente o calor en un edificio; calefacción" },
  "Room": { en: "one area inside a house", es: "un espacio dentro de una casa; un cuarto o habitación" },
  "Bathroom": { en: "the room with a toilet or shower", es: "el cuarto con inodoro o ducha; baño" },
  "Kitchen": { en: "the room where you cook", es: "el cuarto donde cocinas; cocina" },
  "Bedroom": { en: "the room where you sleep", es: "el cuarto donde duermes; dormitorio" },
  "Living room": { en: "the room where people sit and relax", es: "el cuarto donde la gente se sienta y descansa; sala" },
  "Hall": { en: "the long space that connects rooms", es: "el espacio largo que conecta cuartos; pasillo" },
  "Floor": { en: "the bottom part you walk on", es: "la parte de abajo donde caminas; piso" },
  "Basement": { en: "the part of a house below the ground", es: "la parte de una casa debajo del suelo; sótano" },
  "Attic": { en: "the space under the roof", es: "el espacio debajo del techo; ático" },
  "Roof": { en: "the top of a house", es: "la parte de arriba de una casa; techo" },
  "Chimney": { en: "the part of a house where smoke goes out", es: "la parte de una casa por donde sale el humo; chimenea" },
  "Door": { en: "the thing you open to go in or out", es: "la cosa que abres para entrar o salir; puerta" },
  "Front": { en: "the part that faces forward", es: "la parte de adelante; frente" },
  "Lock": { en: "the part that keeps a door closed with a key", es: "la parte que mantiene una puerta cerrada con llave; cerradura" },
  "Stairs": { en: "steps that go up or down", es: "escalones para subir o bajar; escaleras" },
  "Porch": { en: "a covered area by the front door", es: "un espacio cubierto junto a la puerta principal; porche" },
  "Deck": { en: "a flat outdoor floor behind a house", es: "un piso plano al aire libre detrás de una casa; terraza de madera" },
  "Garage": { en: "a place where you keep a car", es: "un lugar donde guardas un carro; garaje" },
  "Driveway": { en: "the road or space where a car goes to the house", es: "el camino o espacio por donde entra el carro a la casa; entrada" },
  "Yard": { en: "the ground around a house", es: "la tierra alrededor de una casa; patio" },
  "Garden": { en: "a place where flowers or vegetables grow", es: "un lugar donde crecen flores o verduras; jardín" },
  "Window": { en: "glass in a wall that lets you see outside", es: "vidrio en una pared para ver afuera; ventana" },
  "End table": { en: "a small table beside a chair or sofa", es: "una mesa pequeña junto a una silla o sofá; mesa auxiliar" },
  "Coffee table": { en: "a low table in front of a sofa", es: "una mesa baja delante del sofá; mesa de centro" },
  "Plant": { en: "a living thing that grows in soil", es: "un ser vivo que crece en la tierra; planta" },
  "Lamp": { en: "a light you can move or place on a table", es: "una luz que puedes mover o poner en una mesa; lámpara" },
  "Light": { en: "something that makes a room bright", es: "algo que hace un cuarto claro; luz" },
  "Painting": { en: "a picture made with paint", es: "una imagen hecha con pintura; pintura o cuadro" },
  "Rug": { en: "a small carpet on the floor", es: "una alfombra pequeña" },
  "Carpet": { en: "thick cloth that covers a floor", es: "tela gruesa que cubre el piso; alfombra" },
  "Bathtub": { en: "a large tub for bathing", es: "una tina grande para bañarse; bañera" },
  "Sink": { en: "the place where water comes out for washing", es: "el lugar donde sale agua para lavar; lavabo o fregadero" },
  "Toilet": { en: "the bathroom seat used to go to the bathroom", es: "el asiento del baño usado para hacer tus necesidades; inodoro" },
  "Curtain": { en: "cloth that covers a window", es: "tela que cubre una ventana; cortina" },
  "Bed": { en: "the place where you sleep", es: "el lugar donde duermes; cama" },
  "Closet": { en: "a small space where clothes are kept", es: "un espacio pequeño donde se guarda ropa; clóset" },
  "Bedtable": { en: "a small table next to a bed", es: "una mesa pequeña junto a una cama; mesa de noche" },
  "Refrigerator": { en: "a cold machine that keeps food fresh", es: "una máquina fría que mantiene la comida fresca; refrigerador" },
  "Microwave": { en: "a machine that heats food quickly", es: "una máquina que calienta comida rápido; microondas" },
  "Oven": { en: "the part of a stove used for baking", es: "la parte de la estufa usada para hornear; horno" },
  "Counter": { en: "the flat surface in a kitchen for preparing food", es: "la superficie plana en una cocina para preparar comida; mostrador o encimera" },
  "Cabinet": { en: "a box with doors where things are stored", es: "una caja con puertas donde se guardan cosas; gabinete" },
  "Sofa": { en: "a soft seat for several people", es: "un asiento suave para varias personas; sofá" },
  "Armchair": { en: "a chair with arms", es: "una silla con brazos; sillón" },
  "TV": { en: "a screen you watch shows on", es: "una pantalla donde miras programas; televisión" },
  "Fireplace": { en: "a place in a wall where a fire burns", es: "un lugar en la pared donde se prende fuego; chimenea" },
  "Washer": { en: "a machine that washes clothes", es: "una máquina que lava ropa; lavadora" },
  "Dryer": { en: "a machine that dries clothes", es: "una máquina que seca ropa; secadora" },
  "Under": { en: "below something", es: "debajo de" },
  "Over": { en: "above something", es: "encima de" },
  "Homemaker": { en: "a person who works in the home caring for the family", es: "una persona que trabaja en la casa cuidando a la familia" },
  "Mechanic": { en: "a person who fixes cars or machines", es: "una persona que arregla carros o máquinas; mecánico" },
  "Office assistant": { en: "a person who helps in an office", es: "una persona que ayuda en una oficina; asistente de oficina" },
  "Administrative assistant": { en: "a person who does office support work", es: "una persona que hace trabajo de apoyo en la oficina; asistente administrativo" },
  "Secretary": { en: "a person who answers phones and does office work", es: "una persona que contesta teléfonos y hace trabajo de oficina; secretario o secretaria" },
  "Receptionist": { en: "a person who greets people and answers phones", es: "una persona que recibe a la gente y contesta teléfonos; recepcionista" },
  "Server": { en: "a person who brings food in a restaurant", es: "una persona que lleva comida en un restaurante; mesero o mesera" },
  "Busser": { en: "a person who clears tables in a restaurant", es: "una persona que limpia mesas en un restaurante" },
  "Cook": { en: "a person who prepares food", es: "una persona que prepara comida; cocinero o cocinera" },
  "Prep Cook": { en: "a cook who gets food ready before cooking", es: "un cocinero que prepara comida antes de cocinar" },
  "Chef": { en: "the main cook in a kitchen", es: "el cocinero principal en una cocina; chef" },
  "Dishwasher": { en: "a person who washes dishes at work, or a machine that washes dishes", es: "una persona que lava platos en el trabajo, o una máquina que lava platos" },
  "Host": { en: "a person who welcomes people to a restaurant", es: "una persona que recibe a la gente en un restaurante" },
  "Custodian": { en: "a person who cleans and cares for a building", es: "una persona que limpia y cuida un edificio; conserje" },
  "Cashier": { en: "a person who takes money in a store", es: "una persona que recibe dinero en una tienda; cajero o cajera" },
  "Principal": { en: "the leader of a school", es: "la persona principal de una escuela; director o directora" },
  "Doctor": { en: "a person who helps sick people get better", es: "una persona que ayuda a los enfermos a mejorar; doctor" },
  "Nurse": { en: "a person who cares for sick people", es: "una persona que cuida a los enfermos; enfermero o enfermera" },
  "Dentist": { en: "a doctor for teeth", es: "un doctor para los dientes; dentista" },
  "Painter": { en: "a person who paints houses or walls", es: "una persona que pinta casas o paredes; pintor o pintora" },
  "Plumber": { en: "a person who fixes pipes and water problems", es: "una persona que arregla tuberías y problemas de agua; plomero o fontanero" },
  "Electrician": { en: "a person who works with electricity", es: "una persona que trabaja con electricidad; electricista" },
  "Construction worker": { en: "a person who builds things like houses or roads", es: "una persona que construye cosas como casas o caminos" },
  "Housekeeper": { en: "a person who cleans rooms or homes", es: "una persona que limpia cuartos o casas; ama de llaves o personal de limpieza" },
  "Driver": { en: "a person who drives a car, bus, or truck", es: "una persona que maneja un carro, bus o camión; conductor" },
  "Landscaper": { en: "a person who works with grass, plants, and yards", es: "una persona que trabaja con césped, plantas y patios" },
  "Salesperson": { en: "a person who sells things", es: "una persona que vende cosas; vendedor o vendedora" },
  "Business owner": { en: "a person who owns a business", es: "una persona que es dueña de un negocio" },
  "Pay": { en: "money you get for your work", es: "dinero que recibes por tu trabajo; pago" },
  "Salary": { en: "regular pay for a job", es: "pago regular por un trabajo; salario" },
  "Benefits": { en: "extra help from a job, like insurance or vacation", es: "ayuda extra de un trabajo, como seguro o vacaciones; beneficios" },
  "Full-time": { en: "working all the usual hours each week", es: "trabajando todas las horas normales cada semana; tiempo completo" },
  "Part-time": { en: "working fewer hours than full-time", es: "trabajando menos horas que tiempo completo; medio tiempo" },
  "Title": { en: "the name of your job", es: "el nombre de tu trabajo; título o puesto" },
  "Experience": { en: "skills and knowledge from doing something before", es: "habilidades y conocimiento por haber hecho algo antes; experiencia" },
  "Break": { en: "a short rest from work", es: "un descanso corto del trabajo; descanso" },
  "Hired": { en: "chosen for a job", es: "escogido para un trabajo; contratado" },
  "Fired": { en: "told to leave a job", es: "cuando te dicen que dejes un trabajo; despedido" },
  "Laid off": { en: "out of work because the job ended", es: "sin trabajo porque el puesto terminó; despedido por recorte" },
  "Employee": { en: "a person who works for a company", es: "una persona que trabaja para una empresa; empleado" },
  "Paycheck": { en: "the money or paper you get for your work", es: "el dinero o papel que recibes por tu trabajo; cheque de pago" },
  "Uniform": { en: "special clothes worn for work", es: "ropa especial usada para el trabajo; uniforme" },
  "Boss": { en: "the person in charge of your work", es: "la persona encargada de tu trabajo; jefe o jefa" },
  "Interview": { en: "a meeting to see if you can get a job", es: "una reunión para ver si puedes conseguir un trabajo; entrevista" },
  "Employer": { en: "the person or company that gives you work", es: "la persona o empresa que te da trabajo; empleador" },
  "Taxes": { en: "money taken from pay for the government", es: "dinero tomado de tu pago para el gobierno; impuestos" },
  "Application": { en: "a form you fill out for a job", es: "un formulario que llenas para un trabajo; solicitud" },
  "Vacation": { en: "time away from work to rest", es: "tiempo fuera del trabajo para descansar; vacaciones" },
  "Sick leave": { en: "time away from work because you are sick", es: "tiempo fuera del trabajo porque estás enfermo; licencia por enfermedad" },
  "Insurance": { en: "a plan that helps pay for big costs", es: "un plan que ayuda a pagar gastos grandes; seguro" },
  "Resume": { en: "a paper with your work history and skills", es: "un papel con tu experiencia de trabajo y habilidades; currículum" },
  "Raise": { en: "more pay than before", es: "más pago que antes; aumento" },
  "Skill": { en: "something you can do well", es: "algo que puedes hacer bien; habilidad" },
  "Strength": { en: "something you are good at", es: "algo en lo que eres bueno; fortaleza" },
  "Teamwork": { en: "working well with other people", es: "trabajar bien con otras personas; trabajo en equipo" },
  "Problem-Solving": { en: "finding answers to problems", es: "encontrar respuestas a problemas; resolver problemas" },
  "Communication": { en: "sharing ideas with other people", es: "compartir ideas con otras personas; comunicación" },
  "Leadership": { en: "guiding other people", es: "guiar a otras personas; liderazgo" },
  "Creative": { en: "good at making new ideas", es: "bueno para crear ideas nuevas; creativo" },
  "Flexible": { en: "able to change when needed", es: "capaz de cambiar cuando es necesario; flexible" },
  "Organized": { en: "keeping things in order", es: "mantener las cosas en orden; organizado" },
  "Dependable": { en: "someone people can trust", es: "alguien en quien la gente puede confiar; confiable" },
  "Honest": { en: "truthful", es: "que dice la verdad; honesto" },
  "Hard-Working": { en: "doing a lot of work with effort", es: "que trabaja mucho con esfuerzo; trabajador" },
  "Respectful": { en: "showing kindness and respect", es: "mostrando amabilidad y respeto; respetuoso" },
  "Head": { en: "the top part of the body", es: "la parte de arriba del cuerpo; cabeza" },
  "Arms": { en: "the body parts from the shoulder to the hand", es: "las partes del cuerpo desde el hombro hasta la mano; brazos" },
  "Chest": { en: "the front upper part of the body", es: "la parte frontal alta del cuerpo; pecho" },
  "Hands": { en: "the body parts at the end of your arms", es: "las partes del cuerpo al final de tus brazos; manos" },
  "Stomach": { en: "the front middle part of the body; belly", es: "la parte media del frente del cuerpo; estómago o barriga" },
  "Back": { en: "the part behind your chest and stomach", es: "la parte detrás del pecho y el estómago; espalda" },
  "Fingers": { en: "the small parts on your hands", es: "las partes pequeñas de las manos; dedos" },
  "Legs": { en: "the body parts used for standing and walking", es: "las partes del cuerpo usadas para pararse y caminar; piernas" },
  "Foot": { en: "the body part at the end of the leg", es: "la parte del cuerpo al final de la pierna; pie" },
  "Feet": { en: "more than one foot", es: "más de un pie; pies" },
  "Toes": { en: "the small parts on your feet", es: "las partes pequeñas de los pies; dedos del pie" },
  "Neck": { en: "the body part between the head and shoulders", es: "la parte del cuerpo entre la cabeza y los hombros; cuello" },
  "Ears": { en: "the body parts you use to hear", es: "las partes del cuerpo que usas para oír; orejas" },
  "Mouth": { en: "the opening you use to eat and speak", es: "la abertura que usas para comer y hablar; boca" },
  "Nose": { en: "the body part you use to smell and breathe", es: "la parte del cuerpo que usas para oler y respirar; nariz" },
  "Tooth": { en: "one hard white part in the mouth", es: "una parte blanca y dura en la boca; diente" },
  "Teeth": { en: "more than one tooth", es: "más de un diente; dientes" },
  "Throat": { en: "the inside part of the neck used for swallowing", es: "la parte interna del cuello usada para tragar; garganta" },
  "Pain": { en: "hurt in the body", es: "dolor en el cuerpo; dolor" },
  "Cut": { en: "an opening in the skin", es: "una abertura en la piel; cortada" },
  "Dry cough": { en: "a cough without mucus", es: "una tos sin flema; tos seca" },
  "Fever": { en: "body heat that is too high", es: "calor del cuerpo que está muy alto; fiebre" },
  "Headache": { en: "pain in the head", es: "dolor en la cabeza; dolor de cabeza" },
  "Runny nose": { en: "a nose with mucus coming out", es: "una nariz con mucosidad saliendo; nariz que moquea" },
  "Sore Throat": { en: "pain in the throat", es: "dolor en la garganta; garganta irritada" },
  "Sneezing": { en: "air coming out of the nose and mouth suddenly", es: "aire que sale de la nariz y la boca de repente; estornudos" },
  "Backache": { en: "pain in the back", es: "dolor en la espalda" },
  "Toothache": { en: "pain in a tooth", es: "dolor en un diente; dolor de muela" },
  "Chills": { en: "feeling cold when you are sick", es: "sentir frío cuando estás enfermo; escalofríos" },
  "Sweats": { en: "a lot of sweat when you are sick", es: "mucho sudor cuando estás enfermo; sudores" },
  "Fatigue": { en: "feeling very tired", es: "sentirse muy cansado; fatiga" },
  "Dizziness": { en: "feeling like the room is moving", es: "sentir que el cuarto se mueve; mareo" },
  "Itch": { en: "a feeling that makes you want to scratch", es: "una sensación que te hace querer rascarte; picazón" },
  "Rash": { en: "red or irritated skin", es: "piel roja o irritada; sarpullido" },
  "Swelling": { en: "a body part getting bigger from injury or sickness", es: "una parte del cuerpo que se hace más grande por lesión o enfermedad; hinchazón" },
  "Nausea": { en: "feeling like you want to vomit", es: "sentir ganas de vomitar; náusea" },
  "Stress": { en: "feeling worried or under pressure", es: "sentirse preocupado o con presión; estrés" },
  "Prescription": { en: "a doctor's order for medicine", es: "la orden de un doctor para medicina; receta" },
  "Reliever": { en: "medicine that helps pain or sickness feel less strong", es: "medicina que ayuda a bajar el dolor o malestar" },
  "Syrup": { en: "liquid medicine", es: "medicina líquida; jarabe" },
  "Lozenges": { en: "small medicine candies for the throat", es: "pastillas pequeñas para la garganta; pastillas para chupar" },
  "Pills": { en: "small pieces of medicine you swallow", es: "piezas pequeñas de medicina que tragas; pastillas" },
  "Tablets": { en: "small flat pieces of medicine", es: "piezas pequeñas y planas de medicina; tabletas" },
  "Vaccine": { en: "medicine that helps protect you from illness", es: "medicina que ayuda a protegerte de una enfermedad; vacuna" },
  "Allergy": { en: "a body problem caused by food, dust, or other things", es: "un problema del cuerpo causado por comida, polvo u otras cosas; alergia" },
  "Cold": { en: "a common illness with cough or runny nose", es: "una enfermedad común con tos o mocos; resfriado" },
  "Flu": { en: "a stronger sickness with fever and body pain", es: "una enfermedad más fuerte con fiebre y dolor; gripe" },
  "Infection": { en: "illness caused by germs", es: "enfermedad causada por microbios; infección" },
  "Sprain": { en: "an injury when a joint is twisted", es: "una lesión cuando una articulación se tuerce; esguince" },
  "Medical center": { en: "a place where people get health care", es: "un lugar donde la gente recibe atención médica; centro médico" },
  "Elevators": { en: "machines that carry people up and down in a building", es: "máquinas que llevan personas hacia arriba y abajo en un edificio; elevadores" },
  "Lobby": { en: "the main front room in a building", es: "el cuarto o área principal al entrar a un edificio; lobby o vestíbulo" },
  "Checkup": { en: "a visit to the doctor to make sure you are healthy", es: "una visita al doctor para asegurarse de que estás bien; chequeo" },
  "Physical": { en: "a health exam of the body", es: "un examen de salud del cuerpo; examen físico" },
  "Surgery": { en: "a medical operation", es: "una operación médica; cirugía" },
  "Muscles": { en: "body parts that help you move", es: "partes del cuerpo que te ayudan a moverte; músculos" },
  "Weight": { en: "how heavy something or someone is", es: "qué tan pesado es algo o alguien; peso" },
  "Heart": { en: "the body part that moves blood", es: "la parte del cuerpo que mueve la sangre; corazón" },
  "Vegetables": { en: "foods that grow from plants and are not usually sweet", es: "comidas que crecen de plantas y normalmente no son dulces; verduras" },
  "Fruits": { en: "sweet foods that grow on plants or trees", es: "comidas dulces que crecen en plantas o árboles; frutas" },
  "Whole grains": { en: "healthy grains like brown rice or oats", es: "granos saludables como arroz integral o avena; granos enteros" },
  "Protein": { en: "food that helps build the body", es: "comida que ayuda a formar el cuerpo; proteína" },
  "Dairy": { en: "foods made from milk", es: "comidas hechas de leche; lácteos" },
  "Junk food": { en: "food that is not very healthy", es: "comida que no es muy saludable; comida chatarra" },
  "Cereal": { en: "a breakfast food often eaten with milk", es: "una comida de desayuno que muchas veces se come con leche; cereal" },
  "Bread": { en: "food made from flour and baked", es: "comida hecha de harina y horneada; pan" },
  "Toast": { en: "bread made brown with heat", es: "pan tostado con calor; tostada" },
  "Nuts": { en: "hard dry foods like almonds or peanuts", es: "comidas secas y duras como almendras o cacahuates; nueces" },
  "Walnuts": { en: "a kind of nut", es: "un tipo de nuez; nueces" },
  "Peanuts": { en: "small nuts that grow in the ground", es: "nueces pequeñas que crecen en la tierra; cacahuates o maní" },
  "Almonds": { en: "a kind of nut", es: "un tipo de nuez; almendras" },
  "Eggs": { en: "food that comes from chickens", es: "comida que viene de gallinas; huevos" },
  "Milk": { en: "a white drink from animals", es: "una bebida blanca que viene de animales; leche" },
  "Cheese": { en: "food made from milk", es: "comida hecha de leche; queso" },
  "Yogurt": { en: "soft food made from milk", es: "comida suave hecha de leche; yogur" },
  "Chicken": { en: "meat from a chicken", es: "carne de pollo; pollo" },
  "Beef": { en: "meat from a cow", es: "carne de vaca; carne de res" },
  "Pork": { en: "meat from a pig", es: "carne de cerdo; puerco" },
  "Fish": { en: "an animal that lives in water, or its meat", es: "un animal que vive en el agua, o su carne; pescado" },
  "Tuna": { en: "a kind of fish", es: "un tipo de pescado; atún" },
  "Rice": { en: "small grains cooked and eaten as food", es: "granos pequeños que se cocinan y se comen; arroz" },
  "Beans": { en: "small foods that grow in pods", es: "comidas pequeñas que crecen en vainas; frijoles o habichuelas" },
  "Soup": { en: "liquid food", es: "comida líquida; sopa" },
  "Tomatoes": { en: "red vegetables or fruits used in many foods", es: "verduras o frutas rojas usadas en mucha comida; tomates" },
  "Carrots": { en: "long orange vegetables", es: "verduras largas y naranjas; zanahorias" },
  "Avocados": { en: "soft green fruits", es: "frutas verdes y suaves; aguacates" },
  "Broccoli": { en: "a green vegetable", es: "una verdura verde; brócoli" },
  "Cucumber": { en: "a long green vegetable", es: "una verdura larga y verde; pepino" },
  "Corn": { en: "yellow kernels eaten as a vegetable", es: "granos amarillos que se comen como verdura; maíz" },
  "Celery": { en: "a long green vegetable with crunchy sticks", es: "una verdura verde con tallos crujientes; apio" },
  "Lettuce": { en: "a leafy green vegetable", es: "una verdura verde de hojas; lechuga" },
  "Spinach": { en: "a leafy green vegetable", es: "una verdura verde de hojas; espinaca" },
  "Salad": { en: "a food made with raw vegetables", es: "comida hecha con verduras crudas; ensalada" },
  "Oil": { en: "a liquid used for cooking", es: "un líquido usado para cocinar; aceite" },
  "Salt": { en: "a white thing used to give food flavor", es: "una cosa blanca usada para dar sabor a la comida; sal" },
  "Pepper": { en: "a spice used to give food flavor", es: "una especia usada para dar sabor a la comida; pimienta" },
  "Garlic": { en: "a strong-smelling food used in cooking", es: "una comida de olor fuerte usada en cocinar; ajo" },
  "Ketchup": { en: "a red sauce for food", es: "una salsa roja para la comida; kétchup" },
  "Mustard": { en: "a yellow sauce for food", es: "una salsa amarilla para la comida; mostaza" },
  "Jam": { en: "sweet fruit spread for bread", es: "una pasta dulce de fruta para el pan; mermelada" },
  "Jelly": { en: "sweet fruit spread for bread", es: "una pasta dulce de fruta para el pan; jalea" },
  "Peanut butter": { en: "a soft spread made from peanuts", es: "una pasta suave hecha de cacahuates o maní; mantequilla de maní" },
  "Apples": { en: "round fruits that grow on trees", es: "frutas redondas que crecen en árboles; manzanas" },
  "Oranges": { en: "round orange fruits", es: "frutas redondas de color naranja; naranjas" },
  "Bananas": { en: "long yellow fruits", es: "frutas largas y amarillas; bananas o plátanos" },
  "Pears": { en: "sweet fruits with a narrow top and round bottom", es: "frutas dulces con parte de arriba angosta y abajo redondo; peras" },
  "Watermelon": { en: "a large green fruit with red inside", es: "una fruta grande verde con rojo por dentro; sandía" },
  "Melon": { en: "a large sweet fruit", es: "una fruta grande y dulce; melón" },
  "Strawberry": { en: "a small red fruit", es: "una fruta pequeña y roja; fresa" },
  "Pineapple": { en: "a large tropical fruit with a rough outside", es: "una fruta tropical grande con cáscara dura; piña" },
  "Blueberry": { en: "a small blue fruit", es: "una fruta pequeña y azul; arándano" },
  "French Fries": { en: "pieces of potato fried in oil", es: "pedazos de papa fritos en aceite; papas fritas" },
  "Hamburger": { en: "a sandwich with meat inside", es: "un sándwich con carne adentro; hamburguesa" },
  "Pasta": { en: "food like noodles", es: "comida como fideos; pasta" },
  "Sandwich": { en: "food between two pieces of bread", es: "comida entre dos pedazos de pan; sándwich" },
  "Crackers": { en: "small dry baked snacks", es: "bocadillos pequeños, secos y horneados; galletas saladas" },
  "Cookies": { en: "sweet baked snacks", es: "bocadillos dulces horneados; galletas" },
  "Ice Cream": { en: "a cold sweet food", es: "una comida dulce y fría; helado" },
  "Cake": { en: "a sweet baked dessert", es: "un postre dulce horneado; pastel" },
  "Candy": { en: "sweet sugar food", es: "comida dulce hecha con azúcar; dulce" },
  "Potato Chips": { en: "thin fried pieces of potato", es: "pedazos finos de papa frita; papitas" },
  "Bottled water": { en: "water sold in a bottle", es: "agua vendida en una botella" },
  "Juice": { en: "a drink made from fruit", es: "una bebida hecha de fruta; jugo" },
  "Soda": { en: "a sweet fizzy drink", es: "una bebida dulce con gas; refresco" },
  "Can": { en: "a metal container", es: "un recipiente de metal; lata" },
  "Jar": { en: "a glass container", es: "un recipiente de vidrio; frasco" },
  "Bag": { en: "something used to carry things", es: "algo usado para llevar cosas; bolsa" },
  "Box": { en: "a square container", es: "un recipiente cuadrado; caja" },
  "Package": { en: "something wrapped or boxed for carrying or mailing", es: "algo envuelto o en una caja para llevar o mandar; paquete" },
  "Nutrition": { en: "healthy food and what it does for the body", es: "la comida saludable y lo que hace por el cuerpo; nutrición" },
  "Sugar": { en: "the sweet part in many foods", es: "la parte dulce en muchas comidas; azúcar" },
  "Fat": { en: "one part of food that gives energy", es: "una parte de la comida que da energía; grasa" },
  "Carbohydrates": { en: "one part of food that gives energy, like bread or rice", es: "una parte de la comida que da energía, como pan o arroz; carbohidratos" },
  "Calories": { en: "units that measure energy in food", es: "unidades que miden la energía en la comida; calorías" },
  "Menu": { en: "the list of food at a restaurant", es: "la lista de comida en un restaurante; menú" },
  "Food label": { en: "the information on food packages", es: "la información en los paquetes de comida; etiqueta de alimentos" },
  "Habits": { en: "things you do often", es: "cosas que haces muchas veces; hábitos" },
};

const SIMPLE_CATEGORY_TERM_DEFINITIONS: Record<string, { en: string; es: string }> = {
  "Adjectives::Straight": { en: "hair with no curls or waves", es: "cabello sin rizos ni ondas; lacio" },
  "Descriptions (Physical)::Straight": { en: "hair with no curls or waves", es: "cabello sin rizos ni ondas; lacio" },
  "Adverbs of Location::Straight": { en: "forward, without turning", es: "hacia adelante, sin doblar; derecho" },
  "Body Parts::Back": { en: "the part behind your chest and stomach", es: "la parte detrás del pecho y el estómago; espalda" },
  "Parts of House::Back": { en: "the rear part of a house", es: "la parte de atrás de una casa" },
};

function buildSimpleDefinition(term: string, category: string): { en: string; es: string } | null {
  const categoryExact = SIMPLE_CATEGORY_TERM_DEFINITIONS[`${category}::${term}`];
  if (categoryExact) return categoryExact;

  const exact = SIMPLE_TERM_DEFINITIONS[term];
  if (exact) return exact;

  const label = category.toLowerCase();

  if (label.includes("clothing")) {
    return { en: "a piece of clothing", es: "una prenda de ropa" };
  }
  if (label.includes("product")) {
    return { en: "a product or machine people use", es: "un producto o máquina que la gente usa" };
  }
  if (label.includes("quantifier")) {
    return { en: "a word that describes size, age, or condition", es: "una palabra que describe tamaño, edad o condición" };
  }
  if (label.includes("parts of house")) {
    return { en: "a part of a house", es: "una parte de la casa" };
  }
  if (label.includes("domestic")) {
    return { en: "a thing people use in the home", es: "una cosa que la gente usa en la casa" };
  }
  if (label.includes("occupation")) {
    return { en: "a kind of job", es: "un tipo de trabajo" };
  }
  if (label.includes("body parts")) {
    return { en: "a part of the body", es: "una parte del cuerpo" };
  }
  if (label.includes("symptoms")) {
    return { en: "a sign that someone may be sick", es: "una señal de que alguien puede estar enfermo" };
  }
  if (label.includes("medicine")) {
    return { en: "a kind of medicine", es: "un tipo de medicina" };
  }
  if (label.includes("illness")) {
    return { en: "a sickness or health problem", es: "una enfermedad o problema de salud" };
  }
  if (label.includes("food groups")) {
    return { en: "a kind of food group", es: "un tipo de grupo de alimentos" };
  }
  if (label.includes("grains")) {
    return { en: "a breakfast or grain food", es: "una comida de desayuno o de granos" };
  }
  if (label.includes("dairy")) {
    return { en: "a food made from milk", es: "una comida hecha de leche" };
  }
  if (label.includes("meats")) {
    return { en: "a kind of meat or protein food", es: "un tipo de carne o proteína" };
  }
  if (label.includes("staples")) {
    return { en: "a basic food", es: "una comida básica" };
  }
  if (label.includes("vegetables")) {
    return { en: "a vegetable", es: "una verdura" };
  }
  if (label.includes("condiments")) {
    return { en: "something used to add flavor to food", es: "algo que se usa para dar sabor a la comida" };
  }
  if (label.includes("fruits")) {
    return { en: "a fruit", es: "una fruta" };
  }
  if (label.includes("prepared foods")) {
    return { en: "a prepared food", es: "una comida preparada" };
  }
  if (label.includes("sweets")) {
    return { en: "a sweet snack or dessert", es: "un bocadillo dulce o postre" };
  }
  if (label.includes("drinks")) {
    return { en: "a drink", es: "una bebida" };
  }
  if (label.includes("containers")) {
    return { en: "something used to hold or carry things", es: "algo que se usa para guardar o llevar cosas" };
  }

  return null;
}

function buildDefinition(term: string, category: string): string {
  const simple = buildSimpleDefinition(term.trim(), category);
  if (simple) return `${term.trim()} is ${simple.en}.`;
  return `${term.trim()} is ${categoryHint(category)}.`;
}

function buildSpanishDefinition(term: string, category: string): string {
  const simple = buildSimpleDefinition(term.trim(), category);
  if (simple) return `${term.trim()} es ${simple.es}.`;
  return `${term.trim()} es ${categoryHintSpanish(category)}.`;
}

function buildExample(term: string, unitTitle: string): string {
  return `We practice the word "${term}" in ${unitTitle}.`;
}

function buildContextualExample(term: string, category: string, unitTitle: string): string {
  const label = category.toLowerCase();
  const termLower = term.toLowerCase();

  // Days of week - vary subjects for exposure
  if (label.includes("days") && ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].includes(term)) {
    const patterns = [
      `I have class on ${term}.`,
      `Maria works on ${term}.`,
      `The store is closed on ${term}.`,
    ];
    return patterns[term.charCodeAt(0) % patterns.length];
  }

  // Months - vary subjects
  if (
    label.includes("months") &&
    ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].includes(term)
  ) {
    const patterns = [
      `My birthday is in ${term}.`,
      `Her son was born in ${term}.`,
      `School starts in ${term}.`,
    ];
    return patterns[term.charCodeAt(0) % patterns.length];
  }

  // Time reference words
  if (term === "Today") return "Today is Monday.";
  if (term === "Tomorrow") return "Tomorrow is my day off.";
  if (term === "Yesterday") return "Yesterday was very cold.";
  if (term === "Week") return "I work five days a week.";
  if (term === "Month") return "Rent is due every month.";
  if (term === "Next") return "I have an appointment next Tuesday.";

  // Family members - vary between I/my and names/pronouns
  if (label.includes("family")) {
    const patterns = [
      `My ${termLower} lives in Boston.`,
      `Her ${termLower} is a teacher.`,
      `Carlos visits his ${termLower} on weekends.`,
    ];
    return patterns[term.charCodeAt(0) % patterns.length];
  }

  // Community places
  if (label.includes("community places")) {
    const patterns = [
      `I went to the ${termLower} yesterday.`,
      `The ${termLower} is on Main Street.`,
      `She works at the ${termLower}.`,
    ];
    return patterns[term.charCodeAt(0) % patterns.length];
  }

  // Occupations
  if (label.includes("occupation")) {
    const patterns = [
      `He works as a ${termLower}.`,
      `My sister is a ${termLower}.`,
      `Ana wants to be a ${termLower}.`,
    ];
    return patterns[term.charCodeAt(0) % patterns.length];
  }

  // Body parts
  if (label.includes("body")) {
    const patterns = [
      `My ${termLower} hurts.`,
      `She hurt her ${termLower}.`,
      `The doctor checked his ${termLower}.`,
    ];
    return patterns[term.charCodeAt(0) % patterns.length];
  }

  // Symptoms
  if (label.includes("symptom")) {
    const patterns = [
      `I have a ${termLower}.`,
      `He has a bad ${termLower}.`,
      `Maria went home with a ${termLower}.`,
    ];
    return patterns[term.charCodeAt(0) % patterns.length];
  }

  // Foods (fruits, vegetables, meats, dairy, etc.)
  if (
    label.includes("food") ||
    label.includes("fruit") ||
    label.includes("vegetable") ||
    label.includes("meat") ||
    label.includes("dairy") ||
    label.includes("grain") ||
    label.includes("staple") ||
    label.includes("prepared") ||
    label.includes("sweet")
  ) {
    const patterns = [
      `I like ${termLower}.`,
      `She bought some ${termLower} at the store.`,
      `We eat ${termLower} for breakfast.`,
    ];
    return patterns[term.charCodeAt(0) % patterns.length];
  }

  // Clothing
  if (label.includes("clothing")) {
    const patterns = [
      `She is wearing a ${termLower}.`,
      `I need to buy a new ${termLower}.`,
      `His ${termLower} is blue.`,
    ];
    return patterns[term.charCodeAt(0) % patterns.length];
  }

  // Civic vocabulary
  if (label.includes("civic")) {
    const patterns = [
      `The ${termLower} is on the ballot.`,
      `I voted for the ${termLower}.`,
      `She is a ${termLower} in the election.`,
    ];
    return patterns[term.charCodeAt(0) % patterns.length];
  }

  // Routines category
  if (label.includes("routine")) {
    return `I check my ${termLower} every morning.`;
  }

  // Shopping & Finance
  if (label.includes("shopping") || label.includes("finance")) {
    const patterns = [
      `I paid with my ${termLower}.`,
      `She keeps her ${termLower} in her wallet.`,
      `The ${termLower} is on the table.`,
    ];
    return patterns[term.charCodeAt(0) % patterns.length];
  }

  // Housing terms
  if (label.includes("housing") || label.includes("rental")) {
    const patterns = [
      `The ${termLower} is very high this year.`,
      `I called the ${termLower} about the problem.`,
      `Our ${termLower} includes utilities.`,
    ];
    return patterns[term.charCodeAt(0) % patterns.length];
  }

  // Parts of house
  if (label.includes("parts of house")) {
    const patterns = [
      `The ${termLower} is upstairs.`,
      `I cleaned the ${termLower} yesterday.`,
      `Her ${termLower} has two windows.`,
    ];
    return patterns[term.charCodeAt(0) % patterns.length];
  }

  // Domestic items
  if (label.includes("domestic")) {
    const patterns = [
      `The ${termLower} is in the living room.`,
      `I need to fix the ${termLower}.`,
      `She bought a new ${termLower}.`,
    ];
    return patterns[term.charCodeAt(0) % patterns.length];
  }

  // Workforce terms
  if (label.includes("workforce")) {
    const patterns = [
      `My ${termLower} is very good.`,
      `She gets her ${termLower} on Friday.`,
      `The ${termLower} starts at 9 AM.`,
    ];
    return patterns[term.charCodeAt(0) % patterns.length];
  }

  // Strength adjectives
  if (label.includes("strength") && label.includes("adjective")) {
    const patterns = [
      `He is very ${termLower}.`,
      `Maria is ${termLower} and ${termLower}.`,
      `They look for ${termLower} workers.`,
    ];
    return patterns[term.charCodeAt(0) % patterns.length];
  }

  // Medicine
  if (label.includes("medicine")) {
    const patterns = [
      `The doctor gave me ${termLower}.`,
      `He takes ${termLower} for his cold.`,
      `I need to pick up my ${termLower}.`,
    ];
    return patterns[term.charCodeAt(0) % patterns.length];
  }

  // Illness
  if (label.includes("illness")) {
    const patterns = [
      `I have the ${termLower}.`,
      `She stayed home with the ${termLower}.`,
      `He went to the doctor for his ${termLower}.`,
    ];
    return patterns[term.charCodeAt(0) % patterns.length];
  }

  // Emergency & facilities
  if (label.includes("emergency") || label.includes("facilities")) {
    const patterns = [
      `The ${termLower} is on the first floor.`,
      `I waited in the ${termLower}.`,
      `She went to the ${termLower}.`,
    ];
    return patterns[term.charCodeAt(0) % patterns.length];
  }

  // Containers
  if (label.includes("container")) {
    const patterns = [
      `I bought a ${termLower} of soup.`,
      `The ${termLower} is on the shelf.`,
      `She opened the ${termLower}.`,
    ];
    return patterns[term.charCodeAt(0) % patterns.length];
  }

  // Drinks
  if (label.includes("drink")) {
    const patterns = [
      `I drink ${termLower} every morning.`,
      `She ordered ${termLower}.`,
      `We have ${termLower} in the fridge.`,
    ];
    return patterns[term.charCodeAt(0) % patterns.length];
  }

  // Condiments
  if (label.includes("condiment") || label.includes("seasoning")) {
    const patterns = [
      `I put ${termLower} on my food.`,
      `She uses ${termLower} for cooking.`,
      `The ${termLower} is on the table.`,
    ];
    return patterns[term.charCodeAt(0) % patterns.length];
  }

  // Messages/communication
  if (label.includes("message")) {
    const patterns = [
      `I sent her a ${termLower}.`,
      `He left a ${termLower} for you.`,
      `Check your ${termLower}.`,
    ];
    return patterns[term.charCodeAt(0) % patterns.length];
  }

  // Prepositions - these need the term IN a sentence, not about the term
  if (label.includes("preposition") || label.includes("adverb")) {
    return `The book is ${termLower} the table.`;
  }

  // Fallback to current generic system (should rarely be used now)
  return `We practice the word "${term}" in ${unitTitle}.`;
}

function getTermText(term: RawTerm): string {
  return typeof term === "string" ? term : term.term;
}

function buildFillBlankSentence(term: string, example: string, unitTitle: string): string {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(escaped, "i");
  if (pattern.test(example)) return example.replace(pattern, "_____");
  return `We practice the word "_____" in ${unitTitle}.`;
}

function buildContextualFillBlank(term: string, category: string, example: string): string {
  const termLower = term.toLowerCase();

  // First try to replace term in the contextual example
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(escaped, "i");
  if (pattern.test(example)) {
    return example.replace(pattern, "_____");
  }

  // If term doesn't appear in example, create a distinct fill-blank sentence
  const label = category.toLowerCase();

  // Days of week
  if (
    label.includes("days") &&
    ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].includes(term)
  ) {
    return "The meeting is on _____.";
  }

  // Months
  if (
    label.includes("months") &&
    ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].includes(term)
  ) {
    return "Her birthday is in _____.";
  }

  // Time reference words
  if (term === "Today") return "_____ is Thursday.";
  if (term === "Tomorrow") return "_____ is my appointment.";
  if (term === "Yesterday") return "_____ I went to the store.";
  if (term === "Week") return "I study three days a _____.";
  if (term === "Month") return "The rent is due each _____.";
  if (term === "Next") return "The class is _____ Monday.";

  // Family members
  if (label.includes("family")) {
    return `His _____ lives nearby.`;
  }

  // Community places
  if (label.includes("community places")) {
    return `The _____ opens at nine.`;
  }

  // Occupations
  if (label.includes("occupation")) {
    return `I want to be a _____.`;
  }

  // Body parts
  if (label.includes("body")) {
    return `The doctor looked at my _____.`;
  }

  // Symptoms
  if (label.includes("symptom")) {
    return `She stayed home because of her _____.`;
  }

  // Foods
  if (
    label.includes("food") ||
    label.includes("fruit") ||
    label.includes("vegetable") ||
    label.includes("meat") ||
    label.includes("dairy") ||
    label.includes("grain") ||
    label.includes("staple") ||
    label.includes("prepared") ||
    label.includes("sweet")
  ) {
    return `I want to buy some _____.`;
  }

  // Clothing
  if (label.includes("clothing")) {
    return `I put on my _____.`;
  }

  // Civic vocabulary
  if (label.includes("civic")) {
    return `The _____ is running for office.`;
  }

  // Shopping & Finance
  if (label.includes("shopping") || label.includes("finance")) {
    return `I need my _____.`;
  }

  // Housing terms
  if (label.includes("housing") || label.includes("rental")) {
    return `The _____ went up this year.`;
  }

  // Parts of house
  if (label.includes("parts of house")) {
    return `The _____ needs to be cleaned.`;
  }

  // Domestic items
  if (label.includes("domestic")) {
    return `Where is the _____?`;
  }

  // Workforce terms
  if (label.includes("workforce")) {
    return `My _____ is important to me.`;
  }

  // Strength adjectives
  if (label.includes("strength") && label.includes("adjective")) {
    return `She is very _____.`;
  }

  // Medicine
  if (label.includes("medicine")) {
    return `I need to take my _____.`;
  }

  // Illness
  if (label.includes("illness")) {
    return `He is sick with the _____.`;
  }

  // Containers
  if (label.includes("container")) {
    return `Open the _____, please.`;
  }

  // Drinks
  if (label.includes("drink")) {
    return `I would like some _____.`;
  }

  // Condiments
  if (label.includes("condiment") || label.includes("seasoning")) {
    return `Please pass the _____.`;
  }

  // Messages/communication
  if (label.includes("message")) {
    return `Did you get my _____?`;
  }

  // Fallback - try replacing term in example anyway
  if (pattern.test(example)) {
    return example.replace(pattern, "_____");
  }

  // Last resort: generic fill-blank
  return `We use the word "_____" in class.`;
}

function buildVocabularyWordList(groups: VocabularyWordListGroup[]): VocabularyWordListContent {
  return {
    cards: groups.flatMap((group) => group.cards),
    groups,
  };
}

// NEW: Theme mapping configuration for each unit
// Maps original categories into thematic learning groups
const THEME_MAPPINGS: Record<string, Array<{
  id: string;
  title: string;
  description: string;
  icon: string;
  categoryLabels: string[];
  estimatedMinutes: number;
}>> = {
  "unit-1": [
    {
      id: "me-and-my-identity",
      title: "Me & My Identity",
      description: "Learn to introduce yourself and talk about who you are",
      icon: "👤",
      categoryLabels: ["Personal Information", "Possessive Adjectives"],
      estimatedMinutes: 15,
    },
    {
      id: "people-and-pronouns",
      title: "People & Pronouns",
      description: "Talk about other people using the right words",
      icon: "👥",
      categoryLabels: ["People", "Pronouns", "Contractions"],
      estimatedMinutes: 10,
    },
    {
      id: "time-and-numbers",
      title: "Time & Numbers",
      description: "Tell time and count in English",
      icon: "🕐",
      categoryLabels: ["Time of Day", "Numbers"],
      estimatedMinutes: 10,
    },
    {
      id: "learning-tools",
      title: "Learning Tools",
      description: "Name common classroom objects and supplies",
      icon: "📚",
      categoryLabels: ["Classroom", "Other"],
      estimatedMinutes: 8,
    },
  ],
  "unit-2": [
    {
      id: "calendar-and-time",
      title: "Calendar & Time",
      description: "Days, months, and daily schedules",
      icon: "📅",
      categoryLabels: ["Days and Months", "Routines"],
      estimatedMinutes: 15,
    },
    {
      id: "my-family",
      title: "My Family",
      description: "Talk about family members and relationships",
      icon: "👨‍👩‍👧‍👦",
      categoryLabels: ["Family"],
      estimatedMinutes: 12,
    },
    {
      id: "classroom-and-appearance",
      title: "Classroom & Appearance",
      description: "Describe people and classroom items",
      icon: "✏️",
      categoryLabels: ["Classroom", "Descriptions (Physical)", "Adjectives"],
      estimatedMinutes: 12,
    },
  ],
  "unit-3": [
    {
      id: "civic-life",
      title: "Civic Life",
      description: "Voting and community participation",
      icon: "🗳️",
      categoryLabels: ["Civic Vocabulary"],
      estimatedMinutes: 8,
    },
    {
      id: "places-and-services",
      title: "Places & Services",
      description: "Important locations and community resources",
      icon: "🏢",
      categoryLabels: ["Community Places", "Community Services / Needs"],
      estimatedMinutes: 15,
    },
    {
      id: "communication-and-directions",
      title: "Communication & Directions",
      description: "Give directions and send messages",
      icon: "💬",
      categoryLabels: ["Messages", "Adverbs of Location", "Prepositions (Location)", "Adverbs of Frequency"],
      estimatedMinutes: 12,
    },
    {
      id: "celebrations",
      title: "Celebrations",
      description: "Thanksgiving vocabulary",
      icon: "🦃",
      categoryLabels: ["Thanksgiving"],
      estimatedMinutes: 5,
    },
  ],
  "unit-4": [
    {
      id: "what-i-wear",
      title: "What I Wear",
      description: "Clothing and sizes",
      icon: "👔",
      categoryLabels: ["Clothing", "Quantifiers"],
      estimatedMinutes: 12,
    },
    {
      id: "products-and-money",
      title: "Products & Money",
      description: "Shopping, paying, and financial transactions",
      icon: "💳",
      categoryLabels: ["Products", "Shopping & Finance"],
      estimatedMinutes: 15,
    },
    {
      id: "holidays",
      title: "Holidays",
      description: "Christmas vocabulary",
      icon: "🎄",
      categoryLabels: ["Christmas"],
      estimatedMinutes: 5,
    },
  ],
  "unit-5": [
    {
      id: "renting-and-managing",
      title: "Renting & Managing",
      description: "Find housing and handle rental issues",
      icon: "🏠",
      categoryLabels: ["Housing & Rental"],
      estimatedMinutes: 15,
    },
    {
      id: "rooms-and-spaces",
      title: "Rooms & Spaces",
      description: "Parts of a home or apartment",
      icon: "🚪",
      categoryLabels: ["Parts of House"],
      estimatedMinutes: 12,
    },
    {
      id: "furniture-and-appliances",
      title: "Furniture & Appliances",
      description: "Household items and where they go",
      icon: "🛋️",
      categoryLabels: ["Domestic Things", "Prepositions of Location"],
      estimatedMinutes: 15,
    },
  ],
  "unit-6-7": [
    {
      id: "finding-work",
      title: "Finding Work",
      description: "Job search and application process",
      icon: "📝",
      categoryLabels: ["Workforce Terminology"],
      estimatedMinutes: 15,
    },
    {
      id: "on-the-job",
      title: "On the Job",
      description: "Workplace language and expectations",
      icon: "💼",
      categoryLabels: ["Workforce Terminology"],
      estimatedMinutes: 12,
    },
    {
      id: "my-skills",
      title: "My Skills",
      description: "Talk about your strengths and abilities",
      icon: "💪",
      categoryLabels: ["Strengths", "Strength Adjectives"],
      estimatedMinutes: 10,
    },
    {
      id: "occupations",
      title: "Occupations",
      description: "Common job titles and professions",
      icon: "👷",
      categoryLabels: ["Occupations"],
      estimatedMinutes: 15,
    },
  ],
  "unit-8": [
    {
      id: "my-body",
      title: "My Body",
      description: "Body parts and physical wellness",
      icon: "🧍",
      categoryLabels: ["Body Parts", "Exercise"],
      estimatedMinutes: 12,
    },
    {
      id: "feeling-sick",
      title: "Feeling Sick",
      description: "Describe symptoms and illnesses",
      icon: "🤒",
      categoryLabels: ["Symptoms", "Illness"],
      estimatedMinutes: 12,
    },
    {
      id: "getting-care",
      title: "Getting Care",
      description: "Medical facilities, medicine, and appointments",
      icon: "🏥",
      categoryLabels: ["Medicine", "Emergency & Facilities", "Other Medical"],
      estimatedMinutes: 12,
    },
  ],
  "unit-9": [
    {
      id: "food-groups",
      title: "Food Groups & Nutrition",
      description: "Healthy eating and food labels",
      icon: "🥗",
      categoryLabels: ["Food Groups", "Other Wellness"],
      estimatedMinutes: 10,
    },
    {
      id: "breakfast-and-basics",
      title: "Breakfast & Basics",
      description: "Grains, dairy, and staple foods",
      icon: "🥛",
      categoryLabels: ["Grains & Breakfast", "Dairy & Eggs", "Staples"],
      estimatedMinutes: 12,
    },
    {
      id: "fresh-foods",
      title: "Fresh Foods",
      description: "Vegetables, fruits, and proteins",
      icon: "🍎",
      categoryLabels: ["Vegetables", "Fruits", "Meats & Proteins"],
      estimatedMinutes: 15,
    },
    {
      id: "cooking-and-eating",
      title: "Cooking & Eating",
      description: "Condiments, prepared foods, and meals",
      icon: "🍳",
      categoryLabels: ["Condiments & Seasoning", "Prepared Foods"],
      estimatedMinutes: 10,
    },
    {
      id: "treats-and-storage",
      title: "Treats & Storage",
      description: "Snacks, sweets, drinks, and containers",
      icon: "🍪",
      categoryLabels: ["Sweets & Snacks", "Drinks", "Containers"],
      estimatedMinutes: 10,
    },
  ],
};

function buildUnit(rawUnit: RawUnit): PublicLevel1VocabularyUnit {
  const seen = new Set<string>();
  const categories: Array<{ label: string; spanishLabel: string; cards: PublicLevel1VocabularyCard[] }> = [];

  for (const category of rawUnit.categories) {
    const cards: PublicLevel1VocabularyCard[] = [];
    for (const rawTerm of category.terms) {
      const term = getTermText(rawTerm);
      const normalized = normalizeTerm(term);
      if (seen.has(normalized)) continue;
      seen.add(normalized);
      const englishDefinition =
        typeof rawTerm === "string" ? buildDefinition(term, category.label) : rawTerm.englishDefinition;
      const spanishDefinition =
        typeof rawTerm === "string" ? buildSpanishDefinition(term, category.label) : rawTerm.spanishDefinition;
      const example =
        typeof rawTerm === "string"
          ? buildContextualExample(term, category.label, rawUnit.title)
          : rawTerm.example ?? buildContextualExample(term, category.label, rawUnit.title);
      // For fill-blank: use custom fillBlankSentence if provided
      const fillBlankSentence =
        typeof rawTerm === "object" && rawTerm.fillBlankSentence ? rawTerm.fillBlankSentence : undefined;
      cards.push({
        term,
        definition: englishDefinition,
        englishDefinition,
        spanishDefinition,
        example,
        fillBlankSentence,
        category: category.label,
      });
    }
    if (cards.length > 0) categories.push({ label: category.label, spanishLabel: categoryLabelSpanish(category.label), cards });
  }

  const allCards = categories.flatMap((category) => category.cards);
  const groups: VocabularyWordListGroup[] = categories.map((category) => ({
    id: slugify(category.label),
    label: category.label,
    cards: category.cards.map((card) => ({
      term: card.term,
      definition: card.definition,
      example: card.example,
    })),
  }));

  // NEW: Build themes from theme mappings
  const themeConfigs = THEME_MAPPINGS[rawUnit.slug] || [];
  const themes: VocabTheme[] = themeConfigs.map((config) => {
    const themeCards: PublicLevel1VocabularyCard[] = [];
    for (const categoryLabel of config.categoryLabels) {
      const category = categories.find((cat) => cat.label === categoryLabel);
      if (category) {
        themeCards.push(...category.cards);
      }
    }
    return {
      id: config.id,
      title: config.title,
      description: config.description,
      icon: config.icon,
      categories: config.categoryLabels,
      cards: themeCards,
      estimatedMinutes: config.estimatedMinutes,
    };
  });

  return {
    slug: rawUnit.slug,
    title: rawUnit.title,
    theme: rawUnit.theme,
    categories,
    themes: themes.length > 0 ? themes : undefined, // Only add if themes exist
    totalCards: allCards.length,
    content: {
      type: "vocabulary",
      wordList: buildVocabularyWordList(groups),
      flashcards: {
        cards: allCards.map((card) => ({
          term: card.term,
          definition: `${card.englishDefinition} / ${card.spanishDefinition}`,
          example: card.example,
        })),
      },
      matching: {
        pairs: allCards.map((card, index) => ({
          id: index + 1,
          term: card.term,
          definition: `${card.englishDefinition} / ${card.spanishDefinition}`,
        })),
      },
      fillInBlank: {
        sentences: allCards.map((card, index) => {
          const options = [card.term];
          let cursor = 1;
          while (options.length < Math.min(4, allCards.length)) {
            const candidate = allCards[(index + cursor) % allCards.length]?.term;
            if (candidate && !options.includes(candidate)) options.push(candidate);
            cursor += 1;
          }
          // Use custom fillBlankSentence if available, fallback to generated
          const sentenceText = card.fillBlankSentence
            ? card.fillBlankSentence
            : buildContextualFillBlank(card.term, card.category, card.example);
          return {
            id: `${rawUnit.slug}-blank-${index + 1}`,
            text: sentenceText,
            blanks: [card.term],
            correctAnswers: [card.term],
            options,
            explanation: `${card.englishDefinition} / ${card.spanishDefinition}`,
          };
        }),
      },
    },
  };
}

export const LEVEL1_PUBLIC_VOCAB_UNITS: PublicLevel1VocabularyUnit[] = RAW_LEVEL1_UNITS.map(buildUnit);

export function getLevel1PublicVocabUnit(unitSlug: string): PublicLevel1VocabularyUnit | undefined {
  return LEVEL1_PUBLIC_VOCAB_UNITS.find((unit) => unit.slug === unitSlug);
}

// NEW: Get a specific theme from a unit
export function getLevel1PublicVocabTheme(unitSlug: string, themeId: string): VocabTheme | undefined {
  const unit = getLevel1PublicVocabUnit(unitSlug);
  return unit?.themes?.find((theme) => theme.id === themeId);
}
