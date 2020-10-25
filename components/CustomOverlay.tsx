
import React, { FunctionComponent, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { OverlayProps, Overlay } from 'react-native-elements';

import ThemeContext from '../context/ThemeContext';

interface CustomOverlayProps extends OverlayProps {
  onClose: () => void
}

const CustomOverlay: FunctionComponent<CustomOverlayProps> = ({ 
  onClose, 
  windowBackgroundColor, 
  overlayBackgroundColor, 
  width, 
  height,
  overlayStyle,
  onBackdropPress,
  onRequestClose,
  children,
  ...rest
}) => {
  const theme = useContext(ThemeContext);

  const combinedOverlayStyle = StyleSheet.flatten([theme.overlay.style, overlayStyle]);

  return (
    <Overlay
      windowBackgroundColor={windowBackgroundColor ? windowBackgroundColor : theme.overlay.window.backgroundColor}
      overlayBackgroundColor={overlayBackgroundColor ? overlayBackgroundColor : theme.overlay.backgroundColor}
      width={width ? width : theme.overlay.width}
      height={height ? height : theme.overlay.height}
      overlayStyle={combinedOverlayStyle}
      onBackdropPress={onBackdropPress || onClose}
      onRequestClose={onRequestClose || onClose}
      {...rest}
    >
      {children}
    </Overlay>       
  )
}

export default CustomOverlay;