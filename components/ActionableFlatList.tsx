import React, { FunctionComponent, useContext } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { FAB } from 'react-native-paper';

import ThemeContext from '../context/ThemeContext';

interface IProps {
  data: any,
  renderItem: any
  keyExtractor: any,
  action: any
}

const S = StyleSheet.create({
  content: {
    height: '100%',
  },  
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
})

const ActionableFlatList: FunctionComponent<IProps> = ({
  data,
  renderItem,
  keyExtractor,
  action
}) => {
  const theme = useContext(ThemeContext);
  const fabStyles = StyleSheet.flatten([S.fab, {
    backgroundColor: theme.primaryColor
  }]);
  return (
    <View style={S.content}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
      <FAB
        style={fabStyles}
        icon="plus"
        onPress={action}
      />
    </View>
  )
}

export default ActionableFlatList;