/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// eslint-disable-next-line import/no-cycle
import { RootState } from '../store';

export interface GameInterface {
  name: string;
  createdAt: string;
}

export interface GamesInterface {
  games: [
    {
      name: string;
      createdAt: string;
    }
  ];
}

const initialState: any = {
  savedGames: [],
};

const gamesSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {
    getGames({ savedGames }, { payload }: PayloadAction<GameInterface[]>) {
      savedGames.push({
        ...payload.map((el) => ({ name: el.name, createdAt: el.createdAt })),
      });
    },
    setGames({ savedGames }, { payload }: PayloadAction<GameInterface[]>) {
      if (payload) {
        savedGames.push({
          name: payload[0].name,
          createdAt: payload[0].createdAt,
        });
      }
    },
  },
});

export const { getGames, setGames } = gamesSlice.actions;

export const selectGames = (state: RootState) => state.games.savedGames;

export default gamesSlice.reducer;
