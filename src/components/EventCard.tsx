import React from 'react';
import { 
  MapPin, 
  Clock, 
  Ticket, 
  Users, 
  Bookmark, 
  BookmarkCheck,
  Newspaper, 
  Pin, 
  Share2, 
  Landmark,
  Sparkles,
  Calendar
} from 'lucide-react';
import { EventItem, Friend } from '../types';

interface EventCardProps {
  event: EventItem;
  friends: Friend[];
  isBookmarked: boolean;
  onToggleBookmark: (eventId: string) => void;
  onReserveTickets: (event: EventItem) => void;
  onCreateHangout: (event: EventItem) => void;
  onFriendClick: (friendId: string) => void;
  isReserved: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  friends,
  isBookmarked,
  onToggleBookmark,
  onReserveTickets,
  onCreateHangout,
  onFriendClick,
  isReserved,
}) => {
  // Find friends attending this event
  const attendingFriends = friends.filter((f) => event.friendsAttending.includes(f.id));

  // Render correct icon for scraped source
  const renderSourceIcon = (type: string) => {
    switch (type) {
      case 'news':
        return <Newspaper className="w-3 h-3 text-blue-600" />;
      case 'community':
        return <Pin className="w-3 h-3 text-emerald-600" />;
      case 'social':
        return <Share2 className="w-3 h-3 text-purple-600" />;
      case 'council':
        return <Landmark className="w-3 h-3 text-amber-600" />;
      default:
        return <Sparkles className="w-3 h-3 text-zinc-600" />;
    }
  };

  return (
    <article
      id={`event-card-${event.id}`}
      className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col"
    >
      {/* Scraped Source Badge Bar */}
      <div className="px-3.5 py-2 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-medium text-zinc-700">
          {renderSourceIcon(event.source.type)}
          <span className="font-semibold text-zinc-900">{event.source.name}</span>
          <span className="text-zinc-300">•</span>
          <span className="text-zinc-500 text-[11px]">{event.source.label}</span>
        </div>
        <span className="text-[11px] text-zinc-400 font-mono">
          Scraped {event.source.scrapedAt}
        </span>
      </div>

      {/* Image & Overlay Chips */}
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-100">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
          <span className="bg-zinc-900/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            {event.dayOfWeek.slice(0, 3)} • {event.date.slice(5)}
          </span>

          <button
            id={`bookmark-btn-${event.id}`}
            onClick={() => onToggleBookmark(event.id)}
            className={`p-1.5 rounded-full backdrop-blur-md transition-colors ${
              isBookmarked
                ? 'bg-amber-400 text-zinc-950'
                : 'bg-black/40 text-white hover:bg-black/60'
            }`}
            title={isBookmarked ? 'Saved to bookmarks' : 'Save event'}
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-4 h-4 fill-current" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Bottom Overlay Info (Price & Distance) */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white">
          <div className="flex items-center gap-1.5">
            <span
              className={`text-xs font-black px-2.5 py-1 rounded-lg ${
                event.price === 0
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white text-zinc-900 shadow-sm'
              }`}
            >
              {event.price === 0 ? 'FREE RSVP' : `$${event.price}`}
            </span>
            <span className="text-[11px] bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-md text-zinc-200">
              {event.category.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-md text-zinc-200">
            <MapPin className="w-3 h-3 text-amber-400" />
            <span>{event.distanceMiles} mi away</span>
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Timing & Venue */}
          <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium mb-1.5">
            <div className="flex items-center gap-1 text-zinc-700">
              <Calendar className="w-3.5 h-3.5 text-zinc-500" />
              <span>{event.dayOfWeek}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1 text-zinc-700">
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
              <span>{event.time}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-zinc-900 leading-snug">
            {event.title}
          </h3>

          <p className="text-xs text-zinc-600 mt-1 line-clamp-2">
            {event.tagline}
          </p>

          <p className="text-xs text-zinc-500 flex items-center gap-1 mt-2">
            <MapPin className="w-3 h-3 text-zinc-400 flex-shrink-0" />
            <span className="truncate">{event.venue} — {event.address}</span>
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mt-2.5">
            {event.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] bg-zinc-100 text-zinc-600 font-medium px-2 py-0.5 rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Social / Friends Going Indicator */}
        <div className="mt-3.5 pt-3 border-t border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {attendingFriends.length > 0 ? (
              <div className="flex items-center gap-1.5">
                <div className="flex -space-x-2 overflow-hidden">
                  {attendingFriends.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => onFriendClick(f.id)}
                      title={`${f.name} is attending`}
                      className="inline-block ring-2 ring-white rounded-full hover:scale-110 transition-transform"
                    >
                      <img
                        src={f.avatar}
                        alt={f.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    </button>
                  ))}
                </div>
                <span className="text-[11px] font-semibold text-emerald-700">
                  {attendingFriends.length === 1
                    ? `${attendingFriends[0].name} is going`
                    : `${attendingFriends[0].name} & ${attendingFriends.length - 1} friend going`}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                <Users className="w-3.5 h-3.5" />
                <span>{event.attendeeCount} people interested</span>
              </div>
            )}
          </div>

          <span className="text-[11px] text-zinc-400 font-mono">
            {event.attendeeCount} going
          </span>
        </div>

        {/* Action Buttons Row */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          {/* Reserve / Get Tickets */}
          <button
            id={`reserve-btn-${event.id}`}
            onClick={() => onReserveTickets(event)}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-bold text-xs transition-all shadow-sm ${
              isReserved
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-zinc-900 text-white hover:bg-zinc-800'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>{isReserved ? 'Reserved (Passes Ready)' : event.price === 0 ? 'Free RSVP' : 'Get Tickets'}</span>
          </button>

          {/* Plan Hangout Group */}
          <button
            id={`hangout-btn-${event.id}`}
            onClick={() => onCreateHangout(event)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-zinc-100 hover:bg-amber-100 text-zinc-800 hover:text-amber-950 font-semibold text-xs rounded-xl border border-zinc-200 transition-colors"
          >
            <Users className="w-3.5 h-3.5 text-zinc-600" />
            <span>Plan Hangout</span>
          </button>
        </div>
      </div>
    </article>
  );
};
