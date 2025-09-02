import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AppointmentFormComponent } from './components/appointment-form/appointment-form.component';
import { AppointmentDetailComponent } from './components/appointment-detail/appointment-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'appointments/new', component: AppointmentFormComponent },
  { path: 'appointments/:id/edit', component: AppointmentFormComponent },
  { path: 'appointments/:id', component: AppointmentDetailComponent },
  { path: '**', redirectTo: '/dashboard' }
];
