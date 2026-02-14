"use client";

import { useState, useMemo } from "react";

const CALCOM_URL = process.env.NEXT_PUBLIC_CALCOM_EMBED_URL;

const DAYS = ["LUN.", "MAR.", "MER.", "JEU.", "VEN.", "SAM.", "DIM."];
const MONTHS = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];
const SHORT_MONTHS = [
  "JAN.",
  "FÉV.",
  "MARS",
  "AVR.",
  "MAI",
  "JUIN",
  "JUIL.",
  "AOÛT",
  "SEPT.",
  "OCT.",
  "NOV.",
  "DÉC.",
];
const DAY_NAMES = [
  "DIMANCHE",
  "LUNDI",
  "MARDI",
  "MERCREDI",
  "JEUDI",
  "VENDREDI",
  "SAMEDI",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayMondayBased(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

function isWeekday(year: number, month: number, day: number) {
  const d = new Date(year, month, day).getDay();
  return d !== 0 && d !== 6;
}

function isInPast(year: number, month: number, day: number) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(year, month, day);
  return date <= today;
}

function generateTimeSlots() {
  const slots: string[] = [];
  for (let h = 9; h < 17; h++) {
    for (let m = 0; m < 60; m += 15) {
      slots.push(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
      );
    }
  }
  return slots;
}

export default function AppointmentsPage() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const timeSlots = useMemo(() => generateTimeSlots(), []);
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayMondayBased(currentYear, currentMonth);

  const prevMonthDays = getDaysInMonth(
    currentMonth === 0 ? currentYear - 1 : currentYear,
    currentMonth === 0 ? 11 : currentMonth - 1,
  );
  const prevDays = Array.from(
    { length: firstDay },
    (_, i) => prevMonthDays - firstDay + 1 + i,
  );
  const currentDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const totalCells = prevDays.length + currentDays.length;
  const nextDaysCount = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  const nextDays = Array.from({ length: nextDaysCount }, (_, i) => i + 1);

  const canGoPrev = !(
    currentYear === today.getFullYear() && currentMonth === today.getMonth()
  );

  const handlePrevMonth = () => {
    if (!canGoPrev) return;
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDay(null);
    setSelectedTime(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDay(null);
    setSelectedTime(null);
  };

  const isAvailable = (day: number) =>
    isWeekday(currentYear, currentMonth, day) &&
    !isInPast(currentYear, currentMonth, day);

  const selectedDateObj = selectedDay
    ? new Date(currentYear, currentMonth, selectedDay)
    : null;

  const handleNext = () => {
    if (!selectedDay || !selectedTime || !CALCOM_URL) return;
    const month = String(currentMonth + 1).padStart(2, "0");
    const day = String(selectedDay).padStart(2, "0");
    const dateStr = `${currentYear}-${month}-${day}`;
    window.open(
      `https://cal.com/${CALCOM_URL}?date=${dateStr}&slot=${dateStr}T${selectedTime}:00.000Z`,
      "_blank",
    );
  };

  if (!CALCOM_URL) {
    return (
      <div className="container-page py-20 text-center">
        <div className="mx-auto max-w-lg">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent/10">
            <span className="text-4xl">📅</span>
          </div>
          <h1 className="font-display text-3xl font-bold">
            Prendre rendez-vous
          </h1>
          <p className="mt-4 text-foreground/60">
            Le système de réservation est en cours de configuration. Contactez-nous
            directement pour prendre rendez-vous.
          </p>
          <a
            href="mailto:contact@epicerie-africaine.ca"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-medium text-white transition-colors hover:bg-accent-dark"
          >
            Nous contacter
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100dvh-72px)] flex-col items-center justify-center px-4">
      <div className="mb-6 text-center">
        <h1 className="font-display text-3xl font-bold">
          Prendre rendez-vous
        </h1>
        <p className="mt-2 text-sm text-foreground/60">
          Réservez un créneau pour une consultation personnalisée ou un retrait
          de commande.
        </p>
      </div>
      <div className="w-full max-w-3xl rounded-2xl border border-foreground/10 bg-white p-8 shadow-sm">
        <div className="flex gap-8">
          {/* Calendrier */}
          <div className="flex-1">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">
                {MONTHS[currentMonth]} {currentYear}
              </h2>
              <div className="flex gap-1">
                <button
                  onClick={handlePrevMonth}
                  disabled={!canGoPrev}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-foreground/10 text-foreground/40 transition-colors hover:bg-foreground/5 disabled:opacity-30"
                >
                  &#8249;
                </button>
                <button
                  onClick={handleNextMonth}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-foreground/10 text-foreground/40 transition-colors hover:bg-foreground/5"
                >
                  &#8250;
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-y-1 text-center text-[11px] font-semibold tracking-wide text-foreground/35">
              {DAYS.map((d) => (
                <div key={d} className="py-1">
                  {d}
                </div>
              ))}
            </div>

            <div className="mt-1 grid grid-cols-7 gap-y-1 text-center text-sm">
              {prevDays.map((d) => (
                <div key={`p${d}`} className="py-2 text-foreground/20">
                  {d}
                </div>
              ))}
              {currentDays.map((d) => {
                const available = isAvailable(d);
                const selected = selectedDay === d;
                return (
                  <button
                    key={d}
                    onClick={() => {
                      if (available) {
                        setSelectedDay(d);
                        setSelectedTime(null);
                      }
                    }}
                    disabled={!available}
                    className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors ${
                      selected
                        ? "bg-accent font-bold text-white"
                        : available
                          ? "cursor-pointer hover:bg-accent/10"
                          : "cursor-default text-foreground/25"
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
              {nextDays.map((d) => (
                <div key={`n${d}`} className="py-2 text-foreground/20">
                  {d}
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-foreground/35">
              <span className="h-2.5 w-2.5 rounded-full bg-accent" />
              Date sélectionnée
            </div>
          </div>

          {/* Séparateur */}
          <div className="w-px self-stretch bg-foreground/10" />

          {/* Créneaux horaires */}
          <div className="w-44">
            {selectedDay && selectedDateObj ? (
              <>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-foreground/35">
                  {DAY_NAMES[selectedDateObj.getDay()]} {selectedDay}{" "}
                  {SHORT_MONTHS[currentMonth]}
                </p>
                <p className="mt-1 font-display text-sm font-bold">
                  Sélectionnez l&apos;heure
                </p>
                <div className="mt-3 flex max-h-[300px] flex-col gap-2 overflow-y-auto pr-1">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                        selectedTime === time
                          ? "border-accent bg-accent font-medium text-white"
                          : "border-foreground/10 hover:border-accent/30 hover:bg-accent/5"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
                {selectedTime && (
                  <button
                    onClick={handleNext}
                    className="mt-4 w-full rounded-lg bg-accent py-2.5 font-medium text-white transition-colors hover:bg-accent-dark"
                  >
                    Suivant
                  </button>
                )}
              </>
            ) : (
              <div className="flex h-full items-center justify-center text-center text-sm text-foreground/30">
                Sélectionnez une date
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
