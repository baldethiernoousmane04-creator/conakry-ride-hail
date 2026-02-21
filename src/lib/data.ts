import { MotorcycleModel, Neighborhood, PublicPlace, PlaceCategory, DeliveryService, UserProfile, RideHistoryItem, Wallet, AdminWallet, Transaction, AppNotification, SettlementMethod, Promotion, DiscountCode, Rating, RideOption } from "../types";

export const REGIONS = [
  "Conakry",
  "Boké",
  "Kindia",
  "Mamou",
  "Labé",
  "Faranah",
  "Kankan",
  "Nzérékoré"
];

// Helper to generate generic places
const generateRegionalPlaces = (region: string, baseNeighborhoods: string[]): PublicPlace[] => {
  const places: PublicPlace[] = [];
  const categories: PlaceCategory[] = [
    'Pharmacie', 'Marché', 'Hôtel', 'Hôpital', 'Banque', 
    'École', 'Restaurant', 'Station-service', 'Administration',
    'Religieux', 'Commerce', 'Tourisme'
  ];

  baseNeighborhoods.forEach(nb => {
    places.push({ name: `Pharmacie ${nb}`, region, type: 'Pharmacie', address: `Rue de ${nb}, ${region}` });
    places.push({ name: `Marché de ${nb}`, region, type: 'Marché', address: `Place centrale, ${nb}` });
    places.push({ name: `Hôtel ${nb}`, region, type: 'Hôtel', address: `${nb}, Secteur 1` });
    places.push({ name: `École Primaire ${nb}`, region, type: 'École', address: `${nb}, Zone scolaire` });
    places.push({ name: `Mosquée de ${nb}`, region, type: 'Religieux', address: `Grande rue de ${nb}` });
    places.push({ name: `Station-service ${nb}`, region, type: 'Station-service', address: `Route principale, ${nb}` });
    places.push({ name: `Centre de Santé ${nb}`, region, type: 'Hôpital', address: `${nb}, Quartier administratif` });
    places.push({ name: `Restaurant ${nb} Délices`, region, type: 'Restaurant', address: `Face au marché de ${nb}` });
    places.push({ name: `Banque Populaire - ${nb}`, region, type: 'Banque', address: `${nb}, Avenue du commerce` });
    places.push({ name: `Mairie de ${nb}`, region, type: 'Administration', address: `Hôtel de ville, ${nb}` });
  });

  for (let i = 1; i <= 50; i++) {
    const cat = categories[i % categories.length];
    places.push({ 
      name: `${cat} ${region} - Zone ${i}`, 
      region, 
      type: cat, 
      address: `Secteur ${i}, ${region}` 
    });
  }

  return places;
};

// --- DATA DEFINITION ---

// CONAKRY Districts
const conakryNeighborhoods = [
  "Almamya", "Boulbinet", "Coronthie", "Kouléwondy", "Sandervalia", "Tombo", "Manquepas", "Teminétaye", "Moussoudougou", "Sans-Fil", "Sankoumbaya", "Friguiagbé",
  "Camayenne", "Dixinn-Centre", "Dixinn-Port", "Landréah", "Minière", "Bellevue", "Hafia 1", "Hafia 2", "Kénien", "Dixinn-Gare", "Hafia Mosquée", "Dixinn-École",
  "Bonfi", "Coléah", "Madina", "Matam-Centre", "Touguiwondy", "Carrière", "Hermakonon", "Imprimerie", "Bonfi-Marché", "Coléah-Port", "Boussoura", "Madina-École",
  "Kaporo", "Kipé", "Lambanyi", "Nongo", "Ratoma-Centre", "Sonfonia", "Taouyah", "Wanindara", "Kossosso", "Hamdallaye", "Bambeto", "Cosa", "Simambossia", "Kobaya", "Yattaya", "Koloma", "Kiroty", "Soloprimo", "Kakimbo", "Dar-es-Salam", "Lambandji", "Sonfonia-Gare", "Sonfonia-Université", "Cité Enco 5", "Petit Simbaya",
  "Enta", "Gbessia", "Kissosso", "Lansanayah", "Matoto-Centre", "Tombolia", "Sangoyah", "Yimbaya", "Dabompa", "Aviation", "Cité de l'Air", "Gbessia-Port", "Matoto-Marché", "Sangoyah-Haut", "Lansanayah-Barrage", "Yimbaya-École", "Dabompa-Plateau", "Kissosso-Haut", "Gbéssia-Cité", "Enta-Marché"
];

const kindiaNeighborhoods = ["Kindia-Centre", "Coyah-Centre", "Dubréka-Centre", "Forécariah-Centre", "Télimélé-Centre", "Manéah", "Kouria", "Kouriah", "Samaya", "Friguiagbé", "Wonkifong", "Tanéné", "Ouassou", "Souguéta", "Kolenté", "Mambia", "Maférinyah", "Benty", "Kaback", "Sogolon"];
const bokeNeighborhoods = ["Boké-Centre", "Kamsar-Cité", "Sangarédi", "Kolaboui", "Boffa-Centre", "Fria-Centre", "Gaoual-Centre", "Koundara-Centre", "Filira", "Tamaransy", "Kamsar-Vieux-Bourg", "Bagataye", "Doupourou", "Koba", "Lisso", "Kimbo", "Tormelin", "Koumbia", "Wendou-M'Bour", "Saréboïdo"];
const mamouNeighborhoods = ["Mamou-Centre", "Dalaba-Centre", "Pita-Centre", "Boulivel", "Dounet", "Gongoret", "Kegneko", "Konkouré", "Ouré-Kaba", "Soyah", "Ditinn", "Kaala", "Timbi-Madina", "Timbi-Tounni", "Sintali"];
const labeNeighborhoods = ["Labé-Centre", "Lélouma-Centre", "Mali-Centre", "Koubia-Centre", "Tougué-Centre", "Dongora", "Tata", "Pounthioun", "Madina", "Kouraba", "Tountouroun", "Lafou", "Yembéring", "Dara-Labé", "Hafia"];
const kankanNeighborhoods = ["Kankan-Centre", "Siguiri-Centre", "Mandiana-Centre", "Kérouané-Centre", "Kouroussa-Centre", "Milo", "Salamani", "Nabaya", "Karfamoriah", "Doko", "Bouré", "Kintinian", "Norassoba", "Sankiana", "Kiniéran", "Banankoro", "Komodou", "Baro", "Sanguiana", "Balandou"];
const faranahNeighborhoods = ["Faranah-Centre", "Kissidougou-Centre", "Dabola-Centre", "Dinguiraye-Centre", "Sirikôrô", "Passaya", "Nyalya", "Tiro", "Albadariah", "Yendé-Millimou", "Banian", "Bissikrima", "Dogomet", "Lansanya", "Sélouma"];
const nzerekoreNeighborhoods = ["Nzérékoré-Centre", "Macenta-Centre", "Guéckédou-Centre", "Lola-Centre", "Yomou-Centre", "Beyla-Centre", "Boma", "Dorota", "Gonia", "Palé", "Samoé", "Koula", "Sérédou", "Tekoulo", "Nongoa", "Bossou", "N'Zoo", "Diecké", "Sinko", "Boola"];

export const NEIGHBORHOODS: Neighborhood[] = [
  ...conakryNeighborhoods.map(name => ({ name, region: "Conakry", prefecture: "Conakry" })),
  ...kindiaNeighborhoods.map(name => ({ name, region: "Kindia", prefecture: "Kindia" })),
  ...bokeNeighborhoods.map(name => ({ name, region: "Boké", prefecture: "Boké" })),
  ...mamouNeighborhoods.map(name => ({ name, region: "Mamou", prefecture: "Mamou" })),
  ...labeNeighborhoods.map(name => ({ name, region: "Labé", prefecture: "Labé" })),
  ...kankanNeighborhoods.map(name => ({ name, region: "Kankan", prefecture: "Kankan" })),
  ...faranahNeighborhoods.map(name => ({ name, region: "Faranah", prefecture: "Faranah" })),
  ...nzerekoreNeighborhoods.map(name => ({ name, region: "Nzérékoré", prefecture: "Nzérékoré" }))
];

const staticPublicPlaces: PublicPlace[] = [
  { name: "Palais du Peuple", region: "Conakry", type: "Administration", address: "Kaloum, Conakry" },
  { name: "Grande Mosquée de Fayçal", region: "Conakry", type: "Religieux", address: "Dixinn, Conakry" },
  { name: "Aéroport Ahmed Sékou Touré", region: "Conakry", type: "Transport", address: "Gbessia, Conakry" },
  { name: "Port Autonome de Conakry", region: "Conakry", type: "Transport", address: "Kaloum, Conakry" },
  { name: "Marché de Madina", region: "Conakry", type: "Marché", address: "Matam, Conakry" },
  { name: "Sheraton Grand Conakry", region: "Conakry", type: "Hôtel", address: "Kipé, Conakry" },
  { name: "Noom Hotel Conakry", region: "Conakry", type: "Hôtel", address: "Kaloum, Conakry" },
  { name: "Hôpital National Donka", region: "Conakry", type: "Hôpital", address: "Dixinn, Conakry" },
  { name: "Sococe Dixinn", region: "Conakry", type: "Commerce", address: "Dixinn, Conakry" },
  { name: "Prima Center Kaporo", region: "Conakry", type: "Commerce", address: "Kaporo, Conakry" },
  { name: "Pharmacie de Patte d'Oie", region: "Conakry", type: "Pharmacie", address: "Matoto, Conakry" },
  { name: "Pharmacie de Bellevue", region: "Conakry", type: "Pharmacie", address: "Dixinn, Conakry" },
  { name: "Hôtel Kaloum", region: "Conakry", type: "Hôtel", address: "Kaloum, Conakry" },
  { name: "Hôtel Onomo", region: "Conakry", type: "Hôtel", address: "Kaloum, Conakry" },
];

export const PUBLIC_PLACES: PublicPlace[] = [
  ...staticPublicPlaces,
  ...generateRegionalPlaces("Conakry", conakryNeighborhoods),
  ...generateRegionalPlaces("Kindia", kindiaNeighborhoods),
  ...generateRegionalPlaces("Boké", bokeNeighborhoods),
  ...generateRegionalPlaces("Mamou", mamouNeighborhoods),
  ...generateRegionalPlaces("Labé", labeNeighborhoods),
  ...generateRegionalPlaces("Kankan", kankanNeighborhoods),
  ...generateRegionalPlaces("Faranah", faranahNeighborhoods),
  ...generateRegionalPlaces("Nzérékoré", nzerekoreNeighborhoods),
];

// ONLY TVS MODELS
export const MOTORCYCLE_MODELS: MotorcycleModel[] = [
  { 
    id: "tvszt", 
    name: "TVS ZT", 
    category: "Premium", 
    description: "Le summum du confort et de la sécurité", 
    isRare: true,
    basePrice: 25000,
    image: "https://storage.googleapis.com/dala-prod-public-storage/attachments/1fe4fd48-bb22-4191-9ed3-3dcda11752d0/1771679377832_TVS_ZT.jpg"
  },
  { 
    id: "tvs150", 
    name: "TVS 150", 
    category: "Popular", 
    description: "Puissance et stabilité pour vos trajets", 
    isRare: false,
    basePrice: 20000,
    image: "https://storage.googleapis.com/dala-prod-public-storage/attachments/1fe4fd48-bb22-4191-9ed3-3dcda11752d0/1771679377834_tvs_150.jpg"
  },
  { 
    id: "tvs125", 
    name: "TVS 125", 
    category: "Standard", 
    description: "La fiabilité TVS au meilleur prix", 
    isRare: false,
    basePrice: 15000,
    image: "https://storage.googleapis.com/dala-prod-public-storage/attachments/1fe4fd48-bb22-4191-9ed3-3dcda11752d0/1771679377834_TVS_125.jpg"
  },
];

export const DELIVERY_SERVICES: DeliveryService[] = [
  {
    id: "wongaye-coursier",
    name: "Wongaye Coursier",
    description: "Livraison rapide de petits colis et documents",
    basePrice: 10000,
    estimatedTime: "15-25 min",
    category: "courier",
    image: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/2bc7131e-2f56-4a78-8761-15b8684d62d2/wongaye-coursier-83132456-1771681452125.webp"
  },
  {
    id: "wongaye-cargo",
    name: "Wongaye Cargo",
    description: "Transport de marchandises volumineuses via tricycle",
    basePrice: 35000,
    estimatedTime: "30-45 min",
    category: "cargo",
    image: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/2bc7131e-2f56-4a78-8761-15b8684d62d2/wongaye-cargo-f540ab9b-1771681451817.webp"
  },
  {
    id: "wongaye-logistique",
    name: "Wongaye Logistique",
    description: "Camionnette pour déménagements et gros stocks",
    basePrice: 150000,
    estimatedTime: "60+ min",
    category: "cargo",
    image: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/2bc7131e-2f56-4a78-8761-15b8684d62d2/wongaye-logistique-cca129b7-1771681456715.webp"
  }
];

export const MOCK_USER: UserProfile = {
  id: "user-123",
  name: "Moussa Sylla",
  email: "moussa.sylla@email.com",
  phone: "+224 620 00 00 00",
  avatar: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/2bc7131e-2f56-4a78-8761-15b8684d62d2/user-avatar-8d4bcc94-1771682622183.webp",
  rating: 4.9,
  totalRides: 42,
  joinedDate: "Janvier 2024",
  role: 'customer',
  loyaltyPoints: 1250,
  referralCode: "MOUSSA224",
  preferences: {
    language: 'fr',
    notifications: true,
    favoriteVehicle: 'tvszt'
  }
};

export const MOCK_RIDE_HISTORY: RideHistoryItem[] = [
  {
    id: "ride-1",
    date: "20 Mai 2024, 14:30",
    origin: "Marché de Madina",
    destination: "Kipé Sheraton",
    fare: 25000,
    status: 'completed',
    vehicleType: 'moto',
    vehicleName: 'TVS ZT',
    driverName: 'Abdoulaye B.',
    driverId: 'driver-1',
    commission: 3750,
    paymentMethod: 'digital'
  },
  {
    id: "ride-2",
    date: "18 Mai 2024, 09:15",
    origin: "Dixinn-Centre",
    destination: "Kaloum Port",
    fare: 15000,
    status: 'completed',
    vehicleType: 'moto',
    vehicleName: 'TVS 125',
    driverName: 'Mohamed C.',
    driverId: 'driver-2',
    commission: 2250,
    paymentMethod: 'cash'
  },
  {
    id: "ride-3",
    date: "15 Mai 2024, 18:45",
    origin: "Lambanyi",
    destination: "Ratoma-Centre",
    fare: 20000,
    status: 'cancelled',
    vehicleType: 'moto',
    vehicleName: 'TVS 150',
    paymentMethod: 'digital'
  }
];

export const MOCK_RATINGS: Rating[] = [
  {
    id: "rat-1",
    tripId: "ride-1",
    raterUserId: "user-123",
    ratedUserId: "driver-1",
    ratingValue: 5,
    reviewText: "Excellent trajet, chauffeur très prudent !",
    createdAt: "2024-05-20T15:00:00Z"
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-1",
    type: 'ride',
    amount: -25000,
    date: "20 Mai 2024, 14:30",
    description: "Course TVS ZT - Madina vers Kipé",
    status: 'completed',
    paymentMethod: 'digital'
  },
  {
    id: "tx-2",
    type: 'topup',
    amount: 100000,
    date: "19 Mai 2024, 10:00",
    description: "Rechargement via Orange Money",
    status: 'completed'
  },
  {
    id: "tx-4",
    type: 'referral_bonus',
    amount: 10000,
    date: "15 Mai 2024, 12:00",
    description: "Bonus de parrainage (Ami: Alpha)",
    status: 'completed'
  }
];

export const MOCK_WALLET: Wallet = {
  id: "w-1",
  userId: "user-123",
  balance: 145000,
  currency: "GNF",
  transactions: MOCK_TRANSACTIONS
};

export const MOCK_SETTLEMENT_METHODS: SettlementMethod[] = [
  {
    id: 'set-1',
    type: 'orange_money',
    label: 'Orange Money Business',
    accountNumber: '+224 622 11 22 33',
    isActive: true
  },
  {
    id: 'set-2',
    type: 'bank_rib',
    label: 'Banque Centrale (RIB)',
    accountNumber: 'GN65 00001 00002 0000300004 05',
    isActive: false
  }
];

export const MOCK_ADMIN_WALLET: AdminWallet = {
  id: "aw-1",
  userId: "admin-1",
  balance: 1250000,
  totalCommissions: 8540000,
  availableForWithdrawal: 1250000,
  currency: "GNF",
  transactions: [
    {
      id: "atx-1",
      type: 'commission',
      amount: 3750,
      date: "20 Mai 2024, 14:30",
      description: "Comm. Course #ride-1 (Digital Split)",
      status: 'completed'
    },
    {
      id: "atx-2",
      type: 'commission',
      amount: 2250,
      date: "18 Mai 2024, 09:15",
      description: "Comm. Course #ride-2 (Cash Deduction)",
      status: 'completed'
    },
    {
      id: "atx-3",
      type: 'settlement',
      amount: -5000000,
      date: "17 Mai 2024, 16:00",
      description: "Transfert vers Orange Money Business",
      status: 'completed'
    }
  ],
  settlementMethods: MOCK_SETTLEMENT_METHODS
};

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif-1",
    title: "Promotion Week-end !",
    message: "Profitez de 20% de réduction sur tous vos trajets ce samedi et dimanche avec le code WONGAYE20.",
    date: "Il y a 2 heures",
    read: false,
    type: 'promo'
  },
  {
    id: "notif-loyalty-1",
    title: "Nouveau niveau atteint !",
    message: "Félicitations ! Vous êtes maintenant membre Or. Gagnez 2x plus de points par trajet.",
    date: "Il y a 3 heures",
    read: false,
    type: 'loyalty'
  }
];

// PROMOTIONS & DISCOUNT CODES
export const MOCK_PROMOTIONS: Promotion[] = [
  {
    id: 'promo-1',
    title: 'Wongaye Welcome',
    description: '10% de réduction sur votre première course',
    discountType: 'percentage',
    discountValue: 10,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    isActive: true,
    image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/2bc7131e-2f56-4a78-8761-15b8684d62d2/promo-welcome-345345.webp'
  },
  {
    id: 'promo-2',
    title: 'Weekend Special',
    description: '20% de réduction ce weekend',
    discountType: 'percentage',
    discountValue: 20,
    startDate: '2024-05-24',
    endDate: '2024-05-26',
    isActive: true,
    image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/2bc7131e-2f56-4a78-8761-15b8684d62d2/promo-weekend-456456.webp'
  }
];

export const MOCK_DISCOUNT_CODES: DiscountCode[] = [
  {
    id: 'code-1',
    code: 'WONGAYE10',
    discountType: 'percentage',
    discountValue: 10,
    expiryDate: '2024-12-31',
    usageLimit: 1000,
    usageCount: 150,
    isActive: true,
    minOrderValue: 15000
  },
  {
    id: 'code-2',
    code: 'KALAO5000',
    discountType: 'fixed',
    discountValue: 5000,
    expiryDate: '2024-06-30',
    usageLimit: 500,
    usageCount: 42,
    isActive: true,
    minOrderValue: 25000
  }
];

/**
 * Validates a discount code
 */
export const validateDiscountCode = (code: string, currentFare: number): { isValid: boolean; discount?: number; message: string; codeDetails?: DiscountCode } => {
  const foundCode = MOCK_DISCOUNT_CODES.find(c => c.code.toUpperCase() === code.toUpperCase());
  
  if (!foundCode) {
    return { isValid: false, message: "Code promo invalide" };
  }

  if (!foundCode.isActive) {
    return { isValid: false, message: "Ce code n'est plus actif" };
  }

  const now = new Date();
  if (new Date(foundCode.expiryDate) < now) {
    return { isValid: false, message: "Ce code a expiré" };
  }

  if (foundCode.usageLimit && foundCode.usageCount >= foundCode.usageLimit) {
    return { isValid: false, message: "Ce code a atteint sa limite d'utilisation" };
  }

  if (foundCode.minOrderValue && currentFare < foundCode.minOrderValue) {
    return { 
      isValid: false, 
      message: `Ce code nécessite un montant minimum de ${foundCode.minOrderValue} GNF` 
    };
  }

  let discount = 0;
  if (foundCode.discountType === 'percentage') {
    discount = (currentFare * foundCode.discountValue) / 100;
    if (foundCode.maxDiscount && discount > foundCode.maxDiscount) {
      discount = foundCode.maxDiscount;
    }
  } else {
    discount = foundCode.discountValue;
  }

  return { 
    isValid: true, 
    discount: Math.min(discount, currentFare), 
    message: "Code promo appliqué !",
    codeDetails: foundCode
  };
};

// Commission constant
export const COMMISSION_RATE = 0.15;

/**
 * Calculates the breakdown of a trip fare
 */
export const calculateCommissionBreakdown = (fare: number) => {
  const commission = fare * COMMISSION_RATE;
  const driverNet = fare - commission;
  return {
    fare,
    commission,
    driverNet
  };
};

/**
 * Ratings Functions
 */
export const createRating = async (rating: Omit<Rating, 'id' | 'createdAt'>): Promise<Rating> => {
  console.log("Creating rating in database/mock:", rating);
  const newRating: Rating = {
    ...rating,
    id: `rat-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString()
  };
  MOCK_RATINGS.push(newRating);
  return newRating;
};

export const getTripRatings = (tripId: string): Rating[] => {
  return MOCK_RATINGS.filter(r => r.tripId === tripId);
};

export const getUserAverageRating = (userId: string): number => {
  const userRatings = MOCK_RATINGS.filter(r => r.ratedUserId === userId);
  if (userRatings.length === 0) return 5.0;
  const sum = userRatings.reduce((acc, curr) => acc + curr.ratingValue, 0);
  return Number((sum / userRatings.length).toFixed(1));
};

/**
 * Book a ride (Simulated)
 */
export const bookRide = async (pickup: string, destination: string, rideOption: RideOption): Promise<{ success: boolean; tripId: string }> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const tripId = `trip-${Math.random().toString(36).substr(2, 9)}`;
      console.log(`Booking ride: from ${pickup} to ${destination} with ${rideOption.name}`);
      resolve({ success: true, tripId });
    }, 1500);
  });
};