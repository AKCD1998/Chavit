# lNKBlRD — in-house Android mockup

Offline, interactive prototype of the supplied INKBIRD home screen. No backend, account login, real telemetry, Bluetooth/Wi-Fi pairing, store publishing, or network permissions.

## Preview

Run `python3 -m http.server 4173` from this folder, then open http://localhost:4173 at a 393 × 852 mobile viewport. Desktop preview includes simulated Android status/navigation bars. Android uses the real system bars.

The launch screen uses the approved recolored logo. The initial home screen shows the promotional banner, mock weather card (30°C, sunny, sunset 05:53 p.m., sunrise 06:13 a.m., ตำบล แม่กลอง), room tabs and five device cards. The mock advertisement can be dismissed with its close button while the weather card stays visible. Weather values are static fixtures, not live data. All Devices shows the five cards. Living Room, Master Bedroom and Second Bedroom each show the reference empty-room illustration and Thai message, beneath the full weather card. Only the advertisement is hidden in room views; it stays dismissed after returning to All Devices if manually closed. The scanner asks for confirmation, then requests camera access and displays a live preview. It does not yet decode QR codes. Cards, house selection, add controls and bottom navigation open mock UI; device readings and pairing are deliberately unimplemented.

## Android APK

Requires JDK 17+, Android SDK platform 35 / build-tools 35.0.0, and Gradle 8.9.

```sh
cd android
gradle assembleDebug
```

Output: `android/app/build/outputs/apk/debug/app-debug.apk`. Install on Android 8.0+ with `adb install -r app-debug.apk` or transfer the APK to the phone and permit installation from that source. The application ID is `com.inhouse.lnkblrd`; display name is `lNKBlRD`.

The WebView loads bundled assets from an intercepted HTTPS origin, blocks external resources, and requests only camera permission, on confirmation of the scan prompt. No microphone, storage, Bluetooth, location, or network permission is requested. All app UI resources are local. Android WebView must be current enough to support HTML dialog elements.

## Visual fidelity

Layout, Thai device names, online/offline states and alert indicator follow the supplied screenshots. The banner photo is a temporary replacement (https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8), and the sensor icon is an original vector approximation. These two assets need original source images for a pixel-exact match. The approved generated logo is retained as supplied. Thai typography uses bundled Sarabun under the SIL Open Font License; see `assets/Sarabun-OFL.txt`.

No Google Play deployment or external hosting is configured.

The house-name button opens a top sheet matching the supplied reference, with 003 วัดช่องลม, 004 ตลาดบางน้อย, and 001 ตลาดแม่กลอง. An orange check marks the current house. Selecting a row updates the header and check; the prototype continues to use the same device/weather fixtures. Tapping the dimmed backdrop, Escape or Android Back dismisses the sheet. Manage Houses opens a mock house list.

Camera cancel/denial returns to the previous screen. Camera tracks are stopped when the preview is closed, the app is hidden, or the page unloads; late permission results after closing are discarded. Browser camera permissions require HTTPS and a browser with getUserMedia support. Android camera integration is compiled but still needs physical-device verification.
