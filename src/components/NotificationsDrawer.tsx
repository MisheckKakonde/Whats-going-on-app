import React from 'react';
import { X, Bell, CheckCheck, Users, Calendar, Ticket, ArrowRight } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationsDrawerProps {
  notifications: NotificationItem[];
  onClose: () => void;
  onMarkAllRead: () => void;
  onSelectEvent: (eventId: string) => void;
  onSelectGroup?: (groupId: string) => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  notifications,
  onClose,
  onMarkAllRead,
  onSelectEvent,
  onSelectGroup,
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  const renderIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'friend_rsvp':
        return <Calendar className="w-4 h-4 text-emerald-600" />;
      case 'group_invite':
        return <Users className="w-4 h-4 text-amber-600" />;
      case 'ticket_confirmed':
        return <Ticket className="w-4 h-4 text-blue-600" />;
      default:
        return <Bell className="w-4 h-4 text-zinc-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
      <div
        className="bg-white w-full max-w-sm h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-500" />
            <h2 className="font-bold text-base text-zinc-900">Notifications</h2>
            {unreadCount > 0 && (
              <span className="text-xs bg-rose-500 text-white font-bold px-2 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <button
            id="close-notifications-drawer"
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-700 rounded-full hover:bg-zinc-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action bar */}
        {unreadCount > 0 && (
          <div className="px-5 py-2 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between text-xs">
            <span className="text-zinc-500">Based on your friend & event alerts</span>
            <button
              onClick={onMarkAllRead}
              className="text-zinc-700 hover:text-zinc-950 font-bold flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-zinc-400 text-xs">
              No notifications yet. Connect with friends and reserve events to get live updates!
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                id={`notif-${notif.id}`}
                onClick={() => {
                  if (notif.relatedEventId) {
                    onSelectEvent(notif.relatedEventId);
                    onClose();
                  } else if (notif.relatedGroupId && onSelectGroup) {
                    onSelectGroup(notif.relatedGroupId);
                    onClose();
                  }
                }}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  notif.read
                    ? 'bg-white border-zinc-200 hover:border-zinc-300'
                    : 'bg-amber-50/70 border-amber-200/90 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-2 bg-white rounded-xl shadow-xs border border-zinc-200 mt-0.5">
                    {renderIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-bold text-xs text-zinc-900 truncate">
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-zinc-400 font-mono flex-shrink-0">
                        {notif.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 mt-0.5 leading-snug">
                      {notif.message}
                    </p>

                    {notif.relatedEventId && (
                      <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-amber-800">
                        <span>View Event</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
