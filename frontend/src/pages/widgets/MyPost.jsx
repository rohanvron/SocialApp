import { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useDropzone } from "react-dropzone";
import { Image, Send, Delete } from "@mui/icons-material";

const MyPost = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { _id, picturePath, firstName, lastName } = useSelector(
    (state) => state.user
  );
  const token = useSelector((state) => state.token);
  const mode = useSelector((state) => state.mode);

  const onDrop = useCallback((acceptedFiles) => {
    setImage(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    onDrop,
  });

  const handlePost = async () => {
    if (!isValidPost()) return;
    
    setLoading(true);
    const formData = new FormData();
    formData.append("userId", _id);
    formData.append("title", title);
    formData.append("description", description);
    if (image) {
      formData.append("picture", image);
    }

    try {
      const response = await fetch("http://localhost:5000/posts", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        setTitle("");
        setDescription("");
        setImage(null);
        
      } else {
        console.error("Failed to create post");
        
      }
    } catch (error) {
      console.error("Error creating post:", error);
      
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = () => {
    setImage(null);
  };

  const isValidPost = () => {
    return title.trim() !== "" || image !== null;
  };

  return (
    <div
      className={`${
        mode === "light" ? "bg-white text-gray-800" : "bg-gray-800 text-white"
      } rounded-lg shadow-md p-4 mb-6 relative`}
    >
      <div className="flex items-start space-x-4">
        <img
          src={picturePath}
          alt={`${firstName} ${lastName}`}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-grow space-y-4">
          <input
            type="text"
            placeholder="What's on your mind?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full p-2 rounded-md ${
              mode === "light" ? "bg-gray-100" : "bg-gray-700"
            }`}
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`w-full p-2 rounded-md ${
              mode === "light" ? "bg-gray-100" : "bg-gray-700"
            }`}
            rows="2"
          />
          <div className="flex items-center space-x-4">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed p-2 rounded-md text-center cursor-pointer ${
                mode === "light" ? "border-gray-300" : "border-gray-600"
              }`}
            >
              <input {...getInputProps()} />
              <Image className="mx-auto" />
            </div>
            {image && (
              <div className="relative">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={handleDeleteImage}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition duration-300"
                >
                  <Delete className="h-4 w-4" />
                </button>
              </div>
            )}
            <button
              onClick={handlePost}
              disabled={loading || !isValidPost()}
              className={`absolute bottom-4 right-4 px-4 py-2 rounded-md 
                transition duration-300 flex items-center border-2
                text-md font-semibold ${
                  isValidPost()
                    ? "bg-primary-500 hover:bg-primary-600 border-primary-300 hover:border-primary-400"
                    : "bg-gray-300 border-gray-400 cursor-not-allowed"
                }`}
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPost;