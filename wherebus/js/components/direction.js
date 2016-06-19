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


function arrayObjectIndexOf(array, search, property) {
    for(var i = 0, len = array.length; i < len; i++) {
        if (array[i][property] === search) return i;
    }
    return -1;
}

function intersect(a, b){
    var results = [];
    for (var i = 0; i < a.length; i++) {
      if (arrayObjectIndexOf(b, a[i].id, 'id') !== -1) {
        results.push(a[i]);
      }
    }
    return results;
}

class DirectionView extends Component {

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
    var place_id = this.props.id;
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var db = SQLite.openDatabase({name : "db.sqlite3", createFromLocation : 1}, this.successCB, this.errorCB);
    db.transaction((tx) => {
      tx.executeSql("\
select id, bus_name from buses_bus where id in \
(select rl.bus_id id \
from buses_routeline_routes 'rr' JOIN buses_routeline 'rl' \
ON rr.routeline_id = rl.id \
where rr.route_id in \
(select r.id from buses_route 'r' JOIN buses_place 'p' ON r.place_id = p.id \
where p.name like '%" + self.props.data.from + "%') \
group by rl.bus_id) \
", [], (tx, results) => {
          var len = results.rows.length;
          var busFrom = [];
          for (let i = 0; i < len; i++) {
              let row = results.rows.item(i);
              busFrom.push(row);
          }

          tx.executeSql("\
select id, bus_name from buses_bus where id in \
(select rl.bus_id id \
from buses_routeline_routes 'rr' JOIN buses_routeline 'rl' \
ON rr.routeline_id = rl.id \
where rr.route_id in \
(select r.id from buses_route 'r' JOIN buses_place 'p' ON r.place_id = p.id \
where p.name like '%" + self.props.data.to + "%') \
group by rl.bus_id) \
", [], (tx, results) => {
            var len = results.rows.length;
            var busTo = [];
            for (let i = 0; i < len; i++) {
                let row = results.rows.item(i);
                busTo.push(row);
            }
            _results = intersect(busFrom, busTo);
            self.setState({dataSource: ds.cloneWithRows(_results), loading: false});

          });
        });
    });

    this.state = {
      loading: true,
      dataSource: null
    };
  }

  renderRow(rowData, sectionID, rowID) {
    return (
      <TouchableHighlight underlayColor='#dddddd'>
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
          leftItem={{
            title: 'Back',
            onPress: () => this.props.navigator.pop(),
          }}
        />
        <Text style={styles.title}>
            {this.props.name}
        </Text>
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
    backgroundColor: '#999999',
    height: 60
  }
});

module.exports = DirectionView;
