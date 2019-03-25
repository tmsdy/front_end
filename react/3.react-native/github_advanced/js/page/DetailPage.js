import React, {Component,Fragment} from 'react';
import { Platform,StyleSheet, Text, View,TouchableOpacity} from 'react-native';
import { WebView } from "react-native-webview";
import NavigationBar from '../common/NavigationBar'
import ViewUtil from '../util/ViewUtil'
import BackPressComponent from '../common/BackPressComponent'

const TRENDING_URL = 'https://github.com/';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import NavigationUtil from '../navigator/NavigationUtil'

type Props = {};
export default class DetailPage extends Component<Props> {
  constructor(props){
      super(props)
      this.params = this.props.navigation.state.params
      const {projectModels} = this.params
      this.url = projectModels.html_url || TRENDING_URL+projectModels.fullName
      const title = projectModels.full_name || projectModels.fullName;
      this.backPress = new BackPressComponent({backPress: () => this.onBackPress()});
      this.state = {
        title,
        url:this.url,
        canGoBack: false,//是否返回上一页
      }
  }

  componentDidMount() {
      this.backPress.componentDidMount();
  }
  componentWillUnmount() {
      this.backPress.componentWillUnmount();
  }
  onBackPress() {
      this.onBack();
      return true;
  }

  onBack(){
    if (this.state.canGoBack) {
        this.webView.goBack();
    } else {
        NavigationUtil.goBack(this.props.navigation);
    }
  }
  renderRightButton(){
    return (<View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                  // onPress={() => this.onFavoriteButtonClick()}
                  >
                  <FontAwesome
                      name={this.state.isFavorite ? 'star' : 'star-o'}
                      size={20}
                      style={{color: 'white', marginRight: 10}}
                  />
              </TouchableOpacity>
              {ViewUtil.getShareButton(() => {
                  console.log('share')
                  // let shareApp = share.share_app;
                  // ShareUtil.shareboard(shareApp.content, shareApp.imgUrl, this.url, shareApp.title, [0, 1, 2, 3, 4, 5, 6], (code, message) => {
                  //     console.log("result:" + code + message);
                  // });
              })}
          </View>
      )
  }
  onNavigationStateChange(navState){
    console.log(navState)
    this.setState({
      canGoBack:navState.canGoBack,
      url:navState.url
    })
  }
  render() {
    let {url,title}  =this.state
    const titleLayoutStyle = this.state.title.length > 20 ? {paddingRight: 30} : null;
    let statusBar = {
      backgroundColor: '#666' ,
      barStyle: 'light-content'
    }
    let navigationBar = <NavigationBar 
        leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
        title={title}
        titleLayoutStyle={titleLayoutStyle}
        statusBar={statusBar}
        style={{backgroundColor: "#666"}}
        rightButton={this.renderRightButton()}
      />
    console.log(url,title)
    return (
      <Fragment>
        {navigationBar}
        <WebView 
          ref={webView => this.webView = webView}
          startInLoadingState={true}
          onNavigationStateChange={e=>this.onNavigationStateChange(e)}
          source={{uri:url}}
        ></WebView>

      </Fragment>
      
    );
  }
}

