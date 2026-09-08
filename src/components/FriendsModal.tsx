import React, { useState } from 'react';
import { 
  X, 
  Users, 
  UserPlus, 
  Bell, 
  BellOff, 
  Check, 
  Calendar, 
  MapPin, 
  Sparkles, 
  ShieldCheck,
  Search
} from 'lucide-react';
import { Friend, EventItem } from '../types';

interface FriendsModalProps {
  friends: Friend[];
  events: EventItem[];
  onToggleFriend: (friendId: string) => void;
  onToggleFriendNotification: (friendId: string) => void;
  onClose: () => void;
  onSelectEvent: (eventId: string) => void;
}

export const FriendsModal: React.FC<FriendsModalProps> = ({
  friends,
  events,
  onToggleFriend,
  onToggleFriendNotification,
  onClose,
  onSelectEvent,
}) => {
  const [activeTab, setActiveTab] = useState<'my-friends' | 'discover'>('my-friends');
  const [searchQuery, setSearchQuery] = useState('');

  const myFriends = friends.filter((f) => f.isFriend);
  const discoverPeople = friends.filter((f) => !f.isFriend);

  const displayedList = (activeTab === 'my-friends' ? myFriends : discoverPeople).filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.neighborhood.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-zinc-200 animate-in fade-in zoom-in-95 duration-200 my-auto flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-500" />
            <h2 className="font-bold text-base text-zinc-900">Friends & Community</h2>
          </div>
          <button
            id="close-friends-modal"
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-700 rounded-full hover:bg-zinc-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informational Privacy Badge */}
        <div className="px-5 py-2.5 bg-emerald-50/70 border-b border-emerald-100 flex items-center gap-2 text-xs text-emerald-900">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>
            No direct messages or spam posts. Connect with friends to get notified when they RSVP to events.
          </span>
        </div>

        {/* Tab Controls */}
        <div className="p-3 border-b border-zinc-100 grid grid-cols-2 gap-1.5 bg-white">
          <button
            id="tab-my-friends"
            onClick={() => setActiveTab('my-friends')}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'my-friends'
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            My Friends ({myFriends.length})
          </button>
          <button
            id="tab-discover"
            onClick={() => setActiveTab('discover')}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'discover'
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            Discover Nearby ({discoverPeople.length})
          </button>
        </div>

        {/* Search input within modal */}
        <div className="px-4 py-2 bg-zinc-50 border-b border-zinc-100">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, handle, or area..."
              className="w-full pl-8 pr-3 py-1.5 bg-white text-xs text-zinc-800 placeholder-zinc-400 rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
            />
          </div>
        </div>

        {/* Friend List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {displayedList.length === 0 ? (
            <div className="py-8 text-center text-zinc-400 text-xs">
              No matching people found.
            </div>
          ) : (
            displayedList.map((person) => {
              const attendedEvents = events.filter((e) =>
                person.attendingEventIds.includes(e.id)
              );

              return (
                <div
                  key={person.id}
                  id={`friend-card-${person.id}`}
                  className="bg-white p-3 rounded-2xl border border-zinc-200 shadow-sm hover:border-zinc-300 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={person.avatar}
                        alt={person.name}
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-zinc-200"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-zinc-900">{person.name}</h4>
                        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                          <span>{person.handle}</span>
                          <span>•</span>
                          <span className="text-[11px] text-zinc-400">{person.neighborhood}</span>
                        </div>
                      </div>
                    </div>

                    {/* Friend Toggle / Add Button */}
                    <div>
                      {person.isFriend ? (
                        <div className="flex items-center gap-1.5">
                          {/* RSVP Alert Notification Toggle */}
                          <button
                            id={`notify-toggle-${person.id}`}
                            onClick={() => onToggleFriendNotification(person.id)}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              person.notifyOnRsvp
                                ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
                                : 'bg-zinc-100 border-zinc-200 text-zinc-400 hover:bg-zinc-200'
                            }`}
                            title={
                              person.notifyOnRsvp
                                ? 'RSVP Alerts Enabled (click to mute)'
                                : 'RSVP Alerts Muted (click to enable)'
                            }
                          >
                            {person.notifyOnRsvp ? (
                              <Bell className="w-4 h-4 text-amber-600" />
                            ) : (
                              <BellOff className="w-4 h-4" />
                            )}
                          </button>

                          <button
                            onClick={() => onToggleFriend(person.id)}
                            className="px-2.5 py-1 text-xs font-semibold text-zinc-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            Friends
                          </button>
                        </div>
                      ) : (
                        <button
                          id={`add-friend-btn-${person.id}`}
                          onClick={() => onToggleFriend(person.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Friend's Attending Events List */}
                  {attendedEvents.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-zinc-100">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                        Upcoming RSVPs ({attendedEvents.length})
                      </span>
                      <div className="space-y-1">
                        {attendedEvents.map((ev) => (
                          <button
                            key={ev.id}
                            onClick={() => {
                              onSelectEvent(ev.id);
                              onClose();
                            }}
                            className="w-full text-left p-1.5 rounded-lg hover:bg-zinc-50 flex items-center justify-between text-xs text-zinc-700 transition-colors group"
                          >
                            <span className="truncate font-medium group-hover:text-zinc-900">
                              {ev.title}
                            </span>
                            <span className="text-[10px] text-zinc-400 font-mono ml-2 flex-shrink-0">
                              {ev.dayOfWeek.slice(0, 3)}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
