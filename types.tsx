/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList { }
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined; 
  NotFound: undefined;
  Catalog: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type RootTabParamList = {
  Catalog: undefined;
};

export interface XiteGenre {
  id: number;
  name: string;
}

export interface XiteVideo {
  id: number;
  artist: string;
  title: string;
  release_year: string;
  genre_id: number;
  image_url: string;
}

export interface XiteCollectionResponse {
  genres: XiteGenre[];
  videos: XiteVideo[];
}

export interface CatalogVideo extends XiteVideo {
  genreName: string;
  searchIndex: string;
  decadeId: number;
}

export interface CatalogGenre {
  id: number;
  name: string;
  selected?: boolean;
}

export interface CatalogDecade {
  id: number;
  name: string;
  start: number;
  end: number;
  selected?: boolean;
}

export interface CatalogFilter {
  genreMap: Map<number, CatalogGenre>;
  decadeMap: Map<number, CatalogDecade>;  
  keyword: string | null;
  genreIds: number[];
  decadeIds: number[];
}