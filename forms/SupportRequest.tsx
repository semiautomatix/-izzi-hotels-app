import React, { useContext, FunctionComponent, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-elements';

import ThemeContext from '../context/ThemeContext';

import { store } from '../store';

import DropDown from '../components/DropDown';
import LabelText from '../components/LabelText';
import CustomTextInput from '../components/CustomTextInput';

interface SupportRequestProps {
  onSuccess: () => void
}

const hotels = [
  {
    id: 1,
    hotel_name: 'Sun City',
  }, 
  {
    id: 2,
    hotel_name: 'iZZi Nelspruit',
  },  
]

const SupportRequest: FunctionComponent<SupportRequestProps> = ({ onSuccess }) => {
  const [hotel, setHotel] = useState<number>(undefined);
  const [subject, setSubject] = useState<string>(undefined);
  const [message, setMessage] = useState<string>("");

  const theme: any = useContext(ThemeContext);

  // @ts-ignore
  const { state } = useContext(store);

  const S = StyleSheet.create({
    content: {
      backgroundColor: theme.colors.snow,
      height: '100%',
      paddingTop: 30,
      borderRadius: 30,
    },
    header: {
      color: theme.form.header.color, 
      fontFamily: theme.form.header.fontFamily, 
      fontSize: theme.form.header.fontSize, 
      margin: 0, 
      marginBottom: 20
    },       
  });

  return (
    <View style={S.content}>
      <Text style={S.header}>
        Support Request
      </Text>      
      <View
        style={{ flex: 1 }}
        // keyboardShouldPersistTaps='always'
      >
        <LabelText label="Name">Name</LabelText>
        <LabelText label="Email Address">email@gmail.com</LabelText>
        <DropDown
          label='Hotel'
          items={hotels.map(
            (hotel: any) => ({
              label: hotel.hotel_name,
              value: hotel.id
            })
          )}
          onValueChange={(itemValue) => { setHotel(itemValue as number) }}
          selectedValue={hotel}
          nullable={true}
        />
        <DropDown
          label='Subject'
          items={[
            { label: 'Profile', value: 'profile ' },
            { label: 'Booking', value: 'booking' },
            { label: 'Schedule', value: 'schedule' },
            { label: 'Rating and Reviews', value: 'rating' },
            { label: 'Other', value: 'other' },
          ]}
          onValueChange={(itemValue) => setSubject(itemValue as string) }
          selectedValue={subject}
          nullable={false}
        />
        <CustomTextInput
          label='Message'
          placeholder='Type your message...'
          onChangeText={setMessage}
          value={message}
          numberOfLines={6}
          maxLength={1000}
        />       
      </View>
      <View style={{ 
        flex: 1,
        justifyContent: 'flex-end',
      }}>
        <Button
          title="Save"
          buttonStyle={theme.form.button.style}
          titleStyle={theme.form.button.title}
          onPress={onSuccess}
        />
      </View>
    </View>
  );
};

export default SupportRequest;