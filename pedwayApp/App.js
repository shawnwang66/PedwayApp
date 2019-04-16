/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * reference: https://stackoverflow.com/questions/51607886/react-native-json-fetch-from-url
 * https://github.com/react-native-community/react-native-side-menu
 * https://stackoverflow.com/questions/30448547/how-to-model-a-button-with-icons-in-react-native
 * https://github.com/oblador/react-native-vector-icons
 * https://github.com/react-native-community/react-native-maps/blob/master/docs/installation.md
 * https://www.igismap.com/switching-between-google-maps-and-openstreetmap-in-react-native/
 * https://stackoverflow.com/questions/39395404/react-native-import-the-whole-file-split-js-code-into-several-files
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Button} from 'react-native';
import {Platform, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import SideMenu from 'react-native-side-menu';
import RoundButton from './components/RoundButton/RoundButton';
import IconButton from './components/IconButton/IconButton';
import GroundMapView from './components/GroundMapView/GroundMapView';
import SearchBar from './components/SearchBar/SearchBar';
import SlidingUpDetailView
  from './components/SlidingUpDetailView/SlidingUpDetailView';
import Directory
  from './components/Directory/Directory';
import PDFMap
  from './components/PDFMap/PDFMap';
import Icon from 'react-native-vector-icons/FontAwesome';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import {Keyboard} from 'react-native';
import NavigationSwipeView from './components/NavigationSwipeView/NavigationSwipeView';
import {positions, styles} from './styles';

/**
 * HomeScreen that gets rendered first when everything is loaded
 * Consists of a Sidemenu, a MainView, and a hamburger button that toggles
 * Sidemenu/MainView
 */
class HomeScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      sideMenuIsOpen: false,
      sideMenuDisableGesture: true,
      apiServerURL: 'http://a.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png',
      detailViewOpen: true,
      navigateGround: false,
      navigateTo: null,
      hideHamburgerButton: false,
    };


    this.toggleSideBar = this.toggleSideBar.bind(this);
    this.shouldHideHamburgerButton = this.shouldHideHamburgerButton.bind(this);
  }

  toggleSideBar() {
    this.setState({sideMenuIsOpen: !this.state.sideMenuIsOpen});
    Keyboard.dismiss();
  }

  componentDidMount() {
    console.disableYellowBox = true;
  }

  shouldHideHamburgerButton(inputStatus) {
    this.setState({hideHamburgerButton: inputStatus});
  }

  render() {
    const {navigate} = this.props.navigation;
    const MenuComponent = (
      <View style={{flex: 1, backgroundColor: '#a9a9a9', paddingTop: 50, alignItems: 'center'}}>
        <Icon style={{fontSize: 85}}
          name = 'home'
        />
        <TouchableOpacity
          style={styles.sideButton}
          onPress={() => navigate('FoodDirectory')}>
          <Text style={styles.item}>
            <Icon name="info-circle" style={styles.item}/>
              Directory
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sideButton}
          onPress={() => navigate('StaticMap')}>
          <Text style={styles.item}>
            <Icon name="map" style={styles.item}/>
              Map
          </Text>
        </TouchableOpacity>
      </View>
    );

    return (
      <SideMenu
        menu={MenuComponent}
        disableGestures={this.state.sideMenuDisableGesture}
        isOpen={this.state.sideMenuIsOpen}
        onChange={(openStatus) => {
          this.state.sideMenuIsOpen = openStatus;
          this.setState({sideMenuDisableGesture: !openStatus});
        }}
      >
        <MainView shouldHideHamburgerButton={this.shouldHideHamburgerButton}/>

        {this.state.hideHamburgerButton?
          null:
          <IconButton style={[positions.hamburgerButton]} icon={'bars'} func={this.toggleSideBar} size={30}/>}
      </SideMenu>
    );
  }
}

/**
 * MainViews that display groundMap and several Navigation buttons
 * The first button is to trigger the search field
 * The second button is the entry point for the underground map
 */
class MainView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      underground: false,
      selectedEntrance: null,
      searchData: [],
      navigationData: [],
      navigationDataRequested: false,
      isEntrance: true,
    };
    this.toggleUndergroundMap = this.toggleUndergroundMap.bind(this);
    this.toggleNavigateCallback = this.toggleNavigateCallback.bind(this);
    this.setSearchData = this.setSearchData.bind(this);
    this.updateNavigationDataCallback = this.updateNavigationDataCallback.bind(this);
    this.updateSlidingDetailView = this.updateSlidingDetailView.bind(this);
    this.updateSegmentStartEndCallback = this.updateSegmentStartEndCallback.bind(this);
    this.updateSwiperViewIndex = this.updateSwiperViewIndex.bind(this);
    this.setMapInFocus = this.setMapInFocus.bind(this);
    this.clearNavigationData = this.clearNavigationData.bind(this);
    this.endNavigateCallback = this.endNavigateCallback.bind(this);
    this.setUnderground = this.setUnderground.bind(this);
    this.mapViewNetworkErrorHandler = this.mapViewNetworkErrorHandler.bind(this);
    this.displayFeedbackWindow = this.displayFeedbackWindow.bind(this);
  }

  updateNavigationDataCallback(inputData) {
    this.setState({
      navigationData: inputData,
      navigationDataRequested: true,
    });
  }

  toggleUndergroundMap() {
    this.setState({
      underground: !this.state.underground,
    });
  }

  setSearchData(data) {
    this.setState({
      searchData: data,
    });
  }

  updateSlidingDetailView(inputEntrance, isEntrance) {
    this.setState({
      selectedEntrance: inputEntrance,
      isEntrance: isEntrance,
      detailViewOpen: true,
    });
  }

  setUnderground(state) {
    this.setState({underground: state});
  }

  updateSegmentStartEndCallback(start, end) {
    if (this.map !== null) {
      this.map.updateHighlightSegment(start, end);
    }
  }

  mapViewNetworkErrorHandler() {
    if (this.map !== null) {
      this.map.networkErrorHandler();
    }
  }

  updateSwiperViewIndex(idx) {
    if (this.swiperView !== null) {
      this.swiperView.updateSwiperViewIndex(idx);
    }
  }

  setMapInFocus(input) {
    this.map.setMapInFocus(input);
  }

  displayFeedbackWindow(idx) {
    if (this.map !== undefined && this.map !== null) {
      this.map.displayFeedbackWindow(idx);
    }
  }

  clearNavigationData() {
    this.setState({navigationDataRequested: false});
  }

  toggleNavigateCallback(inputEntrance, inputStatus) {
    // use setState to clear the existing navigation data
    this.setState({
      navigateGround: inputStatus,
      navigateTo: inputEntrance,
      navigationData: [],
      navigationDataRequested: false,
    });
    this.props.shouldHideHamburgerButton(inputStatus);

    if (this.map !== null) {
      this.map.updateNavigationState(inputStatus, inputEntrance, 0, 1);
    }
  }

  endNavigateCallback() {
    this.props.shouldHideHamburgerButton(false);
    this.setState({
      navigateGround: false,
    });
    if (this.map !== null) {
      this.map.updateNavigationState(false, undefined, 0, 1);
    }
    if (this.slidingUpView !== null) {
      this.slidingUpView.setNavigate(false);
    }
  }

  render() {
    return (
      <View style={styles.fillView}>

        <GroundMapView
          selectedMarkerCallback={(input, isEntrance) => {
            this.updateSlidingDetailView(input, isEntrance);
          }}
          ref={(mapView) => {
            this.map = mapView;
          }}
          updateNavigationDataCallback={this.updateNavigationDataCallback}
          searchData={this.state.searchData}
          underground={this.state.underground}
          updateSwiperViewIndex={this.updateSwiperViewIndex}
          clearNavigationData={this.clearNavigationData}
          endNavigateCallback={this.endNavigateCallback}
          setUnderground={this.setUnderground}
        />
        <SlidingUpDetailView
          open={this.state.detailViewOpen}
          entrance={this.state.selectedEntrance}
          isEntrance={this.state.isEntrance}
          toggleNavigate={this.toggleNavigateCallback}
          displayFeedbackWindow={this.displayFeedbackWindow}
          ref={(slidingUpView) => {
            this.slidingUpView = slidingUpView;
          }}
        />
        {this.state.navigateGround?
            null:
            <SearchBar
              updateSearchData={this.setSearchData}
              networkErrorHandler={this.mapViewNetworkErrorHandler}
            />}
        <RoundButton
          style={this.state.navigateGround?[positions.positionDown]:[positions.undergroundButton]}
          icon={this.state.underground ? 'level-up' : 'level-down'}
          func={this.toggleUndergroundMap}/>
        {this.state.navigateGround?
          <NavigationSwipeView
            navigationData={this.state.navigationData}
            navigationDataRequested={this.state.navigationDataRequested}
            updateSegmentStartEndCallback={this.updateSegmentStartEndCallback}
            setMapInFocus={this.setMapInFocus}
            setUnderground={this.setUnderground}
            ref={(navigationSwipeView) => {
              this.swiperView = navigationSwipeView;
            }}
          />:
          null
        }
      </View>
    );
  }
}


const MainNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      header: null,
    },
  },
  FoodDirectory: {screen: Directory},
  StaticMap: {screen: PDFMap},
});

const App = createAppContainer(MainNavigator);

export default App;


