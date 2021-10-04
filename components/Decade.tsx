import * as React from 'react';
import { FC } from 'react';
import { StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';
import { CatalogDecade, CatalogGenre } from '../types';

export interface DecadeProps {
  decade: CatalogDecade;
  onSelected: Function;
}

export const Decade: FC<DecadeProps> = (props) => {
  const onPressChange = () => {
    props.onSelected(!props.decade.selected)
  }

  return <Chip
    style={styles.wrapper}
    selected={props.decade.selected}
    onPress={onPressChange}
  >
    {props.decade?.name}
  </Chip>
}

const styles = StyleSheet.create({
  wrapper: {
    margin: 10,
    borderRadius: 10
  },
});
