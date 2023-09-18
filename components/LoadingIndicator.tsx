import React from 'react';
import { View } from 'react-native';
import { Spinner } from '@ui-kitten/components';

const LoadingIndicator = (props: any) => {
  const { style, indicator } = props;
  return (
    <View style={[style, indicator]}>
      <Spinner size="small" />
    </View>
  );
};

export default LoadingIndicator;
