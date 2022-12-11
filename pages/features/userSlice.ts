/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserInterface {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
}

const initialState = {
  currentUser: {
    uid: '',
    email: '',
    displayName: '',
    photoURL: '',
  } as UserInterface,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser({ currentUser }, action: PayloadAction<UserInterface>) {
      currentUser.uid = action.payload?.uid;
      currentUser.email = action.payload?.email;
      currentUser.displayName = action.payload?.displayName;
      currentUser.photoURL = action.payload?.photoURL;
    },
  },
});

export const { setCurrentUser } = userSlice.actions;

export const selectCurrentUser = (state) => state.user.currentUser;

export default userSlice.reducer;
