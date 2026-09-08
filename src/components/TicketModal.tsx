import React, { useState } from 'react';
import { 
  X, 
  Ticket, 
  QrCode, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Share2, 
  Download,
  AlertCircle
} from 'lucide-react';
import { EventItem, TicketReservation } from '../types';

interface TicketModalProps {
  event: EventItem | null;
  existingReservation?: TicketReservation | null;
  onClose: () => void;
  onConfirmBooking: (reservation: TicketReservation) => void;
  userName: string;
}

export const TicketModal: React.FC<TicketModalProps> = ({
  event,
  existingReservation,
  onClose,
  onConfirmBooking,
  userName,
}) => {
  if (!event && !existingReservation) return null;

  const targetEvent = event || {
    id: existingReservation!.eventId,
    title: existingReservation!.eventTitle,
    venue: existingReservation!.venue,
    address: existingReservation!.address,
    date: existingReservation!.eventDate,
    time: existingReservation!.eventTime,
    price: existingReservation!.totalPrice / existingReservation!.quantity,
    ticketTiers: [{ id: 't1', name: existingReservation!.seatTier, price: existingReservation!.totalPrice / existingReservation!.quantity, description: '', remaining: 10 }],
  } as Partial<EventItem> as EventItem;

  const [selectedTierId, setSelectedTierId] = useState<string>(
    targetEvent.ticketTiers?.[0]?.id || 'default'
  );
  const [quantity, setQuantity] = useState<number>(existingReservation?.quantity || 1);
  const [isSuccess, setIsSuccess] = useState<boolean>(!!existingReservation);
  const [activePass, setActivePass] = useState<TicketReservation | null>(existingReservation || null);

  const currentTier = targetEvent.ticketTiers?.find((t) => t.id === selectedTierId) || {
    name: 'General Admission',
    price: targetEvent.price || 0,
    description: 'Standard Entry Pass',
  };

  const totalPrice = currentTier.price * quantity;

  const handleBook = () => {
    const bookingCode = `LP-${targetEvent.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReservation: TicketReservation = {
      id: `res-${Date.now()}`,
      eventId: targetEvent.id,
      eventTitle: targetEvent.title,
      eventDate: targetEvent.date,
      eventTime: targetEvent.time,
      venue: targetEvent.venue,
      address: targetEvent.address || '',
      quantity,
      seatTier: currentTier.name,
      totalPrice,
      bookingCode,
      reservedAt: 'Just now',
      userName,
    };

    setActivePass(newReservation);
    setIsSuccess(true);
    onConfirmBooking(newReservation);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div 
        className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-zinc-200 animate-in fade-in zoom-in-95 duration-200 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-amber-500" />
            <h2 className="font-bold text-base text-zinc-900">
              {isSuccess ? 'Digital Ticket Pass' : 'Reserve & Tickets'}
            </h2>
          </div>
          <button
            id="close-ticket-modal"
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-700 rounded-full hover:bg-zinc-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Mode 1: Success / Show Pass */}
        {isSuccess && activePass ? (
          <div className="p-5">
            {/* Ticket Card Aesthetic */}
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 text-white rounded-2xl p-5 shadow-xl border border-zinc-700 relative overflow-hidden">
              {/* Notches for ticket realism */}
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full" />
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full" />

              <div className="flex items-center justify-between text-xs text-amber-400 font-bold tracking-wider uppercase mb-1">
                <span>LocalPulse Pass</span>
                <span className="bg-amber-400/20 px-2 py-0.5 rounded text-amber-300">CONFIRMED</span>
              </div>

              <h3 className="font-black text-lg text-white leading-tight mt-1">
                {activePass.eventTitle}
              </h3>

              <div className="mt-3 space-y-1 text-xs text-zinc-300">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>{activePass.eventDate} • {activePass.eventTime}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{activePass.venue}</span>
                </div>
              </div>

              {/* Dashed divider */}
              <div className="my-4 border-b border-dashed border-zinc-600" />

              {/* Passenger and seat details */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Attendee</span>
                  <span className="font-bold text-white truncate block">{activePass.userName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Tier</span>
                  <span className="font-bold text-amber-300 truncate block">{activePass.seatTier}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Quantity</span>
                  <span className="font-bold text-white block">{activePass.quantity} Person(s)</span>
                </div>
              </div>

              {/* Simulated QR Code */}
              <div className="mt-5 bg-white text-zinc-900 rounded-xl p-4 flex flex-col items-center justify-center shadow-inner">
                {/* SVG QR Code Pattern */}
                <div className="w-36 h-36 border-4 border-zinc-900 p-2 flex items-center justify-center bg-zinc-50 relative rounded-lg">
                  <div className="grid grid-cols-6 gap-1 w-full h-full">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <div
                        key={i}
                        className={`${
                          (i % 2 === 0 && i % 3 === 0) || i === 0 || i === 5 || i === 30 || i === 35 || (i > 13 && i < 22)
                            ? 'bg-zinc-900'
                            : 'bg-zinc-200'
                        } rounded-[1px]`}
                      />
                    ))}
                  </div>
                  <div className="absolute bg-white px-2 py-0.5 rounded font-black text-[9px] tracking-widest text-zinc-900 border border-zinc-300">
                    PULSE
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-zinc-800 tracking-wider mt-2">
                  {activePass.bookingCode}
                </span>
                <span className="text-[10px] text-zinc-500 mt-0.5">
                  Scan at entrance • Valid for admission
                </span>
              </div>
            </div>

            {/* Quick Helper Actions */}
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={() => alert(`Pass ${activePass.bookingCode} downloaded to mobile wallet.`)}
                className="flex-1 py-2.5 px-3 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save to Wallet</span>
              </button>
              <button
                onClick={onClose}
                className="py-2.5 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold text-xs rounded-xl transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* View Mode 2: Reservation & Purchase Form */
          <div className="p-5 space-y-4">
            {/* Event Summary */}
            <div className="bg-zinc-50 p-3.5 rounded-2xl border border-zinc-200">
              <h3 className="font-bold text-sm text-zinc-900">{targetEvent.title}</h3>
              <div className="mt-1 flex items-center gap-2 text-xs text-zinc-600">
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                <span>{targetEvent.date} • {targetEvent.time}</span>
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-zinc-600">
                <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                <span>{targetEvent.venue}</span>
              </div>
            </div>

            {/* Tier Selection */}
            <div>
              <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider block mb-2">
                Select Admission Tier
              </label>
              <div className="space-y-2">
                {targetEvent.ticketTiers.map((tier) => (
                  <button
                    key={tier.id}
                    id={`tier-select-${tier.id}`}
                    onClick={() => setSelectedTierId(tier.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                      selectedTierId === tier.id
                        ? 'border-zinc-900 bg-zinc-900/5 ring-1 ring-zinc-900'
                        : 'border-zinc-200 hover:border-zinc-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs text-zinc-900">{tier.name}</div>
                      <div className="text-[11px] text-zinc-500 mt-0.5">{tier.description}</div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <div className="font-black text-sm text-zinc-900">
                        {tier.price === 0 ? 'FREE' : `$${tier.price}`}
                      </div>
                      <div className="text-[10px] text-emerald-600 font-semibold">
                        {tier.remaining} spots left
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Stepper */}
            <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border border-zinc-200">
              <div>
                <span className="text-xs font-bold text-zinc-900 block">Quantity</span>
                <span className="text-[11px] text-zinc-500">Max 6 per reservation</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  id="qty-minus"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-lg bg-white border border-zinc-300 text-zinc-700 font-bold flex items-center justify-center hover:bg-zinc-100 disabled:opacity-40 transition-colors"
                >
                  -
                </button>
                <span className="font-black text-sm text-zinc-900 w-4 text-center">
                  {quantity}
                </span>
                <button
                  id="qty-plus"
                  disabled={quantity >= 6}
                  onClick={() => setQuantity((q) => Math.min(6, q + 1))}
                  className="w-8 h-8 rounded-lg bg-white border border-zinc-300 text-zinc-700 font-bold flex items-center justify-center hover:bg-zinc-100 disabled:opacity-40 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Summary Breakdown */}
            <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-sm">
              <span className="text-zinc-600 font-medium">
                Total Due ({quantity} × {currentTier.price === 0 ? 'Free' : `$${currentTier.price}`}):
              </span>
              <span className="font-black text-base text-zinc-900">
                {totalPrice === 0 ? 'FREE' : `$${totalPrice.toFixed(2)}`}
              </span>
            </div>

            {/* Confirm Button */}
            <button
              id="confirm-booking-btn"
              onClick={handleBook}
              className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                {totalPrice === 0 ? 'Confirm Free Reservation' : `Pay & Reserve ($${totalPrice.toFixed(2)})`}
              </span>
            </button>
            <p className="text-[10px] text-center text-zinc-400">
              Mocked checkout sandbox • No real payment card charged
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
