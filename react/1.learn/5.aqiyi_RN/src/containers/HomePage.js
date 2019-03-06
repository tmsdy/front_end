@connect(null, dispatch => bindActionCreators({setTotalScore}, dispatch), null, {withRef: true})

export default class HomePage extends Page {
  
  _goDetails = () => {
    const {isLogin} = this.state
    if(!isLogin) {
      goToLogin()
    } else {
      sendClickPingback('homeRN', 200100, 'detailbtn');
      this.goTo('IntegralDetail')
    }
  }

  _renderTop = () => {
    const {
      userIcon, isLogin
    } = this.state
    return (
      <View style={styles.topContainer}>
        <View style={styles.topBox}>
          <View style={{
            width: 80, height: 80, alignItems: 'center', justifyContent: 'center'
          }}
          >
            {isLogin ? <Image source={{uri: userIcon}} style={styles.avatar}/> :
              <WebImage name="default_icon" style={styles.avatar}/>}
            {/* <AvatarDress /> */}
          </View>
          {/* 积分明细 */}
          <TouchableOpacity onPress={this._goDetails}> 
            <TotalScore
              from="home"
              style={{marginLeft: 10}}
              textStyle={{fontSize: 30, color: '#333', lineHeight: 35}}
            />
          </TouchableOpacity>
          {isLogin &&
          <MedalInfo
            _goMedals={this._goMedals}
            ref={(updateMedal) => { this.updateMedal = updateMedal }}
          />
          }
          {!isLogin &&
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => {
              goToLogin()
            }}
          >
            <Text style={{fontSize: 16, color: '#FF7E00'}}>登录</Text>
          </TouchableOpacity>
          }
        </View>
        {this._renderNav()}
      </View>
    )
  }


}