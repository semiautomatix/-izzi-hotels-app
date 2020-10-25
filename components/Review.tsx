import React, { FunctionComponent, useContext, useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Text, Divider, TextProps } from 'react-native-elements';
// @ts-ignore
import { PYTHON_SERVER_BASE_URL } from 'react-native-dotenv';

import ThemeContext from '../context/ThemeContext';

import Rating from '../components/Rating';

interface ReviewProps {
  rating: any
}

const ReviewText: FunctionComponent<TextProps> = ({ children }) => {
  const [isShowMore, setShowMore] = useState<boolean>(false);

  const theme = useContext(ThemeContext);

  return (
    <View>
      <Text
        numberOfLines={isShowMore ? 0 : 5}
      >
        {children}
      </Text>
      <Text
        style={{
          marginTop: 5,
          color: theme.colors.primary
        }}
        onPress={() => setShowMore(!isShowMore)}
      >
        {isShowMore ? "Read Less..." : "Read More..."}
      </Text>      
    </View>
  )
}

const Review: FunctionComponent<ReviewProps> = ({ rating }) => {

  const theme = useContext(ThemeContext);

  const { rating: stars, review, user: { firstName, lastName, usermetadata: { profilePicture }} } = rating;

  const S = StyleSheet.create({
    content: {
      backgroundColor: theme.colors.snow,
      height: '100%',
      justifyContent: 'flex-start',
      flexDirection: 'column'
    },
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.primary
    },
  });

  const imgSrc = profilePicture ? `uri: ${PYTHON_SERVER_BASE_URL}${profilePicture}` : require('../assets/profile.jpg');

  return (
    <View
      style={{
        flexDirection: 'column',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
        }}
      >
        <View
          style={{
            margin: 10,
          }}
        >
          <Image
            source={imgSrc}
            style={{
              width: 80,
              height: 80,
              borderRadius: 100
            }}
          />
        </View>
        <View
          style={{
            margin: 10,
            flex: 1
          }}
        >
          <Text
            style={{
              fontWeight: 'bold'
            }}
          >
            {firstName} {lastName}
          </Text>
          <Rating
            value={stars}
            count={5}
          />
          <ReviewText>
            {review}
          </ReviewText>
        </View>
      </View>
      <Divider
        style={{
          marginLeft: 60,
        }}
      />
    </View>
  );

}

export default Review;