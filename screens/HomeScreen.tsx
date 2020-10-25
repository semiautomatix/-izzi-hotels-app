import React from 'react';
import { createAppContainer } from "react-navigation";
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Fa5Icon from 'react-native-vector-icons/FontAwesome5';

import { theme } from '../context/ThemeContext';

import TripsScreen from './MyBookingsScreen';
import ProfileScreen from './ProfileScreen';
import HotelsScreen from './HotelsScreen';
import TabBar from '../components/TabBar';
import RoomAutomation from '../forms/RoomAutomation';

const TabNavigator = createBottomTabNavigator(
  {
    Hotels: {
      screen: HotelsScreen,
      navigationOptions: ({ navigation }) => ({
        title: 'Book',
        tabBarIcon: ({ tintColor }) => (
          <Icon name="magnify" size={30
          } color={tintColor} />
        ),
      }),
    },    
    Trips: {
      screen: TripsScreen,
      navigationOptions: ({ navigation }) => ({
        title: 'My Trips',
        tabBarIcon: ({ tintColor }) => (
          <Fa5Icon name="suitcase-rolling" size={24} color={tintColor} />
        ),
      }),
    },
    Account: {
      screen: ProfileScreen,
      navigationOptions: ({ navigation }) => ({
        title: 'Account',
        tabBarIcon: ({ tintColor }) => (
          <Icon name="account" size={30} color={tintColor} />
        ),
      }),
    },
    Stay: {
      screen: RoomAutomation,
      navigationOptions: ({ navigation }) => ({
        title: 'My Stay',
        tabBarIcon: ({ tintColor }) => (
          <Icon name="hotel" size={30} color={tintColor} />
        ),
      }),     
    }
  },
  {
    tabBarComponent: TabBar,
    tabBarOptions: {
      activeTintColor: theme.tabBar.activeTintColor,
      inactiveTintColor: theme.tabBar.inactiveTintColor,
      showLabel: true
    },
  }
);

export default createAppContainer(TabNavigator);