import React from 'react';
import { Ticket, QrCode, Users, MapPin, Calendar, Clock, ChevronRight } from 'lucide-react';
import { TicketReservation, HangoutGroup } from '../types';

interface MyEventsSectionProps {
  reservations: TicketReservation[];
  groups: HangoutGroup[];
  onOpenTicketPass: (reservation: TicketReservation) => void;
  onOpenGroup: (group: HangoutGroup) => void;
  onCreateGroupForEvent: (eventId: string, eventTitle: string) => void;
}

export const MyEventsSection: React.FC<MyEventsSectionProps> = ({
  reservations,
  groups,
  onOpenTicketPass,
  onOpenGroup,
  onCreateGroupForEvent,
}) => {
  if (reservations.length === 0) {
    return (
      <section className="px-4 py-3 bg-amber-50/60 border-b border-amber-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ticket className="w-4 h-4 text-amber-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-900">Your Events (0)</h2>
          </div>
          <span className="text-[11px] text-amber-700 font-medium">No tickets reserved yet</span>
        </div>
        <p className="text-xs text-amber-800/80 mt-1">
          Browse today's local happenings below to reserve a pass or grab tickets with friends.
        </p>
      </section>
    );
  }

  return (
    <section className="px-4 py-3 bg-zinc-900 text-white border-b border-zinc-800">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
            Your Confirmed Events ({reservations.length})
          </h2>
        </div>
        <span className="text-[11px] text-zinc-400 font-medium">
          Digital Passes Ready
        </span>
      </div>

      {/* Horizontal Cards for User's Confirmed Events */}
      <div className="space-y-2.5">
        {reservations.map((res) => {
          const linkedGroup = groups.find((g) => g.eventId === res.eventId);

          return (
            <div
              key={res.id}
              id={`my-event-${res.id}`}
              className="bg-zinc-800/90 rounded-xl p-3 border border-zinc-700/80 hover:border-zinc-600 transition-all shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-semibold mb-0.5">
                    <Calendar className="w-3 h-3" />
                    <span>{res.eventDate}</span>
                    <span>•</span>
                    <Clock className="w-3 h-3" />
                    <span>{res.eventTime}</span>
                  </div>
                  <h3 className="font-bold text-sm text-white truncate leading-snug">
                    {res.eventTitle}
                  </h3>
                  <p className="text-xs text-zinc-300 flex items-center gap-1 mt-0.5 truncate">
                    <MapPin className="w-3 h-3 text-zinc-400 flex-shrink-0" />
                    <span className="truncate">{res.venue}</span>
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="inline-block bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded">
                    {res.quantity} {res.quantity === 1 ? 'Ticket' : 'Tickets'}
                  </span>
                  <div className="text-[10px] text-zinc-400 mt-1 font-mono">
                    {res.bookingCode}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-3 pt-2 border-t border-zinc-700/60 flex items-center justify-between gap-2">
                {/* View Ticket & QR Pass */}
                <button
                  id={`view-pass-btn-${res.id}`}
                  onClick={() => onOpenTicketPass(res)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs rounded-lg transition-colors shadow-sm"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Show Pass / QR</span>
                </button>

                {/* Hangout group status */}
                {linkedGroup ? (
                  <button
                    id={`view-group-btn-${linkedGroup.id}`}
                    onClick={() => onOpenGroup(linkedGroup)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-xs font-semibold rounded-lg transition-colors"
                  >
                    <Users className="w-3.5 h-3.5 text-amber-300" />
                    <span className="truncate max-w-[120px]">{linkedGroup.name}</span>
                    <span className="text-[10px] bg-zinc-600 px-1.5 rounded-full font-bold">
                      {linkedGroup.memberFriendIds.length + 1}
                    </span>
                  </button>
                ) : (
                  <button
                    id={`create-hangout-btn-${res.eventId}`}
                    onClick={() => onCreateGroupForEvent(res.eventId, res.eventTitle)}
                    className="flex items-center gap-1 text-xs text-zinc-300 hover:text-white font-medium hover:underline"
                  >
                    <Users className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Plan Hangout</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
