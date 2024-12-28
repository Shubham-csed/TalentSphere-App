export interface Employee {
  id: number;
  name: string;
  position: string;
  office: string;
  salary: number;

  // New Fields for Detailed Information
  department: string;
  contactNumber: string;
  email: string;
  dateOfJoining: string;
  address: string;
  profilePicUrl: string;
}