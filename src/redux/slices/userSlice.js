import {createSlice} from '@reduxjs/toolkit';

const userSlicer = createSlice({
  name: 'user',
  initialState: {
    userData: null,
    user: null,
    business: null,
    token: null,
    type: null,
    user_profile_pic: {},
    user_profile_pic_size: {},
    user_profile_pic_name: '',
    first_name: '',
    last_name: '',
    isLogin: false,
    refreshDetail: false,
    tokenError: false,
    linkExpired: false,
    firstTime: false,
  },

  reducers: {
    setUser: (state, action) => {
      state.userData = action.payload;
    },
    setUserByEmail: (state, action) => {
      state.user = action.payload;
    },
    setUserFirstName: (state, action) => {
      state.first_name = action.payload;
    },
    setUserLastName: (state, action) => {
      state.last_name = action.payload;
    },

    setToken: (state, action) => {
      state.token = action.payload;
    },

    setLinkExpired: (state, action) => {
      state.linkExpired = action.payload;
    },

    setTokenError: (state, action) => {
      state.tokenError = action.payload;
    },
    // logOut: (state, action) => {
    //   state.initialState = action.payload;
    // },
    setProfilePic: (state, action) => {
      state.user_profile_pic = action.payload;
    },
    setProfilePicSiza: (state, action) => {
      state.user_profile_pic_size = action.payload;
    },
    setProfilePicName: (state, action) => {
      state.user_profile_pic_name = action.payload;
    },
    logOut: (state, action) => {
      state.isLogin = action.payload;
    },
    onLogin: (state, action) => {
      state.isLogin = action.payload;
    },
    setRefresh: (state, action) => {
      state.refreshDetail = action.payload;
    },
    setFirstTime: (state, action) => {
      state.firstTime = action.payload;
    },

    clearUser: (state, action) => {
      state.userData = null;
      state.user = null;
      state.business = null;
      state.token = null;
      state.type = null;
      state.user_profile_pic = {};
      state.user_profile_pic_size = {};
      state.user_profile_pic_name = '';
      state.first_name = '';
      state.last_name = '';
      state.isLogin = false;
      state.refreshDetail = false;
      state.tokenError = false;
      state.linkExpired = false;
      state.firstTime = false;
    },
  },
});

export const {
  setUser,
  setToken,
  setTokenError,
  setLinkExpired,
  logOut,
  setProfilePic,
  setProfilePicSiza,
  setProfilePicName,
  setUserFirstName,
  setUserLastName,
  setUserByEmail,
  onLogin,
  setRefresh,
  clearUser,
  setFirstTime,
} = userSlicer.actions;

export default userSlicer.reducer;
