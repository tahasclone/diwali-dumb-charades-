export type Level = 1 | 2 | 3 | 4;

export type Category =
  | "Action"
  | "Animal"
  | "Object"
  | "Vehicle"
  | "Person"
  | "Sport"
  | "Food"
  | "Place"
  | "Nature"
  | "Festival"
  | "Abstract";

export interface Word {
  /** Hinglish (romanised Hindi) */
  hi: string;
  /** English meaning */
  en: string;
  /** Devanagari */
  dv: string;
  /** Illustration shown on the card */
  em: string;
  cat: Category;
  lv: Level;
}

export const LEVELS: Record<Level, { name: string; blurb: string }> = {
  1: { name: "Very Easy", blurb: "obvious actions, iconic animals" },
  2: { name: "Easy", blurb: "simple actions, common objects" },
  3: { name: "Medium", blurb: "needs some creativity" },
  4: { name: "Difficult", blurb: "food, culture, abstract" },
};

export const CAT_COLORS: Record<Category, string> = {
  Action: "#ffcf6b",
  Animal: "#9be38f",
  Object: "#9fd0ff",
  Vehicle: "#ffa98a",
  Person: "#f7a8d8",
  Sport: "#b8f0e0",
  Food: "#ffb86b",
  Place: "#c7b5ff",
  Nature: "#8ee6ff",
  Festival: "#ff9fb0",
  Abstract: "#e2d4ff",
};

// Hinglish | English | Devanagari | illustration | category
// Within each level, words are roughly ordered easiest to hardest.
const RAW: Record<Level, string> = {
  1: `Naachna|Dancing|नाचना|💃|Action
Sona|Sleeping|सोना|😴|Action
Khana|Eating|खाना|🍽️|Action
Pina|Drinking|पीना|🥤|Action
Hasna|Laughing|हँसना|😂|Action
Rona|Crying|रोना|😭|Action
Daudna|Running|दौड़ना|🏃|Action
Tairna|Swimming|तैरना|🏊|Action
Kudna|Jumping|कूदना|🤸|Action
Gaana|Singing|गाना|🎤|Action
Nahana|Bathing|नहाना|🛁|Action
Padhna|Reading|पढ़ना|📖|Action
Haathi|Elephant|हाथी|🐘|Animal
Bandar|Monkey|बंदर|🐒|Animal
Saanp|Snake|साँप|🐍|Animal
Sher|Lion|शेर|🦁|Animal
Kutta|Dog|कुत्ता|🐕|Animal
Billi|Cat|बिल्ली|🐈|Animal
Gaay|Cow|गाय|🐄|Animal
Machhli|Fish|मछली|🐟|Animal
Chhaata|Umbrella|छाता|☂️|Object
Cycle|Bicycle|साइकिल|🚲|Vehicle
Hawai Jahaz|Airplane|हवाई जहाज़|✈️|Vehicle
Doctor|Doctor|डॉक्टर|🩺|Person
Cricket|Cricket|क्रिकेट|🏏|Sport`,
  2: `Likhna|Writing|लिखना|✍️|Action
Chadhna|Climbing|चढ़ना|🧗|Action
Ladna|Fighting|लड़ना|🥊|Action
Khelna|Playing|खेलना|⚽|Action
Pakadna|Catching|पकड़ना|🧤|Action
Phenkna|Throwing|फेंकना|🤾|Action
Dhakelna|Pushing|धकेलना|🛒|Action
Kheenchna|Pulling|खींचना|🪢|Action
Ghoda|Horse|घोड़ा|🐎|Animal
Mor|Peacock|मोर|🦚|Animal
Tota|Parrot|तोता|🦜|Animal
Chuha|Mouse|चूहा|🐁|Animal
Titli|Butterfly|तितली|🦋|Animal
Kursi|Chair|कुर्सी|🪑|Object
Ghadi|Watch / Clock|घड़ी|⌚|Object
Chashma|Glasses|चश्मा|👓|Object
Chaabi|Key|चाबी|🔑|Object
Jhaadu|Broom|झाड़ू|🧹|Object
Patang|Kite|पतंग|🪁|Object
Gubbara|Balloon|गुब्बारा|🎈|Object
Chamcha|Spoon|चमचा|🥄|Object
Kainchi|Scissors|कैंची|✂️|Object
Kanghi|Comb|कंघी|💇|Object
Bistar|Bed|बिस्तर|🛏️|Object
Pankha|Fan|पंखा|🌀|Object`,
  3: `Cheetah|Cheetah|चीता|🐆|Animal
Kachhua|Tortoise|कछुआ|🐢|Animal
Taala|Lock|ताला|🔒|Object
Aaina|Mirror|आईना|🪞|Object
Roti|Flatbread|रोटी|🫓|Food
Chai|Tea|चाय|☕|Food
Aam|Mango|आम|🥭|Food
Kela|Banana|केला|🍌|Food
Seb|Apple|सेब|🍎|Food
Pyaaz|Onion|प्याज़|🧅|Food
Mirchi|Chilli|मिर्ची|🌶️|Food
Railgaadi|Train|रेलगाड़ी|🚂|Vehicle
Naav|Boat|नाव|⛵|Vehicle
Rickshaw|Rickshaw|रिक्शा|🛺|Vehicle
Station|Station|स्टेशन|🚉|Place
School|School|स्कूल|🏫|Place
Aspataal|Hospital|अस्पताल|🏥|Place
Sipahi|Soldier|सिपाही|🪖|Person
Nai|Barber|नाई|💈|Person
Darzi|Tailor|दर्ज़ी|🧵|Person
Kisaan|Farmer|किसान|🧑‍🌾|Person
Chor|Thief|चोर|🦹|Person
Raja|King|राजा|👑|Person
Aag|Fire|आग|🔥|Nature
Baarish|Rain|बारिश|🌧️|Nature`,
  4: `Samosa|Samosa|समोसा|🥟|Food
Jalebi|Jalebi|जलेबी|🍥|Food
Pani Puri|Pani Puri|पानी पूरी|🥣|Food
Gol Gappe|Gol Gappe|गोलगप्पे|🧆|Food
Dosa|Dosa|डोसा|🌯|Food
Lassi|Lassi|लस्सी|🥛|Food
Pakora|Fritters|पकौड़ा|🍤|Food
Kulfi|Indian Ice Cream|कुल्फ़ी|🍦|Food
Mandir|Temple|मंदिर|🛕|Place
Bazaar|Market|बाज़ार|🛍️|Place
Pehalwan|Wrestler|पहलवान|💪|Person
Pehelwani|Wrestling|पहलवानी|🤼|Action
Jaadugar|Magician|जादूगर|🎩|Person
Masakhara|Joker / Clown|मसख़रा|🤡|Person
Bhoot|Ghost|भूत|👻|Person
Chand|Moon|चाँद|🌙|Nature
Sooraj|Sun|सूरज|☀️|Nature
Tara|Star|तारा|⭐|Nature
Toofaan|Storm|तूफ़ान|🌪️|Nature
Shaadi|Wedding|शादी|💍|Festival
Baraat|Wedding Procession|बारात|🎺|Festival
Holi|Festival of Colours|होली|🎨|Festival
Diwali|Festival of Lights|दिवाली|🪔|Festival
Rangoli|Floor Art|रंगोली|🌺|Festival
Sapna|Dream|सपना|💭|Abstract`,
};

export const WORDS: Record<Level, Word[]> = Object.fromEntries(
  ([1, 2, 3, 4] as Level[]).map((lv) => [
    lv,
    RAW[lv]
      .trim()
      .split("\n")
      .map((line) => {
        const [hi, en, dv, em, cat] = line.split("|");
        return { hi, en, dv, em, cat: cat as Category, lv };
      }),
  ]),
) as Record<Level, Word[]>;
