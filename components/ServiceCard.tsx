import React, { FunctionComponent, useContext } from 'react';
import { Dimensions, Image, View, GestureResponderEvent, TouchableOpacity, StyleSheet, Alert, Platform, ToastAndroid } from "react-native";
import { Card, Text, Button, Icon } from 'react-native-elements'
import ThemeContext, { widthPercentageToDP, heightPercentageToDP } from '../context/ThemeContext';
import moment from 'moment';

interface IProps {
  serviceBooking: any,
  alignment?: string,
  onPress?: (event: GestureResponderEvent) => void;
  onLongPress?: (event: GestureResponderEvent) => void;
  onButtonPress?: () => void
}

const ServiceCard: FunctionComponent<IProps> = ({
  serviceBooking,
  onPress,
  onLongPress,
  onButtonPress
}) => {

  const {
    id,
    service,
    startDateTime,
    checkInDateTime,
    endDateTime,
    checkOutDateTime,
    alignment = 'left',
  } = serviceBooking;

  const {    
    serviceType,
    location,
  } = service;

  const theme: any = useContext(ThemeContext);

  const S = StyleSheet.create({
    container: {
      width: Dimensions.get('window').width,
      margin: 0,
      borderWidth: 0,
      padding: 0,
      paddingBottom: 20,
      elevation: 0
    },
  });

  const serviceImage = serviceType === 'MEETING_ROOM' ? require('../assets/meeting-room.jpg') : require('../assets/coshare.jpg');

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
        <View style={{ flexDirection: serviceType === 'MEETING_ROOM' ? 'row-reverse' : 'row' }}>
          <Image
            source={serviceImage}
            style={{
              height: heightPercentageToDP(28.2),
              width: widthPercentageToDP(34),
            }}
          />
          <View
            style={{
              paddingRight: 20,
              paddingLeft: 20,              
              paddingTop: heightPercentageToDP(3), 
              flexDirection: 'column',
              backgroundColor: 'grey',
              width: widthPercentageToDP(66)
            }}
          >
            <Text
              style={StyleSheet.flatten([theme.header2, 
                { 
                  color: theme.colors.snow, 
                  margin: 0, 
                  textAlign: alignment, 
                  paddingVertical: 0,
                  fontSize: heightPercentageToDP(3), 
                }
              ])}
              numberOfLines={2}
              ellipsizeMode='tail'
            >
              {serviceType === 'MEETING_ROOM' ? 'Meeting' : 'Co-share'}
            </Text>
            <Text
              style={StyleSheet.flatten([theme.header3, 
                {
                  color: theme.colors.snow, 
                  margin: 0, 
                  textAlign: alignment, 
                  paddingVertical: 0,
                  width: widthPercentageToDP(66),
                  fontSize: heightPercentageToDP(2.5), 
                }]
              )}
              numberOfLines={1}
              ellipsizeMode='tail'
            >
              {location}
            </Text>
            <Text style={StyleSheet.flatten([theme.text1, 
                {
                  color: theme.colors.snow, 
                  textAlign: alignment, 
                  fontSize: heightPercentageToDP(2), 
                }]
              )}>
                {`${moment(startDateTime).format('DD MMM YYYY hh:mm A')} - ${moment(endDateTime).format('DD MMM YYYY hh:mm A')}`}
            </Text>
            {serviceType === 'MEETING_ROOM' && !checkOutDateTime? 
              <Button
                icon={
                  <Icon
                    name={checkInDateTime ? 'clock-out' : 'clock-in'}
                    type='material-community'
                    color='#832c44'
                  />
                }
                containerStyle={{
                  width: Dimensions.get('window').width / 3,
                  padding: 10,
                }}
                buttonStyle={{
                  backgroundColor: theme.colors.snow,
                  borderRadius: 0,
                  borderWidth: 1,
                  borderColor: '#832c44'
                }}
                titleStyle={{
                  fontFamily: 'roboto-condensed-bold',
                  color: '#832c44'
                }}
                title={checkInDateTime ? 'Check Out' : 'Check In'}
                type="outline"
                onPress={onButtonPress}
              /> :
              null
            }

          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

export default ServiceCard;