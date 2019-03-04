/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import {AppRegistry} from 'react-native';
import App from './js/App'
import AppContainer from './js/navigator/AppNavigators'
import {name as appName} from './app.json';


AppRegistry.registerComponent(appName, () => AppContainer);
