import type {
  VocabularyContent,
} from "@/types/activity";
import { LEVEL1_VOCAB_CUSTOM_EXAMPLES } from "./level1-vocab-custom-examples";

type VocabularyWordListGroup = {
  id: string;
  label: string;
  cards: Array<{
    term: string;
    definition: string;
    example?: string;
    pos?: string;
  }>;
};

type VocabularyWordListContent = {
  cards?: Array<{
    term: string;
    definition: string;
    example?: string;
    pos?: string;
  }>;
  groups?: VocabularyWordListGroup[];
  [key: string]: unknown;
};

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
  imageUrl?: string; // Photo URL from merged vocab-images (generated + vocab-images-overrides.ts)
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
        { term: "Name", englishDefinition: "the words people use to identify you, including your first name and last name", spanishDefinition: "nombre", example: "My name is Ana Garcia.", fillBlankSentence: "What is your first _____?" },
        { term: "City", englishDefinition: "a large town where people live and work", spanishDefinition: "ciudad", example: "I live in the city of Boston.", fillBlankSentence: "I live in the _____ of Boston." },
        { term: "Country", englishDefinition: "a nation, such as the United States or Mexico", spanishDefinition: "país", example: "My country is El Salvador.", fillBlankSentence: "My _____ is El Salvador." },
        { term: "Address", englishDefinition: "the place where you live or receive mail", spanishDefinition: "dirección", example: "Please write your address on the form.", fillBlankSentence: "My _____ is 45 Oak Street, Apartment 2." },
        { term: "Street", englishDefinition: "the road where a house or building is located", spanishDefinition: "calle", example: "Our apartment is on Main Street.", fillBlankSentence: "My apartment is on Oak _____." },
        { term: "Phone number", englishDefinition: "the set of numbers people use to call you", spanishDefinition: "número de teléfono", example: "My phone number is on the paper.", fillBlankSentence: "My _____ is 617-555-0123." },
        { term: "State", englishDefinition: "one of the main regions of a country, such as Massachusetts", spanishDefinition: "estado", example: "Massachusetts is the state where I live.", fillBlankSentence: "I live in the _____ of Massachusetts." },
        { term: "Zip code", englishDefinition: "the postal code used for mail in an area", spanishDefinition: "código postal", example: "The zip code for this address is 02118.", fillBlankSentence: "The _____ for this area is 02118." },
        { term: "Job", englishDefinition: "the work a person does to earn money", spanishDefinition: "trabajo", example: "My job is cleaning offices.", fillBlankSentence: "My _____ is cleaning offices at the hospital." },
        { term: "Age", englishDefinition: "how many years a person has lived", spanishDefinition: "edad", example: "Her age is thirty-two.", fillBlankSentence: "His _____ is twenty-eight." },
        { term: "Birthday", englishDefinition: "the day each year when you were born", spanishDefinition: "cumpleaños", example: "My birthday is in July.", fillBlankSentence: "When is your _____?" },
        { term: "Years old", englishDefinition: "used to say a person's age in years", spanishDefinition: "años", example: "I am twenty-five years old.", fillBlankSentence: "I am twenty-five _____." },
        { term: "Single", englishDefinition: "not married", spanishDefinition: "soltero o soltera; no casado", example: "She is single.", fillBlankSentence: "He has never been married. He is _____." },
        { term: "Married", englishDefinition: "having a husband or wife", spanishDefinition: "casado o casada", example: "She is married and has two children.", fillBlankSentence: "She and her husband live together. She is _____." },
        { term: "Divorced", englishDefinition: "no longer married after ending a marriage", spanishDefinition: "divorciado o divorciada; ya no casado", example: "He is divorced.", fillBlankSentence: "They ended their marriage last year. Now they are _____." },
      ] },
      { label: "Time of Day", terms: [
        { term: "Morning", englishDefinition: "the early part of the day before noon", spanishDefinition: "la mañana; la parte temprana del día antes del mediodía", example: "I study English in the morning.", fillBlankSentence: "Good _____! Did you sleep well?" },
        { term: "Afternoon", englishDefinition: "the part of the day after noon and before evening", spanishDefinition: "la tarde; la parte del día después del mediodía", example: "We have class in the afternoon.", fillBlankSentence: "It is 2:00 in the _____." },
        { term: "Evening", englishDefinition: "the later part of the day before night", spanishDefinition: "la tarde-noche; la parte final del día antes de dormir", example: "I cook dinner in the evening.", fillBlankSentence: "We eat dinner at 7:00 in the _____." },
        { term: "Night", englishDefinition: "the dark part of the day when people usually sleep", spanishDefinition: "la noche; la parte oscura del día", example: "The children sleep at night.", fillBlankSentence: "Good _____! See you tomorrow." },
      ] },
      { label: "People", terms: [
        { term: "Man", englishDefinition: "an adult male person", spanishDefinition: "un hombre; una persona adulta de sexo masculino", example: "The man is my teacher.", fillBlankSentence: "That _____ over there is my teacher." },
        { term: "Men", englishDefinition: "more than one adult male person", spanishDefinition: "hombres; más de un hombre", example: "The men are waiting outside.", fillBlankSentence: "The _____ in this class are from Mexico." },
        { term: "Woman", englishDefinition: "an adult female person", spanishDefinition: "una mujer; una persona adulta de sexo femenino", example: "The woman is my neighbor.", fillBlankSentence: "That _____ at the front desk is my neighbor." },
        { term: "Women", englishDefinition: "more than one adult female person", spanishDefinition: "mujeres; más de una mujer", example: "The women are in the office.", fillBlankSentence: "The _____ are discussing the project." },
      ] },
      { label: "Pronouns", terms: [
        { term: "I", englishDefinition: "the word a speaker uses to talk about himself or herself", spanishDefinition: "yo; la palabra que usa una persona para hablar de sí misma", example: "I am a student.", fillBlankSentence: "_____ am a student from El Salvador." },
        { term: "You", englishDefinition: "the word used to talk to another person or people", spanishDefinition: "tú, usted, ustedes; la palabra que se usa para hablar con otra persona", example: "You are in my class.", fillBlankSentence: "_____ are a good teacher." },
        { term: "He", englishDefinition: "the word used for a male person", spanishDefinition: "él; la palabra que se usa para un hombre o niño", example: "He is my brother.", fillBlankSentence: "Carlos is my friend. _____ is from Mexico." },
        { term: "She", englishDefinition: "the word used for a female person", spanishDefinition: "ella; la palabra que se usa para una mujer o niña", example: "She is my friend.", fillBlankSentence: "Maria is my teacher. _____ is very kind." },
        { term: "It", englishDefinition: "the word used for a thing, animal, or idea", spanishDefinition: "eso o ello; la palabra que se usa para una cosa, animal o idea", example: "It is my book.", fillBlankSentence: "_____ is a nice day today." },
        { term: "We", englishDefinition: "the word used for the speaker and another person or people", spanishDefinition: "nosotros o nosotras; la palabra para un grupo que te incluye", example: "We are ready.", fillBlankSentence: "My classmate and I study together. _____ practice every day." },
        { term: "They", englishDefinition: "the word used for other people or things", spanishDefinition: "ellos o ellas; la palabra para otras personas o cosas", example: "They are my classmates.", fillBlankSentence: "The students finished early. _____ went home." },
      ] },
      { label: "Contractions", terms: [
        { term: "I'm", englishDefinition: "the short form of I am", spanishDefinition: "la forma corta de I am; significa yo soy o yo estoy", example: "I'm from Brazil.", fillBlankSentence: "_____ a teacher in this school." },
      ] },
      { label: "Possessive Adjectives", terms: [
        { term: "My", englishDefinition: "used to show something belongs to me", spanishDefinition: "mi; se usa para mostrar que algo me pertenece", example: "My teddy bear is blue.", fillBlankSentence: "I love _____ family very much." },
        { term: "Your", englishDefinition: "used to show something belongs to you", spanishDefinition: "tu o su; se usa para mostrar que algo te pertenece", example: "Here is your gift.", fillBlankSentence: "Please write _____ name on the paper." },
        { term: "His", englishDefinition: "used to show something belongs to a man or boy", spanishDefinition: "su, de él; se usa para mostrar que algo le pertenece a un hombre", example: "His car is black.", fillBlankSentence: "Carlos finished _____ homework." },
        { term: "Her", englishDefinition: "used to show something belongs to a woman or girl", spanishDefinition: "su, de ella; se usa para mostrar que algo le pertenece a una mujer", example: "Here is her gift.", fillBlankSentence: "Maria forgot _____ backpack today." },
        { term: "Our", englishDefinition: "used to show something belongs to us", spanishDefinition: "nuestro o nuestra; se usa para mostrar que algo nos pertenece", example: "Our baby is one year old.", fillBlankSentence: "We love _____ new apartment." },
        { term: "Their", englishDefinition: "used to show something belongs to them", spanishDefinition: "su, de ellos o de ellas; se usa para mostrar que algo les pertenece", example: "Their family is large.", fillBlankSentence: "The students ate _____ lunch outside." },
      ] },
      { label: "Numbers", terms: [
        { term: "One", englishDefinition: "the number 1", spanishDefinition: "uno; el número 1", example: "I have one pencil.", fillBlankSentence: "There is _____ person in the office." },
        { term: "Two", englishDefinition: "the number 2", spanishDefinition: "dos; el número 2", example: "She has two children.", fillBlankSentence: "I have a left hand and a right hand. That is _____ hands." },
        { term: "Three", englishDefinition: "the number 3", spanishDefinition: "tres; el número 3", example: "We need three chairs.", fillBlankSentence: "Red, yellow, and blue. That is _____ colors." },
        { term: "Four", englishDefinition: "the number 4", spanishDefinition: "cuatro; el número 4", example: "There are four books on the desk.", fillBlankSentence: "A car has _____ wheels." },
        { term: "Five", englishDefinition: "the number 5", spanishDefinition: "cinco; el número 5", example: "Class starts in five minutes.", fillBlankSentence: "I have _____ fingers on one hand." },
        { term: "Six", englishDefinition: "the number 6", spanishDefinition: "seis; el número 6", example: "I work six days a week.", fillBlankSentence: "I work Monday to Saturday. That is _____ days." },
        { term: "Seven", englishDefinition: "the number 7", spanishDefinition: "siete; el número 7", example: "My son is seven years old.", fillBlankSentence: "There are _____ days in a week." },
        { term: "Eight", englishDefinition: "the number 8", spanishDefinition: "ocho; el número 8", example: "There are eight students here.", fillBlankSentence: "A spider has _____ legs." },
        { term: "Nine", englishDefinition: "the number 9", spanishDefinition: "nueve; el número 9", example: "The bus comes at nine.", fillBlankSentence: "A woman is pregnant for _____ months." },
        { term: "Ten", englishDefinition: "the number 10", spanishDefinition: "diez; el número 10", example: "I have ten dollars.", fillBlankSentence: "I have _____ fingers on both hands." },
      ] },
      { label: "Classroom", terms: [
        { term: "Paper", englishDefinition: "thin material used for writing or printing", spanishDefinition: "papel; material delgado que se usa para escribir o imprimir", example: "Write your answer on the paper.", fillBlankSentence: "Please give me a piece of _____." },
        { term: "Book", englishDefinition: "something with pages that you read", spanishDefinition: "un libro; algo con páginas que lees", example: "Open your book to page three.", fillBlankSentence: "I borrowed a _____ from the library to read at home." },
        { term: "Pen", englishDefinition: "a tool used for writing with ink", spanishDefinition: "bolígrafo o pluma; un objeto para escribir con tinta", example: "Please use a pen.", fillBlankSentence: "I write with a _____." },
        { term: "Notebook", englishDefinition: "a book of blank or lined pages for writing notes", spanishDefinition: "cuaderno; libro con páginas para escribir apuntes", example: "My notebook is in my bag.", fillBlankSentence: "I bought a blank _____ to take notes in class." },
        { term: "Textbook", englishDefinition: "a school book used in class", spanishDefinition: "un libro de texto; un libro escolar que se usa en clase", example: "The textbook is on the desk.", fillBlankSentence: "The _____ has fifteen chapters." },
        { term: "Workbook", englishDefinition: "a practice book with exercises and questions", spanishDefinition: "cuaderno de ejercicios; libro con práctica y preguntas", example: "Finish page five in the workbook.", fillBlankSentence: "Complete the exercises in the _____." },
        { term: "Board", englishDefinition: "the large surface in a classroom where a teacher writes", spanishDefinition: "pizarra o tablero; la superficie grande donde escribe el maestro", example: "The answer is on the board.", fillBlankSentence: "The teacher writes on the _____ with a marker." },
      ] },
      { label: "Other", terms: [
        { term: "Food", englishDefinition: "things people eat", spanishDefinition: "comida; cosas que la gente come", example: "My favorite food is rice.", fillBlankSentence: "Pizza is my favorite _____." },
        { term: "Favorite", englishDefinition: "liked more than other things", spanishDefinition: "favorito o favorita; lo que más te gusta", example: "Blue is my favorite color.", fillBlankSentence: "What is your _____ sport?" },
        { term: "Old", englishDefinition: "having lived many years or not new", spanishDefinition: "viejo o mayor; con muchos años o no nuevo", example: "My grandfather is old.", fillBlankSentence: "This car is 20 years _____." },
      ] },
    ],
  },
  {
    slug: "unit-2",
    title: "Unit 2: Daily Life in the Community",
    theme: "Daily routines, family, and classroom language",
    categories: [
      { label: "Days and Months", terms: [
        { term: "Sunday", englishDefinition: "The first day of the week, often a day for rest or family time.", spanishDefinition: "El primer día de la semana, a menudo un día de descanso o tiempo en familia.", example: "On Sunday, I go grocery shopping for the whole week.", fillBlankSentence: "The first day of the week is _____." },
        { term: "Monday", englishDefinition: "The second day of the week and the beginning of the traditional work week.", spanishDefinition: "El segundo día de la semana y el comienzo de la semana laboral tradicional.", example: "I start my work shift early every Monday morning.", fillBlankSentence: "School starts again on _____ after the weekend." },
        { term: "Tuesday", englishDefinition: "The third day of the week, following Monday.", spanishDefinition: "El tercer día de la semana, siguiendo al lunes.", example: "Our English class meets every Tuesday evening.", fillBlankSentence: "_____ is the day after Monday." },
        { term: "Wednesday", englishDefinition: "The fourth day of the week, often called 'hump day' because it is in the middle.", spanishDefinition: "El cuarto día de la semana, a menudo llamado el medio de la semana.", example: "I have a meeting with my supervisor on Wednesday.", fillBlankSentence: "_____ is in the middle of the work week." },
        { term: "Thursday", englishDefinition: "The fifth day of the week, occurring between Wednesday and Friday.", spanishDefinition: "El quinto día de la semana, que ocurre entre el miércoles y el viernes.", example: "The trash is collected on Thursday mornings.", fillBlankSentence: "_____ comes right before Friday." },
        { term: "Friday", englishDefinition: "The sixth day of the week, often the last day of work for many people.", spanishDefinition: "El sexto día de la semana, a menudo el último día de trabajo para muchas personas.", example: "I usually get my paycheck on Friday afternoon.", fillBlankSentence: "The last work day of the week is _____." },
        { term: "Saturday", englishDefinition: "The seventh day of the week and part of the weekend.", spanishDefinition: "El séptimo día de la semana y parte del fin de semana.", example: "On Saturday, I take my children to the park.", fillBlankSentence: "_____ and Sunday make up the weekend." },
        { term: "January", englishDefinition: "The first month of the year, starting on New Year's Day.", spanishDefinition: "El primer mes del año, que comienza el día de Año Nuevo.", example: "The weather is very cold in Massachusetts in January.", fillBlankSentence: "The new year begins in _____." },
        { term: "February", englishDefinition: "The second month of the year, known for being the shortest month.", spanishDefinition: "El segundo mes del año, conocido por ser el mes más corto.", example: "Valentine's Day is a holiday in February.", fillBlankSentence: "_____ is the shortest month of the year." },
        { term: "March", englishDefinition: "The third month of the year, when the spring season begins.", spanishDefinition: "El tercer mes del año, cuando comienza la temporada de primavera.", example: "The weather starts to get warmer in March.", fillBlankSentence: "Spring begins in _____." },
        { term: "April", englishDefinition: "The fourth month of the year, often associated with rain and taxes.", spanishDefinition: "El cuarto mes del año, a menudo asociado con la lluvia y los impuestos.", example: "Federal income taxes are due in April.", fillBlankSentence: "Tax forms are due in _____." },
        { term: "May", englishDefinition: "The fifth month of the year, known for many flowers and Mother's Day.", spanishDefinition: "El quinto mes del año, conocido por muchas flores y el Día de la Madre.", example: "We celebrate Mother's Day on the second Sunday of May.", fillBlankSentence: "Mother's Day is celebrated in _____." },
        { term: "June", englishDefinition: "The sixth month of the year, when the summer season starts.", spanishDefinition: "El sexto mes del año, cuando comienza la temporada de verano.", example: "Many students graduate from school in June.", fillBlankSentence: "Summer begins in the month of _____." },
        { term: "July", englishDefinition: "The seventh month of the year, when Independence Day is celebrated.", spanishDefinition: "El séptimo mes del año, cuando se celebra el Día de la Independencia.", example: "Independence Day is on July 4th in the United States.", fillBlankSentence: "Independence Day is on the 4th of _____." },
        { term: "August", englishDefinition: "The eighth month of the year and the last full month of summer.", spanishDefinition: "El octavo mes del año y el último mes completo de verano.", example: "Many families go on vacation in August.", fillBlankSentence: "_____ is the last full month of summer." },
        { term: "September", englishDefinition: "The ninth month of the year, when many schools begin.", spanishDefinition: "El noveno mes del año, cuando comienzan muchas escuelas.", example: "The fall season begins in September.", fillBlankSentence: "School starts in _____ in the United States." },
        { term: "October", englishDefinition: "The tenth month of the year, known for fall colors and Halloween.", spanishDefinition: "El décimo mes del año, conocido por los colores de otoño y Halloween.", example: "The leaves change color in October.", fillBlankSentence: "Halloween is celebrated in the month of _____." },
        { term: "November", englishDefinition: "The eleventh month of the year, when Thanksgiving is celebrated.", spanishDefinition: "El undécimo mes del año, cuando se celebra el Día de Acción de Gracias.", example: "We eat a large dinner on Thanksgiving in November.", fillBlankSentence: "Thanksgiving is in _____." },
        { term: "December", englishDefinition: "The twelfth and last month of the year, when winter begins.", spanishDefinition: "El duodécimo y último mes del año, cuando comienza el invierno.", example: "December is the month when we celebrate Christmas.", fillBlankSentence: "The year ends in the month of _____." },
        { term: "Week", englishDefinition: "A period of seven days, usually from Sunday to Saturday.", spanishDefinition: "Un período de siete días, generalmente de domingo a sábado.", example: "I work forty hours every week.", fillBlankSentence: "There are seven days in one _____." },
        { term: "Month", englishDefinition: "A period of about four weeks; there are twelve months in a year.", spanishDefinition: "Un período de unas cuatro semanas; hay doce meses en un año.", example: "Rent is due on the first day of every month.", fillBlankSentence: "February is the shortest _____ of the year." },
        { term: "Today", englishDefinition: "This present day; the day that is happening now.", spanishDefinition: "Este día presente; el día que está sucediendo ahora.", example: "Today is a busy day at work.", fillBlankSentence: "_____ is Tuesday, so English class is tonight." },
        { term: "Tomorrow", englishDefinition: "The day after today.", spanishDefinition: "El día después de hoy.", example: "I have a dentist appointment tomorrow morning.", fillBlankSentence: "_____ is the day after today." },
        { term: "Yesterday", englishDefinition: "The day before today.", spanishDefinition: "El día antes de hoy.", example: "Yesterday was a holiday, so the bank was closed.", fillBlankSentence: "I forgot my homework _____, so I brought it today." },
        { term: "Next", englishDefinition: "Coming immediately after this time or event.", spanishDefinition: "Viniendo inmediatamente después de este tiempo o evento.", example: "We will visit our family next month.", fillBlankSentence: "We will have a test _____ Monday." },
      ] },
      { label: "Routines", terms: [
        { term: "Time", englishDefinition: "The measurement of hours and minutes; used to know when something happens.", spanishDefinition: "La medida de horas y minutos; se usa para saber cuándo sucede algo.", example: "It is important to be on time for your work shift.", fillBlankSentence: "What _____ does the bus come?" },
        { term: "Schedule", englishDefinition: "A plan that shows when activities or work shifts will happen.", spanishDefinition: "Un plan que muestra cuándo sucederán las actividades o los turnos de trabajo.", example: "My work schedule changes every two weeks.", fillBlankSentence: "My work _____ changes every two weeks." },
        { term: "Calendar", englishDefinition: "A chart or book used to track days, weeks, and months of the year.", spanishDefinition: "Una tabla o libro utilizado para realizar un seguimiento de los días, semanas y meses del año.", example: "I marked the parent-teacher meeting on my calendar.", fillBlankSentence: "I wrote the appointment on my _____." },
        { term: "Appointment", englishDefinition: "A formal arrangement to meet someone at a specific time, like a doctor or lawyer.", spanishDefinition: "Un arreglo formal para reunirse con alguien a una hora específica, como un médico o abogado.", example: "I have a medical appointment for my daughter at 3:00 PM.", fillBlankSentence: "I need to make an _____ with my doctor." },
        { term: "Half", englishDefinition: "One of two equal parts of something; thirty minutes of an hour.", spanishDefinition: "Una de dos partes iguales de algo; treinta minutos de una hora.", example: "The English class starts at half past six.", fillBlankSentence: "The meeting starts at _____ past nine." },
        { term: "Hour", englishDefinition: "A unit of time equal to sixty minutes.", spanishDefinition: "Una unidad de tiempo igual a sesenta minutos.", example: "My commute to work takes about one hour by bus.", fillBlankSentence: "The bus ride takes about one _____." },
        { term: "Minute", englishDefinition: "A short unit of time; there are sixty minutes in one hour.", spanishDefinition: "Una unidad corta de tiempo; hay sesenta minutos en una hora.", example: "Please wait one minute while I find my identification.", fillBlankSentence: "Please wait one _____ — I am almost ready." },
        { term: "Breakfast", englishDefinition: "The first meal of the day, usually eaten in the morning.", spanishDefinition: "La primera comida del día, generalmente consumida por la mañana.", example: "I eat a quick breakfast before I leave for work.", fillBlankSentence: "I eat _____ every morning before work." },
        { term: "Lunch", englishDefinition: "A meal eaten in the middle of the day, often during a work break.", spanishDefinition: "Una comida consumida a mitad del día, a menudo durante un descanso laboral.", example: "I brought a sandwich from home for my lunch break.", fillBlankSentence: "I eat _____ at noon." },
        { term: "Dinner", englishDefinition: "The main meal of the day, usually eaten in the evening with family.", spanishDefinition: "La comida principal del día, generalmente consumida por la noche con la familia.", example: "Our family eats dinner together after I get home from work.", fillBlankSentence: "Our family eats _____ together at 7 p.m." },
        { term: "Shower", englishDefinition: "Cleaning your body with a spray of water.", spanishDefinition: "Limpiar tu cuerpo con un chorro de agua.", example: "I take a shower every morning to wake up before school.", fillBlankSentence: "I take a _____ every morning before school." },
        { term: "O'clock", englishDefinition: "Used with numbers from one to twelve to tell the exact hour.", spanishDefinition: "Se usa con números del uno al doce para decir la hora exacta.", example: "My work shift begins at exactly eight o'clock.", fillBlankSentence: "Class starts at eight _____." },
      ] },
      { label: "Family", terms: [
        { term: "Father", englishDefinition: "A male parent; can also be called dad or papa.", spanishDefinition: "padre", example: "My father works as a mechanic in my home country.", fillBlankSentence: "My _____ is my mother's husband." },
        { term: "Mother", englishDefinition: "A female parent; can also be called mom or mama.", spanishDefinition: "madre", example: "My mother is visiting us for two weeks next month.", fillBlankSentence: "My _____ gave birth to me and my sister." },
        { term: "Sister", englishDefinition: "A female person who has the same parents as another person.", spanishDefinition: "hermana", example: "My sister lives in New York and works at a hospital.", fillBlankSentence: "I have one brother and one _____." },
        { term: "Brother", englishDefinition: "A male person who has the same parents as another person.", spanishDefinition: "hermano", example: "My brother is looking for a new job in construction.", fillBlankSentence: "I have one sister and one _____." },
        { term: "Son", englishDefinition: "A male child of a parent.", spanishDefinition: "hijo", example: "My son is in the first grade at the local elementary school.", fillBlankSentence: "He is my _____. I am his father." },
        { term: "Daughter", englishDefinition: "A female child of a parent.", spanishDefinition: "hija", example: "My daughter wants to study nursing when she finishes high school.", fillBlankSentence: "She is my _____. I am her mother." },
        { term: "Cousin", englishDefinition: "The child of your aunt or uncle.", spanishDefinition: "primo o prima", example: "My cousin and I live in the same apartment building.", fillBlankSentence: "My _____ is my aunt's child." },
        { term: "Uncle", englishDefinition: "The brother of your mother or father, or the husband of your aunt.", spanishDefinition: "tío", example: "My uncle helped me find my first job in the United States.", fillBlankSentence: "My _____ is my mother's brother." },
        { term: "Aunt", englishDefinition: "The sister of your mother or father, or the wife of your uncle.", spanishDefinition: "tía", example: "My aunt takes care of my children while I am at work.", fillBlankSentence: "My _____ is my father's sister." },
        { term: "Niece", englishDefinition: "The daughter of your brother or sister.", spanishDefinition: "sobrina", example: "My niece is graduating from high school this June.", fillBlankSentence: "My _____ is my sister's daughter." },
        { term: "Nephew", englishDefinition: "The son of your brother or sister.", spanishDefinition: "sobrino", example: "My nephew is learning English at the community center.", fillBlankSentence: "My _____ is my brother's son." },
        { term: "Grandmother", englishDefinition: "The mother of your father or mother.", spanishDefinition: "abuela", example: "My grandmother lives with us and helps with the cooking.", fillBlankSentence: "My _____ is my mother's mother." },
        { term: "Grandfather", englishDefinition: "The father of your father or mother.", spanishDefinition: "abuelo", example: "My grandfather tells beautiful stories about his life in the mountains.", fillBlankSentence: "My _____ is my father's father." },
        { term: "Husband", englishDefinition: "A married man; the male partner in a marriage.", spanishDefinition: "esposo", example: "My husband works a late shift at the warehouse.", fillBlankSentence: "She loves her _____. They got married in 2010." },
        { term: "Wife", englishDefinition: "A married woman; the female partner in a marriage.", spanishDefinition: "esposa", example: "His wife is a teacher at the adult education center.", fillBlankSentence: "He loves his _____. They got married in 2015." },
        { term: "Parent", englishDefinition: "A father or mother of a child.", spanishDefinition: "padre o madre", example: "Every parent wants their children to have a good education.", fillBlankSentence: "I am a _____ of three children." },
        { term: "Child", englishDefinition: "A young human being below the age of adulthood.", spanishDefinition: "niño o niña", example: "I have one child in elementary school and one in high school.", fillBlankSentence: "She has one _____. His name is Carlos." },
        { term: "Children", englishDefinition: "Two or more young human beings.", spanishDefinition: "niños", example: "The children are playing in the backyard after school.", fillBlankSentence: "How many _____ do you have?" },
        { term: "Mother-in-law", englishDefinition: "The mother of your husband or wife.", spanishDefinition: "suegra", example: "My mother-in-law is visiting from Mexico next week.", fillBlankSentence: "My _____ is my husband's mother." },
        { term: "Father-in-law", englishDefinition: "The father of your husband or wife.", spanishDefinition: "suegro", example: "I helped my father-in-law paint his new apartment.", fillBlankSentence: "My _____ is my wife's father." },
        { term: "Sister-in-law", englishDefinition: "The sister of your husband or wife, or the wife of your brother.", spanishDefinition: "cuñada", example: "My sister-in-law and I often go shopping together on Saturdays.", fillBlankSentence: "My _____ married my brother last year." },
        { term: "Brother-in-law", englishDefinition: "The brother of your husband or wife, or the husband of your sister.", spanishDefinition: "cuñado", example: "My brother-in-law works at the same company as my husband.", fillBlankSentence: "My _____ is my wife's brother." },
        { term: "Members", englishDefinition: "Individuals that belong to a specific group, such as a family or a club.", spanishDefinition: "miembros", example: "There are six members in our household.", fillBlankSentence: "All _____ of the family came to the party." },
        { term: "Relationship", englishDefinition: "The way in which two or more people are connected or behave toward each other.", spanishDefinition: "relación", example: "It is important to have a good relationship with your supervisor at work.", fillBlankSentence: "She has a good _____ with her coworkers." },
      ] },
      { label: "Classroom", terms: [
        { term: "Paper", englishDefinition: "A thin material produced in sheets and used for writing, printing, or drawing.", spanishDefinition: "Un material delgado producido en hojas y utilizado para escribir, imprimir o dibujar.", example: "Please write your name and the date at the top of the paper.", fillBlankSentence: "Please take out a piece of _____ to write on." },
        { term: "Book", englishDefinition: "A written or printed work consisting of pages glued or sewn together.", spanishDefinition: "Un trabajo escrito o impreso que consiste en páginas pegadas o cosidas juntas.", example: "I like to read a book in English for twenty minutes every night.", fillBlankSentence: "I borrowed a _____ from the library to read at home." },
        { term: "Pen", englishDefinition: "An instrument for writing or drawing with ink.", spanishDefinition: "Un instrumento para escribir o dibujar con tinta.", example: "Can I borrow a pen to sign this registration form?", fillBlankSentence: "Can I borrow your _____ to sign this form?" },
        { term: "Notebook", englishDefinition: "A book with blank or ruled pages for writing notes in.", spanishDefinition: "Un libro con páginas en blanco o rayadas para escribir notas.", example: "I write new vocabulary words in my notebook during every class.", fillBlankSentence: "I write new vocabulary words in my blank _____ every day." },
        { term: "Textbook", englishDefinition: "A book used as a standard work for the study of a particular subject.", spanishDefinition: "Un libro utilizado como un trabajo estándar para el estudio de un tema en particular.", example: "The English textbook has many helpful grammar exercises.", fillBlankSentence: "The English _____ we use in class has 20 chapters." },
        { term: "Workbook", englishDefinition: "A student's book containing instruction and exercises.", spanishDefinition: "Un libro del estudiante que contiene instrucciones y ejercicios.", example: "We need to complete page ten in the workbook for homework tonight.", fillBlankSentence: "The _____ has practice exercises to complete for homework." },
        { term: "Pencil sharpener", englishDefinition: "A device for sharpening a pencil by shaving away its wooden surface.", spanishDefinition: "Un dispositivo para afilar un lápiz afeitando su superficie de madera.", example: "My pencil is dull, so I need to use the pencil sharpener in the back of the room.", fillBlankSentence: "My pencil broke, so I used the _____." },
        { term: "Board", englishDefinition: "A large surface in a classroom on which the teacher writes.", spanishDefinition: "Una superficie grande en un aula en la que el profesor escribe.", example: "The teacher wrote the homework assignment on the board.", fillBlankSentence: "The teacher wrote the new words on the _____." },
        { term: "Marker", englishDefinition: "A felt-tip pen with a broad tip, used for writing on a whiteboard.", spanishDefinition: "Un bolígrafo de punta de fieltro con una punta ancha, utilizado para escribir en una pizarra blanca.", example: "The teacher used a blue marker to explain the new verb tenses.", fillBlankSentence: "She used a red _____ to write on the whiteboard." },
        { term: "Eraser", englishDefinition: "An object, typically a piece of soft rubber, used for removing marks made by a pencil or marker.", spanishDefinition: "Un objeto, típicamente una pieza de goma blanda, utilizada para eliminar marcas hechas por un lápiz o marcador.", example: "I made a mistake in my notebook and needed an eraser to fix it.", fillBlankSentence: "He used the _____ to remove the mistake from the board." },
        { term: "Desk", englishDefinition: "A piece of furniture with a flat surface for writing or reading.", spanishDefinition: "Un mueble con una superficie plana para escribir o leer; un escritorio.", example: "Please keep your desk organized and clear of any trash.", fillBlankSentence: "Please put your phone inside your _____." },
        { term: "Chair", englishDefinition: "A separate seat for one person, typically with a back and four legs.", spanishDefinition: "Un asiento separado para una persona, típicamente con un respaldo y cuatro patas.", example: "There are twenty chairs in the classroom for the students.", fillBlankSentence: "Please sit in your _____ and open your book." },
        { term: "Teacher", englishDefinition: "A person who provides education for students.", spanishDefinition: "Una persona que proporciona educación a los estudiantes.", example: "Our teacher explained the new vocabulary words clearly to everyone.", fillBlankSentence: "The _____ explains the grammar lesson every day." },
        { term: "Student", englishDefinition: "A person who is studying at a school or college.", spanishDefinition: "Una persona que está estudiando en una escuela o colegio.", example: "Every student in this class is working hard to learn English.", fillBlankSentence: "Every _____ needs to bring a pencil to the test." },
        { term: "Classmate", englishDefinition: "A student who is in the same class as another.", spanishDefinition: "Un estudiante que está en la misma clase que otro.", example: "My classmate helped me understand the instructions for the project.", fillBlankSentence: "The person who sits next to me in class is my _____." },
        { term: "Partner", englishDefinition: "A person who takes part in an undertaking with another.", spanishDefinition: "Una persona que participa en una tarea con otra.", example: "Please work with a partner to practice the conversation on page five.", fillBlankSentence: "Work with a _____ to practice the dialogue." },
        { term: "Group", englishDefinition: "A number of people or things that are located close together or are considered a unit.", spanishDefinition: "Un número de personas o cosas que se encuentran cerca unas de otras o se consideran una unidad.", example: "We finished our project quickly because we worked well as a group.", fillBlankSentence: "Please work in a _____ of three people." },
      ] },
      { label: "Descriptions (Physical)", terms: [
        { term: "Hair", englishDefinition: "The mass of thin threads that grows on the head of a person.", spanishDefinition: "La masa de hilos delgados que crece en la cabeza de una persona; el cabello.", example: "She has long, black hair and usually wears it in a ponytail.", fillBlankSentence: "He has short, brown _____." },
        { term: "Eyes", englishDefinition: "The two organs in the face that people use to see.", spanishDefinition: "Los dos órganos de la cara que las personas usan para ver; los ojos.", example: "He has beautiful green eyes that sparkle when he smiles.", fillBlankSentence: "She has big, blue _____." },
      ] },
      { label: "Adjectives", terms: [
        { term: "Short", englishDefinition: "Measuring a small distance from end to end; not long or tall.", spanishDefinition: "Midiendo una pequeña distancia de un extremo a otro; no largo ni alto.", example: "He decided to cut his hair short for the summer.", fillBlankSentence: "He is not tall. He is _____." },
        { term: "Long", englishDefinition: "Measuring a great distance from end to end; not short.", spanishDefinition: "Midiendo una gran distancia de un extremo a otro; largo.", example: "She has long hair that reaches down to her waist.", fillBlankSentence: "Her hair is not short. It is very _____." },
        { term: "Straight", englishDefinition: "Moving or continuing in one direction without curving or bending.", spanishDefinition: "Moviéndose o continuando en una dirección sin curvarse ni doblarse; lacio o derecho.", example: "She has straight hair that is very easy to brush.", fillBlankSentence: "Her hair is not curly. It is _____." },
        { term: "Wavy", englishDefinition: "Having a series of curves; not straight or curly.", spanishDefinition: "Teniendo una serie de curvas; ni lacio ni rizado.", example: "Her wavy hair looks beautiful in the sunlight.", fillBlankSentence: "His hair is not straight and not curly. It is _____." },
        { term: "Curly", englishDefinition: "Forming or full of curls; not straight or wavy.", spanishDefinition: "Formando o lleno de rizos; ni lacio ni ondulado.", example: "He was born with very curly hair that is hard to manage.", fillBlankSentence: "Her hair has many small curls. It is very _____." },
        { term: "Bald", englishDefinition: "Having little or no hair on the head.", spanishDefinition: "Teniendo poco o nada de cabello en la cabeza; calvo.", example: "My grandfather is bald, so he always wears a hat outside.", fillBlankSentence: "He has no hair on his head. He is _____." },
        { term: "Brown", englishDefinition: "The color of earth or wood.", spanishDefinition: "El color de la tierra o la madera; café o marrón.", example: "Most of the students in the class have brown eyes.", fillBlankSentence: "Chocolate and coffee are the color _____." },
        { term: "Red", englishDefinition: "The color of blood or tomatoes.", spanishDefinition: "El color de la sangre o los tomates; rojo.", example: "She is wearing a bright red dress for the party tonight.", fillBlankSentence: "The stop sign is _____." },
        { term: "Black", englishDefinition: "The darkest color; the color of coal or night.", spanishDefinition: "El color más oscuro; el color del carbón o de la noche; negro.", example: "He has black hair and a very friendly smile.", fillBlankSentence: "The night sky is very _____." },
        { term: "Blond", englishDefinition: "A pale yellow or golden color, especially of hair.", spanishDefinition: "Un color amarillo pálido o dorado, especialmente del cabello; rubio.", example: "The little boy has blond hair and blue eyes.", fillBlankSentence: "Her hair is light yellow. It is _____." },
        { term: "Gray", englishDefinition: "A color between black and white; the color of ashes.", spanishDefinition: "Un color entre blanco y negro; el color de las cenizas; gris.", example: "His hair is starting to turn gray as he gets older.", fillBlankSentence: "The sky is _____ today." },
        { term: "Tall", englishDefinition: "Of great or more than average height.", spanishDefinition: "De gran altura o superior a la media; alto.", example: "My older brother is very tall and plays basketball on weekends.", fillBlankSentence: "He is not short. He is very _____." },
        { term: "Young", englishDefinition: "Having lived or existed for only a short time; not old.", spanishDefinition: "Habiendo vivido o existido por poco tiempo; joven.", example: "The young children are learning to speak two languages.", fillBlankSentence: "The baby is very _____. She is only two months old." },
        { term: "Old", englishDefinition: "Having lived or existed for a long time; not young.", spanishDefinition: "Habiendo vivido o existido por mucho tiempo; viejo o mayor.", example: "The old library building is being renovated this year.", fillBlankSentence: "She is not young. She is very _____." },
        { term: "Thin", englishDefinition: "Having little, or too little, flesh or fat on the body.", spanishDefinition: "Teniendo poca, o muy poca, carne o grasa en el cuerpo; delgado.", example: "He has become very thin because he exercises every morning.", fillBlankSentence: "The paper is not thick. It is very _____." },
        { term: "Heavy", englishDefinition: "Of great weight; difficult to lift or move.", spanishDefinition: "De gran peso; difícil de levantar o mover; pesado.", example: "I have to lift heavy boxes at my job in the warehouse.", fillBlankSentence: "The suitcase is too _____ to carry." },
      ] },
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
      { label: "Clothing", terms: ["Shirt", "Suit", "Sweater", "Cap", "Dress", "Socks", "Hat", "Shoes", "Sneakers", "Blouse", "Coat", "Skirt", "Belt", "Pants", "Shorts"] },
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

const SIMPLE_TERM_DEFINITIONS: Record<string, { en: string }> = {
  "Sunday": { en: "a day of the week" },
  "Monday": { en: "a day of the week" },
  "Tuesday": { en: "a day of the week" },
  "Wednesday": { en: "a day of the week" },
  "Thursday": { en: "a day of the week" },
  "Friday": { en: "a day of the week" },
  "Saturday": { en: "a day of the week" },
  "January": { en: "a month of the year" },
  "February": { en: "a month of the year" },
  "March": { en: "a month of the year" },
  "April": { en: "a month of the year" },
  "May": { en: "a month of the year" },
  "June": { en: "a month of the year" },
  "July": { en: "a month of the year" },
  "August": { en: "a month of the year" },
  "September": { en: "a month of the year" },
  "October": { en: "a month of the year" },
  "November": { en: "a month of the year" },
  "December": { en: "a month of the year" },
  "Week": { en: "seven days" },
  "Month": { en: "about four weeks" },
  "Today": { en: "this day" },
  "Tomorrow": { en: "the day after today" },
  "Yesterday": { en: "the day before today" },
  "Next": { en: "after this" },
  "Time": { en: "what tells us when something happens" },
  "Schedule": { en: "a plan with times" },
  "Calendar": { en: "a page or app with days and dates" },
  "Appointment": { en: "a time to meet someone" },
  "Half": { en: "one of two equal parts" },
  "Hour": { en: "60 minutes" },
  "Minute": { en: "a small unit of time" },
  "Breakfast": { en: "the first meal of the day" },
  "Lunch": { en: "a meal in the middle of the day" },
  "Dinner": { en: "the main meal at night" },
  "Shower": { en: "washing your body with water" },
  "O'clock": { en: "used to say the exact hour" },
  "Father": { en: "a male parent" },
  "Mother": { en: "a female parent" },
  "Sister": { en: "a girl or woman in your family" },
  "Brother": { en: "a boy or man in your family" },
  "Son": { en: "a male child" },
  "Daughter": { en: "a female child" },
  "Cousin": { en: "a child in your family" },
  "Uncle": { en: "a man in your family" },
  "Aunt": { en: "a woman in your family" },
  "Niece": { en: "a girl in your family" },
  "Nephew": { en: "a boy in your family" },
  "Grandmother": { en: "your parent's mother" },
  "Grandfather": { en: "your parent's father" },
  "Husband": { en: "a married man" },
  "Wife": { en: "a married woman" },
  "Parent": { en: "a mother or father" },
  "Child": { en: "a young person" },
  "Children": { en: "more than one child" },
  "Mother-in-law": { en: "your husband's or wife's mother" },
  "Father-in-law": { en: "your husband's or wife's father" },
  "Sister-in-law": { en: "your husband's or wife's sister" },
  "Brother-in-law": { en: "your husband's or wife's brother" },
  "Members": { en: "people in a group" },
  "Relationship": { en: "how people are connected" },
  "Teacher": { en: "a person who teaches" },
  "Student": { en: "a person who learns" },
  "Classmate": { en: "a student in your class" },
  "Partner": { en: "a person you work with" },
  "Group": { en: "people together" },
  "Pencil sharpener": { en: "a tool to make a pencil sharp" },
  "Marker": { en: "a pen with thick ink" },
  "Eraser": { en: "used to remove pencil marks" },
  "Desk": { en: "a table for school work" },
  "Chair": { en: "a seat for one person" },
  "Hair": { en: "the hair on your head" },
  "Eyes": { en: "the parts you use to see" },
  "Short": { en: "not long or not tall" },
  "Long": { en: "not short" },
  "Wavy": { en: "with soft curves" },
  "Curly": { en: "with many curls" },
  "Bald": { en: "with little or no hair" },
  "Brown": { en: "a color like chocolate or wood" },
  "Red": { en: "the color of blood" },
  "Black": { en: "the darkest color" },
  "Blond": { en: "light yellow hair color" },
  "Gray": { en: "a color between black and white" },
  "Tall": { en: "having a lot of height" },
  "Young": { en: "not old" },
  "Thin": { en: "not heavy" },
  "Heavy": { en: "weighing a lot" },
"Candidate": { en: "a person in an election" },
"Ballot": { en: "the paper used to vote" },
"Voter": { en: "a person who votes" },
"Election": { en: "when people vote" },
"Campaign": { en: "work to help someone win" },
"Political Party": { en: "a political group" },
"Doctor's office": { en: "a place to see a doctor" },
"Dentist's office": { en: "a place to see a dentist" },
"Hospital": { en: "a place for medical care" },
"Hotel": { en: "a place to stay when you travel" },
"House": { en: "a place where people live" },
"Park": { en: "an outdoor place to walk or play" },
"Playground": { en: "a place where children play" },
"Supermarket": { en: "a store where you buy food" },
"Bank": { en: "a place for money" },
"Library": { en: "a place to borrow books" },
"Post Office": { en: "a place to send mail" },
"Fire Department": { en: "the service that helps in fires" },
"Police Station": { en: "the building for police" },
"RMV": { en: "the office for driver's licenses" },
"Bus Stop": { en: "the place where you wait for a bus" },
"Station": { en: "a place where buses or trains stop" },
"Public Transportation": { en: "buses and trains for everyone" },
"City Hall": { en: "the city government building" },
"Clinic": { en: "a place for medical care" },
"School": { en: "a place where people learn" },
"Museum": { en: "a place to see art or history" },
"Restaurant": { en: "a place to buy and eat food" },
"Store": { en: "a place where people buy things" },
"Pharmacy": { en: "a place to get medicine" },
"Gym": { en: "a place to exercise" },
"Airport": { en: "a place where airplanes arrive and leave" },
"Laundromat": { en: "a place to wash clothes" },
"Transportation": { en: "ways to travel" },
"Medical Care": { en: "help from doctors and nurses" },
"Education": { en: "learning in school or class" },
"Shopping": { en: "buying things from stores" },
"Housing": { en: "places where people live" },
"Call": { en: "to talk on the phone" },
"Message": { en: "words sent to a person" },
"Voicemail": { en: "a phone message you hear later" },
"Email": { en: "a message sent by computer or phone" },
"Left": { en: "the direction opposite of right" },
"Right": { en: "the direction opposite of left" },
"Straight": { en: "forward, without turning" },
"Around": { en: "to the other side" },
"In": { en: "inside" },
"At": { en: "in or near a place" },
"On": { en: "touching the top of something" },
"In front of": { en: "before something" },
"Behind": { en: "at the back of something" },
"Between": { en: "in the middle of two things" },
"Next to": { en: "beside" },
"Across from": { en: "on the other side" },
"Never": { en: "not at any time" },
"Rarely": { en: "not often" },
"Sometimes": { en: "at some times" },
"Usually": { en: "most of the time" },
"Always": { en: "every time" },
"Thanks": { en: "words you say when you are grateful" },
"Meal": { en: "food you eat at one time" },
"Indigenous": { en: "from the first people of a place" },
"Pilgrim": { en: "an early settler in America" },
"Electronics": { en: "machines that use electricity" },
"Computer": { en: "a machine for work or learning" },
"Car": { en: "a vehicle people drive" },
"Cellphone": { en: "a phone you carry" },
"Receipt": { en: "paper that shows what you bought" },
"Tax": { en: "money paid to the government" },
"Price": { en: "how much something costs" },
"Cash": { en: "money in bills or coins" },
"Credit Card": { en: "a card you use to pay" },
"Debit Card": { en: "a card that uses bank money" },
"Check": { en: "paper used to pay money" },
"Money Order": { en: "a paper payment" },
"Signature": { en: "your written name" },
"ATM": { en: "a machine to get bank money" },
"Withdraw": { en: "to take money out" },
"Deposit": { en: "to put money in" },
"Online": { en: "using the internet" },
"Return": { en: "to take something back" },
"Exchange": { en: "to return one thing for another" },
"Refund": { en: "money given back to you" },
"Christmas Tree": { en: "a tree for Christmas" },
"Ornaments": { en: "small decorations" },
"Lights": { en: "things that give light" },
"Santa": { en: "the Christmas man in stories" },
"Gift": { en: "something you give to a person" },
"Landlord": { en: "the person who owns the place you rent" },
"Manager": { en: "the person in charge" },
"Agent": { en: "a person who helps rent or buy homes" },
"Real Estate": { en: "homes and land for sale or rent" },
"Tenant": { en: "a person who pays rent" },
"Leak": { en: "water coming out where it should not" },
"Broken Window": { en: "a window with broken glass" },
"Clogged Toilet": { en: "a toilet that water cannot go down" },
"Complaint": { en: "words saying something is wrong" },
"Home": { en: "the place where you live" },
"Apartment": { en: "a home in a larger building" },
"Condominium": { en: "an apartment someone owns" },
"Unit": { en: "one apartment or home space" },
"Rent": { en: "money paid to live somewhere" },
"Lease": { en: "a paper to rent a place" },
"Fee": { en: "money you must pay" },
"Security deposit": { en: "money paid before you move in" },
"Laundry": { en: "clothes that need washing" },
"Mortgage": { en: "a loan to buy a house" },
"Down payment": { en: "the first money you pay" },
"Utilities": { en: "services like water and electricity" },
"Gas": { en: "fuel for cooking, heat, or cars" },
"Water": { en: "the liquid people drink" },
"Electric": { en: "using electricity" },
"Heat": { en: "warmth in a building" },
"Room": { en: "one area inside a house" },
"Bathroom": { en: "the room with a toilet or shower" },
"Kitchen": { en: "the room where you cook" },
"Bedroom": { en: "the room where you sleep" },
"Living room": { en: "the room where people sit and relax" },
"Hall": { en: "the long space between rooms" },
"Floor": { en: "the part you walk on" },
"Basement": { en: "the part of a house below the ground" },
"Attic": { en: "the space under the roof" },
"Roof": { en: "the top of a house" },
"Chimney": { en: "the part that carries smoke outside" },
"Door": { en: "the part you open to enter or leave" },
"Front": { en: "the part in front" },
"Back": { en: "the part in back" },
"Lock": { en: "the part that keeps a door closed" },
"Stairs": { en: "steps that go up or down" },
"Porch": { en: "a covered area by the door" },
"Deck": { en: "a flat outdoor space" },
"Garage": { en: "a place where you keep a car" },
"Driveway": { en: "the space where a car goes to a house" },
"Yard": { en: "the ground around a house" },
"Garden": { en: "a place where flowers or vegetables grow" },
"Window": { en: "glass in a wall to see outside" },
"End table": { en: "a small table by a sofa or chair" },
"Coffee table": { en: "a low table in front of a sofa" },
"Plant": { en: "a living thing that grows" },
"Lamp": { en: "a light you can move" },
"Light": { en: "something that makes a room bright" },
"Painting": { en: "a picture made with paint" },
"Rug": { en: "a small floor covering" },
"Carpet": { en: "a floor covering" },
"Bathtub": { en: "a tub for bathing" },
"Sink": { en: "the place where you wash with water" },
"Toilet": { en: "the bathroom seat you use" },
"Curtain": { en: "cloth that covers a window" },
"Bed": { en: "the furniture where you sleep" },
"Closet": { en: "a space to store clothes" },
"Bedtable": { en: "a small table next to a bed" },
"Refrigerator": { en: "a cold machine for food" },
"Microwave": { en: "a machine that heats food" },
"Oven": { en: "the part used for baking" },
"Counter": { en: "the flat kitchen surface" },
"Cabinet": { en: "a storage space with doors" },
"Sofa": { en: "a soft seat for several people" },
"Armchair": { en: "a chair with arms" },
"TV": { en: "a screen you watch shows on" },
"Fireplace": { en: "a place where a fire burns" },
"Washer": { en: "a machine that washes clothes" },
"Dryer": { en: "a machine that dries clothes" },
"Under": { en: "below something" },
"Over": { en: "above something" },
"Homemaker": { en: "a person who takes care of the home" },
"Mechanic": { en: "a person who repairs cars or machines" },
"Office assistant": { en: "a person who helps in an office" },
"Administrative assistant": { en: "a person who helps with office work" },
"Secretary": { en: "a person who does office work" },
"Receptionist": { en: "a person who welcomes people and answers phones" },
"Server": { en: "a person who takes orders and serves food" },
"Busser": { en: "a person who clears and cleans tables" },
"Cook": { en: "a person who cooks food" },
"Prep Cook": { en: "a cook who prepares ingredients" },
"Chef": { en: "the main cook in a kitchen" },
"Dishwasher": { en: "a person or machine that washes dishes" },
"Host": { en: "a person who welcomes customers" },
"Custodian": { en: "a person who cleans a building" },
"Cashier": { en: "a person who takes payments" },
"Principal": { en: "the leader of a school" },
"Doctor": { en: "a person who treats sick people" },
"Nurse": { en: "a person who cares for patients" },
"Dentist": { en: "a doctor for teeth" },
"Painter": { en: "a person who paints houses or buildings" },
"Plumber": { en: "a person who repairs pipes and toilets" },
"Electrician": { en: "a person who works with electricity" },
"Construction worker": { en: "a person who helps build houses or buildings" },
"Housekeeper": { en: "a person who cleans rooms or homes" },
"Driver": { en: "a person who drives for work" },
"Landscaper": { en: "a person who works with plants and yards" },
"Salesperson": { en: "a person who sells things" },
"Business owner": { en: "a person who owns a business" },
"Pay": { en: "money you get for work" },
"Salary": { en: "regular pay for a job" },
"Benefits": { en: "extra things a job gives you" },
"Full-time": { en: "working all day hours each week" },
"Part-time": { en: "working fewer hours each week" },
"Title": { en: "the name of your job" },
"Experience": { en: "skills from past work" },
"Break": { en: "a short rest from work" },
"Hired": { en: "chosen for a job" },
"Fired": { en: "told to leave a job" },
"Laid off": { en: "out of work because the job ended" },
"Employee": { en: "a person who works for a company" },
"Paycheck": { en: "the money you get for work" },
"Uniform": { en: "special clothes for work" },
"Boss": { en: "the person in charge of your work" },
"Interview": { en: "a meeting for a job" },
"Employer": { en: "the person or company that gives you work" },
"Taxes": { en: "money taken from pay" },
"Application": { en: "a form for a job" },
"Vacation": { en: "time away from work" },
"Sick leave": { en: "time away from work because you are sick" },
"Insurance": { en: "a plan that helps pay costs" },
"Resume": { en: "a paper with your work history" },
"Raise": { en: "more pay than before" },
"Skill": { en: "something you can do well" },
"Strength": { en: "something you do very well" },
"Teamwork": { en: "working well with other people" },
"Problem-Solving": { en: "finding answers to problems" },
"Communication": { en: "sharing ideas with other people" },
"Leadership": { en: "guiding other people" },
"Creative": { en: "good at making new ideas" },
"Flexible": { en: "able to change when needed" },
"Organized": { en: "keeping things in good order" },
"Dependable": { en: "someone people can trust" },
"Honest": { en: "truthful" },
"Hard-Working": { en: "working hard" },
"Respectful": { en: "showing respect to others" },
"Head": { en: "the top part of the body" },
"Arms": { en: "the body parts from the shoulder to the hand" },
"Chest": { en: "the upper front part of the body" },
"Hands": { en: "the body parts at the end of your arms" },
"Stomach": { en: "the front middle part of the body" },
"Fingers": { en: "the small parts on your hands" },
"Legs": { en: "the body parts used for walking" },
"Foot": { en: "the body part at the end of the leg" },
"Feet": { en: "more than one foot" },
"Toes": { en: "the small parts on your feet" },
"Neck": { en: "the body part between the head and shoulders" },
"Ears": { en: "the body parts you use to hear" },
"Mouth": { en: "the opening you use to eat and speak" },
"Nose": { en: "the body part you use to smell and breathe" },
"Tooth": { en: "one hard white part in the mouth" },
"Teeth": { en: "more than one tooth" },
"Throat": { en: "the inside part of the neck" },
"Pain": { en: "hurt in the body" },
"Cut": { en: "an opening in the skin" },
"Dry cough": { en: "a cough without mucus" },
"Fever": { en: "a body temperature that is too high" },
"Headache": { en: "pain in your head" },
"Runny nose": { en: "a nose with mucus coming out" },
"Sore Throat": { en: "pain in the throat" },
"Sneezing": { en: "air coming out suddenly from the nose and mouth" },
"Backache": { en: "pain in your back" },
"Toothache": { en: "pain in a tooth or teeth" },
"Chills": { en: "feeling cold when you are sick" },
"Sweats": { en: "a lot of sweat when you are sick" },
"Fatigue": { en: "feeling very tired" },
"Dizziness": { en: "feeling like the room is moving" },
"Itch": { en: "a feeling that makes you want to scratch" },
"Rash": { en: "a red area on the skin" },
"Swelling": { en: "a body part getting bigger from injury or sickness" },
"Nausea": { en: "feeling like you want to vomit" },
"Stress": { en: "worry or pressure in your mind or body" },
"Prescription": { en: "a paper from a doctor for medicine" },
"Reliever": { en: "medicine that helps reduce pain" },
"Syrup": { en: "liquid medicine" },
"Lozenges": { en: "small medicine for your throat" },
"Pills": { en: "small medicine you swallow" },
"Tablets": { en: "small flat pieces of medicine" },
"Vaccine": { en: "medicine that helps protect you from illness" },
"Allergy": { en: "a body reaction to something" },
"Cold": { en: "a common illness with sneezing or a runny nose" },
"Flu": { en: "a sickness that can cause fever and body pain" },
"Infection": { en: "sickness caused by germs" },
"Sprain": { en: "an injury from twisting" },
"Medical center": { en: "a place where people get medical help" },
"Elevators": { en: "machines that carry people up and down" },
"Lobby": { en: "the front area inside a building" },
"Checkup": { en: "a doctor visit to check your health" },
"Physical": { en: "a full checkup of your body" },
"Surgery": { en: "a medical operation" },
"Muscles": { en: "the body parts that help you move" },
"Weight": { en: "how heavy a person or thing is" },
"Heart": { en: "the body part that pumps blood" },
"Vegetables": { en: "foods from plants that are not sweet" },
"Fruits": { en: "sweet foods from plants or trees" },
"Whole grains": { en: "grains like brown rice or oats" },
"Protein": { en: "foods like meat, eggs, or beans" },
"Dairy": { en: "foods made from milk" },
"Junk food": { en: "unhealthy food" },
"Cereal": { en: "a breakfast food" },
"Bread": { en: "food made from flour" },
"Toast": { en: "bread that is cooked until brown" },
"Nuts": { en: "small hard foods like almonds" },
"Walnuts": { en: "a kind of nut" },
"Peanuts": { en: "a kind of nut" },
"Almonds": { en: "a kind of nut" },
"Eggs": { en: "food from chickens" },
"Milk": { en: "a white drink" },
"Cheese": { en: "food made from milk" },
"Yogurt": { en: "a soft food made from milk" },
"Chicken": { en: "meat from a chicken" },
"Beef": { en: "meat from a cow" },
"Pork": { en: "meat from a pig" },
"Turkey": { en: "meat from a turkey" },
"Fish": { en: "food from water animals" },
"Tuna": { en: "a kind of fish" },
"Rice": { en: "small grains" },
"Beans": { en: "small foods like black beans" },
"Soup": { en: "a liquid food" },
"Oil": { en: "a liquid used for cooking" },
"Salt": { en: "something that adds taste to food" },
"Pepper": { en: "a spice for food" },
"Garlic": { en: "a strong food used in cooking" },
"Ketchup": { en: "a red sauce" },
"Mustard": { en: "a yellow sauce" },
"Jam": { en: "a sweet fruit spread" },
"Jelly": { en: "a sweet fruit spread" },
"Peanut butter": { en: "a spread made from peanuts" },
"Sugar": { en: "a sweet substance" },
"Fat": { en: "part of food that gives energy" },
"Carbohydrates": { en: "foods like bread or rice" },
"Calories": { en: "energy in food" },
"Menu": { en: "a list of food" },
"Food label": { en: "information on food packages" },
"Habits": { en: "things you do often" },
"Shirt": { en: "clothes you wear on your upper body" },
"Suit": { en: "formal clothes for work or events" },
"Sweater": { en: "warm clothes you wear on your upper body" },
"Cap": { en: "a hat with a front cover" },
"Dress": { en: "clothes for women or girls" },
"Socks": { en: "clothes you wear on your feet inside shoes" },
"Hat": { en: "something you wear on your head" },
"Shoes": { en: "things you wear on your feet" },
"Sneakers": { en: "shoes for walking or sports" },
"Blouse": { en: "a shirt for women" },
"Coat": { en: "a warm jacket for cold weather" },
"Skirt": { en: "clothes worn from the waist down" },
"Belt": { en: "something you wear around your waist to hold pants" },
"Pants": { en: "clothes that cover your legs" },
"Shorts": { en: "short pants for warm weather" },
};

const SIMPLE_CATEGORY_TERM_DEFINITIONS: Record<string, { en: string; es: string }> = {
  "Adjectives::Straight": { en: "hair with no curls or waves", es: "cabello sin rizos ni ondas; lacio" },
  "Descriptions (Physical)::Straight": { en: "hair with no curls or waves", es: "cabello sin rizos ni ondas; lacio" },
  "Adverbs of Location::Straight": { en: "forward, without turning", es: "hacia adelante, sin doblar; derecho" },
  "Body Parts::Back": { en: "the part behind your chest and stomach", es: "la parte detrás del pecho y el estómago; espalda" },
  "Parts of House::Back": { en: "the rear part of a house", es: "la parte de atrás de una casa" },
  /** Shopping / clothing sizes — avoid generic quantifier placeholder in “What I wear”. */
  "Quantifiers::Large": {
    en: "a size bigger than medium (for clothes, drinks, etc.)",
    es: "un tamaño más grande que mediano (ropa, bebidas, etc.); talla grande",
  },
  "Quantifiers::Big": {
    en: "large in size",
    es: "de gran tamaño; grande",
  },
  "Quantifiers::Medium": {
    en: "a middle size between small and large",
    es: "un tamaño entre pequeño y grande; mediano o talla M",
  },
  "Quantifiers::Small": {
    en: "a size smaller than medium",
    es: "un tamaño más pequeño que mediano; pequeño o talla S",
  },
  "Quantifiers::New": {
    en: "not used before; recently bought",
    es: "que no se ha usado antes; recién comprado; nuevo",
  },
  "Quantifiers::Used": {
    en: "not new; owned or worn by someone before",
    es: "no nuevo; de segunda mano; usado",
  },
  "Quantifiers::Old": {
    en: "not new anymore (for example when shopping)",
    es: "ya no nuevo (por ejemplo al comprar); viejo o usado",
  },
};

function buildSimpleDefinition(term: string, category: string): { en: string; es?: string } | null {
  const categoryExact = SIMPLE_CATEGORY_TERM_DEFINITIONS[`${category}::${term}`];
  if (categoryExact) return categoryExact;

  const exact = SIMPLE_TERM_DEFINITIONS[term];
  if (exact) return exact;

  const label = category.toLowerCase();

  if (label.includes("product")) {
    return { en: "a product or machine people use", es: "un producto o máquina que la gente usa" };
  }
  if (label.includes("quantifier")) {
    return { en: "a word that describes size, age, or condition", es: "una palabra que describe tamaño, edad o condición" };
  }
  if (label.includes("parts of house")) {
    return { en: "a part of a house or apartment", es: "una parte de la casa o del apartamento" };
  }
  if (label.includes("domestic")) {
    return { en: "an item people use in the home", es: "un objeto que la gente usa en la casa" };
  }
  if (label.includes("occupation")) {
    return { en: "a type of job or profession", es: "un tipo de trabajo o profesión" };
  }
  if (label.includes("body parts")) {
    return { en: "a part of the body", es: "una parte del cuerpo" };
  }
  if (label.includes("symptoms")) {
    return { en: "a sign that a person may be sick", es: "una señal de que una persona puede estar enferma" };
  }
  if (label.includes("medicine")) {
    return { en: "a type of medicine or treatment", es: "un tipo de medicina o tratamiento" };
  }
  if (label.includes("illness")) {
    return { en: "an illness or health problem", es: "una enfermedad o problema de salud" };
  }
  if (label.includes("food groups")) {
    return { en: "a food group", es: "un grupo de alimentos" };
  }
  if (label.includes("grains")) {
    return { en: "a grain food or common breakfast food", es: "un alimento de granos o comida común del desayuno" };
  }
  if (label.includes("dairy")) {
    return { en: "a dairy food made from milk", es: "un alimento lácteo hecho de leche" };
  }
  if (label.includes("meats")) {
    return { en: "a type of meat or protein food", es: "un tipo de carne o proteína" };
  }
  if (label.includes("staples")) {
    return { en: "a basic food", es: "una comida básica" };
  }
  if (label.includes("vegetables")) {
    return { en: "a vegetable", es: "una verdura" };
  }
  if (label.includes("condiments")) {
    return { en: "an item used to add flavor to food", es: "un producto que se usa para dar sabor a la comida" };
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
    return { en: "a container used to hold or carry things", es: "un recipiente que se usa para guardar o llevar cosas" };
  }

  return null;
}

function refineEnglishLearnerDefinition(definition: string): string {
  return definition
    .replace(/^a person who\b/i, "someone who")
    .replace(/^a place where people\b/i, "a place people")
    .replace(/^a place where you\b/i, "a place you")
    .replace(/^something used to\b/i, "an item used to")
    .replace(/^something wrapped or boxed\b/i, "an item wrapped or boxed")
    .replace(/^something you wear\b/i, "an item you wear")
    .replace(/^something you\b/i, "an item you")
    .replace(/^something used\b/i, "an item used")
    .replace(/^things that\b/i, "items that")
    .replace(/^things you do often\b/i, "actions or routines you do often")
    .replace(/^things you\b/i, "items you")
    .replace(/^things\b/i, "items")
    .replace(/^clothes\b/i, "clothing")
    .replace(/^warm clothes\b/i, "warm clothing")
    .replace(/^special clothes\b/i, "special clothing")
    .replace(/^clothes worn\b/i, "clothing worn")
    .replace(/^clothes that\b/i, "clothing that")
    .replace(/^clothes for\b/i, "clothing for")
    .replace(/^a shirt for women\b/i, "a shirt usually worn by women")
    .replace(/^food like noodles\b/i, "noodles or pasta")
    .replace(/^a kind of\b/i, "a type of");
}

function refineSpanishLearnerDefinition(definition: string): string {
  return definition
    .replace(/^algo usado para\b/i, "un objeto que se usa para")
    .replace(/^algo que\b/i, "un objeto que")
    .replace(/^cosas que haces muchas veces\b/i, "acciones o rutinas que haces muchas veces")
    .replace(/^cosas que\b/i, "objetos que")
    .replace(/^ropa abrigada\b/i, "una prenda abrigada")
    .replace(/^ropa para\b/i, "ropa para")
    .replace(/^ropa que\b/i, "ropa que")
    .replace(/^un tipo de\b/i, "un tipo de");
}

function buildDefinition(term: string, category: string): string {
  const simple = buildSimpleDefinition(term.trim(), category);
  if (simple) {
    const refined = refineEnglishLearnerDefinition(simple.en);
    return `${refined.charAt(0).toUpperCase()}${refined.slice(1)}`;
  }
  return `${categoryHint(category)}`;
}

function buildSpanishDefinition(term: string, category: string): string {
  const simple = buildSimpleDefinition(term.trim(), category);
  if (simple) {
    const refined = refineSpanishLearnerDefinition(simple.es ?? categoryHintSpanish(category));
    return `${refined.charAt(0).toUpperCase()}${refined.slice(1)}`;
  }
  return `${categoryHintSpanish(category)}`;
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

/** Curated unique examples for units 2+; falls back to {@link buildContextualExample}. */
function getLevel1ExampleSentence(unitSlug: string, term: string, category: string, unitTitle: string): string {
  const custom = LEVEL1_VOCAB_CUSTOM_EXAMPLES[`${unitSlug}::${term}`];
  if (custom) return custom;
  return buildContextualExample(term, category, unitTitle);
}

function getTermText(term: RawTerm): string {
  return typeof term === "string" ? term : term.term;
}

// Category-specific Spanish translations that override the general dictionary.
// Used when the same word has a different meaning depending on context.
const SPANISH_TRANSLATIONS_BY_CATEGORY: Record<string, Record<string, string>> = {
  "Adjectives": {
    "Straight": "lacio/a",   // straight hair
  },
  "Adverbs of Location": {
    "Straight": "derecho/a", // go straight (direction)
  },
  "Parts of House": {
    "Back": "la parte trasera",
  },
  "Body Parts": {
    "Back": "la espalda",
  },
};

// Short Spanish translations for all Level 1 vocab terms (Latin American usage; regional alternates with " / ").
// Used instead of verbose Spanish definitions.
const SPANISH_TRANSLATIONS: Record<string, string> = {
  "Name": "el nombre",
  "City": "la ciudad",
  "Country": "el país",
  "Address": "la dirección",
  "Street": "la calle",
  "Phone number": "el número de teléfono",
  "State": "el estado",
  "Zip code": "el código postal",
  "Job": "el trabajo",
  "Age": "la edad",
  "Birthday": "el cumpleaños",
  "Years old": "(tener) … años",
  "Single": "soltero/a",
  "Married": "casado/a",
  "Divorced": "divorciado/a",
  "Morning": "la mañana",
  "Afternoon": "la tarde",
  "Evening": "la tarde (atardecer)",
  "Night": "la noche",
  "Man": "el hombre",
  "Men": "los hombres",
  "Woman": "la mujer",
  "Women": "las mujeres",
  "I": "yo",
  "You": "tú / usted",
  "He": "él",
  "She": "ella",
  "It": "eso/ello",
  "We": "nosotros/as",
  "They": "ellos/ellas",
  "I'm": "yo soy / yo estoy",
  "My": "mi / mis",
  "Your": "tu / su",
  "His": "su (de él)",
  "Her": "su (de ella)",
  "Our": "nuestro/a",
  "Their": "su (de ellos)",
  "One": "uno",
  "Two": "dos",
  "Three": "tres",
  "Four": "cuatro",
  "Five": "cinco",
  "Six": "seis",
  "Seven": "siete",
  "Eight": "ocho",
  "Nine": "nueve",
  "Ten": "diez",
  "Paper": "el papel",
  "Book": "el libro",
  "Pen": "el bolígrafo / la pluma",
  "Notebook": "el cuaderno",
  "Textbook": "el libro de texto",
  "Workbook": "el libro de ejercicios",
  "Board": "la pizarra / el pizarrón",
  "Food": "la comida",
  "Favorite": "favorito/a",
  "Old": "viejo/a",
  "Sunday": "el domingo",
  "Monday": "el lunes",
  "Tuesday": "el martes",
  "Wednesday": "el miércoles",
  "Thursday": "el jueves",
  "Friday": "el viernes",
  "Saturday": "el sábado",
  "January": "enero",
  "February": "febrero",
  "March": "marzo",
  "April": "abril",
  "May": "mayo",
  "June": "junio",
  "July": "julio",
  "August": "agosto",
  "September": "septiembre",
  "October": "octubre",
  "November": "noviembre",
  "December": "diciembre",
  "Week": "la semana",
  "Month": "el mes",
  "Today": "hoy",
  "Tomorrow": "mañana",
  "Yesterday": "ayer",
  "Next": "próximo/a",
  "Time": "la hora / el tiempo",
  "Schedule": "el horario",
  "Calendar": "el calendario",
  "Appointment": "la cita",
  "Half": "y media",
  "Hour": "la hora",
  "Minute": "el minuto",
  "Breakfast": "el desayuno",
  "Lunch": "el almuerzo",
  "Dinner": "la cena",
  "Shower": "la ducha",
  "O'clock": "en punto",
  "Father": "el padre",
  "Mother": "la madre",
  "Sister": "la hermana",
  "Brother": "el hermano",
  "Son": "el hijo",
  "Daughter": "la hija",
  "Cousin": "el primo / la prima",
  "Uncle": "el tío",
  "Aunt": "la tía",
  "Niece": "la sobrina",
  "Nephew": "el sobrino",
  "Grandmother": "la abuela",
  "Grandfather": "el abuelo",
  "Husband": "el esposo",
  "Wife": "la esposa",
  "Parent": "el padre / la madre",
  "Child": "el niño / la niña",
  "Children": "los niños",
  "Mother-in-law": "la suegra",
  "Father-in-law": "el suegro",
  "Sister-in-law": "la cuñada",
  "Brother-in-law": "el cuñado",
  "Members": "los miembros",
  "Relationship": "la relación",
  "Pencil sharpener": "el sacapuntas",
  "Marker": "el marcador / el plumón",
  "Eraser": "la goma (de borrar) / el borrador",
  "Desk": "el escritorio",
  "Chair": "la silla",
  "Teacher": "el/la maestro/a",
  "Student": "el/la estudiante",
  "Classmate": "el/la compañero/a",
  "Partner": "el/la compañero/a",
  "Group": "el grupo",
  "Hair": "el cabello",
  "Eyes": "los ojos",
  "Short": "corto/a",
  "Long": "largo/a",
  "Straight": "lacio/a",
  "Wavy": "ondulado/a",
  "Curly": "rizado/a",
  "Bald": "calvo/a",
  "Brown": "marrón / castaño",
  "Red": "rojo/a",
  "Black": "negro/a",
  "Blond": "rubio/a",
  "Gray": "gris / canoso",
  "Tall": "alto/a",
  "Young": "joven",
  "Thin": "delgado/a",
  "Heavy": "corpulento/a; pesado/a (cosa)",
  "Candidate": "el/la candidato/a",
  "Ballot": "la boleta",
  "Voter": "el/la votante",
  "Election": "la elección",
  "Campaign": "la campaña",
  "Political Party": "el partido político",
  "Doctor's office": "el consultorio médico",
  "Dentist's office": "el consultorio dental",
  "Hospital": "el hospital",
  "Hotel": "el hotel",
  "House": "la casa",
  "Park": "el parque",
  "Playground": "el parque infantil",
  "Supermarket": "el supermercado",
  "Bank": "el banco",
  "Library": "la biblioteca",
  "Post Office": "el correo / la oficina de correos",
  "Fire Department": "el cuerpo de bomberos",
  "Police Station": "la comisaría / la estación de policía",
  "RMV": "la oficina de licencias de conducir (tipo DMV)",
  "Bus Stop": "la parada de autobús",
  "Station": "la estación",
  "Public Transportation": "el transporte público",
  "City Hall": "la alcaldía / la municipalidad",
  "Clinic": "la clínica",
  "School": "la escuela",
  "Museum": "el museo",
  "Restaurant": "el restaurante",
  "Store": "la tienda",
  "Pharmacy": "la farmacia",
  "Gym": "el gimnasio",
  "Airport": "el aeropuerto",
  "Laundromat": "la lavandería automática",
  "Transportation": "el transporte",
  "Medical Care": "la atención médica",
  "Education": "la educación",
  "Shopping": "las compras",
  "Housing": "la vivienda",
  "Call": "la llamada",
  "Message": "el mensaje",
  "Voicemail": "el buzón de voz",
  "Email": "el correo electrónico",
  "Left": "a la izquierda",
  "Right": "a la derecha",
  "Around": "alrededor de",
  "In": "en / dentro de",
  "At": "en / a",
  "On": "sobre / en",
  "In front of": "enfrente de",
  "Behind": "detrás de",
  "Between": "entre",
  "Next to": "al lado de",
  "Across from": "frente a",
  "Never": "nunca",
  "Rarely": "rara vez",
  "Sometimes": "a veces",
  "Usually": "generalmente",
  "Always": "siempre",
  "Thanks": "gracias",
  "Meal": "la comida",
  "Turkey": "el pavo",
  "Indigenous": "indígena",
  "Pilgrim": "el/la peregrino/a (colonos en EE.UU.)",
  "Shirt": "la camisa",
  "Suit": "el traje",
  "Sweater": "el suéter",
  "Cap": "la gorra",
  "Dress": "el vestido",
  "Socks": "los calcetines",
  "Hat": "el sombrero",
  "Shoes": "los zapatos",
  "Sneakers": "los tenis / las zapatillas",
  "Blouse": "la blusa",
  "Coat": "el abrigo",
  "Skirt": "la falda",
  "Belt": "el cinturón",
  "Pants": "los pantalones",
  "Shorts": "los pantalones cortos",
  "Electronics": "los electrónicos",
  "Computer": "la computadora",
  "Car": "el carro / el auto",
  "Cellphone": "el celular",
  "Receipt": "el recibo",
  "Tax": "el impuesto",
  "Price": "el precio",
  "Cash": "el efectivo",
  "Credit Card": "la tarjeta de crédito",
  "Debit Card": "la tarjeta de débito",
  "Check": "el cheque",
  "Money Order": "el giro postal",
  "Signature": "la firma",
  "ATM": "el cajero automático",
  "Withdraw": "retirar (dinero)",
  "Deposit": "depositar (dinero)",
  "Online": "en línea",
  "Return": "la devolución",
  "Exchange": "el cambio",
  "Refund": "el reembolso",
  "Large": "grande",
  "Big": "grande",
  "Medium": "mediano/a",
  "Small": "pequeño/a",
  "New": "nuevo/a",
  "Used": "usado/a",
  "Christmas Tree": "el árbol de Navidad",
  "Ornaments": "los adornos",
  "Lights": "las luces",
  "Santa": "Papá Noel / Santa Claus",
  "Gift": "el regalo",
  "Landlord": "el/la dueño/a",
  "Manager": "el/la gerente",
  "Agent": "el/la agente",
  "Real Estate": "los bienes raíces",
  "Tenant": "el/la inquilino/a",
  "Leak": "la gotera",
  "Broken Window": "la ventana rota",
  "Clogged Toilet": "el inodoro tapado",
  "Complaint": "la queja",
  "Home": "el hogar",
  "Apartment": "el apartamento / el departamento",
  "Condominium": "el condominio",
  "Unit": "la unidad",
  "Rent": "la renta / el alquiler",
  "Lease": "el contrato de arrendamiento",
  "Fee": "la tarifa",
  "Security deposit": "el depósito de seguridad",
  "Laundry": "la lavandería",
  "Mortgage": "la hipoteca",
  "Down payment": "el pago inicial",
  "Utilities": "los servicios públicos",
  "Gas": "el gas",
  "Water": "el agua",
  "Electric": "la electricidad",
  "Heat": "la calefacción",
  "Room": "el cuarto",
  "Bathroom": "el baño",
  "Kitchen": "la cocina",
  "Bedroom": "la habitación",
  "Living room": "la sala",
  "Hall": "el pasillo",
  "Floor": "el piso",
  "Basement": "el sótano",
  "Attic": "el ático",
  "Roof": "el techo",
  "Chimney": "el conducto de humos / el tiro",
  "Door": "la puerta",
  "Front": "el frente",
  "Lock": "la cerradura",
  "Stairs": "las escaleras",
  "Porch": "el porche",
  "Deck": "la terraza",
  "Garage": "el garaje",
  "Driveway": "la cochera / la entrada de autos",
  "Yard": "el patio",
  "Garden": "el jardín",
  "Window": "la ventana",
  "End table": "la mesita",
  "Coffee table": "la mesa de centro",
  "Plant": "la planta",
  "Lamp": "la lámpara",
  "Light": "la luz",
  "Painting": "el cuadro",
  "Rug": "la alfombra",
  "Carpet": "la alfombra",
  "Bathtub": "la bañera",
  "Sink": "el lavabo",
  "Toilet": "el inodoro",
  "Curtain": "la cortina",
  "Bed": "la cama",
  "Closet": "el clóset",
  "Bedtable": "la mesita de noche",
  "Refrigerator": "el refrigerador / la heladera",
  "Microwave": "el microondas",
  "Oven": "el horno",
  "Counter": "el mostrador",
  "Cabinet": "el gabinete",
  "Sofa": "el sofá",
  "Armchair": "el sillón",
  "TV": "el televisor",
  "Fireplace": "la chimenea (hogar) / el hogar",
  "Washer": "la lavadora",
  "Dryer": "la secadora",
  "Under": "debajo de",
  "Over": "encima de",
  "Homemaker": "el/la ama de casa",
  "Mechanic": "el/la mecánico/a",
  "Office assistant": "el/la asistente de oficina",
  "Administrative assistant": "el/la asistente administrativo/a",
  "Secretary": "el/la secretario/a",
  "Receptionist": "el/la recepcionista",
  "Server": "el/la mesero/a",
  "Busser": "el/la ayudante de mesero",
  "Cook": "el/la cocinero/a",
  "Prep Cook": "el/la cocinero/a de preparación",
  "Chef": "el/la chef",
  "Dishwasher": "el/la lavaplatos",
  "Host": "el/la anfitrión/a",
  "Custodian": "el/la conserje",
  "Cashier": "el/la cajero/a",
  "Principal": "el/la director/a",
  "Doctor": "el/la médico/a",
  "Nurse": "el/la enfermero/a",
  "Dentist": "el/la dentista",
  "Painter": "el/la pintor/a",
  "Plumber": "el/la plomero/a",
  "Electrician": "el/la electricista",
  "Construction worker": "el/la trabajador/a de construcción",
  "Housekeeper": "el/la empleado/a doméstico/a",
  "Driver": "el/la conductor/a",
  "Landscaper": "el/la jardinero/a",
  "Salesperson": "el/la vendedor/a",
  "Business owner": "el/la dueño/a de negocio",
  "Pay": "el pago",
  "Salary": "el salario",
  "Benefits": "los beneficios",
  "Full-time": "tiempo completo",
  "Part-time": "tiempo parcial",
  "Title": "el título",
  "Experience": "la experiencia",
  "Break": "el descanso",
  "Hired": "contratado/a",
  "Fired": "despedido/a",
  "Laid off": "despedido/a (por recorte)",
  "Employee": "el/la empleado/a",
  "Paycheck": "el cheque de pago",
  "Uniform": "el uniforme",
  "Boss": "el/la jefe/a",
  "Interview": "la entrevista",
  "Employer": "el/la empleador/a",
  "Taxes": "los impuestos",
  "Application": "la solicitud",
  "Vacation": "las vacaciones",
  "Sick leave": "la licencia por enfermedad",
  "Insurance": "el seguro",
  "Resume": "el currículum",
  "Raise": "el aumento",
  "Skill": "la habilidad",
  "Strength": "la fortaleza",
  "Teamwork": "el trabajo en equipo",
  "Problem-Solving": "la resolución de problemas",
  "Communication": "la comunicación",
  "Leadership": "el liderazgo",
  "Creative": "creativo/a",
  "Flexible": "flexible",
  "Organized": "organizado/a",
  "Dependable": "confiable",
  "Honest": "honesto/a",
  "Hard-Working": "trabajador/a",
  "Respectful": "respetuoso/a",
  "Head": "la cabeza",
  "Arms": "los brazos",
  "Chest": "el pecho",
  "Hands": "las manos",
  "Stomach": "el estómago",
  "Back": "la espalda",
  "Fingers": "los dedos",
  "Legs": "las piernas",
  "Foot": "el pie",
  "Feet": "los pies",
  "Toes": "los dedos del pie",
  "Neck": "el cuello",
  "Ears": "las orejas / los oídos",
  "Mouth": "la boca",
  "Nose": "la nariz",
  "Tooth": "el diente",
  "Teeth": "los dientes",
  "Throat": "la garganta",
  "Pain": "el dolor",
  "Cut": "el corte",
  "Dry cough": "la tos seca",
  "Fever": "la fiebre",
  "Headache": "el dolor de cabeza",
  "Runny nose": "la nariz con mocos",
  "Sore Throat": "el dolor de garganta",
  "Sneezing": "los estornudos",
  "Backache": "el dolor de espalda",
  "Toothache": "el dolor de muela",
  "Chills": "los escalofríos",
  "Sweats": "la sudoración",
  "Fatigue": "el cansancio",
  "Dizziness": "el mareo",
  "Itch": "la picazón",
  "Rash": "el sarpullido",
  "Swelling": "la hinchazón",
  "Nausea": "las náuseas",
  "Stress": "el estrés",
  "Prescription": "la receta médica",
  "Reliever": "el analgésico",
  "Syrup": "el jarabe",
  "Lozenges": "las pastillas",
  "Pills": "las píldoras",
  "Tablets": "las tabletas",
  "Vaccine": "la vacuna",
  "Allergy": "la alergia",
  "Cold": "el resfriado",
  "Flu": "la gripe",
  "Infection": "la infección",
  "Sprain": "el esguince",
  "Medical center": "el centro médico",
  "Elevators": "los elevadores / los ascensores",
  "Lobby": "el vestíbulo",
  "Checkup": "el chequeo",
  "Physical": "el examen físico",
  "Surgery": "la cirugía",
  "Muscles": "los músculos",
  "Weight": "el peso",
  "Heart": "el corazón",
  "Vegetables": "las verduras",
  "Fruits": "las frutas",
  "Whole grains": "los granos integrales",
  "Protein": "la proteína",
  "Dairy": "los lácteos",
  "Junk food": "la comida chatarra / la comida basura",
  "Cereal": "el cereal",
  "Bread": "el pan",
  "Toast": "el pan tostado",
  "Nuts": "los frutos secos",
  "Walnuts": "las nueces",
  "Peanuts": "los cacahuates / el maní",
  "Almonds": "las almendras",
  "Eggs": "los huevos",
  "Milk": "la leche",
  "Cheese": "el queso",
  "Yogurt": "el yogur / el yogurt",
  "Chicken": "el pollo",
  "Beef": "la carne de res",
  "Pork": "la carne de cerdo",
  "Fish": "el pescado",
  "Tuna": "el atún",
  "Rice": "el arroz",
  "Beans": "los frijoles / los porotos",
  "Soup": "la sopa",
  "Tomatoes": "los tomates",
  "Carrots": "las zanahorias",
  "Avocados": "los aguacates / las paltas",
  "Broccoli": "el brócoli",
  "Cucumber": "el pepino",
  "Corn": "el maíz / el choclo",
  "Celery": "el apio",
  "Lettuce": "la lechuga",
  "Spinach": "la espinaca",
  "Salad": "la ensalada",
  "Oil": "el aceite",
  "Salt": "la sal",
  "Pepper": "la pimienta",
  "Garlic": "el ajo",
  "Ketchup": "la catsup",
  "Mustard": "la mostaza",
  "Jam": "la mermelada",
  "Jelly": "la jalea",
  "Peanut butter": "la mantequilla de maní / de cacahuate",
  "Apples": "las manzanas",
  "Oranges": "las naranjas",
  "Bananas": "los plátanos / los bananos",
  "Pears": "las peras",
  "Watermelon": "la sandía",
  "Melon": "el melón",
  "Strawberry": "la fresa / la frutilla",
  "Pineapple": "la piña",
  "Blueberry": "el arándano azul",
  "French Fries": "las papas fritas",
  "Hamburger": "la hamburguesa",
  "Pasta": "la pasta",
  "Sandwich": "el sándwich",
  "Crackers": "las galletas saladas",
  "Cookies": "las galletas",
  "Ice Cream": "el helado",
  "Cake": "el pastel",
  "Candy": "el dulce",
  "Potato Chips": "las papas fritas de bolsa",
  "Bottled water": "el agua embotellada",
  "Juice": "el jugo",
  "Soda": "el refresco / la gaseosa",
  "Can": "la lata",
  "Jar": "el frasco",
  "Bag": "la bolsa",
  "Box": "la caja",
  "Package": "el paquete",
  "Nutrition": "la nutrición",
  "Sugar": "el azúcar",
  "Fat": "la grasa",
  "Carbohydrates": "los carbohidratos",
  "Calories": "las calorías",
  "Menu": "el menú",
  "Food label": "la etiqueta nutricional",
  "Habits": "los hábitos",
};

// Curated fill-in-the-blank sentences for terms that use auto-generated examples.
// These are unambiguous — only the keyed term fits logically.
const CURATED_FILL_BLANK_SENTENCES: Record<string, string> = {
  "Sunday": "We go to church every _____.",
  "Monday": "School starts again on _____ after the weekend.",
  "Tuesday": "My doctor's appointment is on _____.",
  "Wednesday": "English class meets on _____ evening.",
  "Thursday": "We have a staff meeting every _____.",
  "Friday": "Many people finish work early on _____.",
  "Saturday": "The farmers market is open on _____.",
  "January": "The new year begins in _____.",
  "February": "Valentine's Day is in _____.",
  "March": "Spring begins in _____.",
  "April": "Tax forms are due in _____.",
  "May": "Mother's Day is celebrated in _____.",
  "June": "Many students graduate in _____.",
  "July": "Independence Day is on July 4th, in _____.",
  "August": "It is very hot in _____ where I come from.",
  "September": "School starts in _____ in the United States.",
  "October": "Halloween is on October 31st, in _____.",
  "November": "Thanksgiving is in _____.",
  "December": "Christmas is in _____.",
  "Week": "There are seven days in one _____.",
  "Month": "February is the shortest _____ of the year.",
  "Today": "_____ is Tuesday, so English class is tonight.",
  "Tomorrow": "My dentist appointment is _____ at 10 a.m.",
  "Yesterday": "I forgot my homework _____, so I brought it today.",
  "Next": "We will have a test _____ Monday.",
  "Time": "What _____ does the bus come?",
  "Schedule": "The doctor's office sent me a new _____ for my appointments.",
  "Calendar": "I wrote the appointment on my _____.",
  "Appointment": "I need to make an _____ with my doctor.",
  "Half": "The meeting starts at _____ past nine.",
  "Hour": "The bus ride takes about one _____.",
  "Minute": "Please wait one _____ — I am almost ready.",
  "Breakfast": "I eat _____ every morning before work.",
  "Lunch": "I eat _____ at noon.",
  "Dinner": "Our family eats _____ together at 7 p.m.",
  "Shower": "I take a _____ every morning before school.",
  "O'clock": "Class starts at eight _____.",
  "Father": "My _____ taught me how to drive.",
  "Mother": "My _____ makes dinner every night.",
  "Sister": "My _____ and I share a bedroom.",
  "Brother": "My _____ is two years older than me.",
  "Son": "Their _____ is in first grade this year.",
  "Daughter": "Their _____ just started college.",
  "Cousin": "My _____ and I grew up in the same city.",
  "Uncle": "My _____ is my mother's brother.",
  "Aunt": "My _____ brings tamales to every family party.",
  "Niece": "My _____ is my sister's daughter.",
  "Nephew": "My _____ is my brother's son.",
  "Grandmother": "My _____ lives with us and helps with the children.",
  "Grandfather": "My _____ tells stories about his home country.",
  "Husband": "My _____ works at the hospital.",
  "Wife": "His _____ is a teacher at the elementary school.",
  "Parent": "Every _____ wants a good life for their child.",
  "Child": "Every _____ in the class has a backpack.",
  "Children": "The _____ played in the park after school.",
  "Mother-in-law": "My _____ is my husband's mother.",
  "Father-in-law": "My _____ is my wife's father.",
  "Sister-in-law": "My _____ married my brother last year.",
  "Brother-in-law": "My _____ is my wife's brother.",
  "Members": "All _____ of the family came to the party.",
  "Relationship": "She has a good _____ with her coworkers.",
  "Paper": "Please take out a piece of _____ to write on.",
  "Book": "Open your _____ to page 12.",
  "Pen": "Can I borrow your _____ to sign this form?",
  "Notebook": "Write the new words in your _____.",
  "Textbook": "Please bring your _____ to every class.",
  "Workbook": "Complete page 5 in your _____ for homework.",
  "Pencil sharpener": "My pencil broke, so I used the _____.",
  "Board": "The teacher wrote the new words on the _____.",
  "Marker": "She used a red _____ to write on the whiteboard.",
  "Eraser": "He used the _____ to remove the mistake from the board.",
  "Desk": "Please put your phone inside your _____.",
  "Chair": "Please sit in your _____ and open your book.",
  "Teacher": "The _____ explains the grammar lesson every day.",
  "Student": "Every _____ needs to bring a pencil to the test.",
  "Classmate": "My _____ helped me understand the homework.",
  "Partner": "Work with a _____ to practice the dialogue.",
  "Group": "Please work in a _____ of three people.",
  "Hair": "She has long black _____.",
  "Eyes": "He has brown _____.",
  "Short": "My son is _____ because he is only five years old.",
  "Long": "She has _____ hair that goes past her shoulders.",
  "Straight": "Her hair is very _____ and smooth.",
  "Wavy": "His hair is not straight or curly — it is _____.",
  "Curly": "The little girl has _____ red hair.",
  "Bald": "My grandfather has no hair — he is _____.",
  "Brown": "She has _____ eyes and dark hair.",
  "Red": "He has _____ hair and pale skin.",
  "Black": "My mother has _____ hair and dark eyes.",
  "Blond": "The child has _____ hair and blue eyes.",
  "Gray": "My father's hair is _____ now because he is 60.",
  "Tall": "The basketball player is very _____.",
  "Young": "She looks very _____ for her age.",
  "Old": "The building is very _____ — it was built 100 years ago.",
  "Thin": "He was very _____ when he was sick.",
  "Heavy": "The box is very _____ — I need help to lift it.",
  "Candidate": "Each _____ gave a speech before the election.",
  "Ballot": "She folded her _____ and put it in the box.",
  "Voter": "Every _____ must show ID at the polling place.",
  "Election": "The presidential _____ is held every four years.",
  "Campaign": "The _____ started six months before the vote.",
  "Political Party": "She joined a _____ to support her candidate.",
  "Doctor's office": "I called the _____ to make an appointment.",
  "Dentist's office": "I went to the _____ to get my teeth cleaned.",
  "Hospital": "She had her baby at the _____ downtown.",
  "Hotel": "They stayed at a _____ near the airport.",
  "House": "They bought a _____ with three bedrooms.",
  "Park": "The children play in the _____ after school.",
  "Playground": "The kids ran to the _____ to go on the swings.",
  "Supermarket": "I buy food at the _____ every week.",
  "Bank": "I need to go to the _____ to deposit my paycheck.",
  "Library": "You can borrow books for free at the _____.",
  "Post Office": "I went to the _____ to mail a package.",
  "Fire Department": "The _____ sent two trucks to the burning building.",
  "Police Station": "She went to the _____ to report a stolen bike.",
  "RMV": "I went to the _____ to get my driver's license.",
  "Bus Stop": "I wait at the _____ at 7 a.m. every day.",
  "Station": "The train leaves from South _____ at noon.",
  "Public Transportation": "She takes _____ to work because she does not have a car.",
  "City Hall": "You can get a marriage license at _____.",
  "Clinic": "The community _____ offers free health services.",
  "School": "My children walk to _____ every morning.",
  "Museum": "We visited the history _____ on a field trip.",
  "Restaurant": "We went to a _____ to celebrate her birthday.",
  "Store": "I went to the _____ to buy new shoes.",
  "Pharmacy": "I picked up my medication at the _____.",
  "Gym": "He goes to the _____ three times a week to exercise.",
  "Airport": "We arrived at the _____ two hours before our flight.",
  "Laundromat": "I wash my clothes at the _____ on the corner.",
  "Transportation": "The city has good _____ — buses run every 10 minutes.",
  "Medical Care": "Everyone should have access to _____.",
  "Education": "Good _____ helps people find better jobs.",
  "Shopping": "She does her _____ at the supermarket on Saturdays.",
  "Housing": "Finding affordable _____ in the city is difficult.",
  "Call": "Please _____ the doctor's office to make an appointment.",
  "Message": "I sent him a _____ but he did not reply.",
  "Voicemail": "She left a _____ because I did not answer my phone.",
  "Email": "The teacher sent the homework by _____.",
  "Left": "Turn _____ on Main Street.",
  "Right": "The bank is on the _____ side of the street.",
  "Around": "Walk _____ the building to find the back entrance.",
  "In": "The milk is _____ the refrigerator.",
  "At": "I will meet you _____ the bus stop.",
  "On": "The book is _____ the desk.",
  "In front of": "The bus stop is _____ the school.",
  "Behind": "The parking lot is _____ the store.",
  "Between": "The pharmacy is _____ the bank and the library.",
  "Next to": "The park is _____ the police station.",
  "Across from": "The post office is _____ the supermarket.",
  "Never": "I _____ eat fast food because it makes me feel sick.",
  "Rarely": "She _____ misses class — maybe once a year.",
  "Sometimes": "He _____ walks to work when the weather is nice.",
  "Usually": "I _____ take the bus, but today I drove.",
  "Always": "She _____ arrives to class on time.",
  "Thanks": "She said _____ after I held the door open for her.",
  "Meal": "Thanksgiving dinner is a big _____ shared with family.",
  "Turkey": "We roasted a _____ for the Thanksgiving feast.",
  "Indigenous": "Thanksgiving has roots in _____ history.",
  "Pilgrim": "The _____ came to America on the Mayflower.",
  "Shirt": "He wore a white _____ and a tie to the interview.",
  "Suit": "He wore a _____ to the job interview.",
  "Sweater": "She put on a _____ because the classroom was cold.",
  "Cap": "He wore a baseball _____ to keep the sun out of his eyes.",
  "Dress": "She wore a red _____ to the party.",
  "Socks": "I need to buy new _____ because mine have holes.",
  "Hat": "She wore a warm _____ because it was snowing.",
  "Shoes": "Please take off your _____ at the door.",
  "Sneakers": "He wears _____ to the gym every day.",
  "Blouse": "She wore a white _____ with her black skirt.",
  "Coat": "It is very cold outside — please wear your _____.",
  "Skirt": "She wore a long _____ and a blouse to work.",
  "Belt": "His pants were loose, so he wore a _____.",
  "Pants": "He bought new _____ for his job interview.",
  "Shorts": "It is hot today, so I am wearing _____.",
  "Electronics": "The store sells _____ like televisions and computers.",
  "Computer": "I use my _____ to do homework at home.",
  "Car": "He drives his _____ to work every day.",
  "Cellphone": "She uses her _____ to call her family.",
  "Receipt": "Keep your _____ in case you need to return the item.",
  "Tax": "The price on the label does not include _____.",
  "Price": "The _____ of the jacket is $45.",
  "Cash": "I paid with _____ because the card machine was broken.",
  "Credit Card": "She paid for the groceries with her _____.",
  "Debit Card": "He used his _____ to pay directly from his bank account.",
  "Check": "She wrote a _____ to pay her rent.",
  "Money Order": "He bought a _____ at the post office to pay the bill.",
  "Signature": "Please write your _____ at the bottom of the form.",
  "ATM": "I took out $40 from the _____ on the corner.",
  "Withdraw": "I need to _____ $100 from the bank.",
  "Deposit": "She went to the bank to _____ her paycheck.",
  "Online": "I paid my electric bill _____ this month.",
  "Return": "I need to _____ these shoes because they are the wrong size.",
  "Exchange": "Can I _____ this shirt for a bigger size?",
  "Refund": "The store gave her a _____ because the product was broken.",
  "Large": "She ordered a _____ coffee because she was very tired.",
  "Big": "They moved into a _____ apartment with four bedrooms.",
  "Medium": "The _____ pizza feeds about three people.",
  "Small": "This shirt is too _____ — I need a larger size.",
  "New": "She bought a _____ car last week.",
  "Used": "He bought a _____ car because it was cheaper.",
  "Christmas Tree": "We decorated the _____ with lights and ornaments.",
  "Ornaments": "The children hung _____ on the Christmas tree.",
  "Lights": "We put _____ on the Christmas tree to make it bright.",
  "Santa": "The children left cookies out for _____ on Christmas Eve.",
  "Gift": "She wrapped a _____ for her daughter's birthday.",
  "Landlord": "The _____ fixed the broken heater in our apartment.",
  "Manager": "The building _____ collects rent on the first of the month.",
  "Agent": "The real estate _____ showed us three apartments.",
  "Real Estate": "She works in _____ and helps people buy homes.",
  "Tenant": "The _____ paid rent on the first of every month.",
  "Leak": "There is a water _____ under the kitchen sink.",
  "Broken Window": "The apartment had a _____ that let in cold air.",
  "Clogged Toilet": "I called the plumber because of a _____.",
  "Complaint": "She made a _____ about the noisy neighbors.",
  "Home": "After a long day, it feels good to come _____.",
  "Apartment": "She rents a two-bedroom _____ near the school.",
  "Condominium": "He bought a _____ in the city center.",
  "Unit": "We live in _____ 3B on the second floor.",
  "Rent": "My _____ is $1,200 per month.",
  "Lease": "She signed a one-year _____ for the apartment.",
  "Fee": "There is a $50 _____ for a late rent payment.",
  "Security deposit": "I paid a _____ of one month's rent before moving in.",
  "Laundry": "I do my _____ at the laundromat on Saturday.",
  "Mortgage": "They pay a _____ every month to the bank for their house.",
  "Down payment": "They saved money for a _____ on their first home.",
  "Utilities": "The rent is $900, and _____ cost about $100 more.",
  "Gas": "The _____ bill is higher in winter because of the heat.",
  "Water": "The _____ bill is included in our rent.",
  "Electric": "The _____ bill goes up when we use the air conditioner.",
  "Heat": "The apartment has no _____, so it is very cold in winter.",
  "Room": "There is only one extra _____ in the apartment.",
  "Bathroom": "There is only one _____ in our apartment.",
  "Kitchen": "She cooks dinner in the _____ every evening.",
  "Bedroom": "The children share a _____.",
  "Living room": "We watch TV together in the _____.",
  "Hall": "The _____ connects the bedroom to the bathroom.",
  "Floor": "The kitchen _____ is dirty — I need to mop it.",
  "Basement": "They store extra boxes in the _____.",
  "Attic": "We keep old furniture in the _____.",
  "Roof": "There is a hole in the _____ and rain comes in.",
  "Chimney": "Santa Claus comes down the _____.",
  "Door": "Please close the _____ when you leave.",
  "Front": "I will meet you at the _____ of the building.",
  "Back": "The trash cans are in the _____ of the house.",
  "Lock": "She put a new _____ on the front door for safety.",
  "Stairs": "Take the _____ to the second floor.",
  "Porch": "They sit on the _____ and drink coffee in the morning.",
  "Deck": "They have a _____ behind the house with a table and chairs.",
  "Garage": "He parks his car in the _____ at night.",
  "Driveway": "She parked her car in the _____ in front of the house.",
  "Yard": "The children play in the _____ after school.",
  "Garden": "She grows tomatoes in her _____ every summer.",
  "Window": "Please open the _____ — it is very hot in here.",
  "End table": "She put the lamp on the _____ beside the sofa.",
  "Coffee table": "He put his drink on the _____ in front of the sofa.",
  "Plant": "She waters the _____ by the window every day.",
  "Lamp": "She turned on the _____ because the room was dark.",
  "Light": "Please turn off the _____ when you leave the room.",
  "Painting": "There is a beautiful _____ on the living room wall.",
  "Rug": "There is a soft _____ under the coffee table.",
  "Carpet": "The bedroom has _____ on the floor.",
  "Bathtub": "He fills the _____ with warm water and takes a bath.",
  "Sink": "Wash your hands in the _____.",
  "Toilet": "The _____ in the bathroom is clogged.",
  "Curtain": "She closed the _____ to block the sunlight.",
  "Bed": "I make my _____ every morning.",
  "Closet": "She hangs her coats in the hall _____.",
  "Bedtable": "She keeps her phone on the _____ while she sleeps.",
  "Refrigerator": "Put the leftovers in the _____ so they stay fresh.",
  "Microwave": "I heated my lunch in the _____ for two minutes.",
  "Oven": "She baked cookies in the _____ at 350 degrees.",
  "Counter": "She put the groceries on the kitchen _____.",
  "Cabinet": "The plates are in the _____ above the sink.",
  "Sofa": "They sat on the _____ and watched a movie.",
  "Armchair": "He likes to read in his _____ by the window.",
  "TV": "She turned on the _____ to watch the news.",
  "Fireplace": "They sat by the _____ to stay warm in winter.",
  "Washer": "Put your clothes in the _____ and add detergent.",
  "Dryer": "The clothes are wet — please put them in the _____.",
  "Under": "The cat is sleeping _____ the bed.",
  "Over": "She hung a picture _____ the fireplace.",
  "Homemaker": "She is a _____ and takes care of her children at home.",
  "Mechanic": "The _____ fixed my car's engine.",
  "Office assistant": "The _____ answered phones and filed documents.",
  "Administrative assistant": "The _____ scheduled all the manager's meetings.",
  "Secretary": "The _____ typed the letters and sent them out.",
  "Receptionist": "The _____ greeted patients at the front desk.",
  "Server": "The _____ took our order and brought our food.",
  "Busser": "The _____ cleared the dishes from the table.",
  "Cook": "The _____ prepared the soup and the sandwiches.",
  "Prep Cook": "The _____ cut the vegetables before the restaurant opened.",
  "Chef": "The _____ created a new dish for the menu.",
  "Dishwasher": "The _____ cleaned all the pots and plates after dinner.",
  "Host": "The _____ welcomed guests and showed them to their table.",
  "Custodian": "The _____ cleaned the school building every evening.",
  "Cashier": "The _____ counted my change and gave me a receipt.",
  "Principal": "The school _____ spoke to parents at the meeting.",
  "Doctor": "The _____ told me to rest and drink lots of water.",
  "Nurse": "The _____ checked my blood pressure before the exam.",
  "Dentist": "The _____ cleaned my teeth and took X-rays.",
  "Painter": "The _____ painted all the walls in the new apartment.",
  "Plumber": "The _____ fixed the leak under the kitchen sink.",
  "Electrician": "The _____ repaired the wiring in the bathroom.",
  "Construction worker": "The _____ wore a hard hat at the job site.",
  "Housekeeper": "The _____ cleaned the hotel rooms every morning.",
  "Driver": "The _____ picked us up and took us to the airport.",
  "Landscaper": "The _____ mowed the lawn and planted flowers.",
  "Salesperson": "The _____ helped me find the right size jacket.",
  "Business owner": "The _____ opens the restaurant at 7 a.m. every day.",
  "Pay": "He receives his _____ every two weeks.",
  "Salary": "Her _____ is $3,000 per month.",
  "Benefits": "The job offers good _____, including health insurance.",
  "Full-time": "She works _____ — 40 hours a week.",
  "Part-time": "He works _____ in the evenings after school.",
  "Title": "Her job _____ is Administrative Assistant.",
  "Experience": "The job requires two years of _____.",
  "Break": "Workers get a 15-minute _____ in the morning.",
  "Hired": "She was _____ after a great interview.",
  "Fired": "He was _____ because he missed too many days of work.",
  "Laid off": "Many workers were _____ when the company closed.",
  "Employee": "Every _____ must sign in when they arrive.",
  "Paycheck": "She deposits her _____ in the bank every Friday.",
  "Uniform": "All workers wear a _____ with the company logo.",
  "Boss": "My _____ asked me to stay late to finish the project.",
  "Interview": "She practiced her answers before the job _____.",
  "Employer": "My _____ provides health insurance for all workers.",
  "Taxes": "He pays _____ from his salary every month.",
  "Application": "Please fill out this job _____ and return it today.",
  "Vacation": "She took one week of _____ to visit her family.",
  "Sick leave": "He used _____ when he had the flu.",
  "Insurance": "Health _____ helps pay for doctor visits.",
  "Resume": "She updated her _____ before applying for the job.",
  "Raise": "After one year, she received a pay _____ of $2 per hour.",
  "Skill": "Speaking two languages is an important _____ for this job.",
  "Strength": "Honesty is one of her greatest _____ as an employee.",
  "Teamwork": "Good _____ helps the whole group finish faster.",
  "Problem-Solving": "The manager praised her _____ when the machine broke.",
  "Communication": "Good _____ is important when working with customers.",
  "Leadership": "She showed great _____ when she trained the new workers.",
  "Creative": "She is very _____ and always thinks of new ideas.",
  "Flexible": "A good employee is _____ and can work different hours.",
  "Organized": "He is very _____ and always finishes work on time.",
  "Dependable": "She is _____ — she is never late and always keeps her promises.",
  "Honest": "He is very _____ and always tells the truth at work.",
  "Hard-Working": "She is _____ and never leaves before the job is done.",
  "Respectful": "He is _____ to all his coworkers, even when there is a problem.",
  "Head": "She wore a hat on her _____ to stay warm.",
  "Arms": "She raised her _____ to ask a question in class.",
  "Chest": "He felt pain in his _____ and went to the emergency room.",
  "Hands": "Wash your _____ before you eat.",
  "Stomach": "She has a _____ ache after eating too much.",
  "Fingers": "She cut her _____ while cooking dinner.",
  "Legs": "His _____ hurt after he ran five miles.",
  "Foot": "He hurt his _____ when he stepped on a rock.",
  "Feet": "My _____ hurt after standing all day at work.",
  "Toes": "She stubbed her _____ on the chair.",
  "Neck": "He pulled a muscle in his _____ and cannot turn his head.",
  "Ears": "She covers her _____ with a hat when it is cold outside.",
  "Mouth": "Open your _____ and say 'ahh,' said the doctor.",
  "Nose": "Her _____ is running because she has a cold.",
  "Tooth": "One _____ hurts, so I need to see the dentist.",
  "Teeth": "He brushes his _____ twice a day.",
  "Throat": "She has a sore _____ and it hurts to swallow.",
  "Pain": "She felt a sharp _____ in her lower back.",
  "Cut": "He got a _____ on his hand while cooking.",
  "Dry cough": "She has a _____ that will not go away.",
  "Fever": "The child had a _____ of 102 degrees.",
  "Headache": "I have a _____ from staring at the screen too long.",
  "Runny nose": "She has a _____ and keeps blowing her nose.",
  "Sore Throat": "It hurts to swallow because he has a _____.",
  "Sneezing": "She keeps _____ because of her allergies.",
  "Backache": "He has a _____ from lifting heavy boxes at work.",
  "Toothache": "She has a _____ and needs to see the dentist.",
  "Chills": "He had a fever and _____ all night.",
  "Sweats": "She woke up in the middle of the night with night _____.",
  "Fatigue": "She felt great _____ after working a double shift.",
  "Dizziness": "She felt _____ when she stood up too fast.",
  "Itch": "The mosquito bite made her skin _____ all day.",
  "Rash": "He had a red _____ on his arm after touching a plant.",
  "Swelling": "There is _____ in her ankle after she twisted it.",
  "Nausea": "The medicine made her feel _____ for the first few days.",
  "Stress": "Too much _____ at work can make you sick.",
  "Prescription": "The doctor gave her a _____ for antibiotics.",
  "Reliever": "She took a pain _____ for her headache.",
  "Syrup": "He took cough _____ to help with his cough.",
  "Lozenges": "She sucked on throat _____ to soothe her sore throat.",
  "Pills": "Take two _____ with a full glass of water.",
  "Tablets": "The doctor told him to take two _____ every eight hours.",
  "Vaccine": "She got the flu _____ at the pharmacy.",
  "Allergy": "He has an _____ to cats and sneezes near them.",
  "Cold": "She has a _____ and needs to rest and drink fluids.",
  "Flu": "He had the _____ last winter and missed a week of work.",
  "Infection": "The cut got dirty and caused a skin _____.",
  "Sprain": "She has an ankle _____ from falling on the stairs.",
  "Medical center": "The _____ is open 24 hours a day.",
  "Elevators": "Take the _____ to the third floor for the doctor's office.",
  "Lobby": "Please wait in the _____ until the nurse calls your name.",
  "Checkup": "He goes to the doctor for a yearly _____.",
  "Physical": "She had a _____ before starting her new job.",
  "Surgery": "The doctor said he needs _____ on his knee.",
  "Muscles": "He lifted weights at the gym to build his _____.",
  "Weight": "The doctor checked her _____ at the start of the visit.",
  "Heart": "Exercise is good for your _____.",
  "Vegetables": "She eats _____ like carrots and broccoli every day.",
  "Fruits": "Apples and bananas are popular _____.",
  "Whole grains": "Brown rice and oatmeal are examples of _____.",
  "Protein": "Chicken, beans, and eggs are good sources of _____.",
  "Dairy": "Milk, cheese, and yogurt are _____ products.",
  "Junk food": "Soda and chips are _____ — they have little nutrition.",
  "Cereal": "She eats _____ with milk every morning.",
  "Bread": "He made a sandwich with two slices of _____.",
  "Toast": "She had _____ with butter and jam for breakfast.",
  "Nuts": "She added _____ to her salad for extra protein.",
  "Walnuts": "She puts _____ in her oatmeal every morning.",
  "Peanuts": "He is allergic to _____ and cannot eat them.",
  "Almonds": "She eats a handful of _____ as a snack.",
  "Eggs": "She made scrambled _____ for breakfast.",
  "Milk": "He drinks a glass of _____ with his breakfast.",
  "Cheese": "She put _____ on top of the pasta.",
  "Yogurt": "She eats _____ with fruit for a healthy snack.",
  "Chicken": "She grilled _____ for dinner with rice and salad.",
  "Beef": "The soup is made with _____ and vegetables.",
  "Pork": "He cooked _____ chops with potatoes.",
  "Fish": "They eat _____ every Friday night.",
  "Tuna": "She made a _____ sandwich for lunch.",
  "Rice": "She cooked _____ and beans for dinner.",
  "Beans": "He added black _____ to the soup.",
  "Soup": "She made chicken _____ when her son was sick.",
  "Tomatoes": "She sliced the _____ and added them to the salad.",
  "Carrots": "She put _____ and celery in the soup.",
  "Avocados": "She mashed _____ to make guacamole.",
  "Broccoli": "She steamed _____ as a side dish for dinner.",
  "Cucumber": "She sliced the _____ and added it to the salad.",
  "Corn": "They boiled _____ on the cob for the cookout.",
  "Celery": "She dips _____ in peanut butter for a snack.",
  "Lettuce": "She put _____ and tomatoes on the sandwich.",
  "Spinach": "She added _____ to the salad for extra nutrients.",
  "Salad": "She made a _____ with lettuce, tomatoes, and cucumber.",
  "Oil": "He cooked the vegetables in olive _____.",
  "Salt": "She added _____ and pepper to the soup.",
  "Pepper": "She added _____ to the eggs while cooking.",
  "Garlic": "She adds _____ to almost every dish she cooks.",
  "Ketchup": "He put _____ on his French fries.",
  "Mustard": "She put _____ on her hot dog.",
  "Jam": "She spread _____ on her toast for breakfast.",
  "Jelly": "She made a peanut butter and _____ sandwich.",
  "Peanut butter": "He spread _____ on his toast for protein.",
  "Apples": "She packed two _____ in her lunch bag.",
  "Oranges": "She peeled _____ for her children as a snack.",
  "Bananas": "He puts _____ in his cereal every morning.",
  "Pears": "She put _____ in the fruit salad.",
  "Watermelon": "They ate cold _____ at the picnic.",
  "Melon": "She cut the _____ into slices for dessert.",
  "Strawberry": "She put a _____ on top of the yogurt.",
  "Pineapple": "She added _____ to the fruit salad.",
  "Blueberry": "She added _____ to her oatmeal.",
  "French Fries": "He ordered a burger and _____ at the restaurant.",
  "Hamburger": "She made a _____ with lettuce and tomato.",
  "Pasta": "She cooked _____ with tomato sauce for dinner.",
  "Sandwich": "He made a turkey _____ for lunch.",
  "Crackers": "She ate _____ with cheese for a snack.",
  "Cookies": "She baked chocolate chip _____ for the class.",
  "Ice Cream": "The children asked for _____ after dinner.",
  "Cake": "She baked a birthday _____ for her son.",
  "Candy": "He gave out _____ to the children on Halloween.",
  "Potato Chips": "She opened a bag of _____ to snack on.",
  "Bottled water": "She drinks _____ throughout the day.",
  "Juice": "She drinks orange _____ with her breakfast.",
  "Soda": "He ordered a _____ with his meal.",
  "Can": "She opened a _____ of beans for the soup.",
  "Jar": "She bought a _____ of peanut butter at the store.",
  "Bag": "She bought a _____ of rice at the supermarket.",
  "Box": "He bought a _____ of cereal for breakfast.",
  "Package": "She opened a _____ of crackers from the cabinet.",
  "Food": "She brought _____ from home to eat at work.",
  "Nutrition": "The class learned about _____ and healthy eating.",
  "Sugar": "Too much _____ in your diet is bad for your teeth.",
  "Fat": "Butter and oil contain a lot of _____.",
  "Carbohydrates": "Bread, rice, and pasta are all _____.",
  "Calories": "That dessert has 400 _____.",
  "Menu": "She looked at the _____ to decide what to order.",
  "Food label": "She read the _____ to check how much sugar was in the drink.",
  "Habits": "Eating breakfast every day is one of her healthy _____.",
};

function buildFillBlankSentence(term: string, example: string, unitTitle: string): string {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(escaped, "i");
  if (pattern.test(example)) return example.replace(pattern, "_____");
  return `We practice the word "_____" in ${unitTitle}.`;
}

function buildContextualFillBlank(term: string, category: string, example: string): string {
  // Check curated sentences first — these are unambiguous and pedagogically sound
  if (CURATED_FILL_BLANK_SENTENCES[term]) {
    return CURATED_FILL_BLANK_SENTENCES[term];
  }

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
        SPANISH_TRANSLATIONS_BY_CATEGORY[category.label]?.[term] ??
        SPANISH_TRANSLATIONS[term] ??
        (typeof rawTerm === "string" ? buildSpanishDefinition(term, category.label) : rawTerm.spanishDefinition);
      const example =
        typeof rawTerm === "string"
          ? getLevel1ExampleSentence(rawUnit.slug, term, category.label, rawUnit.title)
          : rawTerm.example ?? getLevel1ExampleSentence(rawUnit.slug, term, category.label, rawUnit.title);
      // For fill-blank: use custom fillBlankSentence if provided, otherwise generate one
      const fillBlankSentence =
        typeof rawTerm === "object" && rawTerm.fillBlankSentence
          ? rawTerm.fillBlankSentence
          : buildContextualFillBlank(term, category.label, example);
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
