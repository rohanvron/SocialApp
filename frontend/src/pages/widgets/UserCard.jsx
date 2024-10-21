import { ManageAccountsOutlined, EmailOutlined } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const UserCard = ({ userId, picturePath }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const mode = useSelector((state) => state.mode);

  const getUser = async () => {
    const response = await fetch(`https://social-app-one-rho.vercel.app/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
  }

  const { firstName, lastName, email, friends } = user;

  return (
    <div className={`${mode === 'light' ? 'bg-white text-gray-800' : 'bg-gray-800 text-white'} rounded-lg shadow-md p-6`}>
      <div className="flex items-center justify-between cursor-pointer" onClick={() => navigate(`/profile/${userId}`)}>
        <div className="flex items-center space-x-4">
          <img
            src={picturePath}
            alt={`${firstName} ${lastName}`}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h2 className="text-xl font-semibold hover:text-primary-500">
              {firstName} {lastName}
            </h2>
            <p className={`${mode === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
              {friends.length} friends
            </p>
          </div>
        </div>
        <ManageAccountsOutlined className={`${mode === 'light' ? 'text-gray-400' : 'text-gray-500'} hover:text-primary-500`} />
      </div>
      <div className={`my-4 border-t ${mode === 'light' ? 'border-gray-200' : 'border-gray-700'}`}></div>
      <div className="flex items-center space-x-2">
        <EmailOutlined className={`${mode === 'light' ? 'text-gray-400' : 'text-gray-500'}`} />
        <span className={`${mode === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>{email}</span>
      </div>
    </div>
  );
};

UserCard.propTypes = {
  userId: PropTypes.string.isRequired,
  picturePath: PropTypes.string.isRequired,
};

export default UserCard;