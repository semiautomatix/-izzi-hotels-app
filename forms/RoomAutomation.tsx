import React, { FunctionComponent, useContext, useState  } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { Text } from 'react-native-elements';
import axios from 'axios';

import ThemeContext, { widthPercentageToDP, heightPercentageToDP } from '../context/ThemeContext';

// utils
import * as messages from '../utils/messages';

import AutomationButton from '../components/AutomationButton';
import Loading from '../components/Loading';

interface RoomAutomationProps {
}

const RoomAutomation: FunctionComponent<RoomAutomationProps> = () => {
  const [buttons, setButtons] = useState<any[]>([
    {
      id: 1,
      label: 'Lights',
      iconName: 'lightbulb-on-outline',
      iconType: 'material-community',
      state: 'off'
    },
    {
      id: 2,
      label: 'Television',
      iconName: 'television',
      iconType: 'material-community',
      state: 'off'
    },
    {
      id: 3,
      label: 'Air Conditioner',
      iconName: 'ac-unit',
      state: 'off'
    },
    {
      id: 4,
      label: 'Coffee',
      iconName: 'coffee-outline',
      iconType: 'material-community',
      state: 'off'
    },
  ]);
  const [loading, setLoading] = useState<boolean>(false);
    
  const theme: any = useContext(ThemeContext);

  const S = StyleSheet.create({
    scene: {
      flex: 1,
      backgroundColor: theme.scene.backgroundColor,
      alignItems: 'center',
      padding: heightPercentageToDP(5) 
    },
    content: {
      backgroundColor: theme.colors.snow,
      height: '100%',
      marginTop: 30,
      padding: widthPercentageToDP(7.5),
      flexDirection: 'column',
      width: widthPercentageToDP(100)
    },
    header: {
      color: theme.colors.snow,
      fontFamily: theme.form.header.fontFamily,
      fontSize: theme.form.header.fontSize,
      margin: 0,
      marginBottom: 20
    },
    row: {
      flexDirection: 'row'
    }
  });

  const buttonRows = buttons.reduce(function(result, value, index, array) {
    if (index % 2 === 0)
      result.push(array.slice(index, index + 2));
    return result;
  }, []);

  const triggerAction = async (id: number) => {    
    setLoading(true);
    /*const response = await axios.post('https://sonoff-eb.cf/get_reading', {
      mail:"thomas@electricbench.co.za",
      password:"78#IzziApp",
    });*/
    const response = await axios.post('https://sonoff-eb.cf/toggle', {
      mail:"thomas@electricbench.co.za",
      password:"78#IzziApp",
    });
    console.log(response)
    const { data } = response;
    if (Object.keys(data).length === 0) {
      messages.showMessage('Device did not respond');
      buttons.map(
        (button) => {
          if (button.id === id) {
            button.state = 'off'
          }
          return button;
        }
      )      
    } else {
      buttons.map(
        (button) => {
          if (button.id === id) {
            button.state = button.state === data.state
          }
          return button;
        }
      )
    }
    setLoading(false);
  }

  return (
    <View style={S.scene}>
      <Text style={S.header}>
        Room Automation
      </Text>  
      <View style={S.content}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={loading}
        >
          <View
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              flex: 1
            }}
          >
            <Loading />
          </View>
        </Modal>
        {buttonRows.map(
          (row: any[]) =>
            <View style={S.row}>  
              {row.map(
                (button) => <AutomationButton 
                  iconName={button.iconName}
                  iconType={button.iconType}
                  label={button.label}
                  on={button.state === 'on'}
                  onPress={() => triggerAction(button.id)}
                />
              )}
            </View>  
        )}       
      </View>      
    </View>
  )
}

export default RoomAutomation;