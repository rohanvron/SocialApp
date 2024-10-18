import { useSelector } from "react-redux";
import Navbar from "../navbar/Navbar";
import UserCard from "../widgets/UserCard";
import MyPost from "../widgets/MyPost";
import PostFeed from "../widgets/PostFeed";
import FriendList from "../widgets/FriendList";

const HomePage = () => {
  const { _id, picturePath } = useSelector((state) => state.user);
  const mode = useSelector((state) => state.mode);

  return (
    <div className={`min-h-screen ${mode === 'light' ? 'bg-gray-100' : 'bg-gray-900'}`}>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full lg:w-1/4 px-4 mb-8 lg:mb-0">
            <UserCard userId={_id} picturePath={picturePath} />
          </div>
          <div className="w-full lg:w-1/2 px-4 mb-8 lg:mb-0">
            <MyPost />
              
              <PostFeed />
              
          </div>
          <div className="w-full lg:w-1/4 px-4">
            <FriendList userId={_id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;