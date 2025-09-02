import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { MaterialModule } from '../../shared/material.module';
import { AppointmentService } from '../../services/appointment.service';
import { 
  Appointment, 
  AppointmentQueryParams, 
  AppointmentStatus, 
  AppointmentStatusLabels 
} from '../../models/appointment.model';

@Component({
  selector: 'app-appointment-list',
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './appointment-list.component.html',
  styleUrl: './appointment-list.component.scss'
})
export class AppointmentListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['patient', 'doctor', 'date', 'status', 'actions'];
  dataSource = new MatTableDataSource<Appointment>();
  
  filterForm: FormGroup;
  totalElements = 0;
  pageSize = 10;
  currentPage = 0;
  loading = false;
  
  statusOptions = Object.values(AppointmentStatus);
  statusLabels = AppointmentStatusLabels;

  constructor(
    private appointmentService: AppointmentService,
    private router: Router,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      patientName: [''],
      doctorName: [''],
      status: [''],
      startDate: [''],
      endDate: ['']
    });
  }

  ngOnInit(): void {
    this.loadAppointments();
    
    // Setup reactive filters
    this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.currentPage = 0;
        this.loadAppointments();
      });
  }

  ngAfterViewInit(): void {
    this.paginator.page.subscribe(() => {
      this.currentPage = this.paginator.pageIndex;
      this.pageSize = this.paginator.pageSize;
      this.loadAppointments();
    });
  }

  loadAppointments(): void {
    this.loading = true;
    const filters = this.filterForm.value;
    
    const params: AppointmentQueryParams = {
      page: this.currentPage,
      pageSize: this.pageSize,
      ...filters
    };

    // Remove empty filters
    Object.keys(params).forEach(key => {
      if (params[key as keyof AppointmentQueryParams] === '' || 
          params[key as keyof AppointmentQueryParams] === null) {
        delete params[key as keyof AppointmentQueryParams];
      }
    });

    this.appointmentService.getAppointments(params).subscribe({
      next: (response) => {
        this.dataSource.data = response.content;
        this.totalElements = response.totalElements;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading appointments:', error);
        this.loading = false;
      }
    });
  }

  clearFilters(): void {
    this.filterForm.reset();
  }

  viewAppointment(appointment: Appointment): void {
    this.router.navigate(['/appointments', appointment.id]);
  }

  editAppointment(appointment: Appointment): void {
    this.router.navigate(['/appointments', appointment.id, 'edit']);
  }

  confirmAppointment(appointment: Appointment): void {
    this.appointmentService.confirmAppointment(appointment.id).subscribe({
      next: () => {
        this.snackBar.open('Rendez-vous confirmé', 'Fermer', { duration: 3000 });
        this.loadAppointments();
      }
    });
  }

  startAppointment(appointment: Appointment): void {
    this.appointmentService.startAppointment(appointment.id).subscribe({
      next: () => {
        this.snackBar.open('Rendez-vous démarré', 'Fermer', { duration: 3000 });
        this.loadAppointments();
      }
    });
  }

  cancelAppointment(appointment: Appointment): void {
    if (confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) {
      this.appointmentService.cancelAppointment(appointment.id).subscribe({
        next: () => {
          this.snackBar.open('Rendez-vous annulé', 'Fermer', { duration: 3000 });
          this.loadAppointments();
        }
      });
    }
  }

  completeAppointment(appointment: Appointment): void {
    this.appointmentService.completeAppointment(appointment.id).subscribe({
      next: () => {
        this.snackBar.open('Rendez-vous terminé', 'Fermer', { duration: 3000 });
        this.loadAppointments();
      }
    });
  }

  markAsNoShow(appointment: Appointment): void {
    if (confirm('Marquer ce rendez-vous comme absent ?')) {
      this.appointmentService.markAsNoShow(appointment.id).subscribe({
        next: () => {
          this.snackBar.open('Rendez-vous marqué comme absent', 'Fermer', { duration: 3000 });
          this.loadAppointments();
        }
      });
    }
  }

  getStatusColor(status: AppointmentStatus): string {
    switch (status) {
      case AppointmentStatus.SCHEDULED:
        return 'primary';
      case AppointmentStatus.CONFIRMED:
        return 'accent';
      case AppointmentStatus.IN_PROGRESS:
        return 'warn';
      case AppointmentStatus.COMPLETED:
        return 'primary';
      case AppointmentStatus.CANCELLED:
        return '';
      case AppointmentStatus.NO_SHOW:
        return '';
      default:
        return '';
    }
  }

  canConfirm(appointment: Appointment): boolean {
    return appointment.status === AppointmentStatus.SCHEDULED;
  }

  canStart(appointment: Appointment): boolean {
    return appointment.status === AppointmentStatus.CONFIRMED;
  }

  canComplete(appointment: Appointment): boolean {
    return appointment.status === AppointmentStatus.IN_PROGRESS;
  }

  canCancel(appointment: Appointment): boolean {
    return [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED].includes(appointment.status);
  }

  canMarkNoShow(appointment: Appointment): boolean {
    return [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED].includes(appointment.status);
  }

  getStatusLabel(status: AppointmentStatus): string {
    return this.statusLabels[status];
  }
}
