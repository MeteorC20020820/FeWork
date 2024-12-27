"use client";
import axios from "axios";
import styles from "./creat.module.css";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
interface ModalAddAssetProps {
  isOpen: boolean;
  onClose: () => void;
  onAssetCreated: () => void;
}

export default function Create({ isOpen, onClose,onAssetCreated }: ModalAddAssetProps) {
  const [formData, setFormData] = useState({
    name: "",
    quantiy: 0,
    imageUrl: "",
    price: 0,
    description: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    quantiy: "",
    imageUrl: "",
    price: "",
    description: "",
  });
  const router = useRouter();
  const [loading, setLoading] = useState(false);
   const handleNavigation = (path: string) => {
     setLoading(true); // Bật loading khi bắt đầu điều hướng
     router.push(path);
     setTimeout(() => setLoading(false), 1000); // Tắt loading sau khi điều hướng (hoặc xử lý tại sự kiện onRouteChangeComplete)
   };
  const token = localStorage.getItem("authToken");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error when typing
  };

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
        setErrors((prev) => ({ ...prev, imageUrl: "" })); // Clear image error
      } catch (error) {
        console.error("Failed to upload image:", error);
      }
    }
  };

  const validateFormData = () => {
    const newErrors: any = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    }

    if (!formData.quantiy || formData.quantiy <= 0) {
      newErrors.quantiy = "Quantity must be greater than 0.";
    }

    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateFormData()) {
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:7295/api/Asset",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status == 200) {
        onAssetCreated();
        alert("Create asset success");
        setFormData({
          name: "",
          quantiy: 0,
          imageUrl: "",
          price: 0,
          description: "",
        });
        onClose(); 
      }
    } catch (error) {
      console.log(error);
      alert("Create Error");
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
          {errors.name && <p className={styles.error}>{errors.name}</p>}
        </div>
        <div className={styles.formGroup}>
          <label>Quantity</label>
          <input
            type="number"
            name="quantiy"
            value={formData.quantiy}
            onChange={handleChange}
          />
          {errors.quantiy && <p className={styles.error}>{errors.quantiy}</p>}
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
          {errors.imageUrl && <p className={styles.error}>{errors.imageUrl}</p>}
        </div>
        <div className={styles.formGroup}>
          <label>Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
          {errors.price && <p className={styles.error}>{errors.price}</p>}
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
          {errors.description && (
            <p className={styles.error}>{errors.description}</p>
          )}
        </div>
        <div className={styles.actions}>
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loader}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}
    </div>
  );
}
