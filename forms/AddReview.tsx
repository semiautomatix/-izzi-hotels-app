import React, { useContext, FunctionComponent, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, Rating } from 'react-native-elements';
import * as yup from 'yup';

import ThemeContext from '../context/ThemeContext';

// GraphQL
import { useCreateRating } from '../graphql/bookings/mutations';

import * as messages from '../utils/messages';

import LabelText from '../components/LabelText';
import CustomTextInput from '../components/CustomTextInput';
import { ratingsQuery } from '../graphql/bookings/queries';

interface AddReviewProps {
  hotel: any,
  onSuccess: () => void
}

const AddReview: FunctionComponent<AddReviewProps> = ({ hotel, onSuccess }) => {
  const [rating, setRating] = useState<number>(2.5);
  const [review, setReview] = useState<string>("");
  const [errors, setErrors] = useState<yup.ValidationError[]>([]);  

  const theme: any = useContext(ThemeContext);

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
    labelStyle: {
      color: theme.form.input.label.color,      
      fontWeight: theme.form.input.label.fontWeight,  
      fontSize: theme.form.input.label.fontSize,
      paddingBottom: 5,
      paddingLeft: 10
    },           
  });

  const [useCreateRatingFn] = useCreateRating({
    // should authentication be successful store token and navigate to home screen
    async update(cache, { data: { createRating: { ok, rating }} }) {      
      if (ok) {
        const { ratings } = cache.readQuery({ query: ratingsQuery });
        cache.writeQuery({
          query: ratingsQuery,
          data: { ratings: ratings.concat([rating]) },
        });        
        onSuccess();
      } else {
        messages.showMessage('Failed to submit review');
      }
    }
  });    

  // validation schema
  const schema = yup.object().shape({
    rating: yup.number().required().label("Rating"),
    review: yup.string().required().label("Review"),
  });    

  const createRating = async () => {
    try {
      // validate fields
      await schema.validate(
        {
          rating,
          review
        }, {abortEarly: false}
      )
      // if validation finds not errors clear errors then attempt authentication
      setErrors([]);
      try {
        await useCreateRatingFn(              
          {
            variables: {
              input: {
                hotelId: hotel.id,
                rating,
                review
              }
            }
          }
        );         
        onSuccess();                    
      } catch (err) {
        // translate error
        console.log(err);
        messages.showMessage('Failed to submit review');
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
        Submit Review
      </Text>      
      <View
        style={{ flex: 1 }}
        // keyboardShouldPersistTaps='always'
      >
        <LabelText label="Hotel">{hotel.hotelName}</LabelText>
        <Text style={S.labelStyle}>Rating</Text>
        <View>
          <Rating 
            imageSize={30}    
            startingValue={rating}      
            onFinishRating={setRating}
          />
        </View>
        <CustomTextInput
          label='Review'
          placeholder='Type your review here...'
          onChangeText={setReview}
          value={review}
          numberOfLines={6}
          maxLength={1000}
          error={errors.find((error) => error.path === 'review')}
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
          onPress={createRating}
        />
      </View>
    </View>
  );
};

export default AddReview;