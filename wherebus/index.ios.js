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
  View,
  NavigatorIOS
} from 'react-native';

var Dashboard = require('../wherebus/js/dashboard');

class wherebus extends Component {
  render() {
    return (
      <Dashboard />
    );
  }
}

AppRegistry.registerComponent('wherebus', () => wherebus);
