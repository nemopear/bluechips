import React, { Component } from 'react';
var SQLite = require('react-native-sqlite-storage');
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  RecyclerViewBackedScrollView,
  ListView
} from 'react-native';

var Header = require('../common/header');
var SGListView = require('react-native-sglistview');

class BusListContainerView extends Component {

  errorCB(err) {
    console.log("SQL Error: " + err);
  }

  successCB() {
    console.log("SQL executed fine");
  }

  openCB() {
    console.log("Database OPENED");
  }

  constructor(props) {
    super(props);
    var self = this;
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var db = SQLite.openDatabase({name : "db.sqlite3", createFromLocation : 1}, this.successCB, this.errorCB);
    db.transaction((tx) => {
      tx.executeSql("SELECT id, name, bus_name FROM buses_bus", [], (tx, results) => {
          console.log("Query completed");
          var len = results.rows.length;
          var _results = [];
          for (let i = 0; i < len; i++) {
              let row = results.rows.item(i);
              _results.push(row);
          }
          self.setState({dataSource: ds.cloneWithRows(_results), loading: false});
        });
    });

    this.state = {
      loading: true,
      dataSource: null
    };
  }

  rowPressed(data) {
    this.props.navigator.push({
      busline: true,
      bus: data,
    });
  }

  renderRow(rowData, sectionID, rowID) {
    return (
      <TouchableHighlight onPress={() => this.rowPressed(rowData)}
                          underlayColor='#dddddd'>
        <View>
          <View style={styles.rowContainer}>
            <Text style={styles.text}>
              {rowData.bus_name}
            </Text>
          </View>
          <View style={styles.separator}/>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <View style={styles.content}>
        <Header
          title={this.props.title}
          style={styles.header}
          rightItem={{
            title: 'Direction',
            onPress: () => this.props.navigator.push({directionform: true})
          }}
        />
      {this.state.loading? (
        <View style={styles.container}>
          <Text style={styles.title}>รอสักครู่</Text>
        </View>
      ): ( <SGListView dataSource={this.state.dataSource}
                     renderRow={this.renderRow.bind(this)}
                     automaticallyAdjustContentInsets={true} />)
      }</View>);
  }
};

var styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: '#dddddd'
  },
  title: {
    fontSize: 20,
    color: '#656565'
  },
  rowContainer: {
    flexDirection: 'row',
    padding: 10
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  content: {
    flex: 1,
  },
  header: {
    backgroundColor: '#47BFBF',
  }
});

module.exports = BusListContainerView;
