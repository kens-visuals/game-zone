/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { RootState } from '../store';

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
    setCurrentUser({ currentUser }, { payload }: PayloadAction<UserInterface>) {
      currentUser.uid = payload?.uid;
      currentUser.email = payload?.email;
      currentUser.displayName = payload?.displayName;
      currentUser.photoURL = payload?.photoURL;
    },
  },
});

export const { setCurrentUser } = userSlice.actions;

export const selectCurrentUser = (state: RootState) => state.user.currentUser;

export default userSlice.reducer;
