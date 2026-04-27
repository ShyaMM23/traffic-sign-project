# Traffic AI — Web App

## Setup in VS Code

1. Open the `web-app` folder in VS Code
2. Open the terminal and install dependencies:
   ```
   npm install
   ```
3. Start the FastAPI backend on port 8000:
   ```
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```
4. Start the dev server:
   ```
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000)

## How the proxy works

Vite is configured to proxy all `/api/*` requests to `http://127.0.0.1:8000`.  
The app sends uploads to `/api/predict/` which becomes `http://127.0.0.1:8000/predict/`.  
No CORS issues — everything goes through the same origin in dev.

## Backend API contract

```
POST /predict/
Content-Type: multipart/form-data
Body: file = <image>

Response 200:
{
  "class": "Speed limit (30km/h)",
  "confidence": 0.974
}
```

## Project structure

```
web-app/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css           ← design tokens
    ├── components/
    │   ├── Layout.jsx      ← sidebar shell
    │   └── Layout.module.css
    └── pages/
        ├── Login.jsx / .module.css
        ├── Home.jsx  / .module.css
        ├── Detect.jsx / .module.css
        └── About.jsx  / .module.css
```
