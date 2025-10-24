import { User } from "./user.model";

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location?: string;
  organizer: User;
  participants?: User[];
  participants_count: number;
  is_registered: boolean;
  created_at: string;
  updated_at: string;
}

export interface EventCreate {
  title: string;
  description: string;
  date: string;
  location?: string;
}

export interface EventList {
  id: number;
  title: string;
  description: string;
  date: string;
  organizer: User;
  participants_count: number;
  is_registered: boolean;
}