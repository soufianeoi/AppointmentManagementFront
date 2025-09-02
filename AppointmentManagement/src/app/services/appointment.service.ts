import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  Appointment, 
  CreateAppointmentRequest, 
  UpdateAppointmentRequest, 
  AppointmentQueryParams, 
  PaginatedResponse 
} from '../models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private readonly baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getAppointments(params?: AppointmentQueryParams): Observable<PaginatedResponse<Appointment>> {
    let httpParams = new HttpParams();
    
    if (params) {
      if (params.page !== undefined) httpParams = httpParams.set('page', params.page.toString());
      if (params.pageSize !== undefined) httpParams = httpParams.set('pageSize', params.pageSize.toString());
      if (params.doctorName) httpParams = httpParams.set('doctorName', params.doctorName);
      if (params.patientName) httpParams = httpParams.set('patientName', params.patientName);
      if (params.status) httpParams = httpParams.set('status', params.status);
      if (params.startDate) httpParams = httpParams.set('startDate', params.startDate);
      if (params.endDate) httpParams = httpParams.set('endDate', params.endDate);
    }

    return this.http.get<PaginatedResponse<Appointment>>(`${this.baseUrl}/appointments`, { params: httpParams });
  }

  getAppointmentById(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.baseUrl}/appointments/${id}`);
  }

  createAppointment(appointment: CreateAppointmentRequest): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.baseUrl}/appointments`, appointment);
  }

  updateAppointment(id: number, appointment: UpdateAppointmentRequest): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.baseUrl}/appointments/${id}`, appointment);
  }

  confirmAppointment(id: number): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.baseUrl}/appointments/${id}/confirm`, {});
  }

  startAppointment(id: number): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.baseUrl}/appointments/${id}/start`, {});
  }

  cancelAppointment(id: number): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.baseUrl}/appointments/${id}/cancel`, {});
  }

  completeAppointment(id: number): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.baseUrl}/appointments/${id}/complete`, {});
  }

  markAsNoShow(id: number): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.baseUrl}/appointments/${id}/no-show`, {});
  }
}
