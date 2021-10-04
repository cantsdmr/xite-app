import * as React from 'react';
import { FC } from 'react';
import { NativeSyntheticEvent, ScrollView, StyleSheet, TextInputChangeEventData } from 'react-native';
import { Divider, Searchbar } from 'react-native-paper';
import { CatalogDecade, CatalogFilter, CatalogGenre } from '../types';
import { debounce } from '../utils';
import { Decade } from './Decade';
import { Genre } from './Genre';
import { View } from './Themed';

export interface VideoFilterProps {
  filter: CatalogFilter;
  onFilterChanged?: (filter: Partial<CatalogFilter>) => void;
}

export const VideoFilter: FC<VideoFilterProps> = (props) => {
  const [searchTerm, setSearchTerm] = React.useState(props.filter.keyword);

  const onChangeSearch = (query: string) => {
    setSearchTerm(query);
  }

  const onEndSearch = (event: any) => {
    props.onFilterChanged?.({
      keyword: searchTerm
    })
  }

  const onChangeGenre = (genre: CatalogGenre) => {
    let genreMap = new Map([...props.filter.genreMap]);

    genreMap.delete(genre.id);
    genreMap.set(genre.id, genre);

    props.onFilterChanged?.({
      genreMap: genreMap
    });
  }

  const onChangeDecade = (decade: CatalogDecade) => {
    let decadeMap = new Map([...props.filter.decadeMap]);

    decadeMap.delete(decade.id);
    decadeMap.set(decade.id, decade);

    props.onFilterChanged?.({
      decadeMap: decadeMap
    });
  }

  let allGenres = [];

  for (let item of props.filter.genreMap.entries()) {
    const genre = <Genre
      key={item[0]}
      genre={item[1]}
      onSelected={(isSelected: boolean) => onChangeGenre({
        ...item[1],
        selected: isSelected
      })} />;

    allGenres.push(genre);
  }

  let allDecades: any[] = [];

  for (let decade of props.filter.decadeMap.entries()) {
    const decadeElement = <Decade
      key={decade[0]}
      decade={decade[1]}
      onSelected={(isSelected: boolean) => onChangeDecade({
        ...decade[1],
        selected: isSelected
      })} />;

    allDecades.push(decadeElement);
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search by title and artist"
        onChange={debounce(onEndSearch, 1500)}
        onChangeText={onChangeSearch}
        onSubmitEditing={onEndSearch}
        value={searchTerm ?? ''}
        style={styles.searchBar}
      />
      <ScrollView style={styles.filter}>
        <View style={styles.genreContainer}>
          {allGenres}
        </View>
        <Divider style={styles.divider} />
        <View style={styles.decadeContainer}>
          {allDecades}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 100,
  },
  genreContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
  },
  decadeContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
  },
  divider: {
    backgroundColor: "#000"
  },
  filter: {
    width: '100%',
    height: 300,
    zIndex: 100
  },
  searchBar: {
    borderRadius: 0
  }
});

export const MusicDecades: CatalogDecade[] = [
  {
    id: 1,
    name: "60's",
    start: 1960,
    end: 1970
  },
  {
    id: 2,
    name: "70's",
    start: 1970,
    end: 1980
  },
  {
    id: 3,
    name: "80's",
    start: 1980,
    end: 1990
  },
  {
    id: 4,
    name: "90's",
    start: 1990,
    end: 2000
  },
  {
    id: 5,
    name: "2000's",
    start: 2000,
    end: 2010
  },
  {
    id: 6,
    name: "2010's",
    start: 2010,
    end: 2020
  },
  {
    id: 7,
    name: "2020's",
    start: 2020,
    end: 2030
  }
];