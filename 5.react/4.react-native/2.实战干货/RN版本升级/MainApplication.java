package com.fumamxapp;

import android.app.Application;
import android.content.Context;
import com.facebook.react.PackageList;
import android.webkit.WebView;

import com.facebook.react.ReactApplication;
import com.facebook.react.shell.MainReactPackage;
import com.zmxv.RNSound.RNSoundPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.rnfs.RNFSPackage;
import cn.jpush.reactnativejpush.JPushPackage;
import io.github.elyx0.reactnativedocumentpicker.DocumentPickerPackage;

import com.microsoft.codepush.react.CodePush;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.rnim.rn.audio.ReactNativeAudioPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import com.github.alinz.reactnativewebviewbridge.WebViewBridgePackage;

import java.lang.reflect.InvocationTargetException;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

    @Override
    protected String getJSBundleFile() {
      return CodePush.getJSBundleFile();
    }
    
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      @SuppressWarnings("UnnecessaryLocalVariable")
      List<ReactPackage> packages = new PackageList(this).getPackages();
      // Packages that cannot be autolinked yet can be added manually here:
      packages.add(new MainReactPackage());
      packages.add(new RNSoundPackage());
      packages.add(new ReactNativeAudioPackage());
      packages.add(new DocumentPickerPackage());
      packages.add(new PickerPackage());
      packages.add(new RNFSPackage());
      packages.add(new JPushPackage(!BuildConfig.DEBUG, !BuildConfig.DEBUG));
      packages.add(new CodePush(BuildConfig.CODEPUSH_KEY, getApplicationContext(), BuildConfig.DEBUG));
      packages.add(new RNCWebViewPackage());
      packages.add(new VectorIconsPackage());
      packages.add(new LinearGradientPackage());
      packages.add(new RNGestureHandlerPackage());
      packages.add(new SplashScreenReactPackage());
      packages.add(new WebViewBridgePackage());
      packages.add(new MyReactPackage());//我自定义的

      return packages;

    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    WebView.setWebContentsDebuggingEnabled(true);
  }
}
