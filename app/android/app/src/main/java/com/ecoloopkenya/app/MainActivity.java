package com.getcapacitor.myapp;

import android.os.Bundle;
import android.view.View;
import android.webkit.WebSettings;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Configure WebView for forced desktop view
        setupWebViewForDesktop();
    }
    
    private void setupWebViewForDesktop() {
        // Get the WebView from Capacitor bridge
        WebView webView = getBridge().getWebView();
        
        if (webView != null) {
            // Force desktop view - CRITICAL SETTINGS
            webView.getSettings().setLoadWithOverviewMode(false);
            webView.getSettings().setUseWideViewPort(true);
            webView.getSettings().setSupportZoom(false);
            webView.getSettings().setBuiltInZoomControls(false);
            webView.getSettings().setDisplayZoomControls(false);
            
            // Set user agent to desktop
            String desktopUserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";
            webView.getSettings().setUserAgentString(desktopUserAgent);
            
            // Disable automatic scaling and fitting
            webView.getSettings().setLayoutAlgorithm(WebSettings.LayoutAlgorithm.NORMAL);
            
            // Enable hardware acceleration for smooth animations
            webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);
            
            // Enable JavaScript
            webView.getSettings().setJavaScriptEnabled(true);
            
            // Prevent zoom and scaling
            webView.getSettings().setSupportZoom(false);
            webView.getSettings().setBuiltInZoomControls(false);
            webView.getSettings().setDisplayZoomControls(false);
        }
    }
}
