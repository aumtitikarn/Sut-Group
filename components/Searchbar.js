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
      style = {{ 
        backgroundColor: '#FFF',
        marginTop: 20,
        margin: 10,
        borderWidth: 1,
        borderColoe: '#FFF',
        shadowColor: 'rgba(0, 0, 0, 0.25)',
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 4,
        elevation: 4,
      }}
    />
  );
};

export default MyComponent;