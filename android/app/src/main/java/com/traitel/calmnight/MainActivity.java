package com.traitel.calmnight;

import android.os.Bundle;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.webkit.WebView;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.graphics.Color;
import com.getcapacitor.BridgeActivity;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.AdSize;
import com.google.android.gms.ads.AdView;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.AdListener;
import com.google.android.gms.ads.initialization.InitializationStatus;
import com.google.android.gms.ads.initialization.OnInitializationCompleteListener;

public class MainActivity extends BridgeActivity {

    private static final String TAG = "MainActivity";
    private AdView mAdView;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Log.d(TAG, "MainActivity onCreate started");

        // Handle window insets to avoid camera/notch overlap
        getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE |
                        View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN);

        // Add padding to the main content to avoid camera area
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                addCameraPadding();
            }
        });

        // Initialize the Mobile Ads SDK
        Log.d(TAG, "Initializing Mobile Ads SDK");
        MobileAds.initialize(this, new OnInitializationCompleteListener() {
            @Override
            public void onInitializationComplete(InitializationStatus initializationStatus) {
                Log.d(TAG, "Mobile Ads SDK initialized successfully");
                // Create and add banner ad programmatically
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        createAndAddBannerAd();
                    }
                });
            }
        });
    }

    private void addCameraPadding() {
        Log.d(TAG, "Adding camera/notch padding");
        try {
            // Get the root view
            ViewGroup rootView = (ViewGroup) findViewById(android.R.id.content);
            if (rootView != null && rootView.getChildCount() > 0) {
                View mainContent = rootView.getChildAt(0);

                // Add top padding to avoid camera/notch area
                // Using a safe value that works for most devices
                int topPadding = (int) (48 * getResources().getDisplayMetrics().density); // 48dp in pixels

                mainContent.setPadding(
                        mainContent.getPaddingLeft(),
                        topPadding,
                        mainContent.getPaddingRight(),
                        mainContent.getPaddingBottom());

                Log.d(TAG, "Added top padding: " + topPadding + "px to avoid camera area");
            }
        } catch (Exception e) {
            Log.e(TAG, "Error adding camera padding: " + e.getMessage());
        }
    }

    private void createAndAddBannerAd() {
        Log.d(TAG, "Creating banner ad programmatically");

        try {
            // Get the root view of the activity
            ViewGroup rootView = (ViewGroup) findViewById(android.R.id.content);
            Log.d(TAG, "Root view found: " + rootView);

            // Create the AdView programmatically (clean, no debug elements)
            mAdView = new AdView(this);
            mAdView.setAdUnitId("ca-app-pub-5987164538420961/5207753700");
            mAdView.setAdSize(AdSize.BANNER);

            // Set ad listener for debugging
            mAdView.setAdListener(new AdListener() {
                @Override
                public void onAdLoaded() {
                    Log.d(TAG, "Banner ad loaded successfully");
                }

                @Override
                public void onAdFailedToLoad(LoadAdError adError) {
                    Log.e(TAG, "Banner ad failed to load: " + adError.getMessage());
                    Log.e(TAG, "Error code: " + adError.getCode());
                }

                @Override
                public void onAdOpened() {
                    Log.d(TAG, "Banner ad opened");
                }

                @Override
                public void onAdClosed() {
                    Log.d(TAG, "Banner ad closed");
                }
            });

            // Add AdView directly to the bottom of the screen
            FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(
                    FrameLayout.LayoutParams.MATCH_PARENT,
                    FrameLayout.LayoutParams.WRAP_CONTENT);
            params.gravity = Gravity.BOTTOM;

            rootView.addView(mAdView, params);
            Log.d(TAG, "Clean banner ad added to bottom of root view");

            // Load the ad
            AdRequest adRequest = new AdRequest.Builder().build();
            Log.d(TAG, "Loading ad with request");
            mAdView.loadAd(adRequest);

        } catch (Exception e) {
            Log.e(TAG, "Error creating banner ad: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Override
    public void onPause() {
        if (mAdView != null) {
            mAdView.pause();
        }
        super.onPause();
    }

    @Override
    public void onResume() {
        super.onResume();
        if (mAdView != null) {
            mAdView.resume();
        }
        // Try to load ad again if it's not loaded
        if (mAdView != null && mAdView.getVisibility() == View.VISIBLE) {
            Log.d(TAG, "AdView is visible, checking if ad is loaded");
        }
    }

    @Override
    public void onDestroy() {
        if (mAdView != null) {
            mAdView.destroy();
        }
        super.onDestroy();
    }
}
