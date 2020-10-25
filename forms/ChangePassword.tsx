import React, { useContext, FunctionComponent, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-elements';
import * as yup from 'yup';

import ThemeContext from '../context/ThemeContext';

import * as messages from '../utils/messages';
import * as validations from '../utils/validations';

import CustomInput from '../components/CustomInput';
import { useChangePassword } from '../graphql/users/mutations';

yup.addMethod(yup.string, 'equalTo', validations.equalTo);

interface ChangePasswordProps {
  onSuccess: () => void
}

const ChangePassword: FunctionComponent<ChangePasswordProps> = ({ onSuccess }) => {
  // get theme from context
  const theme: any = useContext(ThemeContext);

  // local state
  const [oldPassword, setOldPassword] = useState<string>(undefined);
  const [newPassword, setNewPassword] = useState<string>(undefined);
  const [confirmPassword, setConfirmPassword] = useState<string>(undefined);
  const [errors, setErrors] = useState<yup.ValidationError[]>([]);

  // styles
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
  const [useChangePasswordMutationFn] = useChangePassword({
    // should authentication be successful store token and navigate to home screen
    async update(cache, { data: { changePassword: { ok }} }) {      
      if (ok) {
        onSuccess();
      } else {
        messages.showMessage('Failed to change password');
      }
    }
  });  

  // validation schema
  const schema = yup.object().shape({
    oldPassword: yup.string().required().label("Old Password"),
    newPassword: yup.string().required().label("New Password"),
    // @ts-ignore
    confirmPassword: yup.string().equalTo(yup.ref('newPassword'), 'Passwords must match').required().label('Confirm Password'),
  });  

  const updatePassword = async () => {
    try {
      // validate fields
      await schema.validate(
        {
          oldPassword,
          newPassword,
          confirmPassword
        }, {abortEarly: false}
      )
      // if validation finds not errors clear errors then attempt authentication
      setErrors([]);
      try {
        await useChangePasswordMutationFn(              
          {
            variables: {
              newPassword,
              confirmPassword,
              oldPassword
            }
          }
        );         
        onSuccess();                    
      } catch (err) {
        // translate error
        messages.showMessage('Failed to change password');
      }   
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setErrors(err.inner);
      } else {
        console.error(err);
      }
    }        
  }

  return (
    <View style={S.content}>
      <Text style={S.header}>
        Change Password
      </Text>      
      <View
        style={{ flex: 1 }}
        // keyboardShouldPersistTaps='always'
      >
        <CustomInput
          label='Old Password'
          onChangeText={setOldPassword}
          value={oldPassword}
          secureTextEntry={true}
          error={errors.find((error) => error.path === 'oldPassword')}
        />
        <CustomInput
          label='New Password'
          onChangeText={setNewPassword}
          value={newPassword}
          secureTextEntry={true}
          error={errors.find((error) => error.path === 'newPassword')}
        />
        <CustomInput
          label='Confirm Password'
          onChangeText={setConfirmPassword}
          value={confirmPassword}
          secureTextEntry={true}
          error={errors.find((error) => error.path === 'confirmPassword')}
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
          onPress={updatePassword}
        />
      </View>
    </View>
  );
};

export default ChangePassword;