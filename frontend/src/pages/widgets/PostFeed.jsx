import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../state/authSlice";
import Posts from "./Posts";
import PropTypes from "prop-types";

const PostFeed = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  // fetch posts
  const getPosts = async () => {
    const response = await fetch("http://localhost:5000/posts", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

  // fetch user posts
  const getUserPosts = async () => {
    const response = await fetch(
      `http://localhost:5000/posts/${userId}/posts`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

  useEffect(() => {
    const fetchData = () => {
      if (isProfile) {
        getUserPosts();
      } else {
        getPosts();
      }
    };

    // Initial fetch
    fetchData();

    // polling every 5 sec
    const interval = setInterval(() => {
      fetchData();
    }, 5000); // Poll every 5 sec

    // Cleanup component unmount
    return () => clearInterval(interval);
  }, [isProfile, token, userId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-4">
      {posts.slice().reverse().map(
        ({
          _id,
          userId,
          firstName,
          lastName,
          title,
          description,
          location,
          picturePath,
          userPicturePath,
          likes,
          createdAt,
        }) => (
          <Posts
            key={_id}
            postId={_id}
            postUserId={userId}
            name={`${firstName} ${lastName}`}
            title={title}
            description={description}
            location={location}
            picturePath={picturePath}
            userPicturePath={userPicturePath}
            likes={likes}
            createdAt={createdAt}
          />
        )
      )}
    </div>
  );
};

PostFeed.propTypes = {
  userId: PropTypes.string,
  isProfile: PropTypes.bool,
};

export default PostFeed;