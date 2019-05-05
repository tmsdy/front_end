/**
 * @lzj
 * 首页电影推荐模块
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  CameraRoll,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { takeSnapshot } from '@iqiyi/rn-view-shot';
import Swiper from '@iqiyi/rn-swiper';
import {
  View,
  Image,
} from '@iqiyi/rn-ui';
import { Width } from '@iqiyi/rn-utils';
import WebImage from './WebImage';
import { sendClickPingback } from '../common/pingback';
import { showToast } from '../common/QYNativeBridge';

export default class extends Component {
  static propTypes = {
    moviePosters: PropTypes.array.isRequired,
    handlePlayMovie: PropTypes.func.isRequired,
  }

  // 播放电影
  _playMovie = (p) => {
    this.props.handlePlayMovie(p)
  }

  // 保存电影海报
  _savePoster = () => {
    sendClickPingback('sign_movie_pop', 100100, 'movie_save');

    const options = {
      format: 'jpeg',
      quality: 0.8,
    }

    takeSnapshot(this.posterImage, options).then(
      (uri) => {
        CameraRoll.saveToCameraRoll(uri).then((path) => {
          showToast('图片保存成功!')
        }).catch(err => showToast(err.message));
      },
      err => showToast(err.message)
    )
  }

  _renderPoster = (p) => {
    return (
      <View
        key={p.order}
        style={styles.slide}
      >
        <View style={styles.poster_wrap}>
          <Image source={{uri: p.thumbnail_url}} style={styles.movie_poster} />
          <TouchableOpacity
            onPress={() => this._playMovie(p)}
            style={styles.playIcon}
          >
            <WebImage name="play_new" style={{width: 30, height: 30}} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this._savePoster}
            style={styles.saveIcon}
          >
            <WebImage name="save_new" style={{width: 30, height: 30}} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render() {
    const { moviePosters } = this.props

    return (
      <Swiper
        ref={(poster) => { this.posterImage = poster }}
        height={450}
        width={Width}
        collapsable={false}
        horizontal
        pagingEnabled
        showsPagination={false}
        showsHorizontalScrollIndicator={false}
        loop={false}
        style={styles.movie_swiper}
      >
        {
          moviePosters.map(this._renderPoster)
        }
      </Swiper>
    )
  }
}

const styles = StyleSheet.create({
  movie_swiper: {
    marginTop: 30,
  },
  slide: {
    width: Width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  poster_wrap: {
    width: Width * 0.8,
    height: Width * 1.2,
  },
  movie_poster: {
    width: Width * 0.8,
    height: Width * 1.2,
    borderRadius: 5,
  },
  playIcon: {
    position: 'absolute',
    top: 15,
    right: 60,
  },
  saveIcon: {
    width: 30,
    height: 30,
    position: 'absolute',
    top: 15,
    right: 15,
  }
})
