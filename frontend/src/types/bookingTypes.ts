export type BookingStatus = "pending" | "accepted" | "cancelled" | "completed";


export interface BookingType {
  id:string;
  title:string,
  firstName:string;
  lastName:string;
  date:Date;
  start_time:string;
  duration:number;
  total_price:number;
  notes?:string;
  status: BookingStatus;
}
export interface BookingForm {
  task_id: string;
  date: Date;
  start_time: string;
  duration: string;
  notes: string;
  total_price: number;
}
