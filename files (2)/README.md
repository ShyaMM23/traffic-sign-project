# Traffic AI — Android App

## Setup in Android Studio

1. Open Android Studio → **Open** → select the `android-app` folder
2. Wait for Gradle sync to complete
3. In `ApiClient.kt`, update `BASE_URL`:
   - **Emulator**: `http://10.0.2.2:8000` (default, already set)
   - **Real device**: `http://<YOUR_PC_LAN_IP>:8000`
4. Run your FastAPI backend: `uvicorn main:app --host 0.0.0.0 --port 8000`
5. Press ▶ Run in Android Studio

## Project Structure

```
app/src/main/
├── java/com/trafficai/
│   ├── LoginActivity.kt      ← Login screen
│   ├── MainActivity.kt       ← Bottom nav host
│   ├── HomeFragment.kt       ← Home screen
│   ├── DetectFragment.kt     ← Image upload + detect
│   ├── AboutFragment.kt      ← About screen
│   └── ApiClient.kt          ← Backend HTTP calls
├── res/
│   ├── layout/               ← XML layouts
│   ├── navigation/           ← Nav graph
│   ├── menu/                 ← Bottom nav menu
│   └── values/               ← Colors, themes, strings
└── AndroidManifest.xml
```

## Backend API

Expects: `POST /predict/` with `multipart/form-data` field `file`  
Returns: `{ "class": "Speed limit (30km/h)", "confidence": 0.97 }`
