"use client";
import React, { useEffect, useState } from "react";
import styles from "./forum.module.css";
import SideBar from "../SideBar/sideBar";
import axios from "axios";
import CommentSection from "./CommentSection";

export default function Forum() {
  const [user, setUser] = useState<any>({});
  const [userRoleP, setUserRoleP] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [posts, setPosts] = useState<any>({})
  const [preview, setPreview] = useState<string | null>(null);
  const token = localStorage?.getItem("authToken");
  const [acc, setAcc] = useState<any>({})
  console.log(acc)
  console.log(user)
  console.log(token)
  useEffect(() =>{
    const getApiAcc = async() =>{
      try{
        const res = await axios.get(
          `http://localhost:7295/api/Account/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(res.data.data)
        setAcc(res.data.data)
      }
      catch(error){
        console.log(error)
      }
    }
    getApiAcc()
  }, [user])

  useEffect(() =>{
  })
  // Xử lý khi nhấn nút đăng bài
  const handlePost = async() => {
    try{
      const res = await axios.post(
        `http://localhost:7295/api/Post`,
        {
          content: postContent,
          imageUrl: image?.name,
          status: 0,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(res)
      if(res.status ==200){
         window.location.reload();
      }
    }
    catch(error){

    }
    if (postContent.trim() === "" && !image) {
      alert("Please write something or upload an image before posting!");
      return;
    }

    console.log("Post content:", postContent);
    if (image) {
      console.log("Image file:", image);
    }
    setPostContent("");
    setImage(null);
    setPreview(null);
    setIsModalOpen(false);
  };

  useEffect(() =>{
    const ApiGetPost = async() =>{
      try{
        const res = await axios.get("http://localhost:7295/api/Post", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(res)
        setPosts(res.data.data)
      }
      catch(error){
        console.log(error)
      }
    }
    ApiGetPost()
  },[])
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className={styles.bodyForum}>
      {/* Sidebar */}
      <SideBar setUser={setUser} setUserRoleP={setUserRoleP} />
      <div style={{ width: "18%" }}></div>

      {/* Giao diện đăng bài */}
      <div className={styles.right}>
        <div
          className={styles.inputContainer}
          onClick={() => setIsModalOpen(true)}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "10px",
            }}
          >
            <img
              src={`/${acc.avatarUrl}`}
              alt="Avatar"
              className={styles.avatar}
            />
            <p className={styles.name}>{user.fullName}</p>
          </div>
          <input
            className={styles.inputField}
            placeholder="What's on your mind?"
            readOnly
          />
          <div className={styles.actions}>
            <div className={styles.actionButton}>📸 Photo/Video</div>
            <div className={styles.actionButton}>😊 Feeling/Activity</div>
          </div>
        </div>
        <div
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <div className={styles.postList}>
            {posts.length > 0 ? (
              [...posts].reverse().map((post: any, index: number) => (
                <div key={index} className={styles.post}>
                  {/* Header */}
                  <div className={styles.postHeader}>
                    <img
                      src={`/${post.avatarUrl}`}
                      alt="Avatar"
                      className={styles.avatar}
                    />
                    <div className={styles.postInfo}>
                      <p className={styles.userName}>{post.fullName}</p>
                      <span className={styles.timestamp}>
                        {new Date(post.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className={styles.postContent}>
                    <p>{post.content}</p>
                    {post.imageUrl && (
                      <img
                        src={`/${post.imageUrl}`}
                        alt="Post"
                        className={styles.postImage}
                      />
                    )}
                  </div>

                  {/* Comment Section */}
                  <CommentSection postId={post.id} acc={post}  acc2 = {acc}/>
                </div>
              ))
            ) : (
              <p>No posts available</p>
            )}
          </div>
        </div>
      </div>
      {/* Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Create Post</h2>
              <button
                className={styles.closeButton}
                onClick={() => setIsModalOpen(false)}
              >
                ✖
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.userInfo}>
                <img
                  src="https://via.placeholder.com/40"
                  alt="Avatar"
                  className={styles.avatar}
                />
                <div>
                  <p className={styles.userName}>Your Name</p>
                  <select className={styles.privacyDropdown}>
                    <option value="public">🌐 Public</option>
                    <option value="friends">👥 Friends</option>
                    <option value="onlyme">🔒 Only Me</option>
                  </select>
                </div>
              </div>
              <textarea
                className={styles.textArea}
                rows={4}
                placeholder="What's on your mind?"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
              />
              {/* Hiển thị ảnh đã chọn */}
              {preview && (
                <div className={styles.imagePreview}>
                  <img
                    src={preview}
                    alt="Preview"
                    className={styles.previewImg}
                  />
                </div>
              )}
              <div className={styles.modalFooter}>
                <div className={styles.actionIcons}>
                  <label htmlFor="fileInput" className={styles.fileLabel}>
                    🖼️ Photo/Video
                  </label>
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    className={styles.fileInput}
                    onChange={handleImageChange}
                  />
                </div>
                <button className={styles.postButton} onClick={handlePost}>
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
