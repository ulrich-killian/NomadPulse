import { Shipment } from './types';


const CURRENCY_API_KEY = '09b78b161649b45a934366bb';
const WEATHER_API_BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const AVIATIONSTACK_API_KEY = '2d08abf11dbb425e540e1bd543ce7058';
const GEOAPIFY_API_KEY = '11ff1cbaa18747c3a368eadb055158e1';
const PEXELS_API_KEY = 'Xd7sBBkBP9h3nIPN3HYiCVaB1J1hCQtveJce0HsQS3rMB6h7HjSEwOEv';


export async function getExchangeRates(baseCode: string = 'USD'): Promise<Record<string, number>> {
  try {
    const url = `https://v6.exchangerate-api.com/v6/${CURRENCY_API_KEY}/latest/${baseCode}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`ExchangeRate API returned status ${response.status}`);
    }
    const data = await response.json();
    if (data.result === 'success' && data.conversion_rates) {
      return data.conversion_rates;
    }
    throw new Error('Rates not provided in response');
  } catch (error) {
    console.error('getExchangeRates error, returning fallback rates:', error);
  
    const baseRates: Record<string, number> = {
      USD: 1, EUR: 0.92, GBP: 0.79, JPY: 156.2, CAD: 1.36, AUD: 1.51, CNY: 7.24, INR: 83.3, CHF: 0.91
    };
    if (baseCode === 'USD') return baseRates;
    
    const usdRate = baseRates[baseCode] || 1;
    const computedRates: Record<string, number> = {};
    for (const [code, rate] of Object.entries(baseRates)) {
      computedRates[code] = Number((rate / usdRate).toFixed(4));
    }
    return computedRates;
  }
}


export interface WeatherForecast {
  currentTemp: number;
  condition: string;
  conditionText: string;
  forecast: { day: string; condition: 'sunny' | 'cloudy' | 'rainy'; temp: number; text: string }[];
}

export async function getWeatherData(lat: number, lng: number): Promise<WeatherForecast> {
  try {
    const url = `${WEATHER_API_BASE_URL}?latitude=${lat}&longitude=${lng}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Open-Meteo returned status ${response.status}`);
    }
    const data = await response.json();
    
    const currentTemp = Math.round(data.current_weather?.temperature || 24);
    const weathercode = data.current_weather?.weathercode || 0;
    
    
    const getCondition = (code: number): { key: 'sunny' | 'cloudy' | 'rainy'; name: string } => {
      if (code <= 3) return { key: 'sunny', name: 'Clear & Sunny' };
      if (code <= 48) return { key: 'cloudy', name: 'Mostly Cloudy' };
      return { key: 'rainy', name: 'Showers & Rainy' };
    };

    const currentCond = getCondition(weathercode);

   
    const forecastDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const todayIndex = new Date().getDay(); 
    const dailyData = data.daily;
    const forecastList: any[] = [];

    if (dailyData && dailyData.temperature_2m_max) {
      for (let i = 1; i <= Math.min(3, dailyData.temperature_2m_max.length - 1); i++) {
        const index = (todayIndex + i - 1) % 7;
        const code = dailyData.weathercode ? dailyData.weathercode[i] : 0;
        const cond = getCondition(code);
        const maxTemp = Math.round(dailyData.temperature_2m_max[i]);
        forecastList.push({
          day: forecastDays[index],
          condition: cond.key,
          temp: maxTemp,
          text: cond.name
        });
      }
    } else {
      
      forecastList.push(
        { day: 'Mon', condition: 'cloudy', temp: 26, text: 'Partly Cloudy' },
        { day: 'Tue', condition: 'sunny', temp: 29, text: 'Clear & Sunny' },
        { day: 'Wed', condition: 'rainy', temp: 22, text: 'Light Showers' }
      );
    }

    return {
      currentTemp,
      condition: currentCond.key,
      conditionText: currentCond.name,
      forecast: forecastList
    };
  } catch (error) {
    console.error('getWeatherData error, using mock output:', error);
    return {
      currentTemp: 28,
      condition: 'sunny',
      conditionText: 'Sunny & Clear',
      forecast: [
        { day: 'Mon', condition: 'cloudy', temp: 26, text: 'Cloudy' },
        { day: 'Tue', condition: 'sunny', temp: 29, text: 'Clear' },
        { day: 'Wed', condition: 'rainy', temp: 22, text: 'Rain' }
      ]
    };
  }
}


export interface FlightInfo {
  flightNumber: string;
  airline: string;
  departure: string;
  arrival: string;
  status: string;
  gate?: string;
  terminal?: string;
}

export async function getLiveFlights(airportCode: string): Promise<FlightInfo[]> {
  try {
  
    const secureUrl = `https://api.aviationstack.com/v1/flights?access_key=${AVIATIONSTACK_API_KEY}&arr_iata=${airportCode}&limit=4`;
    const response = await fetch(secureUrl);
    if (!response.ok) {
      throw new Error('Aviationstack request blocked or error triggered.');
    }
    const json = await response.json();
    if (json.data && json.data.length > 0) {
      return json.data.map((f: any) => ({
        flightNumber: f.flight?.iata || f.flight?.number || 'AA-100',
        airline: f.airline?.name || 'Global Airways',
        departure: f.departure?.airport || 'Origin Hub',
        arrival: f.arrival?.iata || airportCode,
        status: f.flight_status || 'Scheduled',
        gate: f.arrival?.gate,
        terminal: f.arrival?.terminal
      }));
    }
    throw new Error('Empty flight data array');
  } catch (err) {
   
    const prebakedFlights: Record<string, FlightInfo[]> = {
      JTR: [
        { flightNumber: 'GQ-342', airline: 'Sky Express', departure: 'Athens (ATH)', arrival: 'JTR', status: 'Landed' },
        { flightNumber: 'EJU-2901', airline: 'EasyJet Europe', departure: 'Milan (MXP)', arrival: 'JTR', status: 'En Route' },
        { flightNumber: 'FR-1242', airline: 'Ryanair', departure: 'Rome (FCO)', arrival: 'JTR', status: 'On Time' },
        { flightNumber: 'A3-356', airline: 'Aegean Airlines', departure: 'Thessaloniki (SKG)', arrival: 'JTR', status: 'Scheduled' }
      ],
      NAP: [
        { flightNumber: 'LH-1926', airline: 'Lufthansa', departure: 'Munich (MUC)', arrival: 'NAP', status: 'Landed' },
        { flightNumber: 'AZ-1281', airline: 'ITA Airways', departure: 'Rome (FCO)', arrival: 'NAP', status: 'On Time' },
        { flightNumber: 'BA-2612', airline: 'British Airways', departure: 'London (Gatwick)', arrival: 'NAP', status: 'Scheduled' }
      ],
      BCN: [
        { flightNumber: 'VY-1024', airline: 'Vueling', departure: 'Paris (ORY)', arrival: 'BCN', status: 'Delayed' },
        { flightNumber: 'IB-3012', airline: 'Iberia', departure: 'Madrid (MAD)', arrival: 'BCN', status: 'Landed' },
        { flightNumber: 'SQ-378', airline: 'Singapore Airlines', departure: 'Milan (MXP)', arrival: 'BCN', status: 'En Route' }
      ]
    };
    return prebakedFlights[airportCode] || [
      { flightNumber: 'NP-101', airline: 'AeroNomad', departure: 'London (LHR)', arrival: airportCode, status: 'On Time' },
      { flightNumber: 'NP-239', airline: 'PulseAir', departure: 'Tokyo (HND)', arrival: airportCode, status: 'Scheduled' }
    ];
  }
}


export async function searchPexelsImages(query: string): Promise<string[]> {
  try {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=4`;
    const response = await fetch(url, {
      headers: { Authorization: PEXELS_API_KEY }
    });
    if (!response.ok) throw new Error('Pexels API error status');
    const data = await response.json();
    if (data.photos && data.photos.length > 0) {
      return data.photos.map((p: any) => p.src.large2x || p.src.large || p.src.original);
    }
    return [];
  } catch (e) {
    console.error('searchPexelsImages error:', e);
    return [];
  }
}
