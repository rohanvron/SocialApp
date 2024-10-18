import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "../state/authSlice";
import { UserPlus, UserMinus } from "lucide-react";
import PropType from "prop-types";

const Friend = ({ friendId, name, subtitle, userPicturePath }) => {
  const dispatch = useDispatch();
  const loggedInUserId = useSelector((state) => state.user._id);
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);
  const mode = useSelector((state) => state.mode);

  const isFriend = friends.find((friend) => friend._id === friendId);

  const patchFriend = async () => {
    const response = await fetch(
      `http://localhost:5000/users/${loggedInUserId}/${friendId}`,
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
    <div className="flex items-center space-x-2">
      <div className="flex items-center">
        <img
          src={userPicturePath}
          alt={name}
          className="w-10 h-10 rounded-full mr-2"
        />
        <div>
          <p className="font-bold">{name}</p>
          <p className={`text-sm ${mode === "light" ? "text-gray-600" : "text-gray-300"}`}>{subtitle}</p>
        </div>
      </div>
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
    </div>
  );
};

Friend.propTypes = {
  friendId: PropType.string.isRequired,
  name: PropType.string.isRequired,
  subtitle: PropType.string.isRequired,
  userPicturePath: PropType.string.isRequired,
};

export default Friend;