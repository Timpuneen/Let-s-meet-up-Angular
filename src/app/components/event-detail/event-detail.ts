import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../services/event';
import { AuthService } from '../../services/auth';
import { Event, EventCreate } from '../../models/event.model';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './event-detail.html',
  styleUrls: ['./event-detail.css']
})
export class EventDetailComponent implements OnInit {
  event: Event | null = null;
  isLoading = true;
  errorMessage = '';
  successMessage = '';
  isCreateMode = false;

  newEvent: EventCreate = {
    title: '',
    description: '',
    date: '',
    location: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id === 'new') {
      this.isCreateMode = true;
      this.isLoading = false;
      
      if (!this.authService.isAuthenticated()) {
        this.router.navigate(['/login']);
      }
    } else if (id) {
      this.loadEvent(+id);
    }
  }

  loadEvent(id: number): void {
    this.isLoading = true;
    this.eventService.getEvent(id).subscribe({
      next: (event) => {
        this.event = event;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load event';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  //reg for event
  registerForEvent(): void {
    if (!this.event) return;
    
    this.eventService.registerForEvent(this.event.id).subscribe({
      next: (updatedEvent) => {
        this.event = updatedEvent;
        this.successMessage = 'Successfully registered!';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Failed to register';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  //cancel reg
  cancelRegistration(): void {
    if (!this.event) return;
    
    this.eventService.cancelRegistration(this.event.id).subscribe({
      next: (updatedEvent) => {
        this.event = updatedEvent;
        this.successMessage = 'Registration cancelled';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Failed to cancel';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  //create event
  createEvent(): void {
    if (!this.newEvent.title || !this.newEvent.description || !this.newEvent.date) {
      this.errorMessage = 'Please fill all required fields';
      return;
    }

    console.log('Creating event:', this.newEvent);
    
    this.eventService.createEvent(this.newEvent).subscribe({
      next: (event) => {
        console.log('Event created:', event);
        this.successMessage = 'Event created successfully!';
        
        if (event && event.id) {
          setTimeout(() => this.router.navigate(['/events', event.id]), 1500);
        } else {
          setTimeout(() => this.router.navigate(['/events']), 1500);
        }
      },
      error: (err) => {
        console.error('Create event error:', err);
        this.errorMessage = err.error?.date?.[0] || err.error?.error || 'Failed to create event';
      }
    });
  }

  //back to list
  goBack(): void {
    this.router.navigate(['/events']);
  }

  //date format
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  isOrganizer(): boolean {
    const currentUser = this.authService.getCurrentUser();
    return !!this.event && !!currentUser && this.event.organizer.id === currentUser.id;
  }
}
