declare type Duration = {
  label: string;
  price: number;
  priceId: string;
};

declare type Service = {
  id: string;
  name: string;
  description: string;
  image: string | null;
  durations: Duration[];
};

declare type BusyTime = {
  start: string;
  end: string;
};

declare type PersonalData = {
  fullName: string;
  preferredName?: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: string;
  profession?: string;

  address: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
  zipCode: string;
};

declare type SelectedService = {
  priceId: string;
  name: string;
  price: number;
  productId: string;
  quantity: number;
  durationLabel: string;
  duration: number;
};