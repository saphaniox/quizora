package com.saptechug.quitech;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        registerPlugin(NativeCatalogueAdPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
