package com.inhouse.lnkblrd;
import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;
public class MainActivity extends Activity {
    private WebView web;
    private android.webkit.PermissionRequest pendingCamera;
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
                if ("https".equals(uri.getScheme()) && "api.open-meteo.com".equals(uri.getHost()) && (uri.getPort() == -1 || uri.getPort() == 443) && "/v1/forecast".equals(uri.getPath())) return null;
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
        web.setWebChromeClient(new android.webkit.WebChromeClient() {
            @Override public void onReceivedTitle(WebView view, String title) { getWindow().setStatusBarColor(title != null && title.startsWith("สภาพอากาศ") ? 0xff248dbb : 0xfff4f4f4); }
            @Override public void onPermissionRequest(android.webkit.PermissionRequest request) {
                if (!("https".equals(request.getOrigin().getScheme()) && "app.local".equals(request.getOrigin().getHost()) && (request.getOrigin().getPort() == -1 || request.getOrigin().getPort() == 443)) || !java.util.Arrays.asList(request.getResources()).contains(android.webkit.PermissionRequest.RESOURCE_VIDEO_CAPTURE)) { request.deny(); return; }
                if (checkSelfPermission(android.Manifest.permission.CAMERA) == android.content.pm.PackageManager.PERMISSION_GRANTED) {
                    request.grant(new String[]{android.webkit.PermissionRequest.RESOURCE_VIDEO_CAPTURE});
                } else {
                    if (pendingCamera != null) pendingCamera.deny();
                    pendingCamera = request;
                    requestPermissions(new String[]{android.Manifest.permission.CAMERA}, 100);
                }
            }
            @Override public void onPermissionRequestCanceled(android.webkit.PermissionRequest request) { if (pendingCamera == request) pendingCamera = null; }
        });
        setContentView(web);
        web.loadUrl("https://app.local/index.html?native=1");
    }
    @Override public void onRequestPermissionsResult(int code, String[] permissions, int[] results) {
        super.onRequestPermissionsResult(code, permissions, results);
        if (code == 100 && pendingCamera != null) {
            if (results.length > 0 && results[0] == android.content.pm.PackageManager.PERMISSION_GRANTED) pendingCamera.grant(new String[]{android.webkit.PermissionRequest.RESOURCE_VIDEO_CAPTURE});
            else pendingCamera.deny();
            pendingCamera = null;
        }
    }
    @Override protected void onPause() { if (pendingCamera == null) web.evaluateJavascript("if (typeof closeCamera === 'function') closeCamera()", null); super.onPause(); }
    @Override protected void onStop() { web.evaluateJavascript("if (typeof closeCamera === 'function') closeCamera()", null); super.onStop(); }
    @Override protected void onDestroy() { if (pendingCamera != null) { pendingCamera.deny(); pendingCamera = null; } web.destroy(); super.onDestroy(); }
    @Override public void onBackPressed() { web.evaluateJavascript("(() => { const d = document.querySelector('dialog[open]'); if (d) { d.close(); return true; } if (typeof closeWeatherDetails === 'function' && closeWeatherDetails()) return true; return false; })()", result -> { if (!"true".equals(result)) MainActivity.super.onBackPressed(); }); }
}
