"use client";
import React, { useEffect, useState } from "react";
import styles from "./forum.module.css";
import SideBar from "../SideBar/sideBar";
import axios from "axios";
import CommentSection from "./CommentSection";
import { SendX, Delete, Edit } from "@/components/icon/icon";
import DeleteP from "./Delete/delete";
import Success from "../Alert/Success/success";
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
  const [modalDelete, setModalDelete] = useState(false)
  const [post, setPost] = useState<any>(null)
  console.log(editPost)
  const [imageLink, setImageLink] = useState<any>(null)
  const [check, setCheck] = useState(false)
  const [message, setMessage] = useState<any>('')
  // Fetch user account
  useEffect(() => {
    const getApiAcc = async () => {
      try {
        const res = await axios.get(
          `http://localhost:7295/api/Account/GetAccountByEmployeeId/${user.id}`,
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
  // Fetch all posts
  useEffect(() => {
    ApiGetPost();
  }, [token]);
  const resetPost= () =>{
    ApiGetPost();
  }
  useEffect(() => {
    const handleFile = async () => {
      if (!image) return; // Nếu không có file, không thực hiện gì
      const formData = new FormData();
      formData.append("file", image);

      try {
        const res = await axios.post(
          "http://localhost:7295/api/FileUpload/upload",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data", // Đảm bảo định dạng đúng
            },
          }
        );
        console.log(res.data.url);
        setImageLink(res.data.url)
      } catch (error) {
        console.log(error);
      }
    };

    handleFile();
  }, [image]);

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
          imageUrl: imageLink,
          status: 0,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        setCheck(true)
        setMessage('Create post successfully!')
        setPosts([...posts, res.data.data]);
        resetPost()
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
    console.log(editPost)
    try {
      const updatedData = {
        content: postContent,
        imageUrl: imageLink,
      };
      console.log(updatedData)
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
        setCheck(true)
        setMessage('Update post successfully!')
        setPosts(
          posts.map((post) =>
            post.id === editPost.id ? { ...post, ...updatedData } : post
          )
        );
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
        setCheck(true)
        setMessage('Delete post successfully!')
        setPosts(posts.filter((post) => post.id !== postId));
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
    setPreview(post.imageUrl ? `${post.imageUrl}` : null);
    setIsModalOpen(true);
  };
  console.log(imageLink)
  return (
    <div className={styles.bodyForum}>
      <SideBar setUser={setUser} setUserRoleP={setUserRoleP} />
      <div style={{ width: "18%" }}></div>

      <div className={styles.right}>
        <div className={styles.header}>
          <p className={styles.titleHeader}>Forum</p>
        </div>
        <div style={{padding:'5px 20px'}}>
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
                src={`${acc.avatarUrl}`}
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
        </div>
        <div
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <div className={styles.postList}>
            {posts.length > 0 ? (
              [...posts].reverse().map((post) => (
                <div className={styles.post} key={post?.id}>
                  <div className={styles.postHeader}>
                    <img
                      src={`${post?.avatarUrl}`}
                      alt="Avatar"
                      className={styles.avatar}
                    />
                    <div className={styles.postInfo}>
                      <p className={styles.userName}>{post?.fullName}</p>
                      <span className={styles.timestamp}>
                        {new Date(post?.createdAt).toLocaleString()}
                      </span>
                    </div>
                    {(post?.accountId === acc?.id || userRoleP ==='1') && (
                      <div className={styles.options}>
                        <button className={styles.optionButton}>⋮</button>
                        <div className={styles.dropdown}>
                          {(post?.accountId === acc?.id ) &&(
                            <button
                            className={styles.dropdownItem}
                            onClick={() => handleEdit(post)}
                          >
                            <Edit color={"#c5ab01"} width={20} height={20}/>
                          </button>
                          )}
                          <button
                            className={styles.dropdownItem}
                            onClick={() => {setModalDelete(true), setPost(post)}}
                          >
                            <Delete color={"red"} width={20} height={20}/>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className={styles.postContent}>
                    <p>{post?.content}</p>
                    <div style={{display:'flex', justifyContent:'center'}}>
                      {post?.imageUrl && (
                        <img
                          src={`${post?.imageUrl}`}
                          alt="Post"
                          className={styles.postImage}
                        />
                      )}
                    </div>
                  </div>
                  <CommentSection postId={post?.id} acc={post} acc2={acc} role={userRoleP}/>
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
      {DeleteP(modalDelete, setModalDelete,"Post",handleDelete,post)}
      <Success success ={check} setSuccess={setCheck} message={message}/>
    </div>
  );
}
