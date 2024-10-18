import User from "../models/user.model.js";

// getting user (read)
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// getting user friends
export const getUserFriends = async (req, res) => {
  try {
    // destructuring
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );

    // formatting friends data
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, picturePath }) => {
        return { _id, firstName, lastName, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// adding or removing a friend (update)
export const addRemoveFriend = async (req, res) => {
  try {
    // destructuring id and friendId from params
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    // checking if the user is already a friend
    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    // getting the updated list of friends
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, picturePath }) => {
        return { _id, firstName, lastName, picturePath };
      }
    );

    res.status(200).json(formattedFriends);

  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
