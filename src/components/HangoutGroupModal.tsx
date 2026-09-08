import React, { useState } from 'react';
import { X, Users, MapPin, Calendar, Clock, Plus, Check, Send, AlertCircle } from 'lucide-react';
import { EventItem, Friend, HangoutGroup } from '../types';

interface HangoutGroupModalProps {
  event: EventItem | null;
  existingGroup?: HangoutGroup | null;
  friends: Friend[];
  onClose: () => void;
  onCreateGroup: (newGroup: HangoutGroup) => void;
  userName: string;
}

export const HangoutGroupModal: React.FC<HangoutGroupModalProps> = ({
  event,
  existingGroup,
  friends,
  onClose,
  onCreateGroup,
  userName,
}) => {
  if (!event && !existingGroup) return null;

  const targetEvent = event || {
    id: existingGroup!.eventId,
    title: existingGroup!.eventTitle,
    venue: existingGroup!.eventVenue,
    date: existingGroup!.eventDate,
    time: existingGroup!.eventTime,
  } as Partial<EventItem> as EventItem;

  const [groupName, setGroupName] = useState<string>(
    existingGroup?.name || `${targetEvent.title.split(' ')[0]} Hangout Crew`
  );
  const [meetingSpot, setMeetingSpot] = useState<string>(
    existingGroup?.meetingSpot || 'Meeting near the main entrance 15 minutes before start'
  );
  const [customNote, setCustomNote] = useState<string>(
    existingGroup?.customNote || 'Hey everyone! Let us go together for this event.'
  );
  const [selectedFriendIds, setSelectedFriendIds] = useState<string[]>(
    existingGroup?.invitedFriendIds || []
  );

  const toggleFriend = (id: string) => {
    setSelectedFriendIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCreate = () => {
    if (!groupName.trim()) return;

    const newGroup: HangoutGroup = {
      id: `grp-${Date.now()}`,
      name: groupName.trim(),
      eventId: targetEvent.id,
      eventTitle: targetEvent.title,
      eventDate: targetEvent.date,
      eventTime: targetEvent.time,
      eventVenue: targetEvent.venue,
      createdByName: `${userName} (You)`,
      createdAt: 'Just now',
      memberFriendIds: [],
      invitedFriendIds: selectedFriendIds,
      meetingSpot: meetingSpot.trim(),
      customNote: customNote.trim(),
    };

    onCreateGroup(newGroup);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-zinc-200 animate-in fade-in zoom-in-95 duration-200 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-500" />
            <h2 className="font-bold text-base text-zinc-900">
              {existingGroup ? 'Hangout Details' : 'Plan Event Hangout'}
            </h2>
          </div>
          <button
            id="close-hangout-modal"
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-700 rounded-full hover:bg-zinc-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Target Event Context */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3">
            <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">
              Event Hangout
            </span>
            <h3 className="font-bold text-sm text-zinc-900 mt-0.5">{targetEvent.title}</h3>
            <div className="flex items-center gap-2 text-xs text-zinc-600 mt-1">
              <Calendar className="w-3.5 h-3.5 text-amber-700" />
              <span>{targetEvent.date} • {targetEvent.time}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-600 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-amber-700" />
              <span>{targetEvent.venue}</span>
            </div>
          </div>

          {existingGroup ? (
            /* Existing Group Detail View */
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-zinc-700 uppercase tracking-wider block">
                  Group Name
                </span>
                <p className="font-black text-base text-zinc-900 mt-0.5">{existingGroup.name}</p>
              </div>

              <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200 text-xs">
                <span className="font-bold text-zinc-700 block mb-1">📍 Meeting Spot & Logistics</span>
                <p className="text-zinc-600">{existingGroup.meetingSpot || 'No specific meeting spot set.'}</p>
                {existingGroup.customNote && (
                  <p className="text-zinc-500 mt-1 italic">"{existingGroup.customNote}"</p>
                )}
              </div>

              <div>
                <span className="text-xs font-bold text-zinc-700 uppercase tracking-wider block mb-2">
                  Confirmed Attending ({existingGroup.memberFriendIds.length + 1})
                </span>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-emerald-50 rounded-xl border border-emerald-100 text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-bold text-emerald-900">{existingGroup.createdByName}</span>
                    <span className="text-[10px] bg-emerald-200 text-emerald-800 px-1.5 py-0.2 rounded font-semibold ml-auto">
                      Organizer
                    </span>
                  </div>

                  {existingGroup.memberFriendIds.map((mId) => {
                    const friend = friends.find((f) => f.id === mId);
                    if (!friend) return null;
                    return (
                      <div key={mId} className="flex items-center gap-2.5 p-2 bg-zinc-50 rounded-xl border border-zinc-200 text-xs">
                        <img src={friend.avatar} alt={friend.name} className="w-6 h-6 rounded-full object-cover" />
                        <span className="font-semibold text-zinc-800">{friend.name}</span>
                        <span className="text-[10px] text-zinc-400 font-mono">{friend.handle}</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold ml-auto">
                          Confirmed
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {existingGroup.invitedFriendIds.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-zinc-700 uppercase tracking-wider block mb-2">
                    Invited Friends ({existingGroup.invitedFriendIds.length})
                  </span>
                  <div className="space-y-1.5">
                    {existingGroup.invitedFriendIds.map((invId) => {
                      const friend = friends.find((f) => f.id === invId);
                      if (!friend) return null;
                      return (
                        <div key={invId} className="flex items-center gap-2.5 p-2 bg-white rounded-xl border border-zinc-200 text-xs">
                          <img src={friend.avatar} alt={friend.name} className="w-6 h-6 rounded-full object-cover opacity-80" />
                          <span className="font-medium text-zinc-700">{friend.name}</span>
                          <span className="text-[10px] text-zinc-400 font-mono">{friend.handle}</span>
                          <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-semibold ml-auto">
                            Invite Sent
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Creation Form */
            <div className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider block mb-1">
                  Hangout Group Name
                </label>
                <input
                  id="hangout-name-input"
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g., Skyline Jazz Crew, Friday Market Walkers"
                  className="w-full px-3 py-2 text-sm bg-zinc-50 border border-zinc-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider block mb-1">
                  Meeting Spot / Logistics
                </label>
                <input
                  id="meeting-spot-input"
                  type="text"
                  value={meetingSpot}
                  onChange={(e) => setMeetingSpot(e.target.value)}
                  placeholder="e.g. By the south wine tent at 6:15 PM"
                  className="w-full px-3 py-2 text-sm bg-zinc-50 border border-zinc-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider block mb-1">
                  Note to Friends
                </label>
                <textarea
                  id="hangout-note-input"
                  rows={2}
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="Add a quick note about who's driving or tickets..."
                  className="w-full px-3 py-2 text-sm bg-zinc-50 border border-zinc-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10 resize-none"
                />
              </div>

              {/* Invite Friends Checklist */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
                    Invite Friends ({selectedFriendIds.length} selected)
                  </label>
                  <span className="text-[10px] text-zinc-400">
                    No DMs • Group invite notification sent
                  </span>
                </div>

                <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                  {friends
                    .filter((f) => f.isFriend)
                    .map((friend) => {
                      const isSelected = selectedFriendIds.includes(friend.id);
                      return (
                        <button
                          key={friend.id}
                          id={`invite-friend-${friend.id}`}
                          type="button"
                          onClick={() => toggleFriend(friend.id)}
                          className={`w-full flex items-center justify-between p-2 rounded-xl border transition-all text-xs ${
                            isSelected
                              ? 'bg-amber-50/80 border-amber-300 text-zinc-900 ring-1 ring-amber-300'
                              : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100 text-zinc-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <img
                              src={friend.avatar}
                              alt={friend.name}
                              className="w-7 h-7 rounded-full object-cover"
                            />
                            <div className="text-left">
                              <span className="font-bold text-zinc-900 block">{friend.name}</span>
                              <span className="text-[10px] text-zinc-400">{friend.neighborhood}</span>
                            </div>
                          </div>
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                              isSelected
                                ? 'bg-amber-500 border-amber-600 text-white'
                                : 'border-zinc-300 bg-white text-transparent'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        </button>
                      );
                    })}
                </div>
              </div>

              <button
                id="submit-hangout-btn"
                onClick={handleCreate}
                disabled={!groupName.trim()}
                className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mt-3"
              >
                <Send className="w-4 h-4" />
                <span>Create Hangout & Send {selectedFriendIds.length} Invites</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
