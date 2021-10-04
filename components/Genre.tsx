import * as React from 'react';
import { FC } from 'react';
import { StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';
import { CatalogGenre } from '../types';

export interface GenreProps {
  genre: CatalogGenre;
  onSelected: Function;
}

export const Genre: FC<GenreProps> = (props) => {
  const [isSelected, setSelected] = React.useState(false);

  const onPressChange = () => {
    setSelected(!isSelected);
  }

  React.useEffect(() => {
    props.onSelected(isSelected);
  }, [isSelected]);

  return <Chip
    style={styles.wrapper}
    selected={isSelected}
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
