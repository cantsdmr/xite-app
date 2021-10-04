import axios from 'axios';
import * as React from 'react';
import { useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ActivityIndicator, Appbar, Colors } from 'react-native-paper';
import { View } from '../components/Themed';
import { decades, VideoFilter } from '../components/VideoFilter';
import { VideoList } from '../components/VideoList';
import { CatalogFilter, CatalogVideo, RootStackScreenProps, XiteCollectionResponse } from '../types';


interface Catalog {
  genres: Map<number, string>;
  videos: CatalogVideo[];
  filter: CatalogFilter;
  loaded: boolean;
  filterOpened: boolean;
}

export default function CatalogScreen({ navigation }: RootStackScreenProps<'Catalog'>) {
  const [catalogData, setCatalogData] = React.useState<Catalog>(initialState);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get<XiteCollectionResponse>(dataUrl);
      const formattedCatalogData = formatXiteCollectionResponse(response.data);

      setCatalogData({
        ...catalogData,
        ...formattedCatalogData,
        loaded: true
      });
    }

    fetchData();
  }, [])

  return (
    <View style={styles.root}>
      <Appbar.Header>
        <Appbar.Content title="XITE Catalog" />
        <Appbar.Action icon="filter-variant" onPress={() => setCatalogData({ ...catalogData, filterOpened: !catalogData.filterOpened })} />
      </Appbar.Header>
      {catalogData.loaded && catalogData.filterOpened && <VideoFilter genres={catalogData.genres} onFilterChanged={(newFilter: CatalogFilter) => setCatalogData({
        ...catalogData,
        filter: newFilter
      })} />
      }
      <ScrollView style={styles.container}>
        {!catalogData.loaded && <ActivityIndicator animating={true} color={Colors.red800} size={"large"} style={styles.indicator} />}
        {catalogData.loaded && <VideoList videos={filterCatalogVideo(catalogData.videos, catalogData.filter)} />}
      </ScrollView>
    </View>
  );
}

const dataUrl = 'https://raw.githubusercontent.com/XiteTV/frontend-coding-exercise/main/data/dataset.json';

const initialState: Catalog = {
  genres: new Map<number, string>(),
  videos: [],
  filter: {
    genreIds: new Set<number>(),
    decadeIds: new Set<number>(),
    keyword: null
  },
  loaded: false,
  filterOpened: false
};

const formatXiteCollectionResponse = (data: XiteCollectionResponse): Partial<Catalog> => {
  let genres = new Map(data.genres.map(genre => [genre.id, genre.name]));

  const videos = data.videos.map(item => {
    const title = (item.title ?? 'Unknown Title').toString();
    const artist = (item.artist ?? 'Unknown Artist').toString();
    const year = (item.release_year ?? 'Unknown Year').toString();

    return {
      ...item,
      title: title,
      artist: artist,
      release_year: year,
      genre_name: genres.get(item.genre_id) ?? 'Uncategorized',
      search_index: `${title.toLowerCase()}#${artist.toLowerCase()}}`,
      decade_id: decades.find(e => e.start.toString() <= item.release_year && e.end.toString() > item.release_year)?.id
    } as CatalogVideo
  });

  return {
    genres: genres,
    videos: videos,
  };
}

const filterCatalogVideo = (data: CatalogVideo[], filter: CatalogFilter): CatalogVideo[] => {
  let filteredVideos = [...data];

  if (filter.genreIds.size > 0) {
    filteredVideos = data.filter(e => filter.genreIds.has(e.genre_id));
  }

  if (filter.keyword != null && filter.keyword.trim() != '') {
    const searchTerm = filter.keyword?.toLowerCase() as string;

    filteredVideos = filteredVideos.filter(e => e.search_index.includes(searchTerm))
  }

  if (filter.decadeIds.size > 0) {
    filteredVideos = data.filter(e => filter.decadeIds.has(e.decade_id));
  }

  return filteredVideos;
}

const styles = StyleSheet.create({
  root: {
    flex: 1
  },
  container: {
    width: '100%',
    height: '100%'
  },
  indicator: {
    height: '100%'
  }, 
});