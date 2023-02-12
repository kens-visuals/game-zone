export type DataType = {
  id?: number;
  name: string;
  slug: string;
  description: string;
  games_count: number;
  image_background: string;
};

export type Ratings = {
  title: string;
  percent: number;
}[];

export type ParentPlatform = {
  platform: {
    name: string;
  };
}[];

export type Tags = {
  slug: string;
  name: string;
}[];

export interface Bookmark {
  id?: string;
  name: string;
  slug: string;
  genres: DataType[];
  released: string;
  createdAt: string;
  background_image: string;
}

export interface GameInterface {
  id?: string;
  slug: string;
  name: string;
  released: string;
  background_image: string;
  description?: string;
  genres?: DataType[];
  website?: string;
  redditurl?: string;
  ratings?: Ratings;
  rating?: string;
  rating_top?: string;
  metacritic?: number;
  parent_platforms?: ParentPlatform;
  tags?: Tags;
}

export interface Screenshots {
  image: string;
}

export interface MessageType {
  id: string;
  to: string;
  from: string;
  seen?: boolean;
  chatId: string;
  message: string;
  photoURL: string;
  displayName: string;
  createdAt: { seconds: number };
}
