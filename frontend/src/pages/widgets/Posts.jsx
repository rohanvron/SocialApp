import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost, setFriends } from "../../state/authSlice";
import PropTypes from "prop-types";
import { PencilIcon, TrashIcon, UserPlus, UserMinus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

// props
const Posts = ({
  postId,
  postUserId,
  title,
  description,
  picturePath,
  userPicturePath,
  likes,
  createdAt,

}) => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  const mode = useSelector((state) => state.mode);
  const friends = useSelector((state) => state.user.friends);
  const navigate = useNavigate();

  // fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(
        `http://localhost:5000/users/${postUserId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        console.error("Failed to fetch user data");
      }
    };
    fetchUser();
  }, [postUserId, token]);

  // likes
  const patchLike = async () => {
    const response = await fetch(`http://localhost:5000/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  // edit post
  const handleEdit = async () => {
    console.log("Attempting to edit post with ID:", postId);
    try {
      const response = await fetch(`http://localhost:5000/posts/${postId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: editTitle, description: editDescription }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error updating post:", response.status, errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const updatedPostData = await response.json();
      dispatch(setPost({ post: updatedPostData }));
      setIsEditing(false);
      console.log("Post updated successfully:", updatedPostData);
    } catch (error) {
      console.error("Failed to update post:", error);
    }
  };
  
  // delete post
  const handleDelete = async () => {
    console.log("Attempting to delete post with ID:", postId);
    try {
      const response = await fetch(`http://localhost:5000/posts/${postId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error deleting post:", response.status, errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // removes the deleted post from the Redux store
      dispatch(setPost({ post: null, postId }));
      console.log("Post deleted successfully");
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  // cancel edit
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle(title);
    setEditDescription(description);
  };

  // add friend
  const patchFriend = async () => {
    const response = await fetch(
      `http://localhost:5000/users/${loggedInUserId}/${postUserId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    dispatch(setFriends({ friends: data }));
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const { firstName, lastName } = user;
  const isFriend = friends.find((friend) => friend._id === postUserId);

  return (
    <div
      className={`${
        mode === "light" ? "bg-white text-gray-800" : "bg-gray-800 text-white"
      } rounded-lg shadow-md p-4 mb-4`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <img
            src={userPicturePath}
            alt={`${firstName} ${lastName}`}
            className="w-10 h-10 rounded-full mr-2"
          />
          
          <span className="font-bold cursor-pointer hover:text-blue-500"
          onClick={() => navigate(`/profile/${postUserId}`)}
          >
          {`${firstName} ${lastName}`} - </span> 

          <p className="text-sm text-gray-500 ml-2">
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </p>

        </div>
        {loggedInUserId !== postUserId && (
          <button
            onClick={patchFriend}
            className={`p-1 rounded-full ${
              mode === "light"
                ? "bg-gray-200 hover:bg-gray-300"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {isFriend ? (
              <UserMinus className="w-5 h-5 text-red-500" />
            ) : (
              <UserPlus className="w-5 h-5 text-green-500" />
            )}
          </button>
        )}
      </div>
      <hr className="my-2" />
      {isEditing ? (
        <div className="space-y-2">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className={`w-full p-2 rounded ${
              mode === "light" ? "bg-gray-100" : "bg-gray-700"
            }`}
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className={`w-full p-2 rounded ${
              mode === "light" ? "bg-gray-100" : "bg-gray-700"
            }`}
          />
          <div className="flex space-x-2">
            <button
              onClick={handleEdit}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save
            </button>
            <button
              onClick={handleCancelEdit}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <h4 className="font-semibold text-md my-4">{title}</h4>
          {picturePath && (
            <img
              src={picturePath}
              alt="post"
              className="w-full h-auto rounded-lg mt-2"
            />
          )}
          <p className="my-4">{description}</p>
        </>
      )}
      <hr className="my-2" />
      <div className="flex justify-between items-center mt-2">
        <div className="flex items-center space-x-2">
          <button onClick={patchLike} className="text-blue-500 text-lg">
            {isLiked ? "❤️" : "🤍"} {likeCount}
          </button>
          
        </div>
        {loggedInUserId === postUserId && (
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-blue-500 hover:text-blue-700"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handleDelete}
              className="text-red-500 hover:text-red-700"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    
    </div>
  );
};

Posts.propTypes = {
  postId: PropTypes.string.isRequired,
  postUserId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  picturePath: PropTypes.string,
  userPicturePath: PropTypes.string.isRequired,
  likes: PropTypes.object.isRequired,
  createdAt: PropTypes.string.isRequired,
};

export default Posts;