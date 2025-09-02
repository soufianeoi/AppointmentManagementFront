import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MaterialModule } from '../../shared/material.module';
import { AppointmentService } from '../../services/appointment.service';
import { Appointment, AppointmentStatus, AppointmentStatusLabels } from '../../models/appointment.model';

@Component({
  selector: 'app-appointment-detail',
  imports: [CommonModule, MaterialModule],
  templateUrl: './appointment-detail.component.html',
  styleUrl: './appointment-detail.component.scss'
})
export class AppointmentDetailComponent implements OnInit {
  appointment?: Appointment;
  loading = true;
  statusLabels = AppointmentStatusLabels;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appointmentService: AppointmentService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadAppointment(+id);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  loadAppointment(id: number): void {
    this.loading = true;
    this.appointmentService.getAppointmentById(id).subscribe({
      next: (appointment) => {
        this.appointment = appointment;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading appointment:', error);
        this.snackBar.open('Erreur lors du chargement du rendez-vous', 'Fermer', { duration: 5000 });
        this.router.navigate(['/dashboard']);
      }
    });
  }

  editAppointment(): void {
    if (this.appointment) {
      this.router.navigate(['/appointments', this.appointment.id, 'edit']);
    }
  }

  confirmAppointment(): void {
    if (!this.appointment) return;
    
    this.appointmentService.confirmAppointment(this.appointment.id).subscribe({
      next: (updatedAppointment) => {
        this.appointment = updatedAppointment;
        this.snackBar.open('Rendez-vous confirmé', 'Fermer', { duration: 3000 });
      }
    });
  }

  startAppointment(): void {
    if (!this.appointment) return;
    
    this.appointmentService.startAppointment(this.appointment.id).subscribe({
      next: (updatedAppointment) => {
        this.appointment = updatedAppointment;
        this.snackBar.open('Rendez-vous démarré', 'Fermer', { duration: 3000 });
      }
    });
  }

  completeAppointment(): void {
    if (!this.appointment) return;
    
    this.appointmentService.completeAppointment(this.appointment.id).subscribe({
      next: (updatedAppointment) => {
        this.appointment = updatedAppointment;
        this.snackBar.open('Rendez-vous terminé', 'Fermer', { duration: 3000 });
      }
    });
  }

  cancelAppointment(): void {
    if (!this.appointment) return;
    
    if (confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) {
      this.appointmentService.cancelAppointment(this.appointment.id).subscribe({
        next: (updatedAppointment) => {
          this.appointment = updatedAppointment;
          this.snackBar.open('Rendez-vous annulé', 'Fermer', { duration: 3000 });
        }
      });
    }
  }

  markAsNoShow(): void {
    if (!this.appointment) return;
    
    if (confirm('Marquer ce rendez-vous comme absent ?')) {
      this.appointmentService.markAsNoShow(this.appointment.id).subscribe({
        next: (updatedAppointment) => {
          this.appointment = updatedAppointment;
          this.snackBar.open('Rendez-vous marqué comme absent', 'Fermer', { duration: 3000 });
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
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

  canConfirm(): boolean {
    return this.appointment?.status === AppointmentStatus.SCHEDULED;
  }

  canStart(): boolean {
    return this.appointment?.status === AppointmentStatus.CONFIRMED;
  }

  canComplete(): boolean {
    return this.appointment?.status === AppointmentStatus.IN_PROGRESS;
  }

  canCancel(): boolean {
    return this.appointment ? 
      [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED].includes(this.appointment.status) : 
      false;
  }

  canMarkNoShow(): boolean {
    return this.appointment ? 
      [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED].includes(this.appointment.status) : 
      false;
  }
}
