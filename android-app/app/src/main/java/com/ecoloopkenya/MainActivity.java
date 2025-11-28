package com.ecoloopkenya; 
 
import android.os.Bundle; 
import android.webkit.WebSettings; 
import android.webkit.WebView; 
import android.webkit.WebViewClient; 
import androidx.appcompat.app.AppCompatActivity; 
 
public class MainActivity extends AppCompatActivity { 
    @Override 
    protected void onCreate(Bundle savedInstanceState) { 
        super.onCreate(savedInstanceState); 
        setContentView(R.layout.activity_main); 
 
        WebView webView = findViewById(R.id.webview); 
        WebSettings settings = webView.getSettings(); 
 
        // Enable JavaScript 
        settings.setJavaScriptEnabled(true); 
 
        // Enable responsive layout 
        settings.setUseWideViewPort(true); 
        settings.setLoadWithOverviewMode(true); 
 
        // Disable zoom controls 
        settings.setBuiltInZoomControls(false); 
        settings.setDisplayZoomControls(false); 
 
        // Load the optimized mobile app 
        webView.loadUrl("file:///android_asset/app/index.html"); 
    } 
} 
