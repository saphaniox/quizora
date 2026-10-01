package com.saptechug.quitech;

import android.app.Activity;
import android.graphics.Color;
import android.graphics.drawable.GradientDrawable;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebView;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import androidx.annotation.NonNull;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.ads.mediation.admob.AdMobAdapter;
import com.google.android.gms.ads.AdListener;
import com.google.android.gms.ads.AdLoader;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.nativead.MediaView;
import com.google.android.gms.ads.nativead.NativeAd;
import com.google.android.gms.ads.nativead.NativeAdOptions;
import com.google.android.gms.ads.nativead.NativeAdView;

@CapacitorPlugin(name = "NativeCatalogueAd")
public class NativeCatalogueAdPlugin extends Plugin {

    private NativeAd nativeAd;
    private NativeAdView nativeAdView;
    private boolean darkMode;

    @PluginMethod
    public void load(PluginCall call) {
        String adId = call.getString("adId");
        if (adId == null || adId.trim().isEmpty()) {
            call.reject("A native ad unit ID is required", "NATIVE_AD_ID_REQUIRED");
            return;
        }

        boolean nonPersonalized = Boolean.TRUE.equals(call.getBoolean("npa", false));
        activity().runOnUiThread(() -> {
            destroyAd();

            NativeAdOptions options = new NativeAdOptions.Builder()
                .setAdChoicesPlacement(NativeAdOptions.ADCHOICES_TOP_RIGHT)
                .setMediaAspectRatio(NativeAdOptions.NATIVE_MEDIA_ASPECT_RATIO_LANDSCAPE)
                .build();

            AdLoader loader = new AdLoader.Builder(getContext(), adId)
                .forNativeAd(ad -> {
                    nativeAd = ad;
                    call.resolve();
                })
                .withNativeAdOptions(options)
                .withAdListener(new AdListener() {
                    @Override
                    public void onAdFailedToLoad(@NonNull LoadAdError error) {
                        call.reject(error.getMessage(), "NATIVE_AD_LOAD_FAILED");
                    }
                })
                .build();

            AdRequest.Builder request = new AdRequest.Builder();
            if (nonPersonalized) {
                Bundle extras = new Bundle();
                extras.putString("npa", "1");
                request.addNetworkExtrasBundle(AdMobAdapter.class, extras);
            }
            loader.loadAd(request.build());
        });
    }

    @PluginMethod
    public void show(PluginCall call) {
        if (nativeAd == null) {
            call.reject("No native ad has been loaded", "NATIVE_AD_NOT_READY");
            return;
        }

        double x = call.getDouble("x", 0.0);
        double y = call.getDouble("y", 0.0);
        double width = call.getDouble("width", 0.0);
        double height = call.getDouble("height", 0.0);
        boolean requestedDarkMode = Boolean.TRUE.equals(call.getBoolean("dark", false));

        if (width <= 0 || height <= 0) {
            call.reject("Native ad dimensions must be positive", "NATIVE_AD_SIZE_INVALID");
            return;
        }

        activity().runOnUiThread(() -> {
            if (nativeAdView == null || darkMode != requestedDarkMode) {
                removeAdView();
                darkMode = requestedDarkMode;
                nativeAdView = createNativeAdView(nativeAd, darkMode);
            }

            FrameLayout root = activity().findViewById(android.R.id.content);
            if (nativeAdView.getParent() == null) {
                root.addView(nativeAdView);
            }

            float density = getContext().getResources().getDisplayMetrics().density;
            WebView webView = getBridge().getWebView();
            int[] rootLocation = new int[2];
            int[] webViewLocation = new int[2];
            root.getLocationInWindow(rootLocation);
            webView.getLocationInWindow(webViewLocation);

            FrameLayout.LayoutParams layout = new FrameLayout.LayoutParams(
                Math.max(1, (int) Math.round(width * density)),
                Math.max(1, (int) Math.round(height * density))
            );
            layout.leftMargin = webViewLocation[0] - rootLocation[0] + (int) Math.round(x * density);
            layout.topMargin = webViewLocation[1] - rootLocation[1] + (int) Math.round(y * density);
            nativeAdView.setLayoutParams(layout);
            nativeAdView.setVisibility(View.VISIBLE);
            nativeAdView.bringToFront();
            call.resolve();
        });
    }

    @PluginMethod
    public void hide(PluginCall call) {
        activity().runOnUiThread(() -> {
            if (nativeAdView != null) nativeAdView.setVisibility(View.GONE);
            call.resolve();
        });
    }

    @PluginMethod
    public void destroy(PluginCall call) {
        activity().runOnUiThread(() -> {
            destroyAd();
            call.resolve();
        });
    }

    @Override
    protected void handleOnDestroy() {
        activity().runOnUiThread(this::destroyAd);
        super.handleOnDestroy();
    }

    private NativeAdView createNativeAdView(NativeAd ad, boolean dark) {
        int background = dark ? Color.rgb(15, 23, 42) : Color.WHITE;
        int foreground = dark ? Color.rgb(241, 245, 249) : Color.rgb(15, 23, 42);
        int secondary = dark ? Color.rgb(148, 163, 184) : Color.rgb(71, 85, 105);
        int border = dark ? Color.rgb(51, 65, 85) : Color.rgb(226, 232, 240);
        int accent = Color.rgb(13, 148, 136);

        NativeAdView adView = new NativeAdView(getContext());
        GradientDrawable backgroundDrawable = new GradientDrawable();
        backgroundDrawable.setColor(background);
        backgroundDrawable.setStroke(dp(1), border);
        backgroundDrawable.setCornerRadius(dp(8));
        adView.setBackground(backgroundDrawable);
        adView.setClipToOutline(true);
        adView.setPadding(dp(14), dp(12), dp(14), dp(12));
        adView.setElevation(dp(2));

        LinearLayout content = new LinearLayout(getContext());
        content.setOrientation(LinearLayout.VERTICAL);
        adView.addView(content, new FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT
        ));

        LinearLayout attribution = new LinearLayout(getContext());
        attribution.setGravity(Gravity.CENTER_VERTICAL);
        TextView adBadge = textView("Ad", 11, Color.WHITE);
        adBadge.setGravity(Gravity.CENTER);
        GradientDrawable badgeBackground = new GradientDrawable();
        badgeBackground.setColor(accent);
        badgeBackground.setCornerRadius(dp(3));
        adBadge.setBackground(badgeBackground);
        adBadge.setPadding(dp(6), dp(2), dp(6), dp(2));
        attribution.addView(adBadge);
        TextView sponsored = textView("Sponsored", 12, secondary);
        LinearLayout.LayoutParams sponsoredLayout = wrapContent();
        sponsoredLayout.leftMargin = dp(8);
        attribution.addView(sponsored, sponsoredLayout);
        content.addView(attribution, matchWidthWrapHeight());

        LinearLayout heading = new LinearLayout(getContext());
        heading.setGravity(Gravity.CENTER_VERTICAL);
        LinearLayout.LayoutParams headingLayout = matchWidthWrapHeight();
        headingLayout.topMargin = dp(8);
        content.addView(heading, headingLayout);

        ImageView icon = new ImageView(getContext());
        icon.setScaleType(ImageView.ScaleType.CENTER_CROP);
        LinearLayout.LayoutParams iconLayout = new LinearLayout.LayoutParams(dp(44), dp(44));
        iconLayout.rightMargin = dp(10);
        heading.addView(icon, iconLayout);
        adView.setIconView(icon);
        if (ad.getIcon() != null) icon.setImageDrawable(ad.getIcon().getDrawable());
        else icon.setVisibility(View.GONE);

        LinearLayout titles = new LinearLayout(getContext());
        titles.setOrientation(LinearLayout.VERTICAL);
        heading.addView(titles, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1));

        TextView headline = textView(ad.getHeadline(), 17, foreground);
        headline.setMaxLines(2);
        headline.setTypeface(headline.getTypeface(), android.graphics.Typeface.BOLD);
        titles.addView(headline, matchWidthWrapHeight());
        adView.setHeadlineView(headline);

        TextView advertiser = textView(ad.getAdvertiser(), 12, secondary);
        advertiser.setMaxLines(1);
        titles.addView(advertiser, matchWidthWrapHeight());
        adView.setAdvertiserView(advertiser);
        if (ad.getAdvertiser() == null) advertiser.setVisibility(View.GONE);

        MediaView media = new MediaView(getContext());
        media.setImageScaleType(ImageView.ScaleType.CENTER_CROP);
        LinearLayout.LayoutParams mediaLayout = new LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            0,
            1
        );
        mediaLayout.topMargin = dp(10);
        content.addView(media, mediaLayout);
        adView.setMediaView(media);
        media.setMediaContent(ad.getMediaContent());

        TextView body = textView(ad.getBody(), 13, secondary);
        body.setMaxLines(2);
        LinearLayout.LayoutParams bodyLayout = matchWidthWrapHeight();
        bodyLayout.topMargin = dp(8);
        content.addView(body, bodyLayout);
        adView.setBodyView(body);
        if (ad.getBody() == null) body.setVisibility(View.GONE);

        Button action = new Button(getContext());
        action.setText(ad.getCallToAction());
        action.setTextColor(Color.WHITE);
        action.setTextSize(13);
        action.setAllCaps(false);
        action.setGravity(Gravity.CENTER);
        GradientDrawable actionBackground = new GradientDrawable();
        actionBackground.setColor(accent);
        actionBackground.setCornerRadius(dp(5));
        action.setBackground(actionBackground);
        LinearLayout.LayoutParams actionLayout = new LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            dp(42)
        );
        actionLayout.topMargin = dp(10);
        content.addView(action, actionLayout);
        adView.setCallToActionView(action);
        if (ad.getCallToAction() == null) action.setVisibility(View.GONE);

        adView.setNativeAd(ad);
        return adView;
    }

    private TextView textView(String value, int size, int color) {
        TextView view = new TextView(getContext());
        view.setText(value == null ? "" : value);
        view.setTextSize(size);
        view.setTextColor(color);
        return view;
    }

    private LinearLayout.LayoutParams matchWidthWrapHeight() {
        return new LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.WRAP_CONTENT
        );
    }

    private LinearLayout.LayoutParams wrapContent() {
        return new LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.WRAP_CONTENT,
            ViewGroup.LayoutParams.WRAP_CONTENT
        );
    }

    private int dp(int value) {
        return Math.round(value * getContext().getResources().getDisplayMetrics().density);
    }

    private Activity activity() {
        return (Activity) getContext();
    }

    private void removeAdView() {
        if (nativeAdView == null) return;
        if (nativeAdView.getParent() instanceof ViewGroup) {
            ((ViewGroup) nativeAdView.getParent()).removeView(nativeAdView);
        }
        nativeAdView.destroy();
        nativeAdView = null;
    }

    private void destroyAd() {
        removeAdView();
        if (nativeAd != null) {
            nativeAd.destroy();
            nativeAd = null;
        }
    }
}
