# lNKBlRD — in-house Android mockup

Interactive prototype of the supplied INKBIRD home screen. No backend, account login, real telemetry, Bluetooth/Wi-Fi pairing, store publishing, or backend accounts.

## Preview

Run `python3 -m http.server 4173` from this folder, then open http://localhost:4173 at a 393 × 852 mobile viewport. Desktop preview includes simulated Android status/navigation bars. Android uses the real system bars.

The launch screen uses the approved recolored logo. The initial home screen shows the promotional banner, live outdoor weather card for ตำบลแม่กลอง, room tabs and five device cards. The mock advertisement can be dismissed with its close button while the weather card stays visible. Weather is fetched from Open-Meteo for latitude 13.409, longitude 100.002, refreshed every 15 minutes and displayed in Asia/Bangkok time. This is current model-based outdoor weather, not indoor device telemetry. Humidity, WMO condition icons and sunrise/sunset are live. The location remains Mae Klong for all mock houses pending verified coordinates. Failed initial loads show dashes; failed refreshes mark retained readings as old data. All Devices shows the five cards. Living Room, Master Bedroom and Second Bedroom each show the reference empty-room illustration and Thai message, beneath the full weather card. Only the advertisement is hidden in room views; it stays dismissed after returning to All Devices if manually closed. The scanner asks for confirmation, then requests camera access and displays a live preview. It does not yet decode QR codes. Cards, house selection, add controls and bottom navigation open mock UI; device readings and pairing are deliberately unimplemented.

## Android APK

Requires JDK 17+, Android SDK platform 35 / build-tools 35.0.0, and Gradle 8.9.

```sh
cd android
gradle assembleDebug
```

Output: `android/app/build/outputs/apk/debug/app-debug.apk`. Install on Android 8.0+ with `adb install -r app-debug.apk` or transfer the APK to the phone and permit installation from that source. The application ID is `com.inhouse.lnkblrd`; display name is `lNKBlRD`.

The WebView loads bundled assets from an intercepted HTTPS origin, allows only the Open-Meteo forecast endpoint for external data, and requests only camera permission, on confirmation of the scan prompt. Internet permission enables weather access; no microphone, storage, Bluetooth, or location permission is requested. All app UI resources are local. Weather requires Internet. Android WebView must be current enough to support HTML dialog elements.

## Visual fidelity

Layout, Thai device names, online/offline states and alert indicator follow the supplied screenshots. The banner photo is a temporary replacement (https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8), and the sensor icon is an original vector approximation. These two assets need original source images for a pixel-exact match. The approved generated logo is retained as supplied. Thai typography uses bundled Sarabun under the SIL Open Font License; see `assets/Sarabun-OFL.txt`.

No Google Play deployment or external hosting is configured.

The house-name button opens a top sheet matching the supplied reference, with 003 วัดช่องลม, 004 ตลาดบางน้อย, and 001 ตลาดแม่กลอง. An orange check marks the current house. Selecting a row updates the header and check; the prototype continues to use the same device/weather fixtures. Tapping the dimmed backdrop, Escape or Android Back dismisses the sheet. Manage Houses opens a mock house list.

Camera cancel/denial returns to the previous screen. Camera tracks are stopped when the preview is closed, the app is hidden, or the page unloads; late permission results after closing are discarded. Browser camera permissions require HTTPS and a browser with getUserMedia support. Android camera integration is compiled but still needs physical-device verification.

Tap the weather overview to open a dedicated weather screen matching the supplied reference. The same Open-Meteo forecast request supplies seven daily forecasts, daily maximum UV, sunrise/sunset, current wind speed/direction, daily high/low apparent temperature, and current humidity. Wind units toggle between m/s and km/h using the same API value. Thai weekdays follow Asia/Bangkok dates. Missing fields show dashes; no forecast values are invented. UI Back, browser Back, and Android Back return to the prior home/room view.

The Me tab reproduces the supplied profile layout with a large avatar/name/account ID, shortcuts, and grouped menu rows. Scrolling reveals a compact sticky profile header. Editing the name updates both profile headers in the current session. The account ID and avatar are mock fixtures; submenu destinations are placeholders pending reference screens.

The Smart tab matches the supplied empty automation and tap-to-run views, including custom illustrations, selected-tab styling, a house selector and a plus button. Tab state is retained while navigating elsewhere. Plus opens a placeholder for the selected type; no real automations execute.

## Shop reference screen

The Shop tab reproduces the supplied six categories, promotional banner, two-column product cards and floating support button. ALL contains 20 products, and each specific category contains four products. Product imagery is downloaded from official INKBIRD Shopify CDN assets, bundled locally and listed in `assets/shop/sources.json` with original URLs. The INT-12-BW and INT-14-BW images use the older official assets matching the reference screenshot. The promotional banner is a generated reconstruction from the user's screenshot. Some lower-row/current-version images differ from the reference.

Prices visible in the supplied screenshots are preserved as static demo prices; additional products use official catalog snapshot prices. `price_source` records which applies. These are not live offers. Product taps show a simple image/name/price preview; support and banner destinations are placeholders. There is no checkout, newsletter submission or message sending. All store assets work offline in the APK.

## Community reference screens

The Community tab reproduces the supplied recommended feed and own-profile screens. The two reference posts, user handles, counters and dates are local fixtures. Category/search/sort, inline expansion and Thai translation work locally. Likes and bookmarks populate their matching profile tabs for the current session; initial Posts, Comments, Likes and Saved states match the reference empty messages. Profile name/bio editing and draft composition are local only. No posts, messages, likes, comments, uploads or account changes are sent to INKBIRD or any external service. The warm profile cover is recreated with CSS; the empty-state artwork is a local SVG.

The magnifying glass in the community profile opens a separate white search screen with a focused search input and Cancel action. The device/browser supplies its own keyboard. Search results intentionally remain empty for this prototype. Cancel, Escape, browser Back and Android Back restore the same profile tab and scroll position; query text never filters or changes the underlying profile. Browser Forward reopens search.

Community Edit Profile now opens the full-screen Personal Information page from the supplied reference, with avatar, display name, account ID, email-link row, Asia/Bangkok timezone, short bio and background thumbnail. Name and bio changes are local and update the community profile; the display name is shared with Me. Avatar/background rows preview existing artwork; email and timezone destinations remain placeholders. Back, browser history and Android Back preserve the previous community tab. No remote account changes occur.
