export type GenresTypes = {
  name: string;
  slug: string;
  games_count: number;
  image_background: string;
}[];

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
  name: string;
}[];

export interface GameInterface {
  id: string;
  slug: string;
  name: string;
  released: string;
  description: string;
  background_image: string;
  genres?: GenresTypes;
  website?: string;
  redditurl?: string;
  ratings?: Ratings;
  rating?: string;
  rating_top?: string;
  metacritic?: number;
  parent_platforms?: ParentPlatform;
  tags: Tags;
}

export interface Screenshots {
  image: string;
}