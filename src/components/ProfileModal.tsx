import React from 'react';
import { 
  X, 
  User, 
  Bell, 
  MapPin, 
  Ticket, 
  Users, 
  Sliders, 
  Check, 
  Radio, 
  Newspaper, 
  Pin, 
  Share2,
  Calendar
} from 'lucide-react';
import { UserProfile, TicketReservation } from '../types';

interface ProfileModalProps {
  user: UserProfile;
  reservations: TicketReservation[];
  friendCount: number;
  onClose: () => void;
  onUpdateUser: (updated: UserProfile) => void;
  onOpenTicketPass: (reservation: TicketReservation) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  user,
  reservations,
  friendCount,
  onClose,
  onUpdateUser,
  onOpenTicketPass,
}) => {
  const toggleSetting = (key: keyof UserProfile) => {
    onUpdateUser({
      ...user,
      [key]: !user[key],
    });
  };

  const toggleFeedSource = (sourceKey: keyof UserProfile['feedSources']) => {
    onUpdateUser({
      ...user,
      feedSources: {
        ...user.feedSources,
        [sourceKey]: !user.feedSources[sourceKey],
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-zinc-200 animate-in fade-in zoom-in-95 duration-200 my-auto flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-amber-500" />
            <h2 className="font-bold text-base text-zinc-900">Your Profile & Settings</h2>
          </div>
          <button
            id="close-profile-modal"
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-700 rounded-full hover:bg-zinc-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 overflow-y-auto">
          {/* Identity Header */}
          <div className="flex items-center gap-3.5 p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-zinc-300"
            />
            <div>
              <h3 className="font-bold text-base text-zinc-900">{user.name}</h3>
              <p className="text-xs text-zinc-500 font-mono">{user.handle}</p>
              <p className="text-xs text-zinc-600 flex items-center gap-1 mt-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                <span>{user.location}</span>
              </p>
            </div>
          </div>

          {/* Activity Statistics */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-zinc-50 p-2.5 rounded-xl border border-zinc-200">
              <span className="text-lg font-black text-zinc-900 block">{reservations.length}</span>
              <span className="text-[10px] uppercase font-bold text-zinc-500">Passes Booked</span>
            </div>
            <div className="bg-zinc-50 p-2.5 rounded-xl border border-zinc-200">
              <span className="text-lg font-black text-zinc-900 block">{friendCount}</span>
              <span className="text-[10px] uppercase font-bold text-zinc-500">Friends</span>
            </div>
            <div className="bg-zinc-50 p-2.5 rounded-xl border border-zinc-200">
              <span className="text-lg font-black text-emerald-600 block">Active</span>
              <span className="text-[10px] uppercase font-bold text-zinc-500">Live Pulse</span>
            </div>
          </div>

          {/* Push Notification Preferences */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Bell className="w-4 h-4 text-zinc-700" />
              <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-wider">
                Mobile Push Preferences
              </h4>
            </div>

            <div className="space-y-2 bg-zinc-50 p-3 rounded-2xl border border-zinc-200">
              {/* Toggle 1: Friend RSVPs */}
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-zinc-900 block">Friend Event RSVPs</span>
                  <span className="text-[11px] text-zinc-500">
                    Get alerted whenever connected friends confirm attendance
                  </span>
                </div>
                <button
                  id="toggle-notify-friends"
                  onClick={() => toggleSetting('notifyFriendRsvps')}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                    user.notifyFriendRsvps ? 'bg-emerald-600' : 'bg-zinc-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                      user.notifyFriendRsvps ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 2: Group Hangout Invites */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-200/60">
                <div>
                  <span className="text-xs font-bold text-zinc-900 block">Group Hangout Invites</span>
                  <span className="text-[11px] text-zinc-500">
                    Alerts when friends invite you to coordinate event crews
                  </span>
                </div>
                <button
                  id="toggle-notify-groups"
                  onClick={() => toggleSetting('notifyGroupInvites')}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                    user.notifyGroupInvites ? 'bg-emerald-600' : 'bg-zinc-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                      user.notifyGroupInvites ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 3: New Local Events */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-200/60">
                <div>
                  <span className="text-xs font-bold text-zinc-900 block">Trending Event Drops</span>
                  <span className="text-[11px] text-zinc-500">
                    Highlights when high-demand local events are scraped
                  </span>
                </div>
                <button
                  id="toggle-notify-events"
                  onClick={() => toggleSetting('notifyNewEvents')}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                    user.notifyNewEvents ? 'bg-emerald-600' : 'bg-zinc-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                      user.notifyNewEvents ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Aggregation Feed Source Preferences */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Sliders className="w-4 h-4 text-zinc-700" />
              <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-wider">
                Scraped Feed Sources
              </h4>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => toggleFeedSource('newsSites')}
                className={`p-2.5 rounded-xl border text-center transition-all text-xs flex flex-col items-center justify-center gap-1 ${
                  user.feedSources.newsSites
                    ? 'bg-blue-50 border-blue-200 text-blue-900 font-bold'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-400'
                }`}
              >
                <Newspaper className="w-4 h-4 text-blue-600" />
                <span className="text-[11px]">News Sites</span>
              </button>

              <button
                onClick={() => toggleFeedSource('communityNotes')}
                className={`p-2.5 rounded-xl border text-center transition-all text-xs flex flex-col items-center justify-center gap-1 ${
                  user.feedSources.communityNotes
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-bold'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-400'
                }`}
              >
                <Pin className="w-4 h-4 text-emerald-600" />
                <span className="text-[11px]">Community Notes</span>
              </button>

              <button
                onClick={() => toggleFeedSource('socialBoards')}
                className={`p-2.5 rounded-xl border text-center transition-all text-xs flex flex-col items-center justify-center gap-1 ${
                  user.feedSources.socialBoards
                    ? 'bg-purple-50 border-purple-200 text-purple-900 font-bold'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-400'
                }`}
              >
                <Share2 className="w-4 h-4 text-purple-600" />
                <span className="text-[11px]">Social Media</span>
              </button>
            </div>
          </div>

          {/* My Passes Shortcut */}
          {reservations.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-wider mb-2">
                Stored Passes ({reservations.length})
              </h4>
              <div className="space-y-2">
                {reservations.map((res) => (
                  <div
                    key={res.id}
                    className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 flex items-center justify-between gap-2"
                  >
                    <div>
                      <h5 className="font-bold text-xs text-zinc-900 truncate max-w-[200px]">
                        {res.eventTitle}
                      </h5>
                      <span className="text-[11px] text-zinc-500 font-mono">
                        {res.bookingCode} • {res.quantity} ticket(s)
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        onOpenTicketPass(res);
                        onClose();
                      }}
                      className="px-2.5 py-1 bg-zinc-900 text-white font-bold text-xs rounded-lg hover:bg-zinc-800"
                    >
                      QR Pass
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
