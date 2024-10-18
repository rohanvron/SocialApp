import { createSlice } from "@reduxjs/toolkit";

// setting up the initial state
const initialState = {
  mode: "light",
  user: null,
  token: null,
  posts: [],
};

// creating the slice
export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setMode: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light";
        },

        setLogin: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },

        setLogout: (state) => {
            state.user = null;
            state.token = null;
        },

        setFriends: (state, action) => {
            if (state.user) {
                state.user.friends = action.payload.friends;
            } else {
                console.error("user friends non-existent :(");
            }
        },

        setPosts: (state, action) => {
            state.posts = action.payload.posts;
        },

        setPost: (state, action) => {
            if (action.payload.post === null) {
                // Remove the post
                state.posts = state.posts.filter(post => post._id !== action.payload.postId);
            } else {
                // Update or add the post
                const updatedPosts = state.posts.map(post =>
                    post._id === action.payload.post._id ? action.payload.post : post
                );
                if (!updatedPosts.find(post => post._id === action.payload.post._id)) {
                    updatedPosts.push(action.payload.post);
                }
                state.posts = updatedPosts;
            }
        },

        editPost: (state, action) => {
            const { postId, updatedPost } = action.payload;
            state.posts = state.posts.map(post =>
                post._id === postId ? { ...post, ...updatedPost } : post
            );
        },

        deletePost: (state, action) => {
            state.posts = state.posts.filter(post => post._id !== action.payload);
        },
    }
});

export const { 
    setMode, 
    setLogin, 
    setLogout, 
    setFriends, 
    setPosts, 
    setPost,
    editPost,
    deletePost
} = authSlice.actions;
export default authSlice.reducer;