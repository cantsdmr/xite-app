import axios from 'axios';
import * as React from 'react';
import { useEffect } from 'react';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';
import { ActivityIndicator, Appbar, Colors } from 'react-native-paper';
import { Text, View } from '../components/Themed';
import { MusicDecades, VideoFilter } from '../components/VideoFilter';
import { VideoList } from '../components/VideoList';
import { CatalogFilter, CatalogVideo, RootStackScreenProps, XiteCollectionResponse } from '../types';

interface Catalog {
  genres: Map<number, string>;
  videos: CatalogVideo[];
  filter: CatalogFilter;
  loaded: boolean;
  filterOpened: boolean;
  error: null | string;
}

export default function CatalogScreen({ navigation }: RootStackScreenProps<'Catalog'>) {
  const [catalogData, setCatalogData] = React.useState<Catalog>(initialState);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, [])

  const fetchData = async () => {
    const response = await axios.get<XiteCollectionResponse>(dataUrl);

    if (!(response.status >= 200 && response.status < 400)) {
      setCatalogData({
        ...catalogData,
        error: "Error occured, please try again later.",
        loaded: true
      });
      return;
    }

    const formattedCatalogData = formatXiteCollectionResponse(response.data);

    setCatalogData({
      ...catalogData,
      ...formattedCatalogData,
      loaded: true
    });
  }

  const onRefresh = React.useCallback(() => {

    const refreshAsync = async () => {
      setRefreshing(true);
      await fetchData();

      setRefreshing(false);
    }

    refreshAsync();
  }, []);

  const getFilterView = () => {
    return <VideoFilter genres={catalogData.genres} onFilterChanged={(newFilter: CatalogFilter) => setCatalogData({
      ...catalogData,
      filter: newFilter
    })} />;
  }

  const getAppBarView = () => {
    return <Appbar.Header>
      <Appbar.Content titleStyle={styles.title} title="XITE Catalog" />
      {catalogData.loaded && <Appbar.Action icon="filter-variant" onPress={() => setCatalogData({ ...catalogData, filterOpened: !catalogData.filterOpened })} />}
    </Appbar.Header>;
  }

  const getListView = () => {
    if (!catalogData.loaded) {
      return <></>;
    }

    const videos = filterCatalogVideo(catalogData.videos, catalogData.filter);

    if (videos.length === 0 && !catalogData.error) {
      return <Text style={styles.message}>{"No videos to display."}</Text>;
    }

    return <ScrollView style={styles.container}>
      {catalogData.loaded && <VideoList videos={videos} />}
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </ScrollView>;
  }

  return (
    <View style={styles.root}>
      {getAppBarView()}
      {catalogData.loaded && catalogData.filterOpened && getFilterView()}
      {!catalogData.loaded && <ActivityIndicator animating={true} color={"#98042D"} size={"large"} style={styles.indicator} />}
      {catalogData.loaded && catalogData.error && <Text style={styles.message}>{catalogData.error}</Text>}
      {getListView()}
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
  filterOpened: false,
  error: null,
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
      decade_id: MusicDecades.find(e => e.start.toString() <= item.release_year && e.end.toString() > item.release_year)?.id
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
  title: {
    fontWeight: 'bold'
  },
  indicator: {
    width: '100%',
    margin: 0,
    position: 'absolute',
    top: '50%',
  },
  message: {
    width: '100%',
    margin: 0,
    position: 'absolute',
    top: '50%',
    textAlign: 'center'
  },
});