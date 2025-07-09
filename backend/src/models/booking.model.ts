import { Database } from "../config/db";
import { BookingStatus, CreateBookingDto } from "../types/bookingType";

export class BookingModel {
  static async create(
    booking: CreateBookingDto
  ): Promise<CreateBookingDto | null> {
    const query = `
      INSERT INTO bookings (customer_id, provider_id, task_id,date, start_time, duration, total_price, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?,?)
    `;
    const values = [
      booking.customer_id,
      booking.provider_id,
      booking.task_id,
      booking.date,
      booking.start_time,
      booking.duration,
      booking.total_price,
      booking.notes,
    ];

    const result = await Database.query(query, values);

    if (result.affectedRows === 0) {
      return null;
    }
    return result;
  }

  // static async update(
  //   userId: string,
  //   bookingId: string,
  //   updates: {
  //     date?: Date;
  //     startTime?: string;
  //     durations?: number;
  //     totalPrice?: string;
  //     notes?: string;
  //     status?: string;
  //   }
  // ): Promise<any> {
  //   const fields = [];
  //   const values = [];

  //   if (updates.date !== undefined) {
  //     fields.push("date = ?");
  //     values.push(updates.date);
  //   }
  //   if (updates.startTime !== undefined) {
  //     fields.push("startTime = ?");
  //     values.push(updates.startTime);
  //   }
  //   if (updates.durations !== undefined) {
  //     fields.push("durations = ?");
  //     values.push(updates.durations);
  //   }
  //   if (updates.totalPrice !== undefined) {
  //     fields.push("totalPrice = ?");
  //     values.push(updates.totalPrice);
  //   }
  //   if (updates.notes !== undefined) {
  //     fields.push("notes = ?");
  //     values.push(updates.notes);
  //   }
  //   if (updates.status !== undefined) {
  //     fields.push("status = ?");
  //     values.push(updates.status);
  //   }

  //   if (fields.length === 0) {
  //     return null;
  //   }

  //   const query = `
  //     UPDATE bookings
  //     SET ${fields.join(", ")}
  //     WHERE id = ? AND provider_id = ?
  //   `;
  //   values.push(bookingId, userId);

  //   const result = await Database.query(query, values);
  //   if (result.affectedRows === 0) {
  //     return null;
  //   }
  //   return result;
  // }

  static async findByCustomerId(customer_id: string): Promise<any> {
    const query =
      "SELECT bookings.id,tasks.title,users.firstName,users.lastName,bookings.date,bookings.start_time,bookings.duration,bookings.total_price,bookings.notes,bookings.status FROM bookings LEFT JOIN tasks ON bookings.task_id = tasks.id LEFT JOIN users ON tasks.provider_id = users.id WHERE bookings.customer_id = ?";
    const values = [customer_id];
    const result = await Database.query(query, values);
    if (!result[0]) {
      return null;
    }
    return result;
  }

  static async findByProviderId(provider_id: string): Promise<any> {
    const query =
      "SELECT bookings.id,tasks.title,users.firstName,users.lastName,bookings.date,bookings.start_time,bookings.duration,bookings.total_price,bookings.notes,bookings.status FROM bookings LEFT JOIN tasks ON bookings.task_id = tasks.id LEFT JOIN users ON tasks.provider_id = users.id WHERE bookings.provider_id = ?";
    const values = [provider_id];
    const result = await Database.query(query, values);
    if (!result[0]) {
      return null;
    }
    return result;
  }

  static async updateStatus(userId:string,bookingId: string, status:BookingStatus,role:string): Promise<any> {
    const query = `UPDATE bookings SET status = ? WHERE id = ? AND ${role == "provider" ? "provider_id = ?" : "customer_id = ?"}`;
    const values = [status, bookingId,userId];
    const result = await Database.query(query, values);
    console.log(values);
    
    if (result.affectedRows === 0) {
      return null;
    }

    return result;
  }

  static async delete(bookingId: string): Promise<any> {
    const query = "DELETE FROM bookings WHERE id = ?";
    const values = [bookingId];
    const result = await Database.query(query, values);
    if (result.affectedRows === 0) {
      return null;
    }
    return result;
  }

  static async listAll(): Promise<any[]> {
    const query = "SELECT * FROM bookings ORDER BY date DESC, startTime DESC";
    const result = await Database.query(query);
    return result;
  }
}
