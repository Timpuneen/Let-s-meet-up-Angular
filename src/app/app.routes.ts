import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { EventListComponent } from './components/event-list/event-list';
import { EventDetailComponent } from './components/event-detail/event-detail';

export const routes: Routes = [
  { path: '', redirectTo: '/events', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'events', component: EventListComponent },
  { path: 'events/:id', component: EventDetailComponent },
  { path: '**', redirectTo: '/events' }
];