package com.memoryoak;
import android.os.Bundle; // here
// react-native-splash-screen >= 0.3.1
import org.devio.rn.splashscreen.SplashScreen; // here
// react-native-splash-screen < 0.3.1
import io.branch.rnbranch.*; // <-- add this
import android.content.Intent; // <-- and this
import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
      @Override
  protected void onCreate(Bundle savedInstanceState) {
  SplashScreen.show(this);  // here
  super.onCreate(null);
}
  @Override
  protected String getMainComponentName() {
    return "memoryOak";
  }

      @Override
      protected void onStart() {
          super.onStart();
          RNBranchModule.initSession(getIntent().getData(), this);
      }

      @Override
      public void onNewIntent(Intent intent) {
          super.onNewIntent(intent);
          RNBranchModule.onNewIntent(intent);

        // if (intent != null &&
        //       intent.hasExtra("branch_force_new_session") && 
        //       intent.getBooleanExtra("branch_force_new_session",false)) {
        //     RNBranchModule.onNewIntent(intent);
        // }
      }
 
}
