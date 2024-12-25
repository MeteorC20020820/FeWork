'use client'
import { useState, useRef, useEffect } from "react";
import styles from './workshedule.module.css'
import { IconNextMonth, IconPrevMonth } from "@/components/icon/icon";
import axios from "axios";
const apiAi = "https://b20dccn460.serveo.net/api/v1/";
import { Modal, Input, Select } from "antd";
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
    status: 0,
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
    status: 0,
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
    status: 0,
  },
];
export default function ModalWorkshedule(open: boolean, setOpen: Function, dataEm: any){
const [user, setUser] = useState<any>({});
const token = localStorage?.getItem("authToken");
const [idAcc, setIDAcc] = useState<any>(null)
const [acc, setAcc] = useState<any>(null)
const [data, setData] = useState<any>({})
const [idCheckIn, setIdCheckIn] = useState<any>(null)
useEffect(() =>{
  const ApiGetAccID = async() =>{
    try {
      const res = await axios.get(
        `http://localhost:7295/api/Account/GetAccountByEmployeeId/${dataEm?.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIDAcc(res?.data?.data?.id)
      setAcc(res?.data?.data)
    } catch (error) {
      console.log(error)
    }
  }
  ApiGetAccID()
},[dataEm])
useEffect(() => {
  const ApiGetAttendance = async () => {
    try {
      const res = await axios.get(
        `http://localhost:7295/api/Attendance/${idAcc}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Kiểm tra nếu res.data.data là mảng
      console.log(res.data.data)
      if (Array.isArray(res.data.data)) {
        const formattedData = res.data.data.map((item:any) => {
          const checkInDate = new Date(item.checkIn);
          const checkOutDate = new Date(item.checkOut);

          return {
            id: item.id,
            name: item.status === "present" ? "Attendance" : "Absent",
            timeStart: checkInDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            timeEnd: checkOutDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            day: checkInDate.getDate(),
            month: checkInDate.toLocaleString("default", { month: "long" }),
            year: checkInDate.getFullYear(),
            note: `Check-In: ${checkInDate.toLocaleTimeString()} | Check-Out: ${checkOutDate.toLocaleTimeString()} | Late: ${
              item.late === 1 ? "Yes" : "No"
            }`,
            late: item.late,
            status: item.status,
            face_id:item.account.face_id,
          };
        });

        setData(formattedData);
      } else {
        console.error("Data received from API is not an array:", res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (idAcc) {
    ApiGetAttendance();
  }
}, [idAcc]);
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
  const eventsForDay = Array.isArray(data)
    ? data.filter(
        (event) =>
          event.day === i &&
          parseInt(event.year) === selectedYear &&
          new Date(`${event.month} 1, ${event.year}`).getMonth() ===
            selectedMonth
      )
    : [];

  let status = "hoàn thành"; // Mặc định là hoàn thành
  if (eventsForDay.some((event) => event.late === 1)) {
    status = "muộn";
  } else if (eventsForDay.some((event) => event.status === 0)) {
    status = "đang làm việc";
  }
  else if(eventsForDay.some((event) => event.status === 2)){
    status = "xin nghỉ"
  }

  // Nếu không có sự kiện nào, gán status mặc định là "unknown"
  if (eventsForDay.length === 0) {
    status = "unknown";
  }

  days.push({
    day: i,
    isCurrentMonth: true,
    events: eventsForDay,
    status, // Trạng thái ngày
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
  const eventsForDay = data.filter(
    (event:any) =>
      event.day === day &&
      parseInt(event.year) === selectedYear &&
      new Date(`${event.month} 1, ${event.year}`).getMonth() === selectedMonth
  );
  setSelectedEvents(eventsForDay);
};


    return (
        <Modal
        open={open}
        onCancel={() => setOpen(false)}
        width={700}
        closable={false}
        cancelButtonProps={{ style: { display: "none" } }}
        okButtonProps={{ style: { display: "none" } }}
      >
        <div className={styles.bodyWorkshedule}>
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
                      ? `${styles.currentMonthDay} ${
                          styles[dayObj.status?.replace(/ /g, "-") || "unknown"]
                        }`
                      : styles.otherMonthDay
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
                  <div className={styles.dayNumber}>{dayObj.day}</div>
                  {dayObj.isCurrentMonth && dayObj.events.length > 0 && (
                    <div className={styles.eventList}>
                      <div className={styles.eventStatus}>
                        {dayObj.status === "muộn"
                          ? "Muộn"
                          : dayObj.status === "đang làm việc"
                          ? "Đang làm việc"
                          : dayObj.status === "hoàn thành"
                          ? "Hoàn thành"
                          : dayObj.status === "xin nghỉ"
                          ? "Xin Nghỉ"
                          : "Không có sự kiện"}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {selectedDay !== null && selectedEvents.length > 0 && (
              <div className={styles.eventDetails}>
                <h1 className={styles.titleEvents}>Details for Selected Day</h1>
                <ul>
                  {selectedEvents.map((event) => (
                    <div key={event.id} className={styles.eventsOnDay}>
                      <div>
                        <p className={styles.timeEventDay}>
                          {event.timeStart} - {event.timeEnd}
                        </p>
                        <p className={styles.noteEventDay}>
                          Note: {event.note}
                        </p>
                        <p className={styles.dateEventDay}>
                          Date: {event.day} {event.month} {event.year}
                        </p>
                      </div>
                    </div>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      </Modal>
      
    );
}