export interface Appointment {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorName: string;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentRequest {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorName: string;
}

export interface UpdateAppointmentRequest {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

export interface AppointmentQueryParams {
  page?: number;
  pageSize?: number;
  doctorName?: string;
  patientName?: string;
  status?: AppointmentStatus;
  startDate?: string;
  endDate?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
  first: boolean;
  last: boolean;
}

export enum AppointmentStatus {
  SCHEDULED = 'Scheduled',
  CONFIRMED = 'Confirmed',
  IN_PROGRESS = 'InProgress',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
  NO_SHOW = 'NoShow'
}

export const AppointmentStatusLabels: Record<AppointmentStatus, string> = {
  [AppointmentStatus.SCHEDULED]: 'Programmé',
  [AppointmentStatus.CONFIRMED]: 'Confirmé',
  [AppointmentStatus.IN_PROGRESS]: 'En cours',
  [AppointmentStatus.COMPLETED]: 'Terminé',
  [AppointmentStatus.CANCELLED]: 'Annulé',
  [AppointmentStatus.NO_SHOW]: 'Absent'
};
