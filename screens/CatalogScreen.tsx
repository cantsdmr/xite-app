import axios from 'axios';
import * as React from 'react';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { ActivityIndicator, Appbar } from 'react-native-paper';
import { Text, View } from '../components/Themed';
import { MusicDecades, VideoFilter } from '../components/VideoFilter';
import { VideoList } from '../components/VideoList';
import { CatalogDecade, CatalogFilter, CatalogGenre, CatalogVideo, RootStackScreenProps, XiteCollectionResponse } from '../types';

interface Catalog {
  videos: CatalogVideo[];
  filter: CatalogFilter;
  loaded: boolean;
  filterOpened: boolean;
  error: null | string;
}

export default function CatalogScreen({ navigation }: RootStackScreenProps<'Catalog'>) {
  const [catalogData, setCatalogData] = React.useState<Catalog>(initialState);

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

  const getFilterView = () => {
    return <VideoFilter filter={catalogData.filter} onFilterChanged={(partialFilter: Partial<CatalogFilter>) => setCatalogData({
      ...catalogData,
      filter: {
        ...catalogData.filter,
        ...partialFilter,
        genreIds: [...(partialFilter.genreMap ?? [])].filter(([key, value]) => value.selected === true).map(e => e[0]),
        decadeIds: [...(partialFilter.decadeMap ?? [])].filter(([key, value]) => value.selected === true).map(e => e[0]),
      }
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

    return <View style={styles.container}>
      {catalogData.loaded && <VideoList videos={videos} />}
    </View>;
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
  videos: [],
  filter: {
    genreMap: new Map<number, CatalogGenre>(),
    decadeMap: new Map<number, CatalogDecade>(),
    keyword: null,
    genreIds: [],
    decadeIds: [],
  },
  loaded: false,
  filterOpened: false,
  error: null,
};

const formatXiteCollectionResponse = (data: XiteCollectionResponse): Partial<Catalog> => {
  let genres = new Map(data.genres.map(genre => [genre.id, genre]));

  const videos = data.videos.map(item => {
    const title = (item.title ?? 'Unknown Title').toString();
    const artist = (item.artist ?? 'Unknown Artist').toString();
    const year = (item.release_year ?? 'Unknown Year').toString();

    return {
      ...item,
      title: title,
      artist: artist,
      release_year: year,
      genre_name: genres.get(item.genre_id)?.name ?? 'Uncategorized',
      search_index: `${title.toLowerCase()}#${artist.toLowerCase()}}`,
      decade_id: MusicDecades.find(e => e.start.toString() <= item.release_year && e.end.toString() > item.release_year)?.id
    } as CatalogVideo
  });

  return {
    videos: videos,
    filter: {
      ...initialState.filter,
      genreMap: genres,
      decadeMap: new Map(MusicDecades.map(decade => [decade.id, decade]))
    }
  };
}

const filterCatalogVideo = (data: CatalogVideo[], filter: CatalogFilter): CatalogVideo[] => {
  let filteredVideos = [...data];

  if (filter.genreIds.length > 0) {
    filteredVideos = data.filter(e => filter.genreIds.includes(e.genre_id));
  }

  if (filter.decadeIds.length > 0) {
    filteredVideos = data.filter(e => filter.decadeIds.includes(e.decade_id));
  }

  if (filter.keyword != null && filter.keyword.trim() != '') {
    const searchTerm = filter.keyword?.toLowerCase() as string;

    filteredVideos = filteredVideos.filter(e => e.search_index.includes(searchTerm))
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