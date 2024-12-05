"use client";
import styles from "./timekeeping.module.css";
import SideBar from "../SideBar/sideBar";
import React, { useState, useRef, useEffect } from "react";
import { Timekeeping } from "@/components/icon/icon";

export default function TimeKeeping() {
  const [user, setUser] = useState<any>({});
  const [userRoleP, setUserRoleP] = useState<any>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isLoadingCamera, setIsLoadingCamera] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  console.log(previewImage);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Khi isCameraActive thay đổi, nếu true và stream tồn tại, gán vào videoRef
  useEffect(() => {
    if (isCameraActive && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch((err) => {
        console.error("Error playing video:", err);
      });
    }
  }, [isCameraActive, stream]);

  const handleCameraAccess = async () => {
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

  const handleCloseModal = () => {
    setIsCameraActive(false);
    if (videoRef.current && videoRef.current.srcObject) {
      const currentStream = videoRef.current.srcObject as MediaStream;
      currentStream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setStream(null);
  };

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
        handleCloseModal();
      }
    }
  };

  const handleOkClick = () => {
    if (previewImage) {
      alert("Image has been submitted!");
      console.log("Sending image:", previewImage);
    }
  };

  return (
    <div className={styles.bodyTimekeep}>
      <SideBar setUser={setUser} setUserRoleP={setUserRoleP} />
      <div style={{ width: "18%" }}></div>

      <div className={styles.right}>
        <h2 className={styles.title}>Face Recognition Timekeeping</h2>
        <div className={styles.imagePreview}>
          {previewImage ? (
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

        {!isCameraActive && !previewImage && (
          <div className={styles.uploadContainer}>
            <button
              className={styles.uploadButton}
              onClick={handleCameraAccess}
              disabled={isLoadingCamera}
            >
              {isLoadingCamera ? "Opening Camera..." : "Open Camera"}
            </button>
          </div>
        )}
      </div>

      {isCameraActive && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <video ref={videoRef} className={styles.videoPreview}></video>
            <button className={styles.captureButton} onClick={handleCapture}>
              Capture
            </button>
            <button className={styles.closeButton} onClick={handleCloseModal}>
              Close
            </button>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className={styles.hiddenCanvas}></canvas>
    </div>
  );
}
