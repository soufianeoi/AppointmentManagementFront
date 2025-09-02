import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MaterialModule } from '../../shared/material.module';
import { AppointmentService } from '../../services/appointment.service';
import { CreateAppointmentRequest, UpdateAppointmentRequest, Appointment } from '../../models/appointment.model';

@Component({
  selector: 'app-appointment-form',
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './appointment-form.component.html',
  styleUrl: './appointment-form.component.scss'
})
export class AppointmentFormComponent implements OnInit {
  appointmentForm: FormGroup;
  isEditMode = false;
  appointmentId?: number;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.appointmentForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.maxLength(1000)]],
      appointmentDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      patientName: ['', [Validators.required, Validators.maxLength(100)]],
      patientEmail: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      patientPhone: ['', [Validators.required, Validators.maxLength(20)]],
      doctorName: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.appointmentId = +id;
      this.loadAppointment();
    }
  }

  loadAppointment(): void {
    if (!this.appointmentId) return;
    
    this.loading = true;
    this.appointmentService.getAppointmentById(this.appointmentId).subscribe({
      next: (appointment) => {
        this.populateForm(appointment);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading appointment:', error);
        this.snackBar.open('Erreur lors du chargement du rendez-vous', 'Fermer', { duration: 5000 });
        this.loading = false;
      }
    });
  }

  populateForm(appointment: Appointment): void {
    const startDate = new Date(appointment.startDate);
    const endDate = new Date(appointment.endDate);
    
    this.appointmentForm.patchValue({
      title: appointment.title,
      description: appointment.description,
      appointmentDate: startDate,
      startTime: this.formatTimeForInput(startDate),
      endTime: this.formatTimeForInput(endDate),
      patientName: appointment.patientName,
      patientEmail: appointment.patientEmail,
      patientPhone: appointment.patientPhone,
      doctorName: appointment.doctorName
    });

    // In edit mode, disable patient and doctor fields
    if (this.isEditMode) {
      this.appointmentForm.get('patientName')?.disable();
      this.appointmentForm.get('patientEmail')?.disable();
      this.appointmentForm.get('patientPhone')?.disable();
      this.appointmentForm.get('doctorName')?.disable();
    }
  }

  onSubmit(): void {
    if (this.appointmentForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    const formValue = this.appointmentForm.value;

    if (this.isEditMode && this.appointmentId) {
      const updateRequest: UpdateAppointmentRequest = {
        title: formValue.title,
        description: formValue.description,
        startDate: this.formatDateTime(formValue.appointmentDate, formValue.startTime),
        endDate: this.formatDateTime(formValue.appointmentDate, formValue.endTime)
      };

      this.appointmentService.updateAppointment(this.appointmentId, updateRequest).subscribe({
        next: () => {
          this.snackBar.open('Rendez-vous modifié avec succès', 'Fermer', { duration: 3000 });
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Error updating appointment:', error);
          this.loading = false;
        }
      });
    } else {
      const createRequest: CreateAppointmentRequest = {
        title: formValue.title,
        description: formValue.description,
        startDate: this.formatDateTime(formValue.appointmentDate, formValue.startTime),
        endDate: this.formatDateTime(formValue.appointmentDate, formValue.endTime),
        patientName: formValue.patientName,
        patientEmail: formValue.patientEmail,
        patientPhone: formValue.patientPhone,
        doctorName: formValue.doctorName
      };

      this.appointmentService.createAppointment(createRequest).subscribe({
        next: () => {
          this.snackBar.open('Rendez-vous créé avec succès', 'Fermer', { duration: 3000 });
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Error creating appointment:', error);
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/dashboard']);
  }

  private formatDateTime(date: Date, time: string): string {
    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
    return `${dateStr}T${time}:00`; // YYYY-MM-DDTHH:mm:ss
  }

  private formatTimeForInput(date: Date): string {
    return date.toTimeString().slice(0, 5); // HH:mm
  }

  private markFormGroupTouched(): void {
    Object.keys(this.appointmentForm.controls).forEach(key => {
      const control = this.appointmentForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const control = this.appointmentForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) return `${fieldName} est requis`;
      if (control.errors['email']) return 'Email invalide';
      if (control.errors['maxlength']) return `${fieldName} trop long`;
    }
    return '';
  }
}
