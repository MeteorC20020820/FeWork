"use client";
import styles from "./timekeeping.module.css";
import SideBar from "../SideBar/sideBar";
import React, { useState, useRef } from "react";
import { Timekeeping } from "@/components/icon/icon";

export default function TimeKeeping() {
  const [user, setUser] = useState<any>({});
  const [userRoleP, setUserRoleP] = useState<any>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false); // Quản lý trạng thái camera
  const videoRef = useRef<HTMLVideoElement | null>(null); // Tham chiếu đến thẻ video
  const canvasRef = useRef<HTMLCanvasElement | null>(null); // Tham chiếu đến thẻ canvas

  // Kích hoạt camera
  const handleCameraAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Unable to access the camera. Please check your permissions.");
    }
  };


  // Xử lý chụp ảnh
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
        setPreviewImage(imageData);
        setIsCameraActive(false); // Tắt camera sau khi chụp
        videoRef.current.srcObject = null; // Dừng stream
      }
    }
  };

  // Gửi ảnh đã chụp
  const handleOkClick = () => {
    if (previewImage) {
      alert("Image has been submitted!");
      // Xử lý gửi ảnh đến server tại đây
      console.log("Sending image:", previewImage);
    }
  };

  return (
    <div className={styles.bodyTimekeep}>
      {/* Sidebar */}
      <SideBar setUser={setUser} setUserRoleP={setUserRoleP} />
      <div style={{ width: "18%" }}></div>

      {/* Phần giao diện bên phải */}
      <div className={styles.right}>
        <h2 className={styles.title}>Face Recognition Timekeeping</h2>
        <div className={styles.imagePreview}>
          {/* Hiển thị camera hoặc ảnh đã chụp */}
          {isCameraActive ? (
            <>
              <video ref={videoRef} className={styles.videoPreview} />
              <button className={styles.captureButton} onClick={handleCapture}>
                Capture
              </button>
            </>
          ) : previewImage ? (
            <>
              <img
                src={previewImage}
                alt="Captured"
                className={styles.previewImg}
              />
              <button className={styles.okButton} onClick={handleOkClick}>
                OK
              </button>
            </>
          ) : (
            <Timekeeping
              className={styles.iconTimekeeping}
              color="black"
              width="250px"
              height="250px"
            />
          )}
        </div>

        {/* Nút kích hoạt camera */}
        {!isCameraActive && !previewImage && (
          <div className={styles.uploadContainer}>
            <button
              className={styles.uploadButton}
              onClick={handleCameraAccess}
            >
              Open Camera
            </button>
          </div>
        )}
      </div>

      {/* Canvas ẩn để chụp ảnh */}
      <canvas ref={canvasRef} className={styles.hiddenCanvas}></canvas>
    </div>
  );
}
