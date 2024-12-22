'use client'
import SideBar from "../SideBar/sideBar";
import { useState, useRef, useEffect } from "react";
import styles from './workshedule.module.css'
import { IconNextMonth, IconPrevMonth } from "@/components/icon/icon";
import axios from "axios";
const apiAi = "https://b20dccn460.serveo.net/api/v1/";
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
export default function Workshedule(){
const [user, setUser] = useState<any>({});
const token = localStorage?.getItem("authToken");
const [idAcc, setIDAcc] = useState<any>(null)
const [data, setData] = useState<any>({})

useEffect(() =>{
  const ApiGetAccID = async() =>{
    try {
      const res = await axios.get(
        `http://localhost:7295/api/Account/${user?.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIDAcc(res?.data?.data?.id)
    } catch (error) {
      console.log(error)
    }
  }
  ApiGetAccID()
},[user])
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


console.log(data)
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

const [checkedOutEvents, setCheckedOutEvents] = useState<number[]>([]);
const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
    const [isLoadingCamera, setIsLoadingCamera] = useState(false);
const handleCheckOut = async(eventId: number) => {
  setCheckedOutEvents((prev) => [...prev, eventId]);
  console.log("Attempting to access camera...");
  setIsLoadingCamera(true);
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error("Browser does not support getUserMedia.");
    }

    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    console.log("Camera stream obtained:", mediaStream);
    setStream(mediaStream);
    setIsCameraActive(true);
    console.log("Camera is active");
  } catch (err) {
    console.error("Error accessing camera:", err);
  } finally {
    setIsLoadingCamera(false);
  }
};


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
 const [imageFile, setImageFile] = useState<File | null>(null);
useEffect(() => {
    if (imageFile) {
      apiUrlImage();
    }
  }, [imageFile]);
  const handleCloseModal = () => {
    setIsCameraActive(false);
    if (videoRef.current && videoRef.current.srcObject) {
      const currentStream = videoRef.current.srcObject as MediaStream;
      currentStream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setStream(null);
  };
const apiUrlImage = async () => {
  if (!imageFile) return;
  const formData = new FormData();
  formData.append("file", imageFile);
  try {
    const res = await axios.post(`${apiAi}check-in`, formData);
    console.log(res);
    if (res.data.statusCode == 200) {
      const checkIn = await axios.post(
        `http://localhost:7295/api/Attendance/check-in/${idAcc}`
      );
      if (checkIn.data.statusCode == 200) {
        alert("ok");
      }
    }
  } catch (error) {
    console.log(error);
  }
};
useEffect(() => {
    if (isCameraActive && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch((err) => {
        console.error("Error playing video:", err);
      });
    }
  }, [isCameraActive, stream]);
const handleCapture = () => {
  if (videoRef.current && canvasRef.current) {
    const context = canvasRef.current.getContext("2d");
    if (context) {
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(
        videoRef.current,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      const imageData = canvasRef.current.toDataURL("image/png");
      // Convert base64 to Blob
      const byteString = atob(imageData.split(",")[1]); // Decode base64
      const mimeString = imageData.split(",")[0].split(":")[1].split(";")[0]; // Get MIME type
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });

      // Convert Blob to File
      const file = new File([blob], "captured_image.png", {
        type: mimeString,
      });
      setImageFile(file);
    }
  }
  apiUrlImage();
};
    return (
      <div className={styles.bodyWorkshedule}>
        <SideBar setUser={setUser} setUserRoleP={setUserRoleP} />
        <div style={{ width: "18%" }}></div>
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
                        <h3 className={styles.titleEventDay}>{event.name}</h3>
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
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "end",
                        }}
                      >
                        {event.status === 0 &&
                        !checkedOutEvents.includes(event.id) ? (
                          <button
                            className={styles.checkOutButton}
                            onClick={() => handleCheckOut(event.id)}
                          >
                            Check Out
                          </button>
                        ) : event.status === 0 &&
                          checkedOutEvents.includes(event.id) ? (
                          <p className={styles.checkedOutMessage}>
                            Checked Out
                          </p>
                        ) : null}
                        {isCameraActive && (
                          <div className={styles.modal}>
                            <div className={styles.modalContent}>
                              <video
                                ref={videoRef}
                                className={styles.videoPreview}
                              ></video>
                              <button
                                className={styles.captureButton}
                                onClick={handleCapture}
                              >
                                Capture
                              </button>
                              <button
                                className={styles.closeButton}
                                onClick={handleCloseModal}
                              >
                                Close
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
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