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

var SGListView = require('react-native-sglistview');
class BusLineListContainerView extends Component {

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
select p.id 'id', p.name 'name' \
from buses_place 'p', (select r.'place_id' 'place_id', r.'order' '_order' \
from buses_route 'r' JOIN buses_routeline_routes 'rr' ON  r.id = rr.route_id \
where rr.routeline_id = (select id from buses_routeline where bus_id=" + place_id +
")) 'rp' \
where p.id = rp.place_id \
order by rp._order \
", [], (tx, results) => {
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

  renderRow(rowData, sectionID, rowID) {
    return (
      <TouchableHighlight underlayColor='#dddddd'>
        <View>
          <View style={styles.rowContainer}>
            <Text style={styles.text}>
              {rowData.name}
            </Text>
          </View>
          <View style={styles.separator}/>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      this.state.loading? (
        <View style={styles.container}>
          <Text style={styles.title}>รอสักครู่</Text>
        </View>
      ): ( <View style={styles.top40}>
              <SGListView dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}
                automaticallyAdjustContentInsets={true} /></View>)
    );
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
  top40: {
    marginTop: 60,
    flex: 1,
  }
});

module.exports = BusLineListContainerView;
