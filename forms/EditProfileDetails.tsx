import React, { useContext, FunctionComponent, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-elements';

import ThemeContext from '../context/ThemeContext';

import { store } from '../store';

import DropDown from '../components/DropDown';

interface EditProfileDetailsProps {
  onSuccess: () => void
}

const EditProfileDetails: FunctionComponent<EditProfileDetailsProps> = ({ onSuccess }) => {
  const [nationality, setNationality] = useState<string>(undefined);
  const [ageRange, setAgeRange] = useState<string>(undefined);
  const [gender, setGender] = useState<string>(undefined);

  const theme = useContext(ThemeContext);

  // @ts-ignore
  const { state } = useContext(store);
  const { nationalities } = state;

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
    label: {
      fontSize: 16,
      marginLeft: 10,
      color: 'grey',
      fontWeight: 'normal'
    }
  });

  return (
    <View style={S.content}>
      <Text style={S.header}>
        Profile Details
      </Text>       
      <View
        style={{ flex: 1 }}
        // keyboardShouldPersistTaps='always'
      >
        <DropDown
          label='Nationality'
          items={nationalities.map(
            (nationality: string) => ({
              label: nationality,
              value: nationality
            })
          )}
          onValueChange={(itemValue, itemIndex) => { setNationality(itemValue) }}
          selectedValue={nationality}
          nullable={true}
        />
        <DropDown
          label='Age Range'
          items={[
            { label: '18 - 24', value: '18_24' },
            { label: '25 - 34', value: '25_34' },
            { label: '35 - 44', value: '35_44' },
            { label: '45 - 54', value: '45_54' },
            { label: '55 - 64', value: '18_24' },
            { label: '65+', value: '65' },
          ]}
          onValueChange={(itemValue, itemIndex) => { setAgeRange(itemValue) }}
          selectedValue={ageRange}
          nullable={true}
        />
        <DropDown
          label='Gender'
          items={[
            { label: 'Female', value: 'female' },
            { label: 'Male', value: 'male' },
            { label: 'Non Binary', value: 'non_binary' },
          ]}
          onValueChange={(itemValue, itemIndex) => { setGender(itemValue) }}
          selectedValue={gender}
          nullable={true}
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

export default EditProfileDetails;