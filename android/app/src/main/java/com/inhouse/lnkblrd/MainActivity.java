package com.inhouse.lnkblrd;
import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;
public class MainActivity extends Activity {
    private WebView web;
    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        web = new WebView(this);
        web.setBackgroundColor(0xfff4f4f4);
        web.getSettings().setJavaScriptEnabled(true);
        web.getSettings().setAllowFileAccess(false);
        web.getSettings().setAllowContentAccess(false);
        web.setWebViewClient(new WebViewClient() {
            @Override public android.webkit.WebResourceResponse shouldInterceptRequest(WebView view, android.webkit.WebResourceRequest request) {
                android.net.Uri uri = request.getUrl();
                if (!"https".equals(uri.getScheme()) || !"app.local".equals(uri.getHost())) return new android.webkit.WebResourceResponse("text/plain", "UTF-8", new java.io.ByteArrayInputStream(new byte[0]));
                String path = uri.getPath();
                if (path == null || path.contains("..")) return null;
                if (path.equals("/")) path = "/index.html";
                String mime = path.endsWith(".html") ? "text/html" : path.endsWith(".css") ? "text/css" : path.endsWith(".js") ? "application/javascript" : path.endsWith(".svg") ? "image/svg+xml" : path.endsWith(".png") ? "image/png" : path.endsWith(".jpg") ? "image/jpeg" : "font/ttf";
                try { return new android.webkit.WebResourceResponse(mime, "UTF-8", getAssets().open(path.substring(1))); }
                catch (java.io.IOException e) { return new android.webkit.WebResourceResponse("text/plain", "UTF-8", new java.io.ByteArrayInputStream(new byte[0])); }
            }
            @Override public boolean shouldOverrideUrlLoading(WebView view, android.webkit.WebResourceRequest request) { return true; }
        });
        setContentView(web);
        web.loadUrl("https://app.local/index.html?native=1");
    }
    @Override public void onBackPressed() { web.evaluateJavascript("(() => { const d = document.querySelector('dialog[open]'); if (d) { d.close(); return true; } return false; })()", result -> { if (!"true".equals(result)) MainActivity.super.onBackPressed(); }); }
}
