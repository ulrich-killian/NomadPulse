export interface Attraction {
  id: string;
  name: string;
  location: string;
  region: string;
  price: string;
  priceNum: number;
  rating: number;
  description: string;
  image: string;
  category: 'Beach' | 'Mountain' | 'City' | 'History' | 'Wellness' | string;
  tags: string[];
  languages: {
    primary: string;
    secondary: string;
    phrases: { original: string; english: string; pronunciation: string }[];
  };
  airport: {
    name: string;
    code: string;
    distance: string;
    driveTime: string;
  };
  coords: {
    lat: number;
    lng: number;
  };
}

export interface Tour {
  id: string;
  name: string;
  rating: number;
  description: string;
  image: string;
  category: string;
  tags: string[];
  price: number;
  trending: boolean;
}

export interface Shipment {
  id: string;
  from: string;
  to: string;
  status: 'In Transit' | 'Customs Delay' | 'Delivered' | 'Pending';
  statusDetails: string;
  progress: number;
  eta: string;
}

export interface CurrencyData {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

export interface Trip {
  id: string;
  userId: string;
  name: string;
  startDate: string;
  endDate: string;
  destinations: string[];
}

export interface InAppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'info' | 'price-drop' | 'flight' | 'alert';
}

