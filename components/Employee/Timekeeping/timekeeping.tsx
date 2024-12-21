"use client";
import styles from "./timekeeping.module.css";
import SideBar from "../SideBar/sideBar";
import React, { useState, useRef, useEffect } from "react";
import { Timekeeping } from "@/components/icon/icon";
import axios from "axios";
const apiAi = "https://b20dccn460.serveo.net/api/v1/";
export default function TimeKeeping() {
  const [user, setUser] = useState<any>({});
  const [userRoleP, setUserRoleP] = useState<any>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isLoadingCamera, setIsLoadingCamera] = useState(false);
  const token = localStorage?.getItem("authToken");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [acc, setAcc] = useState<any>(null)
  useEffect(()=>{
    const apiGetAcc = async() =>{
      try{
        const res = await axios.get(`http://localhost:7295/api/Account/${user?.id}`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setAcc(res.data.data)
      }
      catch(error){
        console.log(error)
      }
    }
    apiGetAcc()
  },[user])
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

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<any>(null)
  useEffect(() => {
    if (imageFile) {
      apiUrlImage();
    }
  }, [imageFile]);
  console.log(acc)
  const apiUrlImage = async() =>{
    if(!imageFile) return;
    const formData = new FormData();
    formData.append("file", imageFile)
    try {
      const res = await axios.post(`${apiAi}check-in`,formData);
      console.log(res)
      if(res.data.statusCode == 200){
        const checkIn = await axios.post(`http://localhost:7295/api/Attendance/check-in/${acc?.id}`)
        if(checkIn.data.statusCode == 200){
          alert('ok')
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

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
          <Timekeeping
            className={styles.iconTimekeeping}
            color="black"
            width="250px"
            height="250px"
          />
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
