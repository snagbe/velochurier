export interface AddressGeocoder {
  id: string;
  company: string;
  name: string;
  surname: string;
  city: string;
  street: string;
  zip?: number;
  email?: string;
  phone?: string;
  lat: string;
  lng: string;
  marker?: Marker;
}

export interface Marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}