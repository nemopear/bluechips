'use strict';

import React, { Component } from 'react';
var t = require('tcomb-form-native');
import {
  Text,
  View,
  TouchableHighlight,
} from 'react-native';

var Header = require('../common/header');
var StyleSheet = require('StyleSheet');
var Form = t.form.Form;

var Direction = t.struct({
  from: t.String,
  to: t.String
});

var options = {}; // optional rendering options (see documentation)

class DirectionFormView extends Component {

  componentDidMount() {
      this.refs.form.getComponent('from').refs.input.focus();
  }

  onPress() {
    // call getValue() to get the values of the form
    var value = this.refs.form.getValue();
    if (value) { // if validation fails, value will be null
      console.log(value); // value here is an instance of Person
    }
  }

  render() {
    return (
      <View>
        <Header
          title={this.props.title}
          style={styles.header}
          leftItem={{
            title: 'Back',
            onPress: () => this.props.navigator.pop(),
          }}
        />
        <View style={styles.container}>
          <Form
            ref="form"
            type={Direction}
            options={options}
          />
          <TouchableHighlight style={styles.button} onPress={this.onPress.bind(this)} underlayColor='#99d9f4'>
            <Text style={styles.buttonText}>Find</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 50,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 30,
    alignSelf: 'center',
    marginBottom: 30
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  header: {
    backgroundColor: '#999999',
    height: 60
  }
});

module.exports = DirectionFormView;
