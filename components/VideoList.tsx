import * as React from 'react';
import { RefreshControl, StyleSheet } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { CatalogVideo } from '../types';
import { View } from './Themed';
import { Video } from './Video';

export interface VideoListProps {
  videos: CatalogVideo[];
}

export function VideoList(props: VideoListProps) {
  return <View style={styles.container}>
    <FlatList
      keyExtractor={(item, index) => index.toString()}
      data={props.videos}
      renderItem={({ item }) => <Video video={item} />} />
  </View>
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});