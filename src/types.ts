export type Category = 
  | 'all'
  | 'music'
  | 'food'
  | 'arts'
  | 'community'
  | 'sports'
  | 'nightlife'
  | 'workshops';

export type SourceType = 'news' | 'community' | 'social' | 'council';

export interface AggregatedSource {
  name: string;
  type: SourceType;
  label: string;
  sourceIcon: string;
  scrapedAt: string;
}

export interface EventItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  date: string; // YYYY-MM-DD
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  time: string;
  venue: string;
  address: string;
  distanceMiles: number;
  price: number; // 0 for Free
  category: Category;
  imageUrl: string;
  source: AggregatedSource;
  attendeeCount: number;
  friendsAttending: string[]; // friend IDs
  ticketAvailable: boolean;
  requiresReservation: boolean;
  ticketTiers: {
    id: string;
    name: string;
    price: number;
    description: string;
    remaining: number;
  }[];
  tags: string[];
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  handle: string;
  mutualCount: number;
  isFriend: boolean;
  notifyOnRsvp: boolean;
  attendingEventIds: string[];
  neighborhood: string;
}

export interface HangoutGroup {
  id: string;
  name: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
  createdByName: string;
  createdAt: string;
  memberFriendIds: string[];
  invitedFriendIds: string[];
  meetingSpot: string;
  customNote: string;
}

export interface TicketReservation {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  address: string;
  quantity: number;
  seatTier: string;
  totalPrice: number;
  bookingCode: string;
  reservedAt: string;
  userName: string;
}

export interface NotificationItem {
  id: string;
  type: 'friend_rsvp' | 'group_invite' | 'ticket_confirmed' | 'event_reminder';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  relatedEventId?: string;
  relatedFriendId?: string;
  relatedGroupId?: string;
}

export interface UserProfile {
  name: string;
  handle: string;
  email: string;
  avatar: string;
  location: string;
  notifyFriendRsvps: boolean;
  notifyNewEvents: boolean;
  notifyGroupInvites: boolean;
  feedSources: {
    newsSites: boolean;
    communityNotes: boolean;
    socialBoards: boolean;
  };
}
