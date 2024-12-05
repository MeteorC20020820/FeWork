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
  const [posts, setPosts] = useState<any[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const token = localStorage?.getItem("authToken");
  const [acc, setAcc] = useState<any>({});
  const [editPost, setEditPost] = useState<any>(null);

  // Fetch user account
  useEffect(() => {
    const getApiAcc = async () => {
      try {
        const res = await axios.get(
          `http://localhost:7295/api/Account/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAcc(res.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    getApiAcc();
  }, [user, token]);

  // Fetch all posts
  useEffect(() => {
    const ApiGetPost = async () => {
      try {
        const res = await axios.get("http://localhost:7295/api/Post", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPosts(res.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    ApiGetPost();
  }, [token]);

  // Handle post creation
  const handlePost = async () => {
    if (postContent.trim() === "" && !image) {
      alert("Please write something or upload an image before posting!");
      return;
    }

    try {
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
        }
      );

      if (res.status === 200) {
        setPosts([...posts, res.data.data]);
        alert("Post created successfully!");
      }
    } catch (error) {
      console.error(error);
    } finally {
      resetModal();
    }
  };

  // Handle post update
  const handleUpdatePost = async () => {
    if (!editPost) {
      alert("No post selected for editing!");
      return;
    }

    try {
      const updatedData = {
        content: postContent,
        imageUrl: image?.name || editPost.imageUrl,
      };

      const res = await axios.put(
        `http://localhost:7295/api/Post/${editPost.id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        setPosts(
          posts.map((post) =>
            post.id === editPost.id ? { ...post, ...updatedData } : post
          )
        );
        alert("Post updated successfully!");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post!");
    } finally {
      resetModal();
    }
  };

  // Handle post deletion
  const handleDelete = async (postId: number) => {
    try {
      const res = await axios.delete(
        `http://localhost:7295/api/Post/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        setPosts(posts.filter((post) => post.id !== postId));
        alert("Post deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post!");
    }
  };

  // Reset modal state
  const resetModal = () => {
    setPostContent("");
    setImage(null);
    setPreview(null);
    setIsModalOpen(false);
    setEditPost(null);
  };

  // Handle image preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Handle edit
  const handleEdit = (post: any) => {
    setEditPost(post);
    setPostContent(post.content);
    setPreview(post.imageUrl ? `/${post.imageUrl}` : null);
    setIsModalOpen(true);
  };

  return (
    <div className={styles.bodyForum}>
      <SideBar setUser={setUser} setUserRoleP={setUserRoleP} />
      <div style={{ width: "18%" }}></div>

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
        </div>
        <div
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <div className={styles.postList}>
            {posts.length > 0 ? (
              [...posts].reverse().map((post) => (
                <div className={styles.post} key={post.id}>
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
                    {post.accountId === acc.id && (
                      <div className={styles.options}>
                        <button className={styles.optionButton}>⋮</button>
                        <div className={styles.dropdown}>
                          <button
                            className={styles.dropdownItem}
                            onClick={() => handleEdit(post)}
                          >
                            Edit
                          </button>
                          <button
                            className={styles.dropdownItem}
                            onClick={() => handleDelete(post.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
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
                  <CommentSection postId={post.id} acc={post} acc2={acc} />
                </div>
              ))
            ) : (
              <p>No posts available</p>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>{editPost ? "Edit Post" : "Create Post"}</h2>
              <button className={styles.closeButton} onClick={resetModal}>
                ✖
              </button>
            </div>
            <div className={styles.modalBody}>
              <textarea
                className={styles.textArea}
                rows={4}
                placeholder="What's on your mind?"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
              />
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
                <button
                  className={styles.postButton}
                  onClick={editPost ? handleUpdatePost : handlePost}
                >
                  {editPost ? "Update Post" : "Post"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
