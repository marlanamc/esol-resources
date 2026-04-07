/**
 * Builds src/data/level1-vocab-custom-examples.ts with one unique example sentence
 * per Level 1 vocab card (all units except unit-1, which uses inline examples).
 *
 *   npx tsx scripts/content/build-level1-example-map.ts
 */
import * as fs from "fs";
import * as path from "path";
import { LEVEL1_PUBLIC_VOCAB_UNITS } from "../../src/data/public-level1-vocab";

function pair(slug: string, terms: readonly string[], sentences: readonly string[]): Record<string, string> {
  if (terms.length !== sentences.length) {
    throw new Error(`${slug}: ${terms.length} terms vs ${sentences.length} sentences`);
  }
  const out: Record<string, string> = {};
  for (let i = 0; i < terms.length; i++) {
    out[`${slug}::${terms[i]}`] = sentences[i]!;
  }
  return out;
}

const U2_DAYS: readonly string[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
  "Week",
  "Month",
  "Today",
  "Tomorrow",
  "Yesterday",
  "Next",
];

const U2_DAYS_S: readonly string[] = [
  "Many families go to church on Sunday.",
  "Monday is the first day of the work week.",
  "English class meets on Tuesday and Thursday.",
  "Wednesday is the middle of the week.",
  "Thursday is busy at the doctor's office.",
  "She gets paid every Friday.",
  "Saturday is a good day to visit the park.",
  "New Year's Day is in January.",
  "Valentine's Day is in February.",
  "Spring often starts in March.",
  "April can be rainy in New England.",
  "Many schools end the year in May.",
  "Summer vacation often begins in June.",
  "The Fourth of July is in July.",
  "August is usually very hot.",
  "School starts again in September.",
  "Halloween is in October.",
  "Thanksgiving is in November.",
  "Many people travel in December.",
  "I work five days a week.",
  "Rent is due once a month.",
  "Today is colder than yesterday.",
  "Tomorrow we have a parent meeting.",
  "Yesterday I filled out the form.",
  "Our next class is on Monday.",
];

const U2_ROUTINES_T: readonly string[] = [
  "Time",
  "Schedule",
  "Calendar",
  "Appointment",
  "Half",
  "Hour",
  "Minute",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Shower",
  "O'clock",
];

const U2_ROUTINES_S: readonly string[] = [
  "What time does the library close?",
  "I check my work schedule every Sunday night.",
  "Circle the test date on your calendar.",
  "I made an appointment for a physical exam.",
  "She ate half of her salad and saved the rest.",
  "The movie lasts about two hours.",
  "Please wait one minute while I print the paper.",
  "I eat breakfast before I leave for work.",
  "Lunch break starts at noon.",
  "We eat dinner together at the table.",
  "I take a shower after I exercise.",
  "School starts at eight o'clock in the morning.",
];

const U2_FAMILY_T: readonly string[] = [
  "Father",
  "Mother",
  "Sister",
  "Brother",
  "Son",
  "Daughter",
  "Cousin",
  "Uncle",
  "Aunt",
  "Niece",
  "Nephew",
  "Grandmother",
  "Grandfather",
  "Husband",
  "Wife",
  "Parent",
  "Child",
  "Children",
  "Mother-in-law",
  "Father-in-law",
  "Sister-in-law",
  "Brother-in-law",
  "Members",
  "Relationship",
];

const U2_FAMILY_S: readonly string[] = [
  "My father drives a taxi at night.",
  "Her mother cooks dinner every evening.",
  "My sister studies nursing at college.",
  "His brother lives in Texas.",
  "Their son is in first grade.",
  "Our daughter plays the violin.",
  "I see my cousin at family parties.",
  "My uncle works in construction.",
  "Her aunt sends birthday cards every year.",
  "My niece just learned to walk.",
  "His nephew plays soccer on weekends.",
  "My grandmother tells stories about her country.",
  "His grandfather fixed the fence.",
  "Her husband works on Saturdays.",
  "My wife is learning English with me.",
  "Every parent came to the school meeting.",
  "The child is drawing with crayons.",
  "The children are playing in the yard.",
  "My mother-in-law helps with the baby.",
  "His father-in-law retired last year.",
  "Her sister-in-law is a nurse.",
  "My brother-in-law drives a truck.",
  "All family members were invited to the wedding.",
  "They have a good relationship with their neighbors.",
];

const U2_CLASS_T: readonly string[] = [
  "Paper",
  "Book",
  "Pen",
  "Notebook",
  "Textbook",
  "Workbook",
  "Pencil sharpener",
  "Board",
  "Marker",
  "Eraser",
  "Desk",
  "Chair",
  "Teacher",
  "Student",
  "Classmate",
  "Partner",
  "Group",
];

const U2_CLASS_S: readonly string[] = [
  "Pass the paper to the person behind you.",
  "Open your book to the grammar section.",
  "Sign your name with a blue pen.",
  "Write the answers in your notebook.",
  "The textbook has pictures for each unit.",
  "Do the listening exercise in the workbook.",
  "The pencil sharpener is next to the door.",
  "Copy the sentence from the board.",
  "Use a marker for the poster, not a pencil.",
  "Borrow an eraser if you make a mistake.",
  "Keep your bags under your desk.",
  "Pull your chair closer to the table.",
  "Ask the teacher if you do not understand.",
  "Every student must bring a notebook.",
  "My classmate explained the homework to me.",
  "Work with a partner for this activity.",
  "Our group will present the project on Friday.",
];

const U2_DESC_T: readonly string[] = ["Hair", "Eyes"];
const U2_DESC_S: readonly string[] = [
  "She has long black hair.",
  "His eyes are brown and kind.",
];

const U2_ADJ_T: readonly string[] = [
  "Short",
  "Long",
  "Straight",
  "Wavy",
  "Curly",
  "Bald",
  "Brown",
  "Red",
  "Black",
  "Blond",
  "Gray",
  "Tall",
  "Young",
  "Old",
  "Thin",
  "Heavy",
];

const U2_ADJ_S: readonly string[] = [
  "He is short but very strong.",
  "She has long arms from swimming.",
  "Her hair is straight and shiny.",
  "His hair is wavy like the ocean.",
  "The baby has curly hair.",
  "My uncle is bald and wears a hat.",
  "She bought a brown winter coat.",
  "He dyed his hair red for the play.",
  "Black shoes go with any outfit.",
  "Her hair is blond from the summer sun.",
  "My grandfather's hair is gray.",
  "The tall man plays basketball.",
  "She is young and just finished school.",
  "The building looks very old.",
  "The cat is thin because it was a stray.",
  "The box is too heavy to lift alone.",
];

// --- Unit 3 ---
const U3_CIVIC_T: readonly string[] = [
  "Candidate",
  "Ballot",
  "Voter",
  "Election",
  "Campaign",
  "Political Party",
];
const U3_CIVIC_S: readonly string[] = [
  "The candidate spoke at the community center.",
  "Mark your choice on the ballot carefully.",
  "Every voter should bring identification.",
  "The election is on the first Tuesday in November.",
  "She volunteered for the mayor's campaign.",
  "He belongs to a political party that supports health care reform.",
];

const U3_PLACES_T: readonly string[] = [
  "Doctor's office",
  "Dentist's office",
  "Hospital",
  "Hotel",
  "House",
  "Park",
  "Playground",
  "Supermarket",
  "Bank",
  "Library",
  "Post Office",
  "Fire Department",
  "Police Station",
  "RMV",
  "Bus Stop",
  "Station",
  "Public Transportation",
  "City Hall",
  "Clinic",
  "School",
  "Museum",
  "Restaurant",
  "Store",
  "Pharmacy",
  "Gym",
  "Airport",
  "Laundromat",
];
const U3_PLACES_S: readonly string[] = [
  "I have a checkup at the doctor's office tomorrow.",
  "The dentist's office called to confirm my cleaning.",
  "The hospital has a new emergency room.",
  "We stayed at a hotel near the airport.",
  "Their house has a big front porch.",
  "Children play soccer in the park on weekends.",
  "The playground has swings and a slide.",
  "I buy vegetables at the supermarket on Fridays.",
  "I deposit my paycheck at the bank.",
  "She borrows books from the library for free.",
  "I mailed the package at the Post Office.",
  "Call the Fire Department if you smell smoke.",
  "Report the theft at the Police Station.",
  "I renewed my license at the RMV.",
  "Wait at the bus stop under the shelter.",
  "The train station is two blocks away.",
  "Public Transportation saves money on gas.",
  "We paid the parking ticket at City Hall.",
  "The clinic opens at eight in the morning.",
  "My children walk to school every day.",
  "The museum has free admission on Sundays.",
  "We ate dinner at an Italian restaurant.",
  "The corner store sells milk and bread.",
  "Pick up your prescription at the pharmacy.",
  "She exercises at the gym three times a week.",
  "Our flight leaves from Logan Airport.",
  "I wash blankets at the laundromat downtown.",
];

const U3_SERV_T: readonly string[] = ["Transportation", "Medical Care", "Education", "Shopping", "Housing"];
const U3_SERV_S: readonly string[] = [
  "Public transportation helps people get to work.",
  "Everyone deserves access to medical care.",
  "Education opens doors to better jobs.",
  "Shopping for groceries takes an hour on Saturday.",
  "Affordable housing is hard to find in the city.",
];

const U3_MSG_T: readonly string[] = ["Call", "Message", "Voicemail", "Email"];
const U3_MSG_S: readonly string[] = [
  "Please call me when you get home.",
  "I left a message on the office phone.",
  "Listen to your voicemail before you leave.",
  "Send me an email with your address.",
];

const U3_ADVLOC_T: readonly string[] = ["Left", "Right", "Straight", "Around"];
const U3_ADVLOC_S: readonly string[] = [
  "Turn left at the traffic light.",
  "The bank is on the right side of the street.",
  "Walk straight for two blocks.",
  "We walked around the lake on Sunday.",
];

const U3_PREP_T: readonly string[] = [
  "In",
  "At",
  "On",
  "In front of",
  "Behind",
  "Between",
  "Next to",
  "Across from",
];
const U3_PREP_S: readonly string[] = [
  "The keys are in the drawer.",
  "I will meet you at the coffee shop.",
  "The book is on the counter.",
  "The bus stops in front of the school.",
  "The garden is behind the house.",
  "The pharmacy is between the bank and the bakery.",
  "I sit next to Ana in class.",
  "The library is across from the post office.",
];

const U3_FREQ_T: readonly string[] = ["Never", "Rarely", "Sometimes", "Usually", "Always"];
const U3_FREQ_S: readonly string[] = [
  "I never drink coffee at night.",
  "She rarely misses a day of class.",
  "Sometimes we study in the library.",
  "I usually walk to work.",
  "Always wear your seat belt in the car.",
];

const U3_THANKS_T: readonly string[] = ["Thanks", "Meal", "Turkey", "Indigenous", "Pilgrim"];
const U3_THANKS_S: readonly string[] = [
  "Thanks for bringing the pie to dinner.",
  "Thanksgiving is a big meal for many families.",
  "We roast a turkey for the holiday.",
  "We learned about Indigenous peoples in history class.",
  "The Pilgrims arrived in America in 1620.",
];

// --- Unit 4 ---
const U4_CLOTH_T: readonly string[] = [
  "Shirt",
  "Suit",
  "Sweater",
  "Cap",
  "Dress",
  "Socks",
  "Hat",
  "Shoes",
  "Sneakers",
  "Blouse",
  "Coat",
  "Skirt",
  "Belt",
  "Pants",
  "Shorts",
];
const U4_CLOTH_S: readonly string[] = [
  "He ironed his shirt for the interview.",
  "He wore a suit to the wedding.",
  "She knitted a warm sweater for winter.",
  "Wear a cap to protect your face from the sun.",
  "Her dress is blue with white flowers.",
  "These socks keep my feet warm.",
  "He lost his hat on the bus.",
  "Black shoes match the uniform.",
  "Sneakers are good for walking all day.",
  "She wore a silk blouse to the office.",
  "Put on your coat; it is snowing.",
  "The skirt has pockets, which is handy.",
  "His belt is too tight after the holidays.",
  "These pants need to be hemmed.",
  "I wear shorts at the beach in summer.",
];

const U4_PROD_T: readonly string[] = ["Electronics", "Computer", "Car", "Cellphone"];
const U4_PROD_S: readonly string[] = [
  "Electronics are cheaper after the holidays.",
  "Save your essay on the computer.",
  "We need to register the car at the RMV.",
  "My cellphone battery dies too fast.",
];

const U4_SHOP_T: readonly string[] = [
  "Receipt",
  "Tax",
  "Price",
  "Cash",
  "Credit Card",
  "Debit Card",
  "Check",
  "Money Order",
  "Signature",
  "ATM",
  "Withdraw",
  "Deposit",
  "Online",
  "Return",
  "Exchange",
  "Refund",
];
const U4_SHOP_S: readonly string[] = [
  "Keep the receipt if you need to return the item.",
  "Sales tax is added at the register.",
  "Compare the price at two stores before you buy.",
  "I paid cash because the machine was broken.",
  "She paid with a credit card for the plane tickets.",
  "Insert your debit card and enter your PIN.",
  "I wrote a check for the rent.",
  "I bought a money order to pay the fee.",
  "Sign your signature on the line at the bottom.",
  "I took money out at the ATM on the corner.",
  "You can withdraw cash at any branch.",
  "I need to deposit this check today.",
  "I ordered the shoes online last night.",
  "The store will return your money with a receipt.",
  "I want to exchange this shirt for a larger size.",
  "The store gave me a refund for the broken toy.",
];

const U4_QUANT_T: readonly string[] = ["Large", "Big", "Medium", "Small", "New", "Used", "Old"];
const U4_QUANT_S: readonly string[] = [
  "I need a large suitcase for the trip.",
  "They live in a big house near the river.",
  "I wear a medium shirt in this brand.",
  "The small apartment is easier to clean.",
  "She bought a new phone yesterday.",
  "We bought a used car to save money.",
  "That old jacket still keeps me warm.",
];

const U4_XMAS_T: readonly string[] = ["Christmas Tree", "Ornaments", "Lights", "Santa", "Gift"];
const U4_XMAS_S: readonly string[] = [
  "We decorate the Christmas tree after Thanksgiving.",
  "Hang the ornaments carefully; some are glass.",
  "The lights on the house look beautiful at night.",
  "Children take photos with Santa at the mall.",
  "I wrapped each gift in red paper.",
];

// --- Unit 5 ---
const U5_HOUS_T: readonly string[] = [
  "Landlord",
  "Manager",
  "Agent",
  "Real Estate",
  "Tenant",
  "Leak",
  "Broken Window",
  "Clogged Toilet",
  "Complaint",
  "House",
  "Home",
  "Apartment",
  "Condominium",
  "Unit",
  "Rent",
  "Lease",
  "Fee",
  "Security deposit",
  "Laundry",
  "Mortgage",
  "Down payment",
  "Utilities",
  "Gas",
  "Water",
  "Electric",
  "Heat",
];
const U5_HOUS_S: readonly string[] = [
  "Call the landlord if the heat stops working.",
  "The building manager fixed the elevator.",
  "The real estate agent showed us three apartments.",
  "She works in real estate sales downtown.",
  "The tenant pays rent on the first of the month.",
  "There is a leak under the kitchen sink.",
  "Report the broken window to the landlord.",
  "A clogged toilet needs a plunger or a plumber.",
  "I wrote a complaint about the noisy neighbors.",
  "They bought a house with a big backyard.",
  "Home is where my family gathers for dinner.",
  "Our apartment is on the third floor.",
  "They own a condominium near the beach.",
  "We live in unit 12B.",
  "Rent goes up every year in this city.",
  "Read the lease before you sign it.",
  "There is a fee to use the laundry room.",
  "We paid a security deposit when we moved in.",
  "I do laundry on Sunday mornings.",
  "They got a mortgage from the credit union.",
  "We saved for a down payment for five years.",
  "Utilities are not included in the rent.",
  "Check the gas smell before you light the stove.",
  "The water bill was higher this month.",
  "The electric bill arrives every month.",
  "Turn up the heat if you feel cold.",
];

const U5_PARTS_T: readonly string[] = [
  "Room",
  "Bathroom",
  "Kitchen",
  "Bedroom",
  "Living room",
  "Hall",
  "Floor",
  "Basement",
  "Attic",
  "Roof",
  "Chimney",
  "Door",
  "Front",
  "Back",
  "Lock",
  "Stairs",
  "Porch",
  "Deck",
  "Garage",
  "Driveway",
  "Yard",
  "Garden",
];
const U5_PARTS_S: readonly string[] = [
  "The baby's room is painted yellow.",
  "The bathroom needs a new shower curtain.",
  "We cook soup in the kitchen on cold days.",
  "The bedroom window faces the street.",
  "We watch TV in the living room.",
  "The hall is narrow but has good light.",
  "Sweep the floor after dinner.",
  "We store boxes in the basement.",
  "Old photos are in the attic.",
  "The roof leaked during the storm.",
  "Smoke comes out of the chimney in winter.",
  "Lock the door when you leave.",
  "Paint the front door red this spring.",
  "The back door leads to the garden.",
  "The lock is stuck; use oil.",
  "Be careful on the stairs at night.",
  "We sit on the porch in the evening.",
  "Grill vegetables on the deck in summer.",
  "Park the car in the garage.",
  "Shovel the driveway after it snows.",
  "The kids play in the front yard.",
  "Tomatoes grow well in our garden.",
];

const U5_DOM_T: readonly string[] = [
  "Window",
  "End table",
  "Coffee table",
  "Plant",
  "Lamp",
  "Light",
  "Painting",
  "Rug",
  "Carpet",
  "Bathtub",
  "Sink",
  "Toilet",
  "Curtain",
  "Bed",
  "Closet",
  "Bedtable",
  "Car",
  "Chair",
  "Refrigerator",
  "Microwave",
  "Oven",
  "Counter",
  "Cabinet",
  "Sofa",
  "Armchair",
  "TV",
  "Fireplace",
  "Washer",
  "Dryer",
];
const U5_DOM_S: readonly string[] = [
  "Open the window to air out the kitchen.",
  "She set her mug on the end table beside the sofa.",
  "Magazines and the remote sit on the coffee table.",
  "Water the plant by the window once a week.",
  "Turn on the lamp to read in the evening.",
  "Please turn off the light when you leave the room.",
  "That painting above the sofa is from a local artist.",
  "The rug in the hall catches dirt from outside.",
  "The bedroom has soft carpet under the bed.",
  "Fill the bathtub with warm water before a bath.",
  "Rinse the dishes in the sink after dinner.",
  "The toilet in the guest bathroom runs sometimes.",
  "Close the curtain for more privacy.",
  "Make the bed before you leave for work.",
  "Hang your coat in the closet by the door.",
  "Put your alarm clock on the bedtable.",
  "We park the car in the driveway at night.",
  "Pull up a chair to the dining table.",
  "Put the milk back in the refrigerator.",
  "Heat the soup in the microwave for two minutes.",
  "Bread bakes in the oven at three fifty.",
  "Chop vegetables on the kitchen counter.",
  "Store dishes in the cabinet above the sink.",
  "We relax on the sofa after work.",
  "Grandfather sits in his favorite armchair.",
  "The TV is mounted on the living room wall.",
  "We light a fire in the fireplace on cold nights.",
  "Put dirty clothes in the washer.",
  "Move the clothes from the washer to the dryer.",
];

const U5_PREP_T: readonly string[] = ["In", "On", "Next to", "Between", "Under", "Over"];
const U5_PREP_S: readonly string[] = [
  "The cat sleeps in the laundry basket.",
  "Put the keys on the hook by the door.",
  "The mailbox is next to the front steps.",
  "The sofa sits between the lamp and the window.",
  "Shoes are under the bed.",
  "Hang the towel over the chair.",
];

// --- Unit 6-7 ---
const U67_OCC_T: readonly string[] = [
  "Homemaker",
  "Mechanic",
  "Office assistant",
  "Administrative assistant",
  "Secretary",
  "Receptionist",
  "Manager",
  "Server",
  "Busser",
  "Cook",
  "Prep Cook",
  "Chef",
  "Dishwasher",
  "Host",
  "Custodian",
  "Cashier",
  "Principal",
  "Doctor",
  "Nurse",
  "Dentist",
  "Teacher",
  "Painter",
  "Plumber",
  "Electrician",
  "Construction worker",
  "Housekeeper",
  "Driver",
  "Landscaper",
  "Salesperson",
  "Business owner",
];
const U67_OCC_S: readonly string[] = [
  "A homemaker cares for children and the household.",
  "The mechanic fixed the brakes on my car.",
  "The office assistant files papers and answers phones.",
  "An administrative assistant schedules meetings for the team.",
  "The secretary typed the letter for the director.",
  "The receptionist greets visitors at the front desk.",
  "The restaurant manager trains new employees.",
  "The server brought water and menus to our table.",
  "The busser cleared plates quickly between customers.",
  "The cook prepares meals in a busy kitchen.",
  "The prep cook chops vegetables before dinner service.",
  "The chef designs the menu for the restaurant.",
  "The dishwasher loads the machine after each shift.",
  "The host seats guests near the window.",
  "The custodian mops the halls at night.",
  "The cashier counted change carefully.",
  "The principal spoke at the school assembly.",
  "The doctor listened to my lungs.",
  "The nurse checked my blood pressure.",
  "The dentist cleaned my teeth.",
  "The teacher explains grammar clearly.",
  "The painter covered the floor before starting.",
  "The plumber fixed the pipe under the sink.",
  "The electrician installed new lights.",
  "Construction workers wear hard hats on the site.",
  "The housekeeper changes the sheets at the hotel.",
  "The bus driver waits for passengers at each stop.",
  "The landscaper planted flowers by the entrance.",
  "The salesperson helped me choose a phone.",
  "A small business owner works long hours.",
];

const U67_WORK_T: readonly string[] = [
  "Pay",
  "Salary",
  "Benefits",
  "Full-time",
  "Part-time",
  "Title",
  "Experience",
  "Break",
  "Hired",
  "Fired",
  "Laid off",
  "Job",
  "Employee",
  "Paycheck",
  "Uniform",
  "Boss",
  "Interview",
  "Employer",
  "Taxes",
  "Application",
  "Schedule",
  "Vacation",
  "Sick leave",
  "Insurance",
  "Resume",
  "Raise",
];
const U67_WORK_S: readonly string[] = [
  "How much does this job pay per hour?",
  "Her salary covers rent and childcare.",
  "Health benefits include dental and vision.",
  "She works full-time at the hospital.",
  "He has a part-time job on weekends.",
  "His job title is assistant supervisor.",
  "Employers want experience in customer service.",
  "We get a fifteen-minute break every four hours.",
  "She was hired after a good interview.",
  "He was fired for being late too often.",
  "Many workers were laid off when the factory closed.",
  "She is looking for a job closer to home.",
  "Every employee must wear a name tag.",
  "My paycheck arrives every other Friday.",
  "Wash your uniform before each shift.",
  "Ask your boss if you need Saturday off.",
  "The interview lasted thirty minutes.",
  "The employer posts jobs on the company website.",
  "Taxes are taken out of each paycheck.",
  "Fill out the application in blue ink.",
  "My work schedule changes every week.",
  "We plan a vacation in July.",
  "Use sick leave when you have a fever.",
  "Health insurance helps pay doctor bills.",
  "Update your resume before you apply.",
  "She got a raise after one year at the company.",
];

const U67_STR_T: readonly string[] = ["Skill", "Strength", "Teamwork", "Problem-Solving", "Communication", "Leadership"];
const U67_STR_S: readonly string[] = [
  "Typing fast is a useful skill at work.",
  "Honesty is a strength in any job.",
  "Teamwork helps the kitchen run smoothly.",
  "Problem-solving is important for managers.",
  "Clear communication prevents mistakes.",
  "She showed leadership when the power went out.",
];

const U67_ADJ_T: readonly string[] = [
  "Creative",
  "Flexible",
  "Organized",
  "Dependable",
  "Honest",
  "Hard-Working",
  "Respectful",
];
const U67_ADJ_S: readonly string[] = [
  "She is creative with lesson plans.",
  "Stay flexible if the schedule changes.",
  "An organized worker files papers every day.",
  "Dependable employees arrive on time.",
  "Honest workers admit mistakes quickly.",
  "Hard-working students practice every night.",
  "Be respectful when you speak to customers.",
];

// --- Unit 8 ---
const U8_BODY_T: readonly string[] = [
  "Head",
  "Arms",
  "Chest",
  "Hands",
  "Stomach",
  "Back",
  "Fingers",
  "Legs",
  "Foot",
  "Feet",
  "Toes",
  "Neck",
  "Eyes",
  "Ears",
  "Mouth",
  "Nose",
  "Tooth",
  "Teeth",
  "Throat",
];
const U8_BODY_S: readonly string[] = [
  "She rested her head on the pillow.",
  "He broke both arms in a fall.",
  "The doctor listened to his chest.",
  "Wash your hands before you eat.",
  "My stomach hurts after spicy food.",
  "Sleeping on a bad mattress hurts my back.",
  "She cut her fingers while cooking.",
  "Running strengthens your legs.",
  "My foot hurts near the heel.",
  "Wear dry socks to protect your feet.",
  "Wiggle your toes before you stand up.",
  "Turn your neck slowly if it feels stiff.",
  "Protect your eyes from bright sunlight.",
  "Cover your ears during loud concerts.",
  "Rinse your mouth after you brush.",
  "Breathe through your nose when you run.",
  "I chipped a tooth on hard candy.",
  "Brush your teeth twice a day.",
  "Drink tea if your throat feels sore.",
];

const U8_SYM_T: readonly string[] = [
  "Pain",
  "Cut",
  "Dry cough",
  "Fever",
  "Headache",
  "Runny nose",
  "Sore Throat",
  "Sneezing",
  "Backache",
  "Toothache",
  "Chills",
  "Sweats",
  "Fatigue",
  "Dizziness",
  "Itch",
  "Rash",
  "Swelling",
  "Nausea",
  "Stress",
];
const U8_SYM_S: readonly string[] = [
  "Tell the nurse if you feel pain.",
  "Clean the cut with soap and water.",
  "A dry cough can last after a cold.",
  "Call the doctor if your fever is high.",
  "Dark rooms help when I have a headache.",
  "Allergies give me a runny nose in spring.",
  "Honey tea soothes a sore throat.",
  "Sneezing spreads germs in a small room.",
  "Heating pads help my backache.",
  "See a dentist for a bad toothache.",
  "Chills often come with the flu.",
  "Night sweats can be a sign of fever.",
  "Fatigue can mean you need more sleep.",
  "Sit down if you feel dizziness.",
  "Calamine lotion helps the itch from poison ivy.",
  "The rash spread after I tried a new soap.",
  "Ice reduces swelling on a sprained ankle.",
  "Ginger tea sometimes helps nausea.",
  "Stress can make your stomach feel tight.",
];

const U8_MED_T: readonly string[] = ["Prescription", "Reliever", "Syrup", "Lozenges", "Pills", "Tablets", "Vaccine"];
const U8_MED_S: readonly string[] = [
  "The pharmacist filled my prescription.",
  "This pain reliever works for headaches.",
  "The cough syrup tastes like cherries.",
  "Suck on lozenges when your throat hurts.",
  "Swallow the pills with a full glass of water.",
  "Cut the tablets in half if the dose is small.",
  "Children get a vaccine before starting school.",
];

const U8_ILL_T: readonly string[] = ["Allergy", "Cold", "Flu", "Infection", "Sprain"];
const U8_ILL_S: readonly string[] = [
  "Peanuts give me an allergy reaction.",
  "Rest and fluids help a common cold.",
  "The flu kept her in bed for three days.",
  "The doctor treated the ear infection with antibiotics.",
  "Ice and rest help a mild ankle sprain.",
];

const U8_EM_T: readonly string[] = ["Hospital", "Medical center", "Elevators", "Lobby"];
const U8_EM_S: readonly string[] = [
  "The ambulance took him to the hospital.",
  "The medical center has weekend hours.",
  "Use the elevators if you cannot climb stairs.",
  "Wait in the lobby until they call your name.",
];

const U8_OM_T: readonly string[] = ["Appointment", "Checkup", "Insurance", "Physical", "Surgery"];
const U8_OM_S: readonly string[] = [
  "I scheduled an appointment for next Tuesday.",
  "Yearly checkups help catch problems early.",
  "Call insurance before you go to a specialist.",
  "The school needs a physical before sports.",
  "She recovered quickly after knee surgery.",
];

const U8_EX_T: readonly string[] = ["Muscles", "Weight", "Heart"];
const U8_EX_S: readonly string[] = [
  "Stretch your muscles before you run.",
  "Lifting weights builds strong arms.",
  "Walking is good for your heart.",
];

// --- Unit 9 ---
const U9_FG_T: readonly string[] = ["Vegetables", "Fruits", "Whole grains", "Protein", "Dairy", "Junk food"];
const U9_FG_S: readonly string[] = [
  "Eat vegetables with every dinner.",
  "Fresh fruits make a sweet snack.",
  "Oatmeal is a whole grain breakfast.",
  "Beans and eggs are good sources of protein.",
  "Dairy foods like yogurt have calcium.",
  "Limit junk food for better energy.",
];

const U9_GRAIN_T: readonly string[] = ["Cereal", "Bread", "Toast", "Nuts", "Walnuts", "Peanuts", "Almonds"];
const U9_GRAIN_S: readonly string[] = [
  "I eat cereal with milk in the morning.",
  "Whole wheat bread has more fiber.",
  "Butter your toast while it is still hot.",
  "Nuts are a healthy snack in small amounts.",
  "Walnuts add crunch to oatmeal.",
  "Peanuts are common in candy bars.",
  "Almonds are good in a salad.",
];

const U9_DAIRY_T: readonly string[] = ["Eggs", "Milk", "Cheese", "Yogurt"];
const U9_DAIRY_S: readonly string[] = [
  "Scramble eggs for a quick breakfast.",
  "Milk stays cold in the refrigerator.",
  "Grated cheese melts on top of pasta.",
  "Greek yogurt has extra protein.",
];

const U9_MEAT_T: readonly string[] = ["Chicken", "Beef", "Pork", "Turkey", "Fish", "Tuna"];
const U9_MEAT_S: readonly string[] = [
  "Grill chicken with lemon and herbs.",
  "Beef stew simmers for two hours.",
  "Pork chops need to cook all the way through.",
  "We eat turkey on Thanksgiving.",
  "Baked fish is light and healthy.",
  "Tuna salad is easy for lunch.",
];

const U9_STAP_T: readonly string[] = ["Rice", "Beans", "Soup"];
const U9_STAP_S: readonly string[] = [
  "Rice goes with beans in many meals.",
  "Soak beans overnight before you cook them.",
  "Chicken soup helps when you have a cold.",
];

const U9_VEG_T: readonly string[] = [
  "Tomatoes",
  "Carrots",
  "Avocados",
  "Broccoli",
  "Cucumber",
  "Corn",
  "Celery",
  "Lettuce",
  "Spinach",
  "Salad",
];
const U9_VEG_S: readonly string[] = [
  "Slice tomatoes for the sandwich.",
  "Carrots are crunchy and sweet.",
  "Mash avocados for fresh guacamole.",
  "Steam broccoli for five minutes.",
  "Cucumber slices go in cold water.",
  "Corn on the cob is popular in summer.",
  "Celery sticks pair well with peanut butter.",
  "Rinse lettuce before you make a salad.",
  "Spinach wilts quickly in a hot pan.",
  "A side salad comes with the dinner plate.",
];

const U9_COND_T: readonly string[] = [
  "Oil",
  "Salt",
  "Pepper",
  "Garlic",
  "Ketchup",
  "Mustard",
  "Jam",
  "Jelly",
  "Peanut butter",
];
const U9_COND_S: readonly string[] = [
  "Heat the oil before you fry the eggs.",
  "Add salt slowly; you can add more later.",
  "Fresh pepper tastes stronger than old pepper.",
  "Chop garlic finely so it cooks evenly.",
  "Kids like ketchup with French fries.",
  "Mustard gives sandwiches a sharp taste.",
  "Spread jam on toast for breakfast.",
  "Grape jelly is sweet on a sandwich.",
  "Peanut butter sticks to the roof of your mouth.",
];

const U9_FRUIT_T: readonly string[] = [
  "Apples",
  "Oranges",
  "Bananas",
  "Pears",
  "Watermelon",
  "Melon",
  "Strawberry",
  "Pineapple",
  "Blueberry",
];
const U9_FRUIT_S: readonly string[] = [
  "Apples stay crisp in the refrigerator.",
  "Oranges are full of vitamin C.",
  "Bananas turn brown faster in the heat.",
  "Pears ripen on the counter in a few days.",
  "Watermelon is refreshing on a hot day.",
  "Cantaloupe melon is sweet for breakfast.",
  "Strawberry season is in late spring.",
  "Pineapple is tangy on pizza or in juice.",
  "Blueberry muffins are popular at the café.",
];

const U9_PREP_T: readonly string[] = ["French Fries", "Hamburger", "Pasta", "Sandwich", "Crackers"];
const U9_PREP_S: readonly string[] = [
  "French fries are salty and crispy.",
  "He ordered a hamburger with no onions.",
  "Pasta with tomato sauce is a simple meal.",
  "Pack a sandwich for your lunch box.",
  "Crackers go well with cheese slices.",
];

const U9_SWEET_T: readonly string[] = ["Cookies", "Ice Cream", "Cake", "Candy", "Potato Chips"];
const U9_SWEET_S: readonly string[] = [
  "We baked cookies for the school party.",
  "Vanilla ice cream melts fast in the sun.",
  "Birthday cake has candles on top.",
  "Too much candy can hurt your teeth.",
  "Potato chips are salty, not sweet.",
];

const U9_DRINK_T: readonly string[] = ["Bottled water", "Juice", "Soda"];
const U9_DRINK_S: readonly string[] = [
  "Carry bottled water when you travel.",
  "Orange juice is popular at breakfast.",
  "Soda has a lot of sugar.",
];

const U9_CONT_T: readonly string[] = ["Can", "Jar", "Bag", "Box", "Package"];
const U9_CONT_S: readonly string[] = [
  "Rinse the can before you recycle it.",
  "A glass jar keeps spices dry.",
  "Bring a reusable bag to the store.",
  "Cereal comes in a cardboard box.",
  "Check the date on the package.",
];

const U9_OW_T: readonly string[] = [
  "Food",
  "Nutrition",
  "Sugar",
  "Fat",
  "Carbohydrates",
  "Calories",
  "Menu",
  "Food label",
  "Restaurant",
  "Supermarket",
  "Habits",
];
const U9_OW_S: readonly string[] = [
  "Fresh food is better than processed snacks.",
  "Good nutrition helps you stay alert in class.",
  "Cut back on sugar in your coffee.",
  "Some fat is healthy, like olive oil.",
  "Whole grains provide carbohydrates for energy.",
  "Read calories if you want to lose weight.",
  "The menu lists prices for each dish.",
  "The food label shows sugar and sodium.",
  "We chose a quiet restaurant for dinner.",
  "Compare prices at two supermarkets.",
  "Small habits, like walking daily, add up.",
];

function buildMap(): Record<string, string> {
  return {
    ...pair("unit-2", U2_DAYS, U2_DAYS_S),
    ...pair("unit-2", U2_ROUTINES_T, U2_ROUTINES_S),
    ...pair("unit-2", U2_FAMILY_T, U2_FAMILY_S),
    ...pair("unit-2", U2_CLASS_T, U2_CLASS_S),
    ...pair("unit-2", U2_DESC_T, U2_DESC_S),
    ...pair("unit-2", U2_ADJ_T, U2_ADJ_S),
    ...pair("unit-3", U3_CIVIC_T, U3_CIVIC_S),
    ...pair("unit-3", U3_PLACES_T, U3_PLACES_S),
    ...pair("unit-3", U3_SERV_T, U3_SERV_S),
    ...pair("unit-3", U3_MSG_T, U3_MSG_S),
    ...pair("unit-3", U3_ADVLOC_T, U3_ADVLOC_S),
    ...pair("unit-3", U3_PREP_T, U3_PREP_S),
    ...pair("unit-3", U3_FREQ_T, U3_FREQ_S),
    ...pair("unit-3", U3_THANKS_T, U3_THANKS_S),
    ...pair("unit-4", U4_CLOTH_T, U4_CLOTH_S),
    ...pair("unit-4", U4_PROD_T, U4_PROD_S),
    ...pair("unit-4", U4_SHOP_T, U4_SHOP_S),
    ...pair("unit-4", U4_QUANT_T, U4_QUANT_S),
    ...pair("unit-4", U4_XMAS_T, U4_XMAS_S),
    ...pair("unit-5", U5_HOUS_T, U5_HOUS_S),
    ...pair("unit-5", U5_PARTS_T, U5_PARTS_S),
    ...pair("unit-5", U5_DOM_T, U5_DOM_S),
    ...pair("unit-5", U5_PREP_T, U5_PREP_S),
    ...pair("unit-6-7", U67_OCC_T, U67_OCC_S),
    ...pair("unit-6-7", U67_WORK_T, U67_WORK_S),
    ...pair("unit-6-7", U67_STR_T, U67_STR_S),
    ...pair("unit-6-7", U67_ADJ_T, U67_ADJ_S),
    ...pair("unit-8", U8_BODY_T, U8_BODY_S),
    ...pair("unit-8", U8_SYM_T, U8_SYM_S),
    ...pair("unit-8", U8_MED_T, U8_MED_S),
    ...pair("unit-8", U8_ILL_T, U8_ILL_S),
    ...pair("unit-8", U8_EM_T, U8_EM_S),
    ...pair("unit-8", U8_OM_T, U8_OM_S),
    ...pair("unit-8", U8_EX_T, U8_EX_S),
    ...pair("unit-9", U9_FG_T, U9_FG_S),
    ...pair("unit-9", U9_GRAIN_T, U9_GRAIN_S),
    ...pair("unit-9", U9_DAIRY_T, U9_DAIRY_S),
    ...pair("unit-9", U9_MEAT_T, U9_MEAT_S),
    ...pair("unit-9", U9_STAP_T, U9_STAP_S),
    ...pair("unit-9", U9_VEG_T, U9_VEG_S),
    ...pair("unit-9", U9_COND_T, U9_COND_S),
    ...pair("unit-9", U9_FRUIT_T, U9_FRUIT_S),
    ...pair("unit-9", U9_PREP_T, U9_PREP_S),
    ...pair("unit-9", U9_SWEET_T, U9_SWEET_S),
    ...pair("unit-9", U9_DRINK_T, U9_DRINK_S),
    ...pair("unit-9", U9_CONT_T, U9_CONT_S),
    ...pair("unit-9", U9_OW_T, U9_OW_S),
  };
}

function validate(map: Record<string, string>) {
  for (const unit of LEVEL1_PUBLIC_VOCAB_UNITS) {
    if (unit.slug === "unit-1") continue;
    for (const cat of unit.categories) {
      for (const card of cat.cards) {
        const key = `${unit.slug}::${card.term}`;
        if (!map[key]) {
          throw new Error(`Missing example for ${key} (${cat.label})`);
        }
      }
    }
  }
}

function main() {
  const map = buildMap();
  validate(map);
  const outPath = path.join(process.cwd(), "src/data/level1-vocab-custom-examples.ts");
  const serialized = JSON.stringify(map, null, 2);
  const fixed = `/* eslint-disable max-len -- curated example sentences */\nexport const LEVEL1_VOCAB_CUSTOM_EXAMPLES: Record<string, string> = ${serialized};\n`;
  fs.writeFileSync(outPath, fixed, "utf8");
  console.log(`Wrote ${Object.keys(map).length} entries to ${outPath}`);
}

main();
