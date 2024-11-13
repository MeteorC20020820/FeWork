'use client'
import SideBar from "../SideBar/sideBar";
import { useState, useRef, useEffect } from "react";
import styles from './workshedule.module.css'
import { IconNextMonth, IconPrevMonth } from "@/components/icon/icon";

const events = [
  {
    id: 1,
    name: "event111111111111111111111111",
    timeStart: "9:00",
    timeEnd: "10:00",
    day: 13,
    month: "November",
    year: "2024",
    note: "check",
  },
  {
    id: 2,
    name: "event2",
    timeStart: "9:00",
    timeEnd: "10:00",
    day: 13,
    month: "November",
    year: "2024",
    note: "check123",
  },
  {
    id: 3,
    name: "event12",
    timeStart: "9:00",
    timeEnd: "10:00",
    day: 12,
    month: "November",
    year: "2024",
    note: "check12",
  },
];
export default function Workshedule(){
const [user, setUser] = useState<any>({});
const [userRoleP, setUserRoleP] = useState<any>(null);
const [currentDate, setCurrentDate] = useState(new Date());
const [selectedMonth, setSelectedMonth] = useState<number>(
  currentDate.getMonth()
);
const [selectedYear, setSelectedYear] = useState<number>(
  currentDate.getFullYear()
);
const [selectedDay, setSelectedDay] = useState<number | null>(
  currentDate.getDate()
);
const [selectedEvents, setSelectedEvents] = useState<typeof events>([]);

useEffect(() => {
  const timer = setInterval(() => {
    setCurrentDate(new Date());
  }, 1000 * 60 * 60);
  const eventsForToday = events.filter(
    (event) =>
      event.day === currentDate.getDate() &&
      parseInt(event.year) === currentDate.getFullYear() &&
      new Date(`${event.month} 1, ${event.year}`).getMonth() ===
        currentDate.getMonth()
  );
  setSelectedEvents(eventsForToday);
  setSelectedDay(currentDate.getDate());

  return () => clearInterval(timer);
}, [currentDate]);

const handlePrevMonth = () => {
  const newDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
  setCurrentDate(newDate);
  setSelectedMonth(newDate.getMonth());
  setSelectedYear(newDate.getFullYear());
};

const handleNextMonth = () => {
  const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
  setCurrentDate(newDate);
  setSelectedMonth(newDate.getMonth());
  setSelectedYear(newDate.getFullYear());
};

const handleToday = () => {
  const today = new Date();
  setCurrentDate(today);
  setSelectedMonth(today.getMonth());
  setSelectedYear(today.getFullYear());
};

const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  const month = parseInt(event.target.value, 10);
  setSelectedMonth(month);
  setCurrentDate(new Date(selectedYear, month, 1));
};

const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  const year = parseInt(event.target.value, 10);
  setSelectedYear(year);
  setCurrentDate(new Date(year, selectedMonth, 1));
};

const month = currentDate.toLocaleString("default", { month: "long" });
const year = currentDate.getFullYear();
const currentDay = currentDate.getDate();

const daysInMonth = new Date(year, selectedMonth + 1, 0).getDate();
const firstDayOfMonth = new Date(year, selectedMonth, 1).getDay();
const startingDay = (firstDayOfMonth === 0 ? 7 : firstDayOfMonth) - 1;
const prevMonthDays = new Date(year, selectedMonth, 0).getDate();

const days = [];

for (let i = startingDay - 1; i >= 0; i--) {
  days.push({
    day: prevMonthDays - i,
    isCurrentMonth: false,
    events: [],
  });
}

for (let i = 1; i <= daysInMonth; i++) {
  const eventsForDay = events.filter(
    (event) =>
      event.day === i &&
      parseInt(event.year) === selectedYear &&
      new Date(`${event.month} 1, ${event.year}`).getMonth() === selectedMonth
  );
  days.push({
    day: i,
    isCurrentMonth: true,
    events: eventsForDay,
  });
}

const totalCells = 42;
const remainingCells = totalCells - days.length;
const nextMonthDays = [];
for (let i = 1; i <= remainingCells; i++) {
  nextMonthDays.push({
    day: i,
    isCurrentMonth: false,
    events: [],
  });
}

const fullDays = [...days, ...nextMonthDays];
const lastRow = fullDays.slice(-7);
const allNextMonth = lastRow.every((day) => !day.isCurrentMonth);
const displayDays = allNextMonth ? fullDays.slice(0, -7) : fullDays;

const handleDayClick = (day: number) => {
  setSelectedDay(day);
  const eventsForDay = events.filter(
    (event) =>
      event.day === day &&
      parseInt(event.year) === selectedYear &&
      new Date(`${event.month} 1, ${event.year}`).getMonth() === selectedMonth
  );
  setSelectedEvents(eventsForDay);
};
    return (
      <div className={styles.bodyWorkshedule}>
        <SideBar setUser={setUser} setUserRoleP={setUserRoleP} />
        <div style={{width:"18%"}}></div>
        <div className={styles.content}>
          <div className={styles.calendarContainer}>
            <div className={styles.header}>
              <div className={styles.headerLeft}>
                <button onClick={handleToday} className={styles.btnToday}>
                  Today
                </button>
                <button onClick={handlePrevMonth}>
                  <IconPrevMonth />
                </button>
                <button onClick={handleNextMonth}>
                  <IconNextMonth />
                </button>
                <h2 className={styles.headerTitle}>{`${month} ${year}`}</h2>
              </div>
              <div className={styles.headerMobile}>
                <button onClick={handlePrevMonth}>
                  <IconPrevMonth />
                </button>
                <h2 className={styles.headerTitle}>{`${month} ${year}`}</h2>
                <button onClick={handleNextMonth}>
                  <IconNextMonth />
                </button>
              </div>
              <select
                className={styles.monthSelect}
                value={selectedMonth}
                onChange={handleMonthChange}
              >
                {Array.from({ length: 12 }).map((_, index) => (
                  <option
                    key={index}
                    className={styles.optionYear}
                    value={index}
                  >
                    {new Date(0, index).toLocaleString("default", {
                      month: "long",
                    })}
                  </option>
                ))}
              </select>
              <select
                className={styles.yearSelect}
                value={selectedYear}
                onChange={handleYearChange}
              >
                {Array.from({ length: 10 }).map((_, index) => (
                  <option
                    className={styles.optionYear}
                    key={index}
                    value={year - 5 + index}
                  >
                    {year - 5 + index}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.weekDays}>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
              <div>Sun</div>
            </div>

            <div className={styles.daysGrid}>
              {displayDays.map((dayObj, index) => (
                <div
                  key={index}
                  className={`${styles.day} ${
                    dayObj.isCurrentMonth
                      ? styles.currentMonthDay
                      : styles.otherMonthDay
                  } ${
                    dayObj.isCurrentMonth && dayObj.events.length > 0
                      ? styles.eventDay
                      : ""
                  } ${
                    dayObj.isCurrentMonth &&
                    dayObj.day === currentDay &&
                    currentDate.getMonth() === new Date().getMonth() &&
                    currentDate.getFullYear() === new Date().getFullYear()
                      ? styles.today
                      : ""
                  }`}
                  onClick={() =>
                    dayObj.isCurrentMonth && handleDayClick(dayObj.day)
                  }
                >
                  {dayObj.day}
                  {dayObj.events.length > 0 && (
                    <div className={styles.eventList}>
                      {dayObj.events.map((event) => (
                        <div key={event.id} className={styles.event}>
                          <strong>{event.name}</strong>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {selectedDay !== null && selectedEvents.length > 0 && (
              <div className={styles.eventDetails}>
                <h1 className={styles.titleEvents}>Upcoming Events</h1>
                <ul>
                  {selectedEvents.map((event) => (
                    <div key={event.id} className={styles.eventsOnDay}>
                      <h3 className={styles.titleEventDay}>{event.name}</h3>
                      <p className={styles.timeEventDay}>
                        {event.timeStart} - {event.timeEnd}
                      </p>
                      <p
                        className={styles.noteEventDay}
                        style={{ fontWeight: "600" }}
                      >
                        Note:
                      </p>
                      <p className={styles.noteEventDay}>{event.note}</p>
                    </div>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    );
}