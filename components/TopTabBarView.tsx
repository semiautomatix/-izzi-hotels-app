import React, { FunctionComponent, useState, useContext } from "react";
import { Dimensions, View } from "react-native";
import { TabBar, TabView, SceneMap } from "react-native-tab-view";
import ThemeContext, { theme } from "../context/ThemeContext";

interface ITab {
  title: string,
  component: any
}

interface IProps {
  tabs: ITab[]
}

const TopTabBarView: FunctionComponent<IProps> = ({ tabs }) => {
  const [index, setIndex] = useState<number>(0);

  const theme = useContext(ThemeContext);
    
  const opacity = '0.4';

  const _renderTabBar = (props: any) =>
    <TabBar
      {...props}
      indicatorStyle={theme.topTabBar.indicator}
      style={theme.topTabBar.style}
      getLabelText={({ route }) => route.title}
      labelStyle={theme.topTabBar.label}
    />

  const routes = tabs.map(
    (tab: ITab, index: number) => ({
      key: `route${index}`,
      title: tab.title
    })
  )

  const scenes = {};
  tabs.forEach(
    (tab: ITab, index: number) => {
      scenes[`route${index}`] = tab.component;
    }
  )

  return (
    <React.Fragment>
      <TabView
        style={{ width: Dimensions.get('window').width, margin: 0 }}
        navigationState={{ index, routes }}
        renderScene={SceneMap(scenes)}
        onIndexChange={index => setIndex(index)}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderTabBar={_renderTabBar}
      />
      <View
        style={{
          height: 50,
          backgroundColor: `rgba(0, 0, 0, ${opacity})`,
          position: 'absolute',
          top: 0,
          right: 0,
          left: ((Dimensions.get('window').width / 3) * 2) + 30
        }}
      />
      <View
        style={{
          height: 50,
          backgroundColor: `rgba(0, 0, 0, ${opacity})`,
          position: 'absolute',
          top: 0,
          right: Dimensions.get('window').width - 30,
          left: 0
        }}
      />
    </React.Fragment>
  );
};

export default TopTabBarView; 