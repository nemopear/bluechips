/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

var SQLite = require('react-native-sqlite-storage')
var BusListContainerView = require('../wherebus/js/components/buslist');

class wherebus extends Component {
  render() {
    return (
      <View style={styles.container}>
        <BusListContainerView/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});

AppRegistry.registerComponent('wherebus', () => wherebus);
