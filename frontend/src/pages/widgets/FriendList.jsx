import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; 
import { setFriends } from "../../state/authSlice";
import { UserMinus } from "lucide-react";
import PropType from "prop-types";

const FriendList = ({ userId }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);
  const mode = useSelector((state) => state.mode);
  const navigate = useNavigate();

  const getFriends = async () => {
    const response = await fetch(
      `http://localhost:5000/users/${userId}/friends`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setFriends({ friends: data }));
  };

  useEffect(() => {
    getFriends();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const patchFriend = async (friendId) => {
    const response = await fetch(
      `http://localhost:5000/users/${userId}/${friendId}`,
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

  return (
    <div className={`${mode === "light" ? "bg-white" : "bg-gray-800"} rounded-lg shadow-md p-6`}>
      <h2 className={`text-2xl font-bold mb-4 ${mode === "light" ? "text-gray-800" : "text-white"}`}>Friend List</h2>
      <div className="space-y-4">
        {friends.map((friend) => (
          <div key={friend._id} className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={friend.picturePath}
                alt={`${friend.firstName} ${friend.lastName}`}
                className="w-10 h-10 rounded-full mr-2"
              />
              <div>
                <p className={`font-bold ${mode === "light" ? "text-gray-800" : "text-white"} cursor-pointer hover:text-blue-500`}
                  onClick={() => navigate(`/profile/${friend._id}`)}>
                  {`${friend.firstName} ${friend.lastName}`}
                  
                </p>
              </div>
            </div>
            <button
              onClick={() => patchFriend(friend._id)}
              className={`p-1 rounded-full ${
                mode === "light"
                  ? "bg-gray-200 hover:bg-gray-300"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              <UserMinus className="w-5 h-5 text-red-500" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

FriendList.propTypes = {
  userId: PropType.string.isRequired,
};

export default FriendList;