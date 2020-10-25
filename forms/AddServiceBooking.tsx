import React, { FunctionComponent, useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';
import moment from 'moment';
import * as yup from 'yup';

import * as messages from '../utils/messages';

// GraphQL
import { useAllHotelServicesQuery } from '../graphql/hotels/queries';
import { useCreateServiceBooking } from '../graphql/bookings/mutations';
import { serviceBookingsQuery, useBookingsQuery } from '../graphql/bookings/queries';

import ThemeContext from '../context/ThemeContext';

import CustomDateTimeInput from '../components/CustomDateTimeInput';
import DropDown from '../components/DropDown';


interface AddServiceProps {
  onSuccess: () => void
}

const AddServiceBooking: FunctionComponent<AddServiceProps> = ({ onSuccess }) => {
  const [startDateTime, setStartDateTime] = useState<Date>(undefined);
  const [endDateTime, setEndDateTime] = useState<Date>(undefined);
  const [errors, setErrors] = useState<yup.ValidationError[]>([]);
  const [type, setType] = useState<string>('MEETING_ROOM');
  const [hotelId, setHotelId] = useState<number>(undefined);
  const [serviceId, setServiceId] = useState<number>(undefined);

  const theme = useContext(ThemeContext);

  const { loading, error, data } = useAllHotelServicesQuery(); 

  const S = StyleSheet.create({
    content: {
      backgroundColor: theme.colors.snow,
      height: '100%',
      justifyContent: 'flex-start',
      flexDirection: 'column'
    },
  });

  const [useCreateServiceBookingFn] = useCreateServiceBooking({
    // should authentication be successful store token and navigate to home screen
    async update(cache, { data: { createServiceBooking: { ok, serviceBooking }} }) {      
      if (ok) {
        /*const { serviceBookings } = cache.readQuery({ query: serviceBookingsQuery });
        cache.writeQuery({
          query: serviceBookingsQuery,
          data: { serviceBookings: serviceBookings.concat([serviceBooking]) },
        });  */
        onSuccess();
      } else {
        onFailedServiceBooking();
      }
    }
  });    

  // validation schema
  const schema = yup.object().shape({
    hotelId: yup.number().required().label("Hotel"),
    serviceId: yup.number().required().label("Meeting Room"), // only applicable for meeting rooms, co-share will always be set
    startDateTime: yup.date().required().label("Start Time"),
    endDateTime: yup.date().required().label("End Time"),
  });  

  const createServiceBooking = async () => {
    try {
      // validate fields
      await schema.validate(
        {
          hotelId,
          startDateTime,
          endDateTime,
          serviceId
        }, {abortEarly: false}
      )
      // if validation finds not errors clear errors then attempt authentication
      setErrors([]);
      try {
        await useCreateServiceBookingFn(              
          {
            variables: {
              input: {
                serviceId,
                startDateTime,
                endDateTime,
              }
            }
          }
        );                                  
      } catch (err) {
        // translate error
        onFailedServiceBooking();
      }   
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setErrors(err.inner);
      } else {
        console.error(err);
      }
    }      
  }  

  const onFailedServiceBooking = (message?: string) => {
    messages.showMessage(message ? message : 'Service Booking failed');
  }   

  if (loading) return null;

  const { allHotels } = data;

  return (
    <View>
      <View style={S.content}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            width: '100%',
          }}
        >
          <Button
            title="Meeting"
            containerStyle={{
              marginTop: -11,
              marginLeft: -11,
              flex: 1,
            }}
            buttonStyle={{
              borderRadius: 0,
              borderTopLeftRadius: 30,
              height: 75,
              backgroundColor: type === 'MEETING_ROOM' ? theme.colors.primary : theme.colors.skyGrey
            }}
            onPress={() => setType('MEETING_ROOM')}
          />
          <Button
            title="Co-share"
            containerStyle={{
              marginTop: -11,
              marginRight: -11,
              flex: 1,
            }}
            buttonStyle={{
              borderRadius: 0,
              borderTopRightRadius: 30,
              height: 75,
              backgroundColor: type !== 'MEETING_ROOM' ? theme.colors.primary : theme.colors.skyGrey
            }}
            onPress={() => setType('CO_SHARE')}
          />
        </View>
        <DropDown
          label='Hotel'
          items={allHotels.filter(
            (hotel: any) => {
              let exists = false;
              hotel.serviceSet.forEach(
                (service: any) => {
                  if (service.serviceType === type) {
                    exists = true;
                  }
                }
              );
              return exists;
            }
          ).map(
            (hotel: any) => ({
              label: hotel.hotelName,
              value: hotel.id
            })
          ).reduce( // filter out duplicates
            (acc: any[], cur: any) => {
              let found = false;
              acc.forEach(
                (row: any) => {                  
                  if (row.value === cur.value) found = true
                }                
              );
              return found ? acc : [...acc, cur];
            }, []
          ).sort( // sort by hotel name
            (a: any, b: any) => a.label === b.label ? 0 : a.label > b.label ? 1 : -1 
          )} 
          onValueChange={(itemValue, itemIndex) => {             
            setHotelId(itemValue);
            // if co-share need to set to the co-share service id
            if (itemValue && type === 'CO_SHARE') {
              setServiceId(allHotels.find(
                (hotel: any) => hotel.id === itemValue
              ).serviceSet.find(
                (service: any) => service.serviceType === 'CO_SHARE'
              ).id);
            }
          }}
          selectedValue={hotelId}
          nullable={true}
          error={errors.find((error) => error.path === 'hotelId')}
        />
        {type === 'MEETING_ROOM' ? <DropDown
          label='Meeting Room'
          items={hotelId ? allHotels.find(
            (hotel: any) => hotel.id === hotelId
          ).serviceSet.filter(
            (service: any) => service.serviceType === type
          ).map(
            (service: any) => ({
              label: service.meetingRoom,
              value: service.id
            })
          ).sort( // sort by hotel name
            (a: any, b: any) => a.label === b.label ? 0 : a.label > b.label ? 1 : -1 
          ) : []} 
          onValueChange={(itemValue, itemIndex) => { setServiceId(itemValue) }}
          selectedValue={serviceId}
          nullable={true}
          error={errors.find((error) => error.path === 'serviceId')}
        /> : null}  
        <CustomDateTimeInput
          label='Start Time'
          placeholder='Event Start Time'
          onDateTimeChange={setStartDateTime}
          value={startDateTime && moment(startDateTime).format('DD MMM YYYY hh:mm A')}
          error={errors.find((error) => error.path === 'startDateTime')}
        />
        <CustomDateTimeInput
          label='End Time'
          placeholder='Event End Time'
          onDateTimeChange={setEndDateTime}
          value={endDateTime && moment(endDateTime).format('DD MMM YYYY hh:mm A')}
          error={errors.find((error) => error.path === 'endDateTime')}
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
          onPress={createServiceBooking}
        />
      </View>
    </View>
  )
}

export default AddServiceBooking;