import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';
import { AppointmentListComponent } from '../appointment-list/appointment-list.component';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, MaterialModule, AppointmentListComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
