"use client";
import axios from "axios";
import styles from "./creat.module.css";
import { useState } from "react";

interface ModalAddAssetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Create({
  isOpen,
  onClose,
}: ModalAddAssetProps) {
  const [formData, setFormData] = useState({
    name: "",
    quantiy: 0,
    imageUrl: "",
    price: 0,
    description: "",
  });
  console.log(formData)
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const [imageUrl, setImageUrl] = useState<any>(null)
  const token = localStorage.getItem("authToken");
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formDataImage = new FormData();
      formDataImage.append("file", file);

      try {
        const res = await axios.post(
          "http://localhost:7295/api/FileUpload/upload",
          formDataImage,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const uploadedUrl = res.data.url; 
        setFormData((prev) => ({
          ...prev,
          imageUrl: uploadedUrl, 
        }));
      } catch (error) {
        console.error("Failed to upload image:", error);
      }
    }
  };

  console.log(imageUrl)
  
  const handleSubmit = async() => {
    try{
        const res = await axios.post(
          "http://localhost:7295/api/Asset",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if(res.status == 200){
            window.location.reload()
        }
    }
    catch(error){
        console.log(error)
        alert("Creat Error")
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <h2 className={styles.title}>Add Product</h2>
        <div className={styles.formGroup}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Quantity</label>
          <input
            type="number"
            name="quantiy"
            value={formData.quantiy}
            onChange={handleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Image</label>
          <input
            type="file"
            name="imageUrl"
            accept="image/*"
            onChange={handleFileChange}
          />
          {formData.imageUrl && (
            <img
              src={formData.imageUrl}
              alt="Preview"
              className={styles.imagePreview}
            />
          )}
        </div>
        <div className={styles.formGroup}>
          <label>Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className={styles.textarea}
          ></textarea>
        </div>
        <div className={styles.actions}>
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
