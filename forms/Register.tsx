import React, { useContext, FunctionComponent, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-elements';
import * as yup from 'yup';

// GraphQL
import { useRegister } from '../graphql/users/mutations';

import * as messages from '../utils/messages';

import ThemeContext from '../context/ThemeContext';

import CustomInput from '../components/CustomInput';

interface RegisterProps {
  onSuccess: () => void
}

const Register: FunctionComponent<RegisterProps> = ({ onSuccess }) => {
  const [firstName, setFirstName] = useState<string>(undefined);
  const [lastName, setLastName] = useState<string>(undefined);
  const [emailAddress, setEmailAddress] = useState<string>(undefined);
  const [errors, setErrors] = useState<yup.ValidationError[]>([]);  
  
  const theme = useContext(ThemeContext);

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


  // GraphQL 
  const [useRegisterMutationFn] = useRegister({
    // should authentication be successful store token and navigate to home screen
    async update(cache, { data: { register: { ok }} }) {      
      if (ok) {
        onSuccess();
      } else {
        onFailedRegistration('Registration failed');
      }
    }
  });  

  // validation schema
  const schema = yup.object().shape({
    firstName: yup.string().required().label("First Name"),
    lastName: yup.string().required().label("Last Name"),
    emailAddress: yup.string().email().required().label("Email Address"),
  });  

  const registerUser = async () => {
    try {
      // validate fields
      await schema.validate(
        {
          firstName,
          lastName,
          emailAddress
        }, {abortEarly: false}
      )
      // if validation finds not errors clear errors then attempt authentication
      setErrors([]);
      try {
        await useRegisterMutationFn(              
          {
            variables: {
              firstName,
              lastName,
              emailAddress
            }
          }
        );                          
      } catch (err) {
        // translate error
        onFailedRegistration(err.message.includes('Duplicate entry') ? 'Email address already in use' : null);
      }   
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setErrors(err.inner);
      } else {
        console.error(err);
      }
    }        
  }  

  const onFailedRegistration = (message?: string) => {
    messages.showMessage(message ? message : 'Registration failed');
  }  

  return (
    <View style={S.content}>
      <Text style={S.header}>
        Register
      </Text>  
      <View
        style={{ flex: 1 }}
        // keyboardShouldPersistTaps='always'
      >
        <CustomInput
          label='First Name'
          onChangeText={setFirstName}
          value={firstName}
          error={errors.find((error) => error.path === 'firstName')}
        />
        <CustomInput
          label='Last Name'
          onChangeText={setLastName}
          value={lastName}
          error={errors.find((error) => error.path === 'lastName')}
        />
        <CustomInput
          label='Email Address'
          onChangeText={setEmailAddress}
          value={emailAddress}
          error={errors.find((error) => error.path === 'emailAddress')}
          autoCompleteType="email"
        />
      </View>
      <View style={{ 
        flex: 1,
        justifyContent: 'flex-end',
      }}>
        <Button
          title="Submit"
          buttonStyle={theme.form.button.style}
          titleStyle={theme.form.button.title}
          onPress={registerUser}
        />
      </View>
    </View>
  );
};

export default Register;