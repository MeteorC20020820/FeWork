"use client";

import axios from "axios";
import styles from "./edit.module.css";
import { useState, useEffect } from "react";

interface EditModalProps {
  modelEdit: boolean;
  setModelEdit: Function;
  dataAsset: {
    id: number;
    name: string;
    imageUrl: string;
    quantiy: number;
    price: number;
    description: string;
  };
  onAssetCreated: () => void;
}

export default function EditModal({
  modelEdit,
  setModelEdit,
  dataAsset,
  onAssetCreated,
}: EditModalProps) {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    imageUrl: "",
    quantiy: 0,
    price: 0, // Thêm trường price
    description: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    quantiy: "",
  });

  useEffect(() => {
    if (dataAsset) {
      setFormData({
        id: dataAsset.id.toString(),
        name: dataAsset.name,
        imageUrl: dataAsset.imageUrl,
        quantiy: dataAsset.quantiy,
        price: dataAsset.price,
        description: dataAsset.description,
      });
    }
  }, [dataAsset]);
  const handleChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({
        ...formData,
        [field]: e.target.value,
      });
    };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Khởi tạo object lỗi
    const newErrors = { name: "", quantiy: "" };

    // Validate trường name
    if (formData.name.trim() === "") {
      newErrors.name = "Name is required.";
    }

    // Validate trường quantiy
    if (formData.quantiy <= 0) {
      newErrors.quantiy = "Quantity must be greater than 0.";
    }

    // Cập nhật trạng thái lỗi
    setErrors(newErrors);

    // Nếu có lỗi, ngừng việc submit
    if (newErrors.name || newErrors.quantiy) return;

    try {
      const res = await axios.put(
        `http://localhost:7295/api/Asset/${formData.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        onAssetCreated();
        alert("Create asset success");
        setModelEdit(false);
      }
    } catch (error) {
      console.error("Error updating asset:", error);
    }

    setModelEdit(false);
  };

  if (!modelEdit) return null;

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalContent}>
        <button
          className={styles.closeButton}
          onClick={() => setModelEdit(false)}
        >
          ×
        </button>
        <h2 className={styles.modalTitle}>Edit Asset</h2>
        <form className={styles.modalForm} onSubmit={handleSubmit}>
          <label className={styles.label}>ID</label>
          <input
            type="text"
            value={formData.id}
            disabled
            className={styles.input}
          />

          <label className={styles.label}>Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={handleChange("name")}
            className={`${styles.input} ${
              errors.name ? styles.inputError : ""
            }`}
          />
          {errors.name && <span className={styles.error}>{errors.name}</span>}

          <label className={styles.label}>Image</label>
          <input
            type="file"
            onChange={handleFileChange}
            className={styles.fileInput}
          />
          {formData.imageUrl && (
            <img
              src={formData.imageUrl}
              alt="Preview"
              className={styles.imagePreview}
            />
          )}
          <label className={styles.label}>Quantity</label>
          <input
            type="number"
            value={formData.quantiy}
            onChange={handleChange("quantiy")}
            className={`${styles.input} ${
              errors.quantiy ? styles.inputError : ""
            }`}
          />
          {errors.quantiy && (
            <span className={styles.error}>{errors.quantiy}</span>
          )}

          <label className={styles.label}>Price</label>
          <input
            type="number"
            value={formData.price}
            onChange={handleChange("price")}
            className={styles.input}
          />
          <label className={styles.label}>Description</label>
          <textarea
            value={formData.description}
            onChange={handleChange("description")}
            className={styles.textarea}
          />

          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => setModelEdit(false)}
            >
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
