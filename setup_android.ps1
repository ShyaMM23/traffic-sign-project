# ── Create all directories ──────────────────────────────────────────────────
$base = "mobile\android-app"
$java = "$base\app\src\main\java\com\trafficai"
$res  = "$base\app\src\main\res"

New-Item -ItemType Directory -Force -Path $java | Out-Null
New-Item -ItemType Directory -Force -Path "$res\layout" | Out-Null
New-Item -ItemType Directory -Force -Path "$res\values" | Out-Null
New-Item -ItemType Directory -Force -Path "$res\color" | Out-Null
New-Item -ItemType Directory -Force -Path "$res\navigation" | Out-Null
New-Item -ItemType Directory -Force -Path "$res\menu" | Out-Null
New-Item -ItemType Directory -Force -Path "$res\drawable" | Out-Null
New-Item -ItemType Directory -Force -Path "$res\mipmap-hdpi" | Out-Null
New-Item -ItemType Directory -Force -Path "$res\mipmap-mdpi" | Out-Null
New-Item -ItemType Directory -Force -Path "$res\mipmap-xhdpi" | Out-Null
New-Item -ItemType Directory -Force -Path "$res\mipmap-xxhdpi" | Out-Null
New-Item -ItemType Directory -Force -Path "$res\mipmap-xxxhdpi" | Out-Null

Write-Host "Directories created..." -ForegroundColor Cyan

# ── settings.gradle ─────────────────────────────────────────────────────────
@"
pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "TrafficAI"
include ':app'
"@ | Set-Content "$base\settings.gradle" -Encoding UTF8

# ── build.gradle (project) ───────────────────────────────────────────────────
@"
plugins {
    id 'com.android.application' version '8.2.0' apply false
    id 'org.jetbrains.kotlin.android' version '1.9.0' apply false
}
"@ | Set-Content "$base\build.gradle" -Encoding UTF8

# ── build.gradle (app) ───────────────────────────────────────────────────────
@"
plugins {
    id 'com.android.application'
    id 'org.jetbrains.kotlin.android'
}

android {
    namespace 'com.trafficai'
    compileSdk 34

    defaultConfig {
        applicationId "com.trafficai"
        minSdk 24
        targetSdk 34
        versionCode 1
        versionName "1.0"
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
    kotlinOptions { jvmTarget = '1.8' }
    buildFeatures { viewBinding true }
}

dependencies {
    implementation 'androidx.core:core-ktx:1.12.0'
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.11.0'
    implementation 'androidx.constraintlayout:constraintlayout:2.1.4'
    implementation 'androidx.navigation:navigation-fragment-ktx:2.7.6'
    implementation 'androidx.navigation:navigation-ui-ktx:2.7.6'
    implementation 'com.squareup.okhttp3:okhttp:4.12.0'
    implementation 'com.google.code.gson:gson:2.10.1'
    implementation 'io.coil-kt:coil:2.5.0'
    implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3'
    implementation 'androidx.lifecycle:lifecycle-viewmodel-ktx:2.7.0'
    implementation 'androidx.lifecycle:lifecycle-runtime-ktx:2.7.0'
}
"@ | Set-Content "$base\app\build.gradle" -Encoding UTF8

# ── proguard-rules.pro ───────────────────────────────────────────────────────
@"
# Add project specific ProGuard rules here.
"@ | Set-Content "$base\app\proguard-rules.pro" -Encoding UTF8

# ── AndroidManifest.xml ──────────────────────────────────────────────────────
@"
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="Traffic AI"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.TrafficAI"
        android:usesCleartextTraffic="true">
        <activity
            android:name=".LoginActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
        <activity android:name=".MainActivity" android:exported="false"/>
    </application>
</manifest>
"@ | Set-Content "$base\app\src\main\AndroidManifest.xml" -Encoding UTF8

# ── colors.xml ───────────────────────────────────────────────────────────────
@"
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="primary">#1A56DB</color>
    <color name="primary_dark">#1241A8</color>
    <color name="primary_light">#EEF3FD</color>
    <color name="primary_container">#DBEAFE</color>
    <color name="background">#F8FAFC</color>
    <color name="surface">#FFFFFF</color>
    <color name="surface_variant">#F1F5F9</color>
    <color name="on_surface">#0F172A</color>
    <color name="divider">#E2E8F0</color>
    <color name="success">#16A34A</color>
    <color name="success_bg">#DCFCE7</color>
    <color name="error_color">#DC2626</color>
    <color name="text_primary">#0F172A</color>
    <color name="text_secondary">#475569</color>
    <color name="text_hint">#94A3B8</color>
    <color name="text_on_primary">#FFFFFF</color>
</resources>
"@ | Set-Content "$res\values\colors.xml" -Encoding UTF8

# ── strings.xml ──────────────────────────────────────────────────────────────
@"
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">Traffic AI</string>
</resources>
"@ | Set-Content "$res\values\strings.xml" -Encoding UTF8

# ── dimens.xml ───────────────────────────────────────────────────────────────
@"
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <dimen name="min_height">600dp</dimen>
</resources>
"@ | Set-Content "$res\values\dimens.xml" -Encoding UTF8

# ── themes.xml ───────────────────────────────────────────────────────────────
@"
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="Theme.TrafficAI" parent="Theme.Material3.Light.NoActionBar">
        <item name="colorPrimary">@color/primary</item>
        <item name="colorPrimaryVariant">@color/primary_dark</item>
        <item name="colorOnPrimary">@color/text_on_primary</item>
        <item name="android:colorBackground">@color/background</item>
        <item name="colorSurface">@color/surface</item>
        <item name="android:statusBarColor">@color/surface</item>
        <item name="android:navigationBarColor">@color/surface</item>
        <item name="android:windowLightStatusBar">true</item>
        <item name="android:windowLightNavigationBar">true</item>
    </style>
    <style name="Widget.TrafficAI.Card" parent="Widget.Material3.CardView.Elevated">
        <item name="cardElevation">0dp</item>
        <item name="cardCornerRadius">16dp</item>
        <item name="strokeColor">@color/divider</item>
        <item name="strokeWidth">1dp</item>
        <item name="cardBackgroundColor">@color/surface</item>
    </style>
    <style name="Widget.TrafficAI.Button" parent="Widget.Material3.Button">
        <item name="android:textSize">15sp</item>
        <item name="cornerRadius">12dp</item>
        <item name="android:paddingTop">14dp</item>
        <item name="android:paddingBottom">14dp</item>
    </style>
    <style name="Widget.TrafficAI.Button.Outlined" parent="Widget.Material3.Button.OutlinedButton">
        <item name="android:textSize">15sp</item>
        <item name="cornerRadius">12dp</item>
        <item name="android:paddingTop">14dp</item>
        <item name="android:paddingBottom">14dp</item>
    </style>
    <style name="Widget.TrafficAI.TextInputLayout" parent="Widget.Material3.TextInputLayout.OutlinedBox">
        <item name="boxCornerRadiusTopStart">12dp</item>
        <item name="boxCornerRadiusTopEnd">12dp</item>
        <item name="boxCornerRadiusBottomStart">12dp</item>
        <item name="boxCornerRadiusBottomEnd">12dp</item>
        <item name="boxStrokeColor">@color/divider</item>
    </style>
</resources>
"@ | Set-Content "$res\values\themes.xml" -Encoding UTF8

# ── bottom_nav_color.xml ─────────────────────────────────────────────────────
@"
<?xml version="1.0" encoding="utf-8"?>
<selector xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:color="@color/primary" android:state_checked="true"/>
    <item android:color="@color/text_hint"/>
</selector>
"@ | Set-Content "$res\color\bottom_nav_color.xml" -Encoding UTF8

# ── bottom_nav_menu.xml ──────────────────────────────────────────────────────
@"
<?xml version="1.0" encoding="utf-8"?>
<menu xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:id="@+id/homeFragment"   android:icon="@android:drawable/ic_menu_compass"      android:title="Home"/>
    <item android:id="@+id/detectFragment" android:icon="@android:drawable/ic_menu_camera"       android:title="Detect"/>
    <item android:id="@+id/aboutFragment"  android:icon="@android:drawable/ic_menu_info_details" android:title="About"/>
</menu>
"@ | Set-Content "$res\menu\bottom_nav_menu.xml" -Encoding UTF8

# ── nav_graph.xml ────────────────────────────────────────────────────────────
@"
<?xml version="1.0" encoding="utf-8"?>
<navigation xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:id="@+id/nav_graph"
    app:startDestination="@id/homeFragment">
    <fragment android:id="@+id/homeFragment"   android:name="com.trafficai.HomeFragment"   android:label="Home"/>
    <fragment android:id="@+id/detectFragment" android:name="com.trafficai.DetectFragment" android:label="Detect"/>
    <fragment android:id="@+id/aboutFragment"  android:name="com.trafficai.AboutFragment"  android:label="About"/>
</navigation>
"@ | Set-Content "$res\navigation\nav_graph.xml" -Encoding UTF8

# ── activity_login.xml ───────────────────────────────────────────────────────
@"
<?xml version="1.0" encoding="utf-8"?>
<ScrollView xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent" android:layout_height="match_parent"
    android:fillViewport="true" android:background="@color/background">
    <LinearLayout android:layout_width="match_parent" android:layout_height="wrap_content"
        android:orientation="vertical" android:padding="28dp" android:gravity="center_horizontal">
        <Space android:layout_width="0dp" android:layout_height="0dp" android:layout_weight="1"/>
        <LinearLayout android:layout_width="wrap_content" android:layout_height="wrap_content"
            android:orientation="vertical" android:gravity="center" android:layout_marginBottom="40dp">
            <com.google.android.material.card.MaterialCardView
                style="@style/Widget.TrafficAI.Card"
                android:layout_width="72dp" android:layout_height="72dp"
                app:cardBackgroundColor="@color/primary" app:cardCornerRadius="20dp"
                app:strokeWidth="0dp" android:layout_gravity="center" android:layout_marginBottom="20dp">
                <TextView android:layout_width="match_parent" android:layout_height="match_parent"
                    android:text="&#x1F6A6;" android:textSize="34sp" android:gravity="center"/>
            </com.google.android.material.card.MaterialCardView>
            <TextView android:layout_width="wrap_content" android:layout_height="wrap_content"
                android:text="Traffic AI" android:textSize="28sp" android:textStyle="bold"
                android:textColor="@color/text_primary" android:layout_marginBottom="8dp"/>
            <TextView android:layout_width="wrap_content" android:layout_height="wrap_content"
                android:text="Sign detection powered by deep learning"
                android:textSize="14sp" android:textColor="@color/text_secondary" android:gravity="center"/>
        </LinearLayout>
        <com.google.android.material.card.MaterialCardView
            style="@style/Widget.TrafficAI.Card"
            android:layout_width="match_parent" android:layout_height="wrap_content"
            android:layout_marginBottom="24dp">
            <LinearLayout android:layout_width="match_parent" android:layout_height="wrap_content"
                android:orientation="vertical" android:padding="24dp">
                <TextView android:layout_width="wrap_content" android:layout_height="wrap_content"
                    android:text="Sign in" android:textSize="20sp" android:textStyle="bold"
                    android:textColor="@color/text_primary" android:layout_marginBottom="4dp"/>
                <TextView android:layout_width="wrap_content" android:layout_height="wrap_content"
                    android:text="Enter your credentials to continue"
                    android:textSize="13sp" android:textColor="@color/text_secondary" android:layout_marginBottom="24dp"/>
                <com.google.android.material.textfield.TextInputLayout
                    android:id="@+id/layoutUsername"
                    style="@style/Widget.TrafficAI.TextInputLayout"
                    android:layout_width="match_parent" android:layout_height="wrap_content"
                    android:hint="Username" android:layout_marginBottom="16dp">
                    <com.google.android.material.textfield.TextInputEditText
                        android:id="@+id/etUsername"
                        android:layout_width="match_parent" android:layout_height="wrap_content"
                        android:inputType="text" android:imeOptions="actionNext"/>
                </com.google.android.material.textfield.TextInputLayout>
                <com.google.android.material.textfield.TextInputLayout
                    android:id="@+id/layoutPassword"
                    style="@style/Widget.TrafficAI.TextInputLayout"
                    android:layout_width="match_parent" android:layout_height="wrap_content"
                    android:hint="Password" android:layout_marginBottom="24dp"
                    app:endIconMode="password_toggle">
                    <com.google.android.material.textfield.TextInputEditText
                        android:id="@+id/etPassword"
                        android:layout_width="match_parent" android:layout_height="wrap_content"
                        android:inputType="textPassword" android:imeOptions="actionDone"/>
                </com.google.android.material.textfield.TextInputLayout>
                <com.google.android.material.button.MaterialButton
                    android:id="@+id/btnLogin"
                    style="@style/Widget.TrafficAI.Button"
                    android:layout_width="match_parent" android:layout_height="wrap_content"
                    android:text="Sign In"/>
            </LinearLayout>
        </com.google.android.material.card.MaterialCardView>
        <TextView android:layout_width="wrap_content" android:layout_height="wrap_content"
            android:text="Use any credentials to continue for demo"
            android:textSize="12sp" android:textColor="@color/text_hint" android:gravity="center"/>
        <Space android:layout_width="0dp" android:layout_height="0dp" android:layout_weight="1"/>
    </LinearLayout>
</ScrollView>
"@ | Set-Content "$res\layout\activity_login.xml" -Encoding UTF8

# ── activity_main.xml ────────────────────────────────────────────────────────
@"
<?xml version="1.0" encoding="utf-8"?>
<androidx.coordinatorlayout.widget.CoordinatorLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent" android:layout_height="match_parent"
    android:background="@color/background">
    <fragment
        android:id="@+id/nav_host_fragment"
        android:name="androidx.navigation.fragment.NavHostFragment"
        android:layout_width="match_parent" android:layout_height="match_parent"
        app:defaultNavHost="true" app:navGraph="@navigation/nav_graph"
        app:layout_behavior="@string/appbar_scrolling_view_behavior"/>
    <com.google.android.material.bottomnavigation.BottomNavigationView
        android:id="@+id/bottom_nav"
        android:layout_width="match_parent" android:layout_height="wrap_content"
        android:layout_gravity="bottom" android:background="@color/surface"
        app:menu="@menu/bottom_nav_menu"
        app:labelVisibilityMode="labeled"
        app:itemIconTint="@color/bottom_nav_color"
        app:itemTextColor="@color/bottom_nav_color"/>
</androidx.coordinatorlayout.widget.CoordinatorLayout>
"@ | Set-Content "$res\layout\activity_main.xml" -Encoding UTF8

# ── fragment_home.xml ────────────────────────────────────────────────────────
@"
<?xml version="1.0" encoding="utf-8"?>
<ScrollView xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent" android:layout_height="match_parent"
    android:background="@color/background">
    <LinearLayout android:layout_width="match_parent" android:layout_height="wrap_content"
        android:orientation="vertical" android:padding="20dp">
        <LinearLayout android:layout_width="match_parent" android:layout_height="wrap_content"
            android:orientation="horizontal" android:gravity="center_vertical"
            android:layout_marginBottom="24dp" android:layout_marginTop="8dp">
            <LinearLayout android:layout_width="0dp" android:layout_weight="1"
                android:layout_height="wrap_content" android:orientation="vertical">
                <TextView android:layout_width="wrap_content" android:layout_height="wrap_content"
                    android:text="Traffic AI" android:textSize="26sp" android:textStyle="bold"
                    android:textColor="@color/text_primary"/>
                <TextView android:layout_width="wrap_content" android:layout_height="wrap_content"
                    android:text="Sign detection system" android:textSize="13sp"
                    android:textColor="@color/text_secondary"/>
            </LinearLayout>
            <com.google.android.material.chip.Chip
                android:layout_width="wrap_content" android:layout_height="wrap_content"
                android:text="Online" android:textSize="12sp" android:textColor="@color/success"
                app:chipBackgroundColor="@color/success_bg" app:chipStrokeWidth="0dp"
                android:clickable="false"/>
        </LinearLayout>
        <com.google.android.material.card.MaterialCardView
            style="@style/Widget.TrafficAI.Card"
            android:layout_width="match_parent" android:layout_height="wrap_content"
            app:cardBackgroundColor="@color/primary" app:strokeWidth="0dp"
            android:layout_marginBottom="20dp">
            <LinearLayout android:layout_width="match_parent" android:layout_height="wrap_content"
                android:orientation="vertical" android:padding="24dp">
                <TextView android:layout_width="wrap_content" android:layout_height="wrap_content"
                    android:text="&#x1F6A6;" android:textSize="40sp" android:layout_marginBottom="16dp"/>
                <TextView android:layout_width="wrap_content" android:layout_height="wrap_content"
                    android:text="AI Traffic Sign\nDetection" android:textSize="22sp"
                    android:textStyle="bold" android:textColor="#FFFFFF"
                    android:lineSpacingMultiplier="1.15" android:layout_marginBottom="8dp"/>
                <TextView android:layout_width="wrap_content" android:layout_height="wrap_content"
                    android:text="ResNet-50 &amp; EfficientNet models\ntrained on 43 traffic sign classes"
                    android:textSize="13sp" android:textColor="#BBDEFB"
                    android:lineSpacingMultiplier="1.4" android:layout_marginBottom="20dp"/>
                <com.google.android.material.button.MaterialButton
                    android:id="@+id/btnDetect"
                    android:layout_width="wrap_content" android:layout_height="wrap_content"
                    android:text="Start Detection" android:textColor="@color/primary"
                    app:backgroundTint="#FFFFFF" app:cornerRadius="10dp"
                    android:paddingStart="20dp" android:paddingEnd="20dp"/>
            </LinearLayout>
        </com.google.android.material.card.MaterialCardView>
        <TextView android:layout_width="wrap_content" android:layout_height="wrap_content"
            android:text="System Stats" android:textSize="16sp" android:textStyle="bold"
            android:textColor="@color/text_primary" android:layout_marginBottom="12dp"/>
        <LinearLayout android:layout_width="match_parent" android:layout_height="wrap_content"
            android:orientation="horizontal" android:layout_marginBottom="20dp">
            <com.google.android.material.card.MaterialCardView
                style="@style/Widget.TrafficAI.Card"
                android:layout_width="0dp" android:layout_weight="1"
                android:layout_height="wrap_content" android:layout_marginEnd="8dp">
                <LinearLayout android:layout_width="match_parent" android:layout_height="wrap_content"
                    android:orientation="vertical" android:padding="16dp">
                    <TextView android:layout_width="wrap_content" android:layout_height="wrap_content"
                        android:text="94.7%" android:textSize="22sp" android:textStyle="bold"
                        android:textColor="@color/primary"/>
                    <TextView android:layout_width="wrap_content" android:layout_height="wrap_content"
                        android:text="Accuracy" android:textSize="12sp" android:textColor="@color/text_secondary"/>
                </LinearLayout>
            </com.google.android.material.card.MaterialCardView>
            <com.google.android.material.card.MaterialCardView
                style="@style/Widget.TrafficAI.Card"
                android:layout_width="0dp" android:layout_weight="1"
                android:layout_height="wrap_content" android:layout_marginEnd="8dp">
                <LinearLayout android:layout_width="match_parent" android:layout_height="wrap_content"
                    android:orientation="vertical" android:padding="16dp">
                    <TextView android:layout_width="wrap_content" android:layout_height="wrap_content"
                        android:text="43" android:textSize="22sp" android:textStyle="bold"
                        android:textColor="@color/primary"/>
                    <TextView android:layout_width="wrap_content" android:layout_height="wrap_content"
                        android:text="Classes" android:textSize="12sp" android:textColor="@color/text_secondary"/>
                </LinearLayout>
            </com.google.android.material.card.MaterialCardView>
            <com.google.android.material.card.MaterialCardView
                style="@style/Widget.TrafficAI.Card"
                android:layout_width="0dp" android:layout_weight="1"
                android:layout_height="wrap_content">
                <LinearLayout android:layout_width="match_parent" android:layout_height="wrap_content"
                    android:orientation="vertical" android:padding="16dp">
                    <TextView android:layout_width="wrap_content" android:layout_height="wrap_content"
                        android:text="12ms" android:textSize="22sp" android:textStyle="bold"
                        android:textColor="@color/primary"/>
                    <TextView android:layout_width="wrap_content" android:layout_height="wrap_content"
                        android:text="Latency" android:textSize="12sp" android:textColor="@color/text_secondary"/>
                </LinearLayout>
            </com.google.android.material.card.MaterialCardView>
        </LinearLayout>
    </LinearLayout>
</ScrollView>
"@ | Set-Content "$res\layout\fragment_home.xml" -Encoding UTF8

# ── fragment_detect.xml ──────────────────────────────────────────────────────
@"
<?xml version="1.0" encoding="utf-8"?>
<ScrollView xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent" android:layout_height="match_parent"
    android:background="@color/background">
    <LinearLayout android:layout_width="match_parent" android:layout_height="wrap_content"
        android:orientation="vertical" android:padding="20dp">
        <TextView android:layout_width="wrap_content" android:layout_height="wrap_content"
            android:text="Detect Sign" android:textSize="26sp" android:textStyle="bold"
            android:textColor="@color/text_primary" android:layout_marginTop="8dp" android:layout_marginBottom="4dp"/>
        <TextView android:layout_width="wrap_content" android:layout_height="wrap_content"
            android:text="Upload an image to identify the traffic sign"
            android:textSize="13sp" android:textColor="@color/text_secondary" android:layout_marginBottom="24dp"/>
        <com.google.android.material.card.MaterialCardView
            android:id="@+id/cardImagePreview"
            style="@style/Widget.TrafficAI.Card"
            android:layout_width="match_parent" android:layout_height="240dp"
            android:layout_marginBottom="16dp">
            <FrameLayout android:layout_width="match_parent" android:layout_height="match_parent">
                <LinearLayout android:id="@+id/layoutEmpty"
                    android:layout_width="match_parent" android:layout_height="match_parent"
                    android:orientation="vertical" android:gravity="center"
                    android:background="@color/surface_variant">
                    <TextView android:layout_width="wrap_content" android:layout_height="wrap_content"
                        android:text="&#x1F4F7;" android:textSize="48sp" android:layout_marginBottom="12dp"/>
                    <TextView android:layout_width="wrap_content" android:layout_height="wrap_content"
                        android:text="No image selected" android:textSize="15sp" android:textStyle="bold"
                        android:textColor="@color/text_primary" android:layout_marginBottom="4dp"/>
                    <TextView android:layout_width="wrap_content" android:layout_height="wrap_content"
                        android:text="Tap below to choose from gallery"
                        android:textSize="13sp" android:textColor="@color/text_hint"/>
                </LinearLayout>
                <ImageView android:id="@+id/imgPreview"
                    android:layout_width="match_parent" android:layout_height="match_parent"
                    android:scaleType="centerCrop" android:visibility="gone"/>
            </FrameLayout>
        </com.google.android.material.card.MaterialCardView>
        <com.google.android.material.button.MaterialButton
            android:id="@+id/btnPickImage"
            style="@style/Widget.TrafficAI.Button.Outlined"
            android:layout_width="match_parent" android:layout_height="wrap_content"
            android:text="Choose Image" android:layout_marginBottom="12dp"/>
        <com.google.android.material.button.MaterialButton
            android:id="@+id/btnDetect"
            style="@style/Widget.TrafficAI.Button"
            android:layout_width="match_parent" android:layout_height="wrap_content"
            android:text="Detect Sign" android:enabled="false" android:layout_marginBottom="24dp"/>
        <com.google.android.material.card.MaterialCardView
            android:id="@+id/cardResult"
            style="@style/Widget.TrafficAI.Card"
            android:layout_width="match_parent" android:layout_height="wrap_content"
            android:visibility="gone">
            <LinearLayout android:layout_width="match_parent" android:layout_height="wrap_content"
                android:orientation="vertical" android:padding="20dp">
                <TextView android:layout_width="wrap_content" android:layout_height="wrap_content"
                    android:text="Detection Result" android:textSize="16sp" android:textStyle="bold"
                    android:textColor="@color/text_primary" android:layout_marginBottom="16dp"/>
                <TextView android:layout_width="wrap_content" android:layout_height="wrap_content"
                    android:text="Sign Class" android:textSize="12sp"
                    android:textColor="@color/text_hint" android:layout_marginBottom="4dp"/>
                <TextView android:id="@+id/tvClass"
                    android:layout_width="wrap_content" android:layout_height="wrap_content"
                    android:text="--" android:textSize="24sp" android:textStyle="bold"
                    android:textColor="@color/text_primary" android:layout_marginBottom="16dp"/>
                <View android:layout_width="match_parent" android:layout_height="1dp"
                    android:background="@color/divider" android:layout_marginBottom="16dp"/>
                <LinearLayout android:layout_width="match_parent" android:layout_height="wrap_content"
                    android:orientation="horizontal" android:gravity="center_vertical"
                    android:layout_marginBottom="8dp">
                    <TextView android:layout_width="0dp" android:layout_weight="1"
                        android:layout_height="wrap_content"
                        android:text="Confidence" android:textSize="13sp"
                        android:textColor="@color/text_secondary"/>
                    <TextView android:id="@+id/tvConfidence"
                        android:layout_width="wrap_content" android:layout_height="wrap_content"
                        android:text="--" android:textSize="13sp" android:textStyle="bold"
                        android:textColor="@color/primary"/>
                </LinearLayout>
                <com.google.android.material.progressindicator.LinearProgressIndicator
                    android:id="@+id/progressConfidence"
                    android:layout_width="match_parent" android:layout_height="wrap_content"
                    android:progress="0"
                    app:trackCornerRadius="4dp"
                    app:indicatorColor="@color/primary"
                    app:trackColor="@color/primary_container"/>
            </LinearLayout>
        </com.google.android.material.card.MaterialCardView>
        <LinearLayout android:id="@+id/layoutLoading"
            android:layout_width="match_parent" android:layout_height="wrap_content"
            android:orientation="vertical" android:gravity="center"
            android:padding="24dp" android:visibility="gone">
            <com.google.android.material.progressindicator.CircularProgressIndicator
                android:layout_width="wrap_content" android:layout_height="wrap_content"
                android:indeterminate="true" app:indicatorColor="@color/primary"
                android:layout_marginBottom="12dp"/>
            <TextView android:layout_width="wrap_content" android:layout_height="wrap_content"
                android:text="Analyzing image..." android:textSize="14sp"
                android:textColor="@color/text_secondary"/>
        </LinearLayout>
    </LinearLayout>
</ScrollView>
"@ | Set-Content "$res\layout\fragment_detect.xml" -Encoding UTF8

# ── fragment_about.xml ───────────────────────────────────────────────────────
@"
<?xml version="1.0" encoding="utf-8"?>
<ScrollView xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent" android:layout_height="match_parent"
    android:background="@color/background">
    <LinearLayout android:layout_width="match_parent" android:layout_height="wrap_content"
        android:orientation="vertical" android:padding="20dp">
        <TextView android:layout_width="wrap_content" android:layout_height="wrap_content"
            android:text="About" android:textSize="26sp" android:textStyle="bold"
            android:textColor="@color/text_primary" android:layout_marginTop="8dp" android:layout_marginBottom="24dp"/>
        <com.google.android.material.card.MaterialCardView
            style="@style/Widget.TrafficAI.Card"
            android:layout_width="match_parent" android:layout_height="wrap_content"
            android:layout_marginBottom="16dp">
            <LinearLayout android:layout_width="match_parent" android:layout_height="wrap_content"
                android:orientation="vertical" android:padding="20dp">
                <TextView android:layout_width="wrap_content" android:layout_height="wrap_content"
                    android:text="About the Project" android:textSize="16sp" android:textStyle="bold"
                    android:textColor="@color/text_primary" android:layout_marginBottom="8dp"/>
                <TextView android:layout_width="match_parent" android:layout_height="wrap_content"
                    android:text="This system uses deep learning models trained on the GTSRB dataset to detect and classify 43 distinct traffic sign classes using a sliding-window approach."
                    android:textSize="14sp" android:textColor="@color/text_secondary"
                    android:lineSpacingMultiplier="1.5"/>
            </LinearLayout>
        </com.google.android.material.card.MaterialCardView>
        <com.google.android.material.card.MaterialCardView
            style="@style/Widget.TrafficAI.Card"
            android:layout_width="match_parent" android:layout_height="wrap_content">
            <LinearLayout android:layout_width="match_parent" android:layout_height="wrap_content"
                android:orientation="horizontal" android:padding="16dp" android:gravity="center_vertical">
                <LinearLayout android:layout_width="0dp" android:layout_weight="1"
                    android:layout_height="wrap_content" android:orientation="vertical">
                    <TextView android:layout_width="wrap_content" android:layout_height="wrap_content"
                        android:text="Backend" android:textSize="13sp" android:textColor="@color/text_hint"/>
                    <TextView android:layout_width="wrap_content" android:layout_height="wrap_content"
                        android:text="127.0.0.1:5000" android:textSize="14sp"
                        android:textStyle="bold" android:textColor="@color/primary"/>
                </LinearLayout>
                <LinearLayout android:layout_width="0dp" android:layout_weight="1"
                    android:layout_height="wrap_content" android:orientation="vertical">
                    <TextView android:layout_width="wrap_content" android:layout_height="wrap_content"
                        android:text="Model" android:textSize="13sp" android:textColor="@color/text_hint"/>
                    <TextView android:layout_width="wrap_content" android:layout_height="wrap_content"
                        android:text="ResNet-50" android:textSize="14sp"
                        android:textStyle="bold" android:textColor="@color/text_primary"/>
                </LinearLayout>
            </LinearLayout>
        </com.google.android.material.card.MaterialCardView>
    </LinearLayout>
</ScrollView>
"@ | Set-Content "$res\layout\fragment_about.xml" -Encoding UTF8

# ── Kotlin source files ───────────────────────────────────────────────────────

@"
package com.trafficai

import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.asRequestBody
import com.google.gson.Gson
import com.google.gson.annotations.SerializedName
import java.io.File
import java.util.concurrent.TimeUnit

data class PredictionResponse(
    @SerializedName("class") val detectedClass: String,
    @SerializedName("confidence") val confidence: Float
)

object ApiClient {
    // Emulator  -> 10.0.2.2   | Real device -> your PC's LAN IP
    private const val BASE_URL = "http://10.0.2.2:5000"

    private val client = OkHttpClient.Builder()
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(60, TimeUnit.SECONDS)
        .writeTimeout(60, TimeUnit.SECONDS)
        .build()

    private val gson = Gson()

    suspend fun predict(imageFile: File): Result<PredictionResponse> {
        return try {
            val requestBody = MultipartBody.Builder()
                .setType(MultipartBody.FORM)
                .addFormDataPart("file", imageFile.name,
                    imageFile.asRequestBody("image/*".toMediaTypeOrNull()))
                .build()
            val request = Request.Builder()
                .url("\$BASE_URL/detect")
                .post(requestBody)
                .build()
            val response = client.newCall(request).execute()
            if (response.isSuccessful) {
                val body = response.body?.string() ?: throw Exception("Empty response")
                Result.success(gson.fromJson(body, PredictionResponse::class.java))
            } else {
                Result.failure(Exception("Server error: \${response.code}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
"@ | Set-Content "$java\ApiClient.kt" -Encoding UTF8

@"
package com.trafficai

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.trafficai.databinding.ActivityLoginBinding

class LoginActivity : AppCompatActivity() {
    private lateinit var binding: ActivityLoginBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)
        binding.btnLogin.setOnClickListener {
            val user = binding.etUsername.text.toString().trim()
            val pass = binding.etPassword.text.toString().trim()
            binding.layoutUsername.error = null
            binding.layoutPassword.error = null
            when {
                user.isEmpty() -> binding.layoutUsername.error = "Please enter your username"
                pass.isEmpty() -> binding.layoutPassword.error = "Please enter your password"
                else -> {
                    startActivity(Intent(this, MainActivity::class.java))
                    finish()
                }
            }
        }
    }
}
"@ | Set-Content "$java\LoginActivity.kt" -Encoding UTF8

@"
package com.trafficai

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.navigation.fragment.NavHostFragment
import androidx.navigation.ui.setupWithNavController
import com.trafficai.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        val navHost = supportFragmentManager
            .findFragmentById(R.id.nav_host_fragment) as NavHostFragment
        binding.bottomNav.setupWithNavController(navHost.navController)
    }
}
"@ | Set-Content "$java\MainActivity.kt" -Encoding UTF8

@"
package com.trafficai

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.trafficai.databinding.FragmentHomeBinding

class HomeFragment : Fragment() {
    private var _binding: FragmentHomeBinding? = null
    private val binding get() = _binding!!
    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentHomeBinding.inflate(inflater, container, false)
        return binding.root
    }
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding.btnDetect.setOnClickListener { findNavController().navigate(R.id.detectFragment) }
    }
    override fun onDestroyView() { super.onDestroyView(); _binding = null }
}
"@ | Set-Content "$java\HomeFragment.kt" -Encoding UTF8

@"
package com.trafficai

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.provider.OpenableColumns
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.activity.result.contract.ActivityResultContracts
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import coil.load
import com.google.android.material.snackbar.Snackbar
import com.trafficai.databinding.FragmentDetectBinding
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.io.File
import java.io.FileOutputStream
import kotlin.math.roundToInt

class DetectFragment : Fragment() {
    private var _binding: FragmentDetectBinding? = null
    private val binding get() = _binding!!
    private var selectedFile: File? = null

    private val picker = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
        if (result.resultCode == Activity.RESULT_OK) {
            result.data?.data?.let { uri ->
                selectedFile = copyUri(uri)
                binding.layoutEmpty.visibility = View.GONE
                binding.imgPreview.visibility  = View.VISIBLE
                binding.imgPreview.load(uri) { crossfade(true) }
                binding.btnDetect.isEnabled = true
                binding.cardResult.visibility = View.GONE
            }
        }
    }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentDetectBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding.btnPickImage.setOnClickListener {
            picker.launch(Intent(Intent.ACTION_PICK).apply { type = "image/*" })
        }
        binding.btnDetect.setOnClickListener {
            selectedFile?.let { runDetection(it) }
        }
    }

    private fun runDetection(file: File) {
        binding.layoutLoading.visibility = View.VISIBLE
        binding.cardResult.visibility    = View.GONE
        binding.btnDetect.isEnabled      = false
        binding.btnPickImage.isEnabled   = false
        lifecycleScope.launch {
            val result = withContext(Dispatchers.IO) { ApiClient.predict(file) }
            binding.layoutLoading.visibility = View.GONE
            binding.btnDetect.isEnabled      = true
            binding.btnPickImage.isEnabled   = true
            result.onSuccess { p ->
                binding.cardResult.visibility = View.VISIBLE
                binding.tvClass.text          = p.detectedClass
                val pct = (p.confidence * 100).roundToInt()
                binding.tvConfidence.text     = "\$pct%"
                binding.progressConfidence.progress = pct
            }.onFailure { e ->
                Snackbar.make(binding.root, "Failed: \${e.message}", Snackbar.LENGTH_LONG)
                    .setAction("Retry") { runDetection(file) }.show()
            }
        }
    }

    private fun copyUri(uri: Uri): File {
        val name = getName(uri) ?: "img_\${System.currentTimeMillis()}.jpg"
        val file = File(requireContext().cacheDir, name)
        requireContext().contentResolver.openInputStream(uri)?.use { i ->
            FileOutputStream(file).use { o -> i.copyTo(o) }
        }
        return file
    }

    private fun getName(uri: Uri): String? {
        var n: String? = null
        requireContext().contentResolver.query(uri, null, null, null, null)?.use { c ->
            val idx = c.getColumnIndex(OpenableColumns.DISPLAY_NAME)
            if (c.moveToFirst() && idx >= 0) n = c.getString(idx)
        }
        return n
    }

    override fun onDestroyView() { super.onDestroyView(); _binding = null }
}
"@ | Set-Content "$java\DetectFragment.kt" -Encoding UTF8

@"
package com.trafficai

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.trafficai.databinding.FragmentAboutBinding

class AboutFragment : Fragment() {
    private var _binding: FragmentAboutBinding? = null
    private val binding get() = _binding!!
    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentAboutBinding.inflate(inflater, container, false)
        return binding.root
    }
    override fun onDestroyView() { super.onDestroyView(); _binding = null }
}
"@ | Set-Content "$java\AboutFragment.kt" -Encoding UTF8

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Android app created successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Open Android Studio"
Write-Host "  2. File > Open > select:  mobile\android-app"
Write-Host "  3. Wait for Gradle sync"
Write-Host "  4. Press the Run button"
Write-Host ""
Write-Host "Backend URL is set to: http://10.0.2.2:5000/detect" -ForegroundColor Cyan
Write-Host "(10.0.2.2 = your PC's localhost inside the Android emulator)" -ForegroundColor Gray
