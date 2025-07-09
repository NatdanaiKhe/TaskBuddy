export type BookingStatus =
  | "pending"
  | "accepted"
  | "declined"
  | "cancelled"
  | "completed";

export interface Booking {
  id: string;
  customer_id: string;
  task_id :string,
  provider_id:string;
  status: BookingStatus;
  date: Date;
  start_time: string;
  duration:number;
  notes?: string;
  total_price: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateBookingDto {
  customer_id: string;
  task_id: string;
  provider_id: string;
  date: string;
  start_time: string;
  duration: number;
  total_price: number;
  notes?: string;
}