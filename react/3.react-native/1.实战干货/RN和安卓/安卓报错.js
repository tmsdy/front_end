/*
1.安卓某个库的sdk版本低了：
The specified Android SDK Build Tools version (26.0.3) is ignored, as it is below the minimum supported version (27.0.3) for Android Gradle Plugin 3.1.4.
Android SDK Build Tools 27.0.3 will be used.
解决：file -> project structure -> 去modules里面改

2.compile这个api过时了：
Configuration 'compile' is obsolete and has been replaced with 'implementation' and 'api'.It will be removed at the end of 2018.
解决：compile 改成implementation
androidTestCompile改成androidTestImplementation
testCompile 改成testImplementation

3.

*/