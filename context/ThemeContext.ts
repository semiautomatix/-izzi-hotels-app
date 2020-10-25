import React, {createContext} from 'react';

import { hexToRgbA } from '../utils/colors';
import { Dimensions, PixelRatio } from 'react-native';
import { StatusBarHeight } from '../utils/dimensions';

export const primaryColor = '#2d3164';
export const secondaryColor = '#1b1b36';

export const widthPercentageToDP = (widthPercent: string | number) => {
  const screenWidth = Dimensions.get('window').width;
  // Convert string input to decimal number
  const elemWidth = parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel(screenWidth * elemWidth / 100);
};

export const heightPercentageToDP = (heightPercent: string | number) => {
  const screenHeight = Dimensions.get('window').height;
  // Convert string input to decimal number
  const elemHeight = parseFloat(heightPercent);
return PixelRatio.roundToNearestPixel(screenHeight * elemHeight / 100);
};

export const theme = {
  primaryColor: primaryColor,
  secondaryColor: secondaryColor,
  font: {
    primaryColor: primaryColor,
    secondaryColor: secondaryColor,
  },
  colors: {
    primary: primaryColor,
    secondary: secondaryColor,
    skyGrey: '#c4c7c9',
    snow: '#ffffff',
    ebony: '#000000',
    error: '#ff0000'
  },
  form: {
    input: {
      backgroundColor: hexToRgbA(primaryColor, 0.2),
      color: primaryColor,
      fontSize: heightPercentageToDP(2),
      height: heightPercentageToDP(6.5),
      borderRadius: 10,
      label: {
        color: primaryColor,
        fontSize: heightPercentageToDP(2.2),
        fontWeight: 'bold'
      },
      placeHolder: {
        color: hexToRgbA(primaryColor, 0.2),
      },
      dateTimeInput: {
        fontSize: heightPercentageToDP(1.3),
      }
    },
    header: {
      fontFamily: 'roboto-bold',
      fontSize: heightPercentageToDP(4),
      color: primaryColor
    },
    button: {
      container: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: heightPercentageToDP(21),
        marginTop: heightPercentageToDP(2),
      },
      style: {
        backgroundColor: primaryColor,
        borderRadius: 10,
        height: heightPercentageToDP(8),
        paddingBottom: 15      
      },
      title: {
        fontFamily: 'roboto-bold',
        fontSize: heightPercentageToDP(3),
        color: '#ffffff',  
      }
    }
  },
  scene: {
    backgroundColor: primaryColor,
    logo: {
      container: {
        marginTop: StatusBarHeight + heightPercentageToDP(2),
        alignItems: 'center',
        height: heightPercentageToDP(12),       
      },
      image: {
        maxHeight: heightPercentageToDP(12),
        maxWidth: widthPercentageToDP(33.33),
        resizeMode: 'contain',
      },
    }
  },
  overlay: {
    width: Dimensions.get("window").width - 50,
    height: Dimensions.get("window").height - 50,
    window: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    backgroundColor: '#ffffff',   
    style: {
      borderRadius: 30,
      // position: 'absolute',
      top: 20,
    }
  },
  topTabBar: {
    style: {
      backgroundColor: `rgba(0, 0, 0, 0.4)`,
      position: 'absolute',
      top: 0,
      left: 30,
      right: (Dimensions.get('window').width / 3) - 30,
      elevation: 0,
      height: 50,      
    },
    indicator: {
      backgroundColor: 'white',
      marginBottom: 5      
    },
    label: {
      fontSize: heightPercentageToDP(2.1)
    }    
  },
  tabBar: {
    activeTintColor: primaryColor,
    inactiveTintColor: "#FFFFFF",
    height: widthPercentageToDP(17.8),
    marginTop: widthPercentageToDP(5),
    image: {
      top: heightPercentageToDP(0.26) * -1,      
      width: widthPercentageToDP(24),
      height: widthPercentageToDP(11.8),
      alignItems: 'center',
      justifyContent: 'center'      
    },
    activeIconContainer: {
      top: heightPercentageToDP(2.5) * -1,
      backgroundColor: "#c4c7c9",
      borderRadius: 50,
      width: widthPercentageToDP(14),
      maxHeight: widthPercentageToDP(14),
      marginBottom: heightPercentageToDP(2.5) * -1,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'      
    },
    inactiveIconContainer: {
      paddingTop: heightPercentageToDP(2),
    }    
  },
  events: {
    search: {
      result: {
        container: {
          height: heightPercentageToDP(20),
          width: Dimensions.get('window').width,
        },
        content: {
          height: heightPercentageToDP(20),
          width: Dimensions.get('window').width - widthPercentageToDP(20),
          //top: 0,
          top: heightPercentageToDP(-20),
          // backgroundColor: 'black',
          //opacity: 0.5,
          paddingLeft: 30,
          paddingRight: 30,
          // paddingTop: 60        
          paddingTop: 10
        },
      },
      placeHolder: {
        container: {
          flexDirection: 'row',
          backgroundColor: '#c4c7c9',
          marginBottom: 20
        },
        style: {
          height: heightPercentageToDP(20),
          width: Dimensions.get('window').width,
          backgroundColor: '#c4c7c9',
          //opacity: 0.6,
          paddingLeft: 30,
          paddingRight: 30,
          paddingTop: 60,
        }
      },      
    }
  },
  header1: {
    fontFamily: 'josefin-sans-bold',
    fontSize: 30,
    color: primaryColor,
    paddingVertical: 20
  },
  header2: {
    fontFamily: 'josefin-sans-bold',
    fontSize: 20,
    color: primaryColor,
    paddingVertical: 20
  },  
  header3: {
    fontFamily: 'josefin-sans-bold',
    fontSize: 16,
    color: primaryColor,
    paddingVertical: 20
  },    
  text1: {
    fontFamily: 'roboto-medium',
    fontSize: 15,
    color: secondaryColor,
    paddingBottom: 5
  },
  text2: {
    fontFamily: 'roboto-medium',
    fontSize: 18,
    color: secondaryColor,
    paddingBottom: 5
  },
  link: {
    fontFamily: 'roboto-medium',
    fontSize: 18,
    color: primaryColor,
    paddingBottom: 5  
  },
  iconButton: {
    container: {
      width: widthPercentageToDP(33),
      marginVertical: 10    
    },
    button: {
      borderRadius: 0,
      borderWidth: 1,
      borderColor: primaryColor,
      justifyContent: 'flex-start'
    },
    title: {
      color: primaryColor,
      paddingLeft: 5,
      flex: 1,
      alignItems: 'center'
    }
  }
};

const ThemeContext = createContext(theme);

export default ThemeContext;