import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MaterialModule } from './shared/material.module';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, MaterialModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Gestion des Rendez-vous';
}
