import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, map } from 'rxjs';
import { EventService } from '../../services/event';
import { AuthService } from '../../services/auth';
import { EventList } from '../../models/event.model';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './event-list.html',
  styleUrls: ['./event-list.css']
})
export class EventListComponent implements OnInit {
  events: EventList[] = [];
  filteredEvents: EventList[] = [];
  searchTerm = '';
  isLoading = true;
  errorMessage = '';
  
  //Observable
  private searchSubject = new Subject<string>();

  constructor(
    private eventService: EventService,
    public authService: AuthService,
    private router: Router
  ) {
    //live search
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      map(term => term.toLowerCase().trim())
    ).subscribe(searchTerm => {
      this.filterEvents(searchTerm);
    });
  }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.isLoading = true;
    this.eventService.getEvents().subscribe({
      next: (events) => {
        this.events = events;
        this.filteredEvents = events;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load events';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  //search input change
  onSearchChange(value: string): void {
    this.searchSubject.next(value);
  }

  //RxJS filter
  private filterEvents(term: string): void {
    if (!term) {
      this.filteredEvents = this.events;
    } else {
      this.filteredEvents = this.events.filter(event =>
        event.title.toLowerCase().includes(term) ||
        event.description.toLowerCase().includes(term) ||
        event.organizer.name.toLowerCase().includes(term)
      );
    }
  }

  //evemt details
  viewEventDetails(eventId: number): void {
    this.router.navigate(['/events', eventId]);
  }

  //new event
  createNewEvent(): void {
    this.router.navigate(['/events', 'new']);
  }

  //format date
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
