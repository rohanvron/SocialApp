import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../navbar/Navbar";
import PostFeed from "../widgets/PostFeed";
import UserCard from "../widgets/UserCard";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  
  const getUser = async () => {
    const response = await fetch(`http://localhost:5000/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) return null;

  return (
    <Box>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full lg:w-1/4 px-4 mb-8 lg:mb-0">
            <UserCard userId={userId} picturePath={user.picturePath} />
          </div>
          <div className="w-full lg:w-1/2 px-4 mb-8 lg:mb-0">
              <PostFeed userId={userId} isProfile/>
          </div>
        </div>
      </div>
    </Box>
  )
}

export default ProfilePage