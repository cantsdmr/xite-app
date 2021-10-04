import * as React from 'react';
import { FC } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Divider, Searchbar } from 'react-native-paper';
import { CatalogDecade } from '../types';
import { throttle } from '../utils';
import { Decade } from './Decade';
import { Genre } from './Genre';
import { View } from './Themed';

export interface VideoFilterProps {
  genres: Map<number, string>;
  onFilterChanged?: Function;
}

export const VideoFilter: FC<VideoFilterProps> = (props) => {
  const [filter, setFilter] = React.useState(initialState);

  React.useEffect(() => {
    props.onFilterChanged?.(filter);
  }, [filter]);

  const onChangeSearch = (query: string) => {
    const newFilter = {
      ...filter,
      keyword: query
    };

    setFilter(newFilter);
  }

  const onChangeGenre = (genreId: number, isSelected: boolean) => {
    let genreIds = new Set([...filter.genreIds]);

    isSelected ? genreIds.add(genreId) : genreIds.delete(genreId)

    const newFilter = {
      ...filter,
      genreIds: genreIds
    };

    setFilter(newFilter);
  }

  const onChangeDecade = (decadeId: number, isSelected: boolean) => {
    let decadeIds = new Set([...filter.decadeIds]);

    isSelected ? decadeIds.add(decadeId) : decadeIds.delete(decadeId)

    const newFilter = {
      ...filter,
      decadeIds: decadeIds
    };

    setFilter(newFilter);
  }

  let allGenres = [];

  for (const genrePair of props.genres.entries()) {
    const genre = <Genre
      key={genrePair[0]}
      genre={{
        id: genrePair[0],
        name: genrePair[1]
      }}
      onSelected={(isSelected: boolean) => onChangeGenre(genrePair[0], isSelected)} />;

    allGenres.push(genre);
  }

  let allDecades = [];

  for (const decade of decades) {
    const decadeElement = <Decade
      key={decade.start}
      decade={decade}
      onSelected={(isSelected: boolean) => onChangeDecade(decade.id, isSelected)} />;

    allDecades.push(decadeElement);
  }

  return (
    <>
      <Searchbar
        placeholder="Search by title and artist"
        onChangeText={throttle(onChangeSearch, 2500)}
        value={filter.keyword}
      />
      <ScrollView style={styles.filter}>
        <View style={styles.chipContainer}>
          {allGenres}
        </View>
        <Divider style={styles.divider} />
        <View style={styles.chipContainer}>
          {allDecades}
        </View>
      </ScrollView>
    </>
  );
};

const initialState = {
  genreIds: new Set<number>(),
  keyword: "",
  decadeIds: new Set<number>()
}

const styles = StyleSheet.create({
  chipContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#ebdfdf',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
  },
  divider: {
    width: '50%'
  },
  filter: {
    width: '100%',
    height: 300,
    zIndex: 100
  }
});

export const decades: CatalogDecade[] = [{
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
}];