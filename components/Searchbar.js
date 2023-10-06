import * as React from 'react';
import { Searchbar } from 'react-native-paper';

const MyComponent = () => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const onChangeSearch = query => setSearchQuery(query);

  return (
    <Searchbar
      placeholder="Search"
      onChangeText={onChangeSearch}
      value={searchQuery}
      style={{backgroundColor: '#FFF',
    borderRadius: 20,
    marginTop: 10,
    padding:  10,
    marginLeft: 10,
    height: 50,
    width: 380}}
    />
  );
};

export default MyComponent;