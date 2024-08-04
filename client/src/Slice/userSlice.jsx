import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    error: "",
    loading: false,
    notification: false,
  },
  reducers: {
    signInSuccess: (state, actions) => {
      (state.currentUser = actions.payload),
        (state.error = ""),
        (state.loading = false);
    },
    signOut: (state) => {
      (state.currentUser = null), (state.error = ""), (state.loading = false);
    },
    updateUser: (state, action) => {
      
      state.currentUser = {
        ...state.currentUser,
        username: action.payload.username,
        bio: action.payload.bio,
        profile: action.payload.profile,
      };
    },
    updateFollow: (state, action) => {
      state.currentUser = {
        ...state.currentUser,
        followings: action.payload.followings,
      };
    },

    updateNoti: (state, action) => {
      //console.log(action.payload)
      state.currentUser = {
        ...state.currentUser,
        notifications: [...state.currentUser.notifications, action.payload],
      };
    },

    updateNotiStatus: (state, action) => {
      state.notification = action.payload;
    },
    updateSaves : (state,action)=>{
     //console.log(action.payload)
     state.currentUser = {...state.currentUser , saves : action.payload}
    }
  },
});

// Action creators are generated for each case reducer function
export const {
  signInSuccess,
  signOut,
  updateUser,
  updateFollow,
  updateNoti,
  updateNotiStatus,
  updateSaves
} = counterSlice.actions;

export default counterSlice.reducer;
