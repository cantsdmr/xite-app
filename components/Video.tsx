import * as React from 'react';
import { FC } from 'react';
import { StyleSheet } from 'react-native';
import { Card, Paragraph } from 'react-native-paper';
import { CatalogVideo } from '../types';
import { View } from './Themed';

export interface VideoProps {
  video: CatalogVideo;
}

export const Video: FC<VideoProps> = (props) => {
  return <View style={styles.wrapper}>
    <Card mode="elevated" style={styles.card}>
      <Card.Cover source={{ uri: props.video?.image_url }} />
      <Card.Title title={props.video?.title} subtitle={props.video?.artist} />
      <Card.Content>
        <Paragraph>{props.video?.genre_name} &bull; {props.video?.release_year}</Paragraph>
      </Card.Content>
    </Card>
  </View>
}

const styles = StyleSheet.create({
  wrapper: {
    width: 360,
    margin: 10,
    borderRadius: 10
  },
  card: {
    width: '100%',
    height: 'auto',
  },
});
