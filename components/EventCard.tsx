import React, { FunctionComponent, useContext } from 'react';
import { Dimensions, ImageBackground, View, Image, TouchableOpacity, GestureResponderEvent } from "react-native";
import { Card, Text } from 'react-native-elements'
import ThemeContext from '../context/ThemeContext';

interface IProps {
  eventName: string,
  eventLocation: string,
  eventDates: string,
  eventImage: any 
  alignment?: string,
  onPress?: (event: GestureResponderEvent) => void;
  onLongPress?: (event: GestureResponderEvent) => void;
}

const EventCard: FunctionComponent<IProps> = ({ 
  eventName, 
  eventLocation,
  eventDates,
  eventImage,
  alignment = 'left',
  onLongPress,
  onPress
}) => {

  const imageMultiplier = 4;    
  const theme = useContext(ThemeContext);
  
  return (
    <TouchableOpacity 
      onLongPress={onLongPress}
      onPress={onPress}
    >
      <Card
        containerStyle={{
          width: Dimensions.get('window').width,
          margin: 0,
          borderWidth: 0,
          padding: 0,
          paddingBottom: 20,
          elevation: 0
        }}      
      >
        <ImageBackground
          source={eventImage} 
          style={{
            height: Dimensions.get('window').height / imageMultiplier,
            width: Dimensions.get('window').width,
          }}
        >
          <View
            style={{
              height: Dimensions.get('window').height / imageMultiplier,
              width: Dimensions.get('window').width,
              backgroundColor: 'black',
              opacity: 0.6,
              paddingLeft: 30,
              paddingRight: 30,
              paddingTop: 60,
            }}          
          />
          <View
            style={{
              height: Dimensions.get('window').height / imageMultiplier,
              width: Dimensions.get('window').width,
              top: (Dimensions.get('window').height / imageMultiplier) * -1,
              paddingLeft: 30,
              paddingRight: 30,
              paddingTop: 60
            }}
          >
            <Text 
              style={{ color: 'white', fontFamily: 'josefin-sans-bold', fontSize: 25, margin: 0, textAlign: alignment }} 
              numberOfLines={2} 
              ellipsizeMode='tail'
            >
              {eventName}
            </Text>
            <Text 
              style={{ color: 'white', fontFamily: 'josefin-sans-bold', fontSize: 16, textAlign: alignment }}
              numberOfLines={1} 
              ellipsizeMode='tail'            
            >
              {eventLocation}
            </Text>
            <Text style={{ color: 'white', fontFamily: 'roboto-condensed-regular', fontSize: 16, textAlign: alignment }}>{eventDates}</Text>
          </View>
        </ImageBackground>
      </Card>
    </TouchableOpacity>
  );
}

export default EventCard;