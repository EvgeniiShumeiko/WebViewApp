/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import WebContent from './app/components/WebContent';

const App: () => React$Node = () => {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView backgroundColor="#64aa46" />
      <WebContent uri="https://suhba.store" />
    </>
  );
};

export default App;
