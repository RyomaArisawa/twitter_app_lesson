import { RootState } from './../app/store';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UpdateUserProfile {
  displayName: string;
  photoUrl: string;
}

const initialState = {
  user: {
    uid: '',
    photoUrl: '',
    displayName: '',
  },
};

export const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = initialState.user;
    },
    updateUserProfile: (state, action: PayloadAction<UpdateUserProfile>) => {
      state.user.displayName = action.payload.displayName;
      state.user.photoUrl = action.payload.photoUrl;
    },
  },
});

export const { login, logout, updateUserProfile } = userSlice.actions;

export const selectUser = (state: RootState) => state.userSlice.user;
export default userSlice.reducer;
