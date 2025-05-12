
export type Student = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  gender: string;
  department: string;
  created_at: string;
  updated_at: string;
};

export type Application = {
  id: string;
  student_id: string;
  academic_year: string;
  current_year: number;
  cgpa?: number;
  home_address: string;
  distance_km?: number;
  annual_income?: number;
  category?: string;
  photo_id_url?: string;
  income_cert_url?: string;
  hostel_preference?: string[];
  status: "PENDING" | "APPROVED" | "REJECTED";
  remarks?: string;
  created_at: string;
  updated_at: string;
};

export type Hostel = {
  id: string;
  name: string;
  gender: string;
  total_rooms: number;
  available_rooms: number;
  facilities: string[];
  created_at: string;
};

export type Allocation = {
  id: string;
  application_id: string;
  hostel_id: string;
  room_number: string;
  allotment_date: string;
  payment_status: "PENDING" | "COMPLETED" | "FAILED";
  payment_amount?: number;
  created_at: string;
  updated_at: string;
};
