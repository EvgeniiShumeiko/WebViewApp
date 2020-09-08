import React, {Component} from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Linking,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {WebView} from 'react-native-webview';
import url from 'url';

export default class WebContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      backButtonEnabled: false,
    };
    this.showSpinner = this.showSpinner.bind(this);
    this.hideSpinner = this.hideSpinner.bind(this);
    this.backHandler = this.backHandler.bind(this);
  }
  hideSpinner() {
    this.setState({visible: false});
  }
  showSpinner() {
    this.setState({visible: true});
  }
  backHandler() {
    if (this.state.backButtonEnabled) {
      this.webref.goBack();
      return true;
    }
  }

  render() {
    let {uri, getWebView} = this.props;
    let {visible} = this.state;
    let addScript = this.props.addScript ?? '';
    return (
      <>
        <WebView
          ref={(webref) => {
            this.webref = webref;
            if (getWebView) {
              getWebView(this.webref);
            }
          }}
          key={this.props.update}
          onLoadProgress={(event) => {
            if (event.nativeEvent.progress > 0.8) {
              this.hideSpinner();
            }
          }}
          onMessage={this.props.onMessage}
          automaticallyAdjustContentInsets={false}
          showsHorizontalScrollIndicator={false}
          javaScriptEnabled={true}
          allowsInlineMediaPlayback={true}
          allowsFullscreenVideo={true}
          scalesPageToFit={true}
          domStorageEnabled={true}
          style={styles.cont}
          source={{uri: uri}}
          onHttpError={this.hideSpinner}
          onError={this.hideSpinner}
          onLoadStart={this.showSpinner}
          onLoad={() => {
            this.hideSpinner();
          }}
          onLoadEnd={() => {
            this.webref.injectJavaScript(addScript);
            this.hideSpinner();
          }}
          onNavigationStateChange={(navState) => {
            this.setState({
              backButtonEnabled: navState.canGoBack,
            });
            let full_url = url.parse(navState.url);

            if (
              (full_url.host.includes('yandex.ru') &&
                full_url.pathname !== '/clck/jsredir') ||
              full_url.host.includes('google') ||
              full_url.host.includes('rambler.ru') ||
              full_url.host.includes('mail.ru') ||
              full_url.host.includes('ya.ru') ||
              full_url.host.includes('duckduckgo.com') ||
              full_url.host.includes('yahoo.com') ||
              full_url.host.includes('bing.com')
            ) {
              this.webref.stopLoading();
              Linking.openURL(navState.url).finally(() => {
                this.backHandler();
              });
              return false;
            }
          }}
          renderError={this._renderError}
        />
        {visible && this._renderLoading()}
        <SafeAreaView style={{backgroundColor: '#64aa46'}}>
          <View style={styles.bottomTabBarContainer}>
            <TouchableOpacity
              accessibilityRole="button"
              key="back_button"
              onPress={() => {
                this.webref.goBack();
              }}
              style={styles.bottomTabButton}>
              <Icon
                name="arrow-circle-left"
                type="font-awesome"
                color="#ffffff"
                size={26}
              />
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityRole="button"
              key="reload_button"
              onPress={() => {
                this.webref.reload();
              }}
              style={styles.bottomTabButton}>
              <Icon name="home" type="font-awesome" color="#ffffff" size={26} />
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityRole="button"
              key="forward_button"
              onPress={() => {
                this.webref.goForward();
              }}
              style={styles.bottomTabButton}>
              <Icon
                name="arrow-circle-right"
                type="font-awesome"
                color="#ffffff"
                size={26}
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </>
    );
  }

  _reload = () => {
    this.webref.reload();
  };

  _renderLoading = () => {
    return (
      <View style={styles.activity_cont}>
        <ActivityIndicator
          size="large"
          color="#64aa46"
          style={styles.activity}
        />
      </View>
    );
  };

  _renderError = (errorName) => {
    return (
      <View style={styles.container_error}>
        <Text style={styles.logo_text}>SUHBA</Text>
        <Text style={styles.error_text}>Network Connection Error</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={this._reload.bind(this)}>
          <Text> Reload </Text>
        </TouchableOpacity>
      </View>
    );
  };
}

let windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  bottomTabButton: {
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: windowWidth / 4,
    height: 45,
  },
  bottomTabBarContainer: {
    flexDirection: 'row',
    height: 50,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#64aa46',
  },
  cont: {
    margin: 0,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    margin: 10,
  },
  activity: {
    display: 'flex',
    padding: 20,
    borderRadius: 4,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activity_cont: {
    display: 'flex',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container_error: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
  },
  error_text: {
    fontSize: 15,
    textTransform: 'uppercase',
    color: '#64aa46',
    fontWeight: 'bold',
  },
  logo_text: {
    fontSize: 40,
    textTransform: 'uppercase',
    color: '#64aa46',
    fontWeight: 'bold',
  },
});
