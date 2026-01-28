import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './core/components/navbar/navbar.component';
import { ChatWidgetComponent } from './core/components/chat-widget/chat-widget.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, ChatWidgetComponent],
  template: `
    <app-navbar />
    <main class="page-container animate-fade-in">
      <router-outlet />
    </main>
    <!-- AI Chat Widget - Available on all pages -->
    <app-chat-widget />
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
    
    .page-container {
      padding-top: 2rem;
    }
  `]
})
export class AppComponent {
  title = 'Car Rental System';
}
