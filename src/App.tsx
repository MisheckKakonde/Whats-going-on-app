import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, 
  MapPin, 
  Ticket, 
  Users, 
  Sparkles, 
  Compass, 
  Check, 
  Flame, 
  PlusCircle, 
  Radio, 
  Filter,
  Layers
} from 'lucide-react';
import { 
  Category, 
  EventItem, 
  Friend, 
  HangoutGroup, 
  NotificationItem, 
  TicketReservation, 
  UserProfile 
} from './types';
import { 
  INITIAL_USER, 
  INITIAL_FRIENDS, 
  INITIAL_EVENTS, 
  INITIAL_RESERVATIONS, 
  INITIAL_GROUPS, 
  INITIAL_NOTIFICATIONS 
} from './data/mockData';
import { Header } from './components/Header';
import { DateFilterBar } from './components/DateFilterBar';
import { CategoryFilterBar } from './components/CategoryFilterBar';
import { MyEventsSection } from './components/MyEventsSection';
import { EventCard } from './components/EventCard';
import { TicketModal } from './components/TicketModal';
import { HangoutGroupModal } from './components/HangoutGroupModal';
import { FriendsModal } from './components/FriendsModal';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { ProfileModal } from './components/ProfileModal';

export default function App() {
  // Local storage assisted state
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('lp_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [events, setEvents] = useState<EventItem[]>(() => {
    const saved = localStorage.getItem('lp_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [friends, setFriends] = useState<Friend[]>(() => {
    const saved = localStorage.getItem('lp_friends');
    return saved ? JSON.parse(saved) : INITIAL_FRIENDS;
  });

  const [reservations, setReservations] = useState<TicketReservation[]>(() => {
    const saved = localStorage.getItem('lp_reservations');
    return saved ? JSON.parse(saved) : INITIAL_RESERVATIONS;
  });

  const [groups, setGroups] = useState<HangoutGroup[]>(() => {
    const saved = localStorage.getItem('lp_groups');
    return saved ? JSON.parse(saved) : INITIAL_GROUPS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('lp_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['ev-1', 'ev-5']);
  
  // Navigation & Filtering
  const [selectedDate, setSelectedDate] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeBottomTab, setActiveBottomTab] = useState<'discover' | 'my-tickets' | 'hangouts' | 'friends'>('discover');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(true);

  // Modals
  const [activeTicketEvent, setActiveTicketEvent] = useState<EventItem | null>(null);
  const [activeTicketPass, setActiveTicketPass] = useState<TicketReservation | null>(null);
  const [activeHangoutEvent, setActiveHangoutEvent] = useState<EventItem | null>(null);
  const [activeHangoutGroup, setActiveHangoutGroup] = useState<HangoutGroup | null>(null);
  const [isFriendsModalOpen, setIsFriendsModalOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('lp_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('lp_reservations', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem('lp_groups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('lp_friends', JSON.stringify(friends));
  }, [friends]);

  useEffect(() => {
    localStorage.setItem('lp_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Derived unread notification count
  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      // 1. Date filter
      if (selectedDate !== 'all' && ev.date !== selectedDate) {
        return false;
      }

      // 2. Category filter
      if (selectedCategory !== 'all' && ev.category !== selectedCategory) {
        return false;
      }

      // 3. Feed source preference filter
      if (ev.source.type === 'news' && !user.feedSources.newsSites) return false;
      if (ev.source.type === 'community' && !user.feedSources.communityNotes) return false;
      if (ev.source.type === 'social' && !user.feedSources.socialBoards) return false;

      // 4. Global search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = ev.title.toLowerCase().includes(q);
        const matchesVenue = ev.venue.toLowerCase().includes(q);
        const matchesTagline = ev.tagline.toLowerCase().includes(q);
        const matchesTags = ev.tags.some((t) => t.toLowerCase().includes(q));
        const matchesCategory = ev.category.toLowerCase().includes(q);

        // Check if query matches any friend attending this event
        const matchingFriend = friends.find(
          (f) => ev.friendsAttending.includes(f.id) && f.name.toLowerCase().includes(q)
        );

        if (!matchesTitle && !matchesVenue && !matchesTagline && !matchesTags && !matchesCategory && !matchingFriend) {
          return false;
        }
      }

      return true;
    });
  }, [events, selectedDate, selectedCategory, user.feedSources, searchQuery, friends]);

  // Actions
  const handleToggleBookmark = (eventId: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    );
  };

  const handleConfirmBooking = (newReservation: TicketReservation) => {
    setReservations((prev) => [newReservation, ...prev]);

    // Increase attendee count
    setEvents((prev) =>
      prev.map((e) =>
        e.id === newReservation.eventId
          ? { ...e, attendeeCount: e.attendeeCount + newReservation.quantity }
          : e
      )
    );

    // Create confirmation notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: 'ticket_confirmed',
      title: `Confirmed: ${newReservation.eventTitle}`,
      message: `${newReservation.quantity} ticket(s) issued. Pass code #${newReservation.bookingCode} is saved to your wallet.`,
      timestamp: 'Just now',
      read: false,
      relatedEventId: newReservation.eventId,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleCreateGroup = (newGroup: HangoutGroup) => {
    setGroups((prev) => [newGroup, ...prev]);

    // Notify user
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: 'group_invite',
      title: `Created Hangout: ${newGroup.name}`,
      message: `Sent hangout invites to ${newGroup.invitedFriendIds.length} friend(s) for ${newGroup.eventTitle}.`,
      timestamp: 'Just now',
      read: false,
      relatedGroupId: newGroup.id,
      relatedEventId: newGroup.eventId,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleToggleFriend = (friendId: string) => {
    setFriends((prev) =>
      prev.map((f) => {
        if (f.id === friendId) {
          const updated = !f.isFriend;
          return {
            ...f,
            isFriend: updated,
            notifyOnRsvp: updated ? true : false,
          };
        }
        return f;
      })
    );
  };

  const handleToggleFriendNotification = (friendId: string) => {
    setFriends((prev) =>
      prev.map((f) => (f.id === friendId ? { ...f, notifyOnRsvp: !f.notifyOnRsvp } : f))
    );
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleSelectEventById = (eventId: string) => {
    const target = events.find((e) => e.id === eventId);
    if (target) {
      setSelectedDate('all');
      setSelectedCategory('all');
      setSearchQuery('');
      setActiveBottomTab('discover');
      setTimeout(() => {
        const el = document.getElementById(`event-card-${eventId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('ring-4', 'ring-amber-400');
          setTimeout(() => el.classList.remove('ring-4', 'ring-amber-400'), 2500);
        }
      }, 100);
    }
  };

  const handleSelectGroupById = (groupId: string) => {
    const grp = groups.find((g) => g.id === groupId);
    if (grp) {
      setActiveHangoutGroup(grp);
    }
  };

  const handleOpenTicketPass = (res: TicketReservation) => {
    setActiveTicketPass(res);
  };

  // Helper for quick hangout creation
  const handleOpenCreateHangout = (eventId: string, eventTitle: string) => {
    const target = events.find((e) => e.id === eventId);
    if (target) {
      setActiveHangoutEvent(target);
    } else {
      setActiveHangoutEvent({
        id: eventId,
        title: eventTitle,
        venue: 'Austin Venue',
        date: '2026-09-08',
        time: '7:00 PM',
      } as Partial<EventItem> as EventItem);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-900 font-sans flex items-center justify-center p-0 sm:p-4 md:p-6 select-none">
      {/* Container - Phone Mockup vs Wide Layout */}
      <div
        className={`w-full transition-all duration-300 ${
          isMobileFrame
            ? 'max-w-[430px] min-h-screen sm:min-h-[880px] sm:h-[90vh] bg-white sm:rounded-[44px] shadow-2xl overflow-hidden flex flex-col border sm:border-[8px] border-zinc-800 relative'
            : 'max-w-4xl min-h-screen bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col'
        }`}
      >
        {/* Mobile Status Bar simulation in frame mode */}
        {isMobileFrame && (
          <div className="hidden sm:flex items-center justify-between px-7 pt-3 pb-1 bg-white text-zinc-900 text-xs font-semibold select-none">
            <span>9:41</span>
            <div className="w-20 h-4 bg-black rounded-full mx-auto" />
            <div className="flex items-center gap-1.5 text-[10px]">
              <span>5G</span>
              <div className="w-5 h-2.5 border border-zinc-900 rounded-xs p-0.5">
                <div className="w-full h-full bg-zinc-900" />
              </div>
            </div>
          </div>
        )}

        {/* Global Header */}
        <Header
          user={user}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          unreadCount={unreadCount}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenFriends={() => setIsFriendsModalOpen(true)}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          isMobileFrame={isMobileFrame}
          onToggleMobileFrame={() => setIsMobileFrame((v) => !v)}
          friendCount={friends.filter((f) => f.isFriend).length}
        />

        {/* Main Scrollable App Screen */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col bg-zinc-100/70">
          {/* Tab 1: Discover Feed */}
          {activeBottomTab === 'discover' && (
            <>
              {/* 7-Day Calendar Filter Strip */}
              <DateFilterBar
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                events={events}
              />

              {/* "Your Events" Section (at the top, as requested) */}
              <MyEventsSection
                reservations={reservations}
                groups={groups}
                onOpenTicketPass={handleOpenTicketPass}
                onOpenGroup={(g) => setActiveHangoutGroup(g)}
                onCreateGroupForEvent={handleOpenCreateHangout}
              />

              {/* Category Pills Bar */}
              <CategoryFilterBar
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />

              {/* Feed Header */}
              <div className="px-4 pt-3.5 pb-1 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-black text-zinc-900 tracking-tight flex items-center gap-1.5">
                    <span>Happening Around You</span>
                    <span className="text-[10px] bg-zinc-200 text-zinc-700 px-2 py-0.5 rounded-full font-bold">
                      {filteredEvents.length}
                    </span>
                  </h2>
                  <p className="text-[11px] text-zinc-500">
                    Live aggregation from local journals, notes & social feeds
                  </p>
                </div>

                {/* Reset Filters Shortcut */}
                {(selectedDate !== 'all' || selectedCategory !== 'all' || searchQuery) && (
                  <button
                    onClick={() => {
                      setSelectedDate('all');
                      setSelectedCategory('all');
                      setSearchQuery('');
                    }}
                    className="text-xs font-bold text-amber-700 hover:text-amber-800 underline"
                  >
                    Clear Filters
                  </button>
                )}
              </div>

              {/* Events Feed Grid */}
              <div className="p-4 space-y-4">
                {filteredEvents.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 text-center border border-zinc-200 shadow-sm">
                    <Compass className="w-10 h-10 text-zinc-300 mx-auto mb-2 animate-bounce" />
                    <h3 className="font-bold text-sm text-zinc-800">No happenings found</h3>
                    <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto">
                      No events match your selected date or category filters. Try switching to "All 7 Days" or expanding categories.
                    </p>
                    <button
                      onClick={() => {
                        setSelectedDate('all');
                        setSelectedCategory('all');
                        setSearchQuery('');
                      }}
                      className="mt-4 px-4 py-2 bg-zinc-900 text-white text-xs font-bold rounded-xl hover:bg-zinc-800 transition-colors"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  filteredEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      friends={friends}
                      isBookmarked={bookmarkedIds.includes(event.id)}
                      onToggleBookmark={handleToggleBookmark}
                      onReserveTickets={(ev) => setActiveTicketEvent(ev)}
                      onCreateHangout={(ev) => setActiveHangoutEvent(ev)}
                      onFriendClick={() => setIsFriendsModalOpen(true)}
                      isReserved={reservations.some((r) => r.eventId === event.id)}
                    />
                  ))
                )}
              </div>
            </>
          )}

          {/* Tab 2: My Tickets */}
          {activeBottomTab === 'my-tickets' && (
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-zinc-900">Your Tickets & Passes</h2>
                  <p className="text-xs text-zinc-500">
                    Confirmed reservations and entry barcode passes
                  </p>
                </div>
                <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full">
                  {reservations.length} Active
                </span>
              </div>

              {reservations.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center border border-zinc-200">
                  <Ticket className="w-10 h-10 text-zinc-300 mx-auto mb-2" />
                  <h3 className="font-bold text-sm text-zinc-800">No active passes</h3>
                  <p className="text-xs text-zinc-500 mt-1">
                    Book tickets from the events feed to view your digital admission barcode here.
                  </p>
                  <button
                    onClick={() => setActiveBottomTab('discover')}
                    className="mt-4 px-4 py-2 bg-zinc-900 text-white text-xs font-bold rounded-xl"
                  >
                    Browse Feed
                  </button>
                </div>
              ) : (
                reservations.map((res) => (
                  <div
                    key={res.id}
                    className="bg-white rounded-2xl p-4 border border-zinc-200 shadow-sm space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                          CONFIRMED RESERVATION
                        </span>
                        <h3 className="font-bold text-sm text-zinc-900 mt-0.5">
                          {res.eventTitle}
                        </h3>
                        <p className="text-xs text-zinc-500 mt-1">
                          {res.eventDate} • {res.eventTime}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {res.venue}
                        </p>
                      </div>
                      <span className="text-xs font-mono font-bold bg-zinc-100 px-2 py-1 rounded text-zinc-800">
                        {res.bookingCode}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
                      <div className="text-xs text-zinc-600">
                        <span className="font-bold text-zinc-900">{res.quantity}</span> {res.seatTier}
                        {res.totalPrice > 0 && <span> (${res.totalPrice.toFixed(2)})</span>}
                      </div>

                      <button
                        onClick={() => handleOpenTicketPass(res)}
                        className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs rounded-xl transition-colors"
                      >
                        Show QR Pass
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 3: Hangout Groups */}
          {activeBottomTab === 'hangouts' && (
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-zinc-900">Event Hangouts</h2>
                  <p className="text-xs text-zinc-500">
                    Coordinate meeting up with friends for activities
                  </p>
                </div>
                <button
                  onClick={() => {
                    const firstEv = events[0];
                    if (firstEv) setActiveHangoutEvent(firstEv);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 bg-zinc-900 text-white text-xs font-bold rounded-xl hover:bg-zinc-800"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>New Group</span>
                </button>
              </div>

              {groups.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center border border-zinc-200">
                  <Users className="w-10 h-10 text-zinc-300 mx-auto mb-2" />
                  <h3 className="font-bold text-sm text-zinc-800">No hangouts created yet</h3>
                  <p className="text-xs text-zinc-500 mt-1">
                    Create a group for an event to invite friends and coordinate your arrival.
                  </p>
                </div>
              ) : (
                groups.map((group) => (
                  <div
                    key={group.id}
                    className="bg-white rounded-2xl p-4 border border-zinc-200 shadow-sm space-y-3 cursor-pointer hover:border-zinc-300 transition-all"
                    onClick={() => setActiveHangoutGroup(group)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider inline-block mb-1">
                          Group Hangout
                        </span>
                        <h3 className="font-bold text-sm text-zinc-900">{group.name}</h3>
                        <p className="text-xs text-zinc-600 font-medium mt-0.5">
                          {group.eventTitle}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-zinc-500 bg-zinc-100 px-2 py-1 rounded-lg">
                        {group.memberFriendIds.length + 1} going
                      </span>
                    </div>

                    <div className="text-xs text-zinc-500 bg-zinc-50 p-2.5 rounded-xl border border-zinc-100">
                      <span className="font-semibold text-zinc-700">📍 Meeting:</span> {group.meetingSpot}
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-zinc-100">
                      <span className="text-zinc-400">Created by {group.createdByName}</span>
                      <span className="font-bold text-amber-700">Manage Crew →</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 4: Friends & Network */}
          {activeBottomTab === 'friends' && (
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-zinc-900">Your Friends</h2>
                  <p className="text-xs text-zinc-500">
                    Get notifications when friends confirm they're going to events
                  </p>
                </div>
                <button
                  onClick={() => setIsFriendsModalOpen(true)}
                  className="px-3 py-1.5 bg-zinc-900 text-white font-bold text-xs rounded-xl"
                >
                  Manage Friends
                </button>
              </div>

              <div className="space-y-3">
                {friends
                  .filter((f) => f.isFriend)
                  .map((friend) => (
                    <div
                      key={friend.id}
                      className="bg-white rounded-2xl p-3.5 border border-zinc-200 shadow-sm flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={friend.avatar}
                          alt={friend.name}
                          className="w-10 h-10 rounded-full object-cover ring-1 ring-zinc-200"
                        />
                        <div>
                          <h4 className="font-bold text-sm text-zinc-900">{friend.name}</h4>
                          <span className="text-xs text-zinc-500">{friend.neighborhood}</span>
                          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                            {friend.attendingEventIds.length} upcoming event(s)
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleFriendNotification(friend.id)}
                        className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border transition-colors ${
                          friend.notifyOnRsvp
                            ? 'bg-amber-50 border-amber-200 text-amber-800'
                            : 'bg-zinc-100 border-zinc-200 text-zinc-400'
                        }`}
                      >
                        {friend.notifyOnRsvp ? 'Alerts ON' : 'Muted'}
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </main>

        {/* Bottom Mobile Navigation Bar */}
        <nav className="bg-white border-t border-zinc-200 px-3 py-2 flex items-center justify-around z-30">
          <button
            id="nav-discover"
            onClick={() => setActiveBottomTab('discover')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              activeBottomTab === 'discover'
                ? 'text-zinc-900 font-bold'
                : 'text-zinc-400 hover:text-zinc-600'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[10px]">Discover</span>
          </button>

          <button
            id="nav-tickets"
            onClick={() => setActiveBottomTab('my-tickets')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all relative ${
              activeBottomTab === 'my-tickets'
                ? 'text-zinc-900 font-bold'
                : 'text-zinc-400 hover:text-zinc-600'
            }`}
          >
            <Ticket className="w-5 h-5" />
            <span className="text-[10px]">Passes</span>
            {reservations.length > 0 && (
              <span className="absolute top-1 right-2 w-2 h-2 bg-amber-500 rounded-full" />
            )}
          </button>

          <button
            id="nav-hangouts"
            onClick={() => setActiveBottomTab('hangouts')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              activeBottomTab === 'hangouts'
                ? 'text-zinc-900 font-bold'
                : 'text-zinc-400 hover:text-zinc-600'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-[10px]">Hangouts</span>
          </button>

          <button
            id="nav-friends"
            onClick={() => setActiveBottomTab('friends')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              activeBottomTab === 'friends'
                ? 'text-zinc-900 font-bold'
                : 'text-zinc-400 hover:text-zinc-600'
            }`}
          >
            <Layers className="w-5 h-5" />
            <span className="text-[10px]">Network</span>
          </button>
        </nav>

        {/* Home Indicator Bar for Phone Frame */}
        {isMobileFrame && (
          <div className="hidden sm:block py-1.5 bg-white">
            <div className="w-32 h-1 bg-zinc-300 rounded-full mx-auto" />
          </div>
        )}
      </div>

      {/* --- MODALS & DRAWERS --- */}

      {/* 1. Ticket Purchase / Digital Pass Modal */}
      {(activeTicketEvent || activeTicketPass) && (
        <TicketModal
          event={activeTicketEvent}
          existingReservation={activeTicketPass}
          onClose={() => {
            setActiveTicketEvent(null);
            setActiveTicketPass(null);
          }}
          onConfirmBooking={handleConfirmBooking}
          userName={user.name}
        />
      )}

      {/* 2. Hangout Group Modal */}
      {(activeHangoutEvent || activeHangoutGroup) && (
        <HangoutGroupModal
          event={activeHangoutEvent}
          existingGroup={activeHangoutGroup}
          friends={friends}
          onClose={() => {
            setActiveHangoutEvent(null);
            setActiveHangoutGroup(null);
          }}
          onCreateGroup={handleCreateGroup}
          userName={user.name}
        />
      )}

      {/* 3. Friends & Network Modal */}
      {isFriendsModalOpen && (
        <FriendsModal
          friends={friends}
          events={events}
          onToggleFriend={handleToggleFriend}
          onToggleFriendNotification={handleToggleFriendNotification}
          onClose={() => setIsFriendsModalOpen(false)}
          onSelectEvent={handleSelectEventById}
        />
      )}

      {/* 4. Notifications Center Drawer */}
      {isNotificationsOpen && (
        <NotificationsDrawer
          notifications={notifications}
          onClose={() => setIsNotificationsOpen(false)}
          onMarkAllRead={handleMarkAllNotificationsRead}
          onSelectEvent={handleSelectEventById}
          onSelectGroup={handleSelectGroupById}
        />
      )}

      {/* 5. User Profile & Preferences Modal */}
      {isProfileModalOpen && (
        <ProfileModal
          user={user}
          reservations={reservations}
          friendCount={friends.filter((f) => f.isFriend).length}
          onClose={() => setIsProfileModalOpen(false)}
          onUpdateUser={setUser}
          onOpenTicketPass={(res) => {
            setIsProfileModalOpen(false);
            handleOpenTicketPass(res);
          }}
        />
      )}
    </div>
  );
}
