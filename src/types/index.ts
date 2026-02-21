export interface RideOption {
  id: string;
  name: string;
  price: number;
  estimatedTime: string;
  image: string;
  capacity: number;
  description: string;
  category: 'moto' | 'car' | 'premium' | 'utility' | 'cargo' | 'courier' | 'luxury' | 'electric' | 'xl';
  model?: string;
  isRare?: boolean;
}

export interface MotorcycleModel {
  id: string;
  name: string;
  category: string;
  description: string;
  isRare: boolean;
  basePrice: number;
  image: string;
}

export interface DeliveryService {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  image: string;
  estimatedTime: string;
  category: 'cargo' | 'courier';
}

export interface Location {
  address: string;
  lat: number;
  lng: number;
  type?: 'neighborhood' | 'landmark' | 'public_place';
  region?: string;
}

export interface Neighborhood {
  id?: string;
  name: string;
  region: string;
  prefecture?: string;
}

export type PlaceCategory = 'Pharmacie' | 'Marché' | 'Hôtel' | 'Hôpital' | 'Banque' | 'École' | 'Restaurant' | 'Station-service' | 'Administration' | 'Lieu Public' | 'Quartier' | 'Transport' | 'Culture' | 'Sport' | 'Religieux' | 'Monument' | 'Commerce' | 'Tourisme';

export interface PublicPlace {
  id?: string;
  name: string;
  type: PlaceCategory;
  region: string;
  address?: string;
}

export type AppState = 'idle' | 'searching' | 'selecting' | 'confirmed' | 'on_trip' | 'profile' | 'history' | 'wallet' | 'notifications' | 'admin_dashboard' | 'loyalty' | 'referral';

export type UserRole = 'customer' | 'driver' | 'admin';

export type DriverStatus = 'not_started' | 'pending' | 'approved' | 'rejected';

export interface DriverApplication {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  email: string;
  vehicleType: 'moto' | 'car';
  vehicleModel: string;
  vehicleYear: string;
  licensePlate: string;
  licenseImage?: string;
  registrationImage?: string;
  insuranceImage?: string;
  status: DriverStatus;
  submittedAt: string;
}

export interface DriverStats {
  todayEarnings: number;
  totalTrips: number;
  rating: number;
  isOnline: boolean;
  walletBalance: number;
  verificationStatus: DriverStatus;
  acceptanceRate: number;
  onlineHours: number;
}

export interface RideRequest {
  id: string;
  customerName: string;
  pickup: string;
  destination: string;
  price: number;
  category: string;
  paymentMethod: 'cash' | 'digital';
  distance?: string;
  duration?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  rating: number;
  totalRides: number;
  joinedDate: string;
  role: UserRole;
  status?: 'active' | 'suspended' | 'pending';
  loyaltyPoints: number;
  referralCode: string;
  preferences?: {
    language: string;
    notifications: boolean;
    favoriteVehicle: string;
  };
}

export interface RideHistoryItem {
  id: string;
  date: string;
  origin: string;
  destination: string;
  fare: number;
  status: 'completed' | 'cancelled';
  vehicleType: string;
  vehicleName: string;
  driverName?: string;
  driverId?: string;
  customerId?: string;
  commission?: number;
  paymentMethod?: 'cash' | 'digital';
}

export interface Transaction {
  id: string;
  walletId?: string;
  rideId?: string;
  type: 'ride' | 'topup' | 'refund' | 'delivery' | 'commission' | 'settlement' | 'referral_bonus' | 'loyalty_redemption';
  amount: number;
  date: string;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  paymentMethodId?: string;
  paymentMethod?: 'cash' | 'digital';
}

export interface PaymentMethod {
  id: string;
  userId: string;
  type: 'orange_money' | 'mtn_momo' | 'card' | 'cash';
  providerToken?: string;
  lastDigits?: string;
  isDefault: boolean;
  createdAt: string;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  transactions: Transaction[];
}

export interface AdminWallet extends Wallet {
  totalCommissions: number;
  availableForWithdrawal: number;
  settlementMethods: SettlementMethod[];
}

export interface SettlementMethod {
  id: string;
  type: 'orange_money' | 'mtn_momo' | 'bank_rib';
  label: string;
  accountNumber: string;
  isActive: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'promo' | 'system' | 'trip' | 'support' | 'finance' | 'loyalty';
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  image?: string;
}

export interface DiscountCode {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  expiryDate: string;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
}

export interface Rating {
  id: string;
  tripId: string;
  raterUserId: string;
  ratedUserId: string;
  ratingValue: number;
  reviewText?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  tripId: string;
  text: string;
  createdAt: string;
  isRead: boolean;
}

export interface Dispute {
  id: string;
  tripId: string;
  userId: string;
  userName: string;
  role: UserRole;
  reason: string;
  description: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
}