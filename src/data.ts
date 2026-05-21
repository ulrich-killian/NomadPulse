import { Attraction, Tour, Shipment, CurrencyData } from './types';

export const ATTRACTIONS: Attraction[] = [
  {
    id: 'santorini',
    name: 'Santorini Caldera',
    location: 'Santorini, Greece',
    region: 'Cyclades Islands',
    price: '€15/cablecar',
    priceNum: 15,
    rating: 5.0,
    description: 'Famous for its stunning views, iconic whitewashed houses, and bright blue domes perched atop a breathtaking volcanic caldera overlooking the Aegean sea.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9Rp1QGcZDDJ_FXS_0S-k1CIHzmG2WqyJonkxuMGhlY7N6VUTxohQfAuc2RW9dTEJDooaGZplgoUNajEjWHN0w7xYIv_KqIK_GLrdivyEtL_uV4-u1aCGckT8jZ4SHxY7WFRD6fjrVbx_tvtPfVFoi1YDSVlBJxuZ10VUXOVg9DQ4vZ190ZDzQpdZQp7Z_yD-JXeo5-nSIaMhji9khpneEAniFwh3RwXLLkMCQn0k4csQhAysc9r4qeFsJ-HZ7VVVRw21zwfZcUGYU',
    category: 'Beach',
    tags: ['Popular', 'Romantic', 'Seaside'],
    languages: {
      primary: 'Greek',
      secondary: 'English',
      phrases: [
        { original: 'Kalimera (Καλημέρα)', english: 'Good morning', pronunciation: 'kah-lee-MEH-rah' },
        { original: 'Efharisto (Ευχαριστώ)', english: 'Thank you', pronunciation: 'ef-hah-rees-TOH' },
        { original: 'Parakalo (Παρακαλώ)', english: 'Please / You’re welcome', pronunciation: 'pah-rah-kah-LOH' },
        { original: 'Yassas (Γειά σας)', english: 'Hello', pronunciation: 'YAH-sas' },
        { original: 'Pou einai...? (Πού είναι...?)', english: 'Where is...?', pronunciation: 'poo EE-neh' }
      ]
    },
    airport: {
      name: 'Santorini (Thira) International Airport',
      code: 'JTR',
      distance: '6.2 km to center',
      driveTime: '15 min drive'
    },
    coords: {
      lat: 36.4166,
      lng: 25.4324
    }
  },
  {
    id: 'amalfi',
    name: 'Amalfi Coastline',
    location: 'Campania, Italy',
    region: 'Mediterrenean Coast',
    price: '€85/day tour',
    priceNum: 85,
    rating: 4.9,
    description: 'Experience the dramatic cliffs, hidden pristine beaches, and pastel-colored fishing villages perched dangerously on steep Mediterranean cliffs.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVaJUBWgEd_9AU_3DrsRJAcBbtF_sRtErMG6V7KLFTbOGccJTSNibFsb3PwNtUr36TA_OF0kqGwOKVApcjAfwRCvxBe00vby7fk6tjtw6SgV6aWo5XHJdK-9cQb265hoJddLtXdCxxm_0mb7WCqTUfr8j07h05-fYFy-M64qKBwi79PFwKY-j15tg6Ydp4yjYq1OdNAvKdGaMEGNT2XpFysADD0I0ylKOdmXRmDSxkx4GM7Zf32I8UcxefpCvrZVTTjsJ1EbwnY07E',
    category: 'Beach',
    tags: ['Trending', 'Nature', 'Luxury'],
    languages: {
      primary: 'Italian',
      secondary: 'English',
      phrases: [
        { original: 'Buongiorno', english: 'Good morning', pronunciation: 'bwon-JOR-noh' },
        { original: 'Grazie', english: 'Thank you', pronunciation: 'GRAHT-see-eh' },
        { original: 'Prego', english: 'You’re welcome', pronunciation: 'PREH-goh' },
        { original: 'Dov’è il bagno?', english: 'Where is the restroom?', pronunciation: 'doh-VEH eel BAHN-yo' },
        { original: 'Il conto, per favore', english: 'The bill, please', pronunciation: 'eel KON-toh pehr fah-VOH-reh' }
      ]
    },
    airport: {
      name: 'Naples International Airport',
      code: 'NAP',
      distance: '60 km to Amalfi',
      driveTime: '1h 10m drive'
    },
    coords: {
      lat: 40.6331,
      lng: 14.6027
    }
  },
  {
    id: 'acropolis',
    name: 'Acropolis Hill',
    location: 'Athens, Greece',
    region: 'Attica region',
    price: '€20/ticket',
    priceNum: 20,
    rating: 4.8,
    description: 'Walk through the historical cradle of Western democracy, exploring the ruins of Parthenon, Erechtheion, and the ancient ruins of Athens from above.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDToro9zKEoimebhq7OOE_v2BxRbYl2AVa2jpEARNvHbZq76ObS6rEGggVPA5OVyWuR-7GGZn9Z1Hl95GAmk4hhkUuflVtpJe9ipc7YpiqAd3hVhfwmUyMBuQFb1c-LYUfSkLt8D-lYKv7He5QUvSlEZDOmHfBUp-zu8ZEincDxnZF_pMzmFp6SGxDBhJpEvX38eWJ5metzkduW-LwLkyHFgRa1FiDkvGhNz1WSyUwTzc5drFRJBE3kmyjGyyJyc2skHix9FG3yfs-H',
    category: 'History',
    tags: ['Classical', 'UNESCO', 'Insightful'],
    languages: {
      primary: 'Greek',
      secondary: 'English',
      phrases: [
        { original: 'Kalimera', english: 'Good morning', pronunciation: 'kah-lee-MEH-rah' },
        { original: 'Efharisto', english: 'Thank you', pronunciation: 'ef-hah-ees-to' },
        { original: 'Geia sou', english: 'Hello (informal)', pronunciation: 'YAH-soo' },
        { original: 'Pou einai...? ', english: 'Where is...?', pronunciation: 'poo EE-neh' }
      ]
    },
    airport: {
      name: 'Athens Eleftherios Venizelos Airport',
      code: 'ATH',
      distance: '34 km to center',
      driveTime: '35 min drive'
    },
    coords: {
      lat: 37.9715,
      lng: 23.7257
    }
  },
  {
    id: 'sagrada',
    name: 'La Sagrada Familia',
    location: 'Barcelona, Spain',
    region: 'Catalonia',
    price: '€26/ticket',
    priceNum: 26,
    rating: 4.7,
    description: 'Antoni Gaudí’s breathtaking, highly detailed unfinished basilica towering over Barcelona with intricate symbolic stone facades and colored glass windows.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDX7iXRucCDO6qg9oSYp2Wq4h08JEeoV0UFMMqzdgZ1ynviYen8-Gg1OzpFAxvzt7_mBHHvB1UzDgkZXHF4pmD3zBjvnTlgva6tIMd937SNXcFJ3xQcfMemyIBurSKiMm3zJB2Ty11CqsofCcZ3ect4ZJ6nOIrMC1SxRAzvxqDkbwTN4quxAxthhFvU9B8n68fe8JRDKo34w24P7ZXMjGKU5qoP7U9unD45A9wYLYDZT0SB3gCngLd97cqmj8BNU1vAwOMCCO90LCRX',
    category: 'City',
    tags: ['Architecture', 'Art', 'Spiritual'],
    languages: {
      primary: 'Spanish',
      secondary: 'Catalan / English',
      phrases: [
        { original: 'Hola', english: 'Hello', pronunciation: 'OH-lah' },
        { original: 'Gracias', english: 'Thank you', pronunciation: 'GRAH-syahst' },
        { original: ' ¿Cuánto cuesta?', english: 'How much does it cost?', pronunciation: 'KWAN-toh KWEHS-tah' },
        { original: 'Por favor', english: 'Please', pronunciation: 'por fah-VOR' }
      ]
    },
    airport: {
      name: 'Barcelona El Prat Airport',
      code: 'BCN',
      distance: '15.5 km to center',
      driveTime: '20 min drive'
    },
    coords: {
      lat: 41.4036,
      lng: 2.1744
    }
  },
  {
    id: 'fuji',
    name: 'Mount Fuji Pagoda',
    location: 'Yamanashi, Japan',
    region: 'Fuji Five Lakes',
    price: 'Free entry',
    priceNum: 0,
    rating: 4.9,
    description: 'Look out at the snow-capped peak of iconic Mount Fuji from behind Chureito Pagoda, framed by brilliant cherry blossoms during spring or fiery red maples in autumn.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDioFy84vxoUPHxL65jcFjiOyUT5oVSTKIjLNJt738A2a0uucjOoFYSRZVzz3NNaDr8Q97Emki97T2ldX8jp1YRjcCbCxbpvqn54M19xgs6bhWv1bBEnl_BQjXbAPGcQDBTA9Gmia2CVVzL_4ECAS9O3nGoWVoZ0p7_jluI7xLhLROTj_0t11Z9S946Oc057IYLOZsEA1j1w9dewhnqmfjeVisQVKdfm3NXHsoug8aPalXxWpU616LGsLoNjkVPGdxZ8521RznxGo1A',
    category: 'Mountain',
    tags: ['Scenic', 'Hiking', 'Spiritual'],
    languages: {
      primary: 'Japanese',
      secondary: 'English',
      phrases: [
        { original: 'Konnichiwa (こんにちは)', english: 'Hello', pronunciation: 'kon-nee-chee-wah' },
        { original: 'Arigatou Gozaimasu (ありがとうございます)', english: 'Thank you very much', pronunciation: 'ah-ree-gah-toh go-zah-ee-mahs' },
        { original: 'Sumimasen (すみません)', english: 'Excuse me', pronunciation: 'soo-mee-mah-sen' },
        { original: 'O-kaikei kudasai (お会計ください)', english: 'Bill please', pronunciation: 'oh-kai-kay koo-dah-sai' }
      ]
    },
    airport: {
      name: 'Tokyo Haneda International Airport',
      code: 'HND',
      distance: '128 km to Mount Fuji',
      driveTime: '1h 45m drive'
    },
    coords: {
      lat: 35.3606,
      lng: 138.7274
    }
  },
  {
    id: 'great-wall',
    name: 'Great Wall Mutianyu',
    location: 'Beijing, China',
    region: 'Huairou District',
    price: '¥60/entry',
    priceNum: 8,
    rating: 4.9,
    description: 'Wind across standard historical defenses along beautiful forest ridges, exploring the best preserved mountainous lookouts of the iconic Great Wall of China.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvU1TCeOWK-5qjqzXVYfRj_-6q0Ofrr5NbAZQiTxXkqXbxsgyZNMhHnRloToRdz7V3eV__Nq9Zljsvphs49rjr-y9uTVSdbYHnbrOA-AsO9H_nLdtByV2MvopPneHVL0Un4SNbaTc9hcfoBgqzeLgagiXCLSH_nPtxDZxBqx1IaBjwpu1DJsd1YLyRCDiOOvFTPRgwVubgvtyfMJOmsSkC-24ioQmEaczkgB1WfWrQ7uEV04O_VQXfk2i3mlrNreT5trNcX1mTS-ck',
    category: 'History',
    tags: ['Featured', 'Majestic', 'UNESCO'],
    languages: {
      primary: 'Mandarin Chinese',
      secondary: 'English',
      phrases: [
        { original: 'Ni hao (你好)', english: 'Hello', pronunciation: 'nee how' },
        { original: 'Xie xie (谢谢)', english: 'Thank you', pronunciation: 'shyeh shyeh' },
        { original: 'Cezuo zai nali? (厕所在哪里?)', english: 'Where is the washroom?', pronunciation: 'tsuh-zwoh dzeye nah-lee' },
        { original: 'Tai guile! (太贵了!)', english: 'Too expensive!', pronunciation: 'tie gway luh' }
      ]
    },
    airport: {
      name: 'Beijing Capital International Airport',
      code: 'PEK',
      distance: '55 km to Mutianyu',
      driveTime: '50 min drive'
    },
    coords: {
      lat: 40.4319,
      lng: 116.5704
    }
  }
];

export const TOURS: Tour[] = [
  {
    id: 'cinque-terre',
    name: 'Coastal Villages of Cinque Terre',
    rating: 4.9,
    description: 'Experience the iconic cliffside villages of Italy’s Riviera with private yacht access, olive grove tours, and luxury local wine tasting at Mediterranean sunset.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjrzWzr-vyawaV-s_u_HsXA4PfI8RIwxP5e7MwY9nyzChZTX5RuYzjzhPbPoZUT1y0MSc3DIaOT598jAbpgQosWiPJBZnlhbQDUj2VB_NhugqA8n-iYO7ukkSsd3V8iQ9f0Y0qulEp7b9Ar96NtM9adSIe1aclFT-gKQ5rNrBcb0Hk1kjn3hTLyRxnH0hvflxeI2YyIKd5NFh0c2URTQgoEM4c2cX7wWkqO9GKvQXT0e5ufysOgbjNXTcfF7OSONrajUZhfGWhytbS',
    category: 'Cultural Heritage',
    tags: ['Full Day', 'Eco-Friendly', 'Private Boat'],
    price: 185,
    trending: true
  },
  {
    id: 'taj-mahal',
    name: 'Taj Mahal Sunrise Expedition',
    rating: 5.0,
    description: 'Beat the massive crowds with unique early access to the world’s most exquisite monument of pure white love, guided in high style by a veteran historian.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCAoY7gzb-oWUK2FE4BLos7LYFM_uXM-DqZEHzvQeps3b1Jo_NnSwUDnoZdqr3j9ACFCEUEliPfoZgAbYIciwMlJn3qEjomVwbQ3IOOXuyZR85M8zfMU9ZKj1nh5gpQMuMaovDtwv2kzUQi24mydWBUAxnBVKg4Ec1rEeGURWy8k68ZAcZKqqq7_fkTIfcnXdv2QXwgdzQiYvGoYh9vPtEp8qvkv1PYx5y7vpWwdnw36IYCFmdeZ9dncXgpcc3HTrdSFdGBVnTq1ps',
    category: 'Cultural Heritage',
    tags: ['4 Hours', 'Skip-The-Line', 'Expert Guide'],
    price: 64,
    trending: false
  }
];

export const INITIAL_SHIPMENTS: Shipment[] = [
  {
    id: 'NP-7829-X',
    from: 'Tokyo (HND)',
    to: 'Paris (CDG)',
    status: 'In Transit',
    statusDetails: 'Departed Tokyo Sorting Center, Airline Cargo Checked.',
    progress: 65,
    eta: 'May 24, 2026'
  },
  {
    id: 'NP-4412-M',
    from: 'Munich (MUC)',
    to: 'New York (JFK)',
    status: 'Customs Delay',
    statusDetails: 'Awaiting commercial invoice clearance. Upload requested.',
    progress: 40,
    eta: 'Pending clearance'
  },
  {
    id: 'NP-2109-A',
    from: 'London (LHR)',
    to: 'Dubai (DXB)',
    status: 'Delivered',
    statusDetails: 'Signed by recipient: A. KHAN at front desk.',
    progress: 100,
    eta: 'Delivered on May 18'
  }
];

export const CURRENCIES: CurrencyData[] = [
  { code: 'USD', name: 'United States Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'European Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'Great British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', flag: '🇨🇦' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: 'CN¥', flag: '🇨🇳' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭' }
];
