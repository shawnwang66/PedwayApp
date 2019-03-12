import React, {Component} from 'react';
import styles from './styles';
import {TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';


export default class RoundButton extends React.Component {
  render() {
    return (
        <TouchableOpacity
          style={[this.props.style, styles.floating, styles.roundButton]}
          onPress={this.props.func}>
          <View style={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Icon
              name={this.props.icon}
              size={35}
              color="#555"
            />
          </View>
        </TouchableOpacity>
    );
  }
}

