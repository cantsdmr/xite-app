import * as React from 'react';
import { FC } from 'react';
import { StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';
import { CatalogGenre } from '../types';

export interface GenreProps {
  genre: CatalogGenre;
  onSelected: (selected: boolean) => void;
}

export const Genre: FC<GenreProps> = (props) => {
  const onPressChange = () => {
    props.onSelected(!props.genre.selected)
  }

  return <Chip
    style={styles.wrapper}
    selected={props.genre.selected}
    onPress={onPressChange}
  >
    {props.genre?.name}
  </Chip>
}

const styles = StyleSheet.create({
  wrapper: {
    margin: 10,
    borderRadius: 10
  },
});
