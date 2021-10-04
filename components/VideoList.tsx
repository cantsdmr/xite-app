import * as React from 'react';
import { StyleSheet } from 'react-native';
import { CatalogVideo } from '../types';
import { View } from './Themed';
import { Video } from './Video';

export interface VideoListProps {
  videos: CatalogVideo[];
}

export function VideoList(props: VideoListProps) {
  const videos = props.videos.map((videoItem, index) => {
    return <Video key={index} video={videoItem} />;
  });

  return <View style={styles.container}>
    {videos}
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