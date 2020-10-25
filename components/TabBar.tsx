
import React, { useEffect, useContext, FunctionComponent } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import Constants from 'expo-constants';
import axios from 'axios';

import { store } from '../store';

import ThemeContext from '../context/ThemeContext';

interface TabBarProps {
  renderIcon: any,
  getLabelText: any,
  activeTintColor: any,
  inactiveTintColor: any,
  onTabPress: any,
  onTabLongPress: any,
  getAccessibilityLabel: any,
  navigation: any
}

const TabBar: FunctionComponent<TabBarProps> = ({
  renderIcon,
  getLabelText,
  activeTintColor,
  inactiveTintColor,
  onTabPress,
  onTabLongPress,
  getAccessibilityLabel,
  navigation
}) => {
  const theme: any = useContext(ThemeContext);

  const S = StyleSheet.create({
    container: {
      flexDirection: "row",
      height: theme.tabBar.height,
      elevation: 2,
      backgroundColor: "#c4c7c9",
      marginTop: theme.tabBar.marginTop,
    },
    tabButton: { 
      flex: 1, 
      justifyContent: "center", 
      alignItems: "center" 
    },
    statusBar: {
      backgroundColor: "#832c44",
      height: Constants.statusBarHeight,
    },
  });

  const { routes, index: activeRouteIndex } = navigation.state;

  const globalState = useContext(store);
  // @ts-ignore
  const { dispatch } = globalState;

  useEffect(() => {
    const getNationalities = async () => {
      try {
        const { data } = await axios.get('https://restcountries.eu/rest/v2/all?fields=demonym');
        dispatch({
          type: 'setNationalities',
          payload: data.map(
            (nationality: any) => nationality.demonym
          ).sort(
            (a: string, b: String) => {
              if (a > b) return 1
              else if (a < b) return -1
              else return 0;
            }
          ).filter(
            (nationality: string) => nationality !== ""
          )
        });
      } catch (err) {
        console.error(err);
      }
    }
    getNationalities();

  }, []);
  
  return (
    <View style={S.container}>
      {routes.map((route, routeIndex) => {
        const isRouteActive = routeIndex === activeRouteIndex;
        const tintColor = isRouteActive ? activeTintColor : inactiveTintColor;
        const combineStyles = StyleSheet.flatten([S.tabButton, {
          width: '100%',
        }]);
        return (
          <View
            key={routeIndex}
            style={{
              flex: 1,
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity
              style={isRouteActive ? combineStyles : S.tabButton}
              onPress={() => {
                onTabPress({ route });
              }}
              onLongPress={() => {
                onTabLongPress({ route });
              }}
              accessibilityLabel={getAccessibilityLabel({ route })}
            >
              <View style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                {isRouteActive ? <ImageBackground
                  source={require('../assets/activetab-bg-white.png')}
                  style={theme.tabBar.image}
                >
                  <View
                    style={theme.tabBar.activeIconContainer}
                  >
                    {renderIcon({ route, focused: isRouteActive, tintColor })}
                  </View>
                </ImageBackground> :
                  <View
                    style={theme.tabBar.inactiveIconContainer}
                  >
                    {renderIcon({ route, focused: isRouteActive, tintColor })}
                  </View>}
              </View>
              <View
                style={{
                  bottom: 0
                }}
              >
                <Text style={{
                  color: tintColor,
                  fontSize: 11,
                  paddingBottom: 5
                }}>{getLabelText({ route })}</Text>
              </View>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};

export default TabBar;