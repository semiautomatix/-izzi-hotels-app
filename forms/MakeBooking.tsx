import React, { FunctionComponent, useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-elements';
import moment from 'moment';

import ThemeContext from '../context/ThemeContext';

import { store } from '../store';

import CustomDateInput from '../components/CustomDateInput';
import CounterInput from '../components/CounterInput';

interface MakeBookingProps {
  hotel: any,
  onSuccess: () => void
}

const MakeBooking: FunctionComponent<MakeBookingProps> = ({ hotel, onSuccess }) => {
  const [startDate, setStartDate] = useState<Date>(undefined);
  const [endDate, setEndDate] = useState<Date>(undefined);
  const [numberOfAdults, setNumberOfAdults] = useState<number>(0);
  const [numberOfChildren, setNumberOfChildren] = useState<number>(0);

  const theme = useContext(ThemeContext);

  // @ts-ignore
  const { state } = useContext(store);

  const S = StyleSheet.create({
    content: {
      backgroundColor: theme.colors.snow,
      justifyContent: 'flex-start',
      flexDirection: 'column',
      height: '100%'
    },
  });

  return (
    <View style={S.content}>
      <View
        style={{
          borderRadius: 0,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          height: 75,
          backgroundColor: theme.colors.primary,
          marginTop: -11,
          marginLeft: -11,          
          marginRight: -11,
          marginBottom: 10
        }}
      >
        <Text 
          style={{ 
            color: theme.colors.snow,
            fontFamily: 'josefin-sans-bold', 
            fontSize: 30, 
            margin: 0, 
            paddingTop: 10,
            textAlign: 'center',
          }}
          numberOfLines={1}          
        >
          {hotel.hotelName}          
        </Text>
      </View>
      <View>
        <CustomDateInput
          label='Start Date'
          placeholder='Booking Start Date'
          onDateChange={setStartDate}
          value={startDate && moment(startDate).format('DD MMM YYYY')}
        />
        <CustomDateInput
          label='End Date'
          placeholder='Booking End Time'
          onDateChange={setEndDate}
          value={endDate && moment(endDate).format('DD MMM YYYY')}
        />     
        <CounterInput 
          label='Adults'
          value={numberOfAdults}
          onChangeValue={setNumberOfAdults}
          minimum={0}
        />       
        <CounterInput 
          label='Adults'
          value={numberOfChildren}
          onChangeValue={setNumberOfChildren}
          minimum={0}
        />         
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end'
        }}
      >
        <Button
          title="Save"
          buttonStyle={theme.form.button.style}
          titleStyle={theme.form.button.title}
          onPress={onSuccess}
        />
      </View>
    </View>
  )
}

export default MakeBooking;