import React, { FunctionComponent, useContext } from 'react';
import { Dimensions, ImageBackground, View, Image } from "react-native";
import { Card, Button, Icon, Text } from 'react-native-elements'
import moment from 'moment';

import ThemeContext from '../context/ThemeContext';

interface IProps {
  booking: any,
  onViewHotel?: (hotel: any) => void
}

const HotelBookingCard: FunctionComponent<IProps> = ({ 
  booking,
  onViewHotel = () => {}
}) => {

  const { hotel, startDate, endDate } = booking;
  const {   
    hotelName, 
    city,
    contactNumber,
    address,
    hotelImage,
    shortDescription,
    longDescription
  } = hotel;

  const imageMultiplier = 2;    
  const theme: any = useContext(ThemeContext);
  
  return (
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
        source={hotelImage || require('../assets/example.jpg')} 
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
            opacity: 0.5,
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
          <Image source={require('../assets/izzi-logo.png')} />
          <Text style={{ color: 'white', fontFamily: 'josefin-sans-bold', fontSize: 35, margin: 0 }}>{hotelName}</Text>
          <Text style={{ color: 'white', fontFamily: 'josefin-sans-bold', fontSize: 35, top: -15 }}>{city}</Text>
          <Text style={{ color: 'white', fontFamily: 'roboto-condensed-regular', fontSize: 16 }}>
            {`${moment(startDate).format('DD MMM YYYY')} - ${moment(endDate).format('DD MMM YYYY')}`}
          </Text>
        </View>
        <View
          style={{
            height: Dimensions.get('window').height / imageMultiplier,
            width: Dimensions.get('window').width,
            top: (Dimensions.get('window').height / imageMultiplier) * -1 - 60,
            paddingLeft: 30,
            paddingRight: 30,
          }}
        >
          <Text style={{ color: 'white', fontFamily: 'roboto-condensed-regular', fontSize: 16 }}>{contactNumber}</Text>          
          <Text style={{ color: 'white', fontFamily: 'roboto-condensed-regular', fontSize: 16 }}>{address}</Text>
        </View>
      </ImageBackground>
      <View
        style={{
          paddingLeft: 30,
          paddingRight: 30,
          paddingTop: 10
        }}
      >
        <Text style={{ color: theme.primaryColor, fontFamily: 'roboto-condensed-bold', fontSize: 25, margin: 0 }}>
          {shortDescription}
        </Text>
        {/*<Text style={{ marginBottom: 10, color: theme.font.secondaryColor, fontFamily: 'roboto-medium', fontSize: 16 }}>
          {longDescription}
        </Text>*/}
        <Button
          icon={
            <Icon
              name='search'
              color={theme.colors.primary}
              />
            }
            containerStyle={theme.iconButton.container}
            buttonStyle={theme.iconButton.button}
            titleStyle={theme.iconButton.title}    
            title='View Hotel'
            type="outline"
            onPress={() => onViewHotel(hotel)}
        />
        <Button
          icon={
            <Icon
              name='map-marker'
              type='material-community'
              color={theme.colors.primary}
              />
            }
            containerStyle={theme.iconButton.container}
            buttonStyle={theme.iconButton.button}
            titleStyle={theme.iconButton.title}    
            title='Check In'
            type="outline"
            onPress={() => onViewHotel(hotel)}
        />        
      </View>
    </Card>
  );
}

export default HotelBookingCard;