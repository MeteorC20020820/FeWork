import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./commentSection.module.css";

const CommentSection = ({ postId, acc,acc2 }: { postId: number; acc: any, acc2:any }) => {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    // Gọi API để lấy comment
    const fetchComments = async () => {
      try {
        const res = await axios.get(
          `http://localhost:7295/api/Comment/Post/${postId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(res.data)
        setComments(res.data.data); // Lưu danh sách comment vào state
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [postId, token]);

  // Xử lý thêm comment
  const handleAddComment = async () => {
    if (newComment.trim() === "") return;

    try {
      const res = await axios.post(
        "http://localhost:7295/api/Comment",
        {
          "postId": postId,
          "content": newComment,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Thêm comment mới vào danh sách hiện tại
      if(res.status == 200){
         window.location.reload();
      }
      setComments((prevComments) => [...prevComments, res.data]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };
  console.log(comments)
  return (
    <div className={styles.commentSection}>
      {/* Hiển thị danh sách comment */}
      <div className={styles.commentList}>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className={styles.comment}>
              <div style={{ display: "flex", gap: "5px" }}>
                <img
                  src={`/${comment.avatarUrl}`}
                  alt=""
                  className={styles.postAcc}
                />
                <div
                  style={{
                    padding: "3px 5px",
                    borderRadius: "6px",
                    backgroundColor: "#ccc",
                    width: "20%",
                  }}
                >
                  <p className={styles.author}>{comment.fullName}</p>
                  <p className={styles.content}>{comment.content}</p>
                </div>
              </div>
              <span className={styles.timestamp}>
                {new Date(comment.createdAt).toLocaleString()}
              </span>
            </div>
          ))
        ) : (
          <p></p>
        )}
      </div>

      {/* Ô nhập comment mới */}
      <div className={styles.addComment}>
        <img src={`/${acc2.avatarUrl}`} alt="" className={styles.postAcc} />
        <input
          type="text"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className={styles.commentInput}
        />
        <button onClick={handleAddComment} className={styles.commentButton}>
          Post
        </button>
      </div>
    </div>
  );

};

export default CommentSection;
