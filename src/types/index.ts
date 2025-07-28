export interface Train {
  id: string
  train_number: string
  train_name: string
  source_station: string
  destination_station: string
  departure_time: string
  arrival_time: string
  total_seats: number
  available_seats: number
  price: number
  created_at: string
}

export interface Booking {
  id: string
  user_id: string
  train_id: string
  passenger_name: string
  passenger_age: number
  passenger_gender: string
  seat_number: string
  booking_date: string
  travel_date: string
  status: 'confirmed' | 'cancelled'
  amount: number
  created_at: string
}

export interface User {
  id: string
  email: string
  full_name: string
  phone: string
  created_at: string
}