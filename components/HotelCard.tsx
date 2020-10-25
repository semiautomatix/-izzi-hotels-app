import React, { FunctionComponent, useContext } from 'react';
import { Dimensions, ImageBackground, View, Image } from "react-native";
import { Card, Button, Icon, Text } from 'react-native-elements'
import ThemeContext from '../context/ThemeContext';
import Rating from './Rating';
import { Chip } from 'react-native-paper';
import Loading from './Loading';

interface IProps {
  hotelName: string,
  hotelLocation: string,
  rating: number,
  hotelContact: string,
  hotelAddress: string,
  hotelImage: any,
  contentHeader: string,
  content: string,
  showConfirm?: boolean,
  onShowConfirmPress?: () => void  
}

const HotelCard: FunctionComponent<IProps> = ({ 
  hotelName, 
  hotelLocation,
  rating,
  hotelContact,
  hotelAddress,
  hotelImage,
  contentHeader,
  content,
  showConfirm = false,
  onShowConfirmPress
}) => {

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
          <Text style={{ color: 'white', fontFamily: 'josefin-sans-bold', fontSize: 35, top: -15 }}>{hotelLocation}</Text>
          <Rating   
            value={rating}
            count={5}
          />
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
          <Text style={{ color: 'white', fontFamily: 'roboto-condensed-regular', fontSize: 16 }}>{hotelContact}</Text>          
          <Text style={{ color: 'white', fontFamily: 'roboto-condensed-regular', fontSize: 16 }}>{hotelAddress}</Text>
        </View>
      </ImageBackground>
      <View
        style={{
          paddingLeft: 30,
          paddingRight: 30,
          paddingTop: 10
        }}
      >
        {/*<View style={{ flexDirection: 'row' }}>
          <Chip style={{margin: 3}}>Meeting Room</Chip>
          <Chip style={{margin: 3}}>Co-share</Chip>
        </View>*/}
        <Text style={{ color: theme.primaryColor, fontFamily: 'roboto-condensed-bold', fontSize: 25, margin: 0 }}>
          {contentHeader}
        </Text>
        <Text style={{ marginBottom: 10, color: theme.font.secondaryColor, fontFamily: 'roboto-medium', fontSize: 16 }}>
          {content}
        </Text>
        {showConfirm ? <Button
            icon={
              <Icon
                name='search'
                color={theme.colors.primary}
              />
            }
            containerStyle={theme.iconButton.container}
            buttonStyle={theme.iconButton.button}
            titleStyle={theme.iconButton.title}            
            title='Confirm'
            type="outline"
            onPress={onShowConfirmPress}
          /> : null
        }     
      </View>
    </Card>
  );
}

export default HotelCard;