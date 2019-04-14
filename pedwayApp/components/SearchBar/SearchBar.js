import styles from './styles';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import React, {Component} from 'react';
import axios from 'axios';
import {ORS_API_KEY} from 'react-native-dotenv';

const AZURE_API = 'https://pedway.azurewebsites.net';


export default class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      queryText: '',
      showTextInput: false,
      searching: false,
    };

    this.searchBarOnSubmit = this.searchBarOnSubmit.bind(this);
    this.searchBarEdit = this.searchBarEdit.bind(this);
  }

  searchBarOnSubmit() {
    this.setState({
      showTextInput: false,
    });
    if (this.state.queryText==='') {
      this.props.updateSearchData([]);
    } else {
      this.setState({
        searching: true,
      });

      axios.get(AZURE_API +
          '/api/ors/geocode/autocomplete' +
          '?text=' +
          this.state.queryText +
          '&boundary.rect.min_lat=41.765683' +
          '&boundary.rect.max_lat=41.909595' +
          '&boundary.rect.min_lon=-87.746445' +
          '&boundary.rect.max_lon=-87.565921').then((res) => {
        this.setState({
          searching: false,
        });
        this.props.updateSearchData(res['data']['features']);
        // now we can forward this result to our main map view
      });
    }
  }


  searchBarEdit(textInput) {
    this.setState({
      showTextInput: true,
      queryText: textInput,
    });
  }

  render() {
    if (this.state.searching) {
      return (
        <TouchableOpacity
          style={[styles.floating, styles.searchBox]}
          onPress={this.searchBarOnClick}
        >
          <View style={{
            flexDirection: 'row',
          }}>
            <TextInput
              numberOfLines={1}
              style={styles.textInput}
              placeholder = 'Enter your destination...'
              onSubmitEditing={this.searchBarOnSubmit}
              onChangeText={this.searchBarEdit}
            >
            </TextInput>
            <ActivityIndicator
              size='small'
              color='#333'
              animating={true}
              style={{marginRight: 20}}
            />
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          style={[styles.floating, styles.searchBox]}
          onPress={this.searchBarOnClick}
        >
          <View style={{
            flexDirection: 'row',
          }}>
            <TextInput
              numberOfLines={1}
              style={styles.textInput}
              placeholder = 'Enter your destination...'
              onSubmitEditing={this.searchBarOnSubmit}
              onChangeText={this.searchBarEdit}
            >
            </TextInput>
          </View>
        </TouchableOpacity>
      );
    }
  }
}

