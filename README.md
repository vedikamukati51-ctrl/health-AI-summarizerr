# CIA-Home Frontend — Extended Patient Features

React + TypeScript frontend for the 16-feature CIA-Home / medical-report project.

## 1. Install

Install Node.js LTS first. Then open a terminal in this folder:

```bash
npm install
```

## 2. Configure frontend and backend environment

Copy the example files to real env files and fill in your values:

```bash
copy .env.example .env
copy backend\.env.example backend\.env
```

Frontend `.env`:

```env
VITE_DEMO_MODE=false
VITE_API_BASE_URL=http://localhost:5000
VITE_UPLOAD_FIELD=files
```

Backend `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
GEMINI_API_KEY=your_gemini_api_key_here
```

Use a reachable MongoDB Atlas or local MongoDB URI and a valid Gemini API key for live mode. Without those, the app falls back to demo data and remains usable for presentations.

## 3. Run

```bash
npm run dev
```

Open the local Vite URL shown in the terminal.

## 4. Production build

```bash
npm run build
npm run preview
```

The production files are created in `dist/`.

## Expected backend routes from the feature map

- GET `/api/dashboard`
- POST `/api/reports/upload`
- GET `/api/timeline`
- GET `/api/compare?beforeId=X&latestId=Y`
- GET `/api/reports?search=...&from=...&to=...`
- GET `/api/reports/:id`
- GET `/api/trends?parameter=...`
- GET `/api/glossary/explain?term=...&context=...`

## Important integration note

The feature map does not specify the exact JSON schema returned by every endpoint. This frontend therefore includes small response-normalization helpers and mock fallback data for GET pages. Once your backend is running, the real API response is used automatically.

For upload, the frontend sends selected files as multipart/form-data using the field name in `VITE_UPLOAD_FIELD`.

If your backend uses a different response shape, adjust the corresponding normalizer in `src/services/api.ts`.

## CORS

If frontend and backend run on different ports, the Express backend must allow the Vite origin during development, for example:

```ts
import cors from "cors";
app.use(cors({ origin: "http://localhost:5173" }));
```

Do not expose real patient data during a hackathon demo. The feature map recommends demo/seed data and local storage for demo mode.

## Medical safety

This UI presents AI-generated summaries as informational output. It should not be presented as a diagnosis or a replacement for a healthcare professional.


## Added AarogyaSaathi patient-discovery features

The attached patient feature plan identifies exactly five `[NEW]` discovery features that were not part of the existing CIA-Home frontend. This build adds only those five:
1. Doctor Visit Prep Kit (RD-1)
2. Multilingual Support — Indian languages (RD-2)
3. Medical Chatbot — Patient Query Assistant (RD-3)
4. Specialist Locator (RD-4)
5. 3D Interactive Anatomy Model (RD-5)

Existing CIA-Home report upload, timeline, reports, trends, comparison and glossary features were retained and not duplicated.

### Important implementation note

The five new screens are implemented as frontend-first, demo-ready experiences so the project remains executable without requiring a new backend. The chatbot, specialist list, translation preview and anatomy mapping use local demo logic. They can later be connected to production APIs/services described in the feature plan.

The 3D Anatomy screen uses a lightweight interactive CSS/DOM model with rotation and symptom/body-region mapping so it runs without adding another dependency. For a production clinical-grade visualization, replace this layer with a validated Three.js/WebGL or licensed anatomy service.

### New routes
- `/visit-prep`
- `/language`
- `/chatbot`
- `/specialists`
- `/anatomy`

## VS Code execution

1. Extract the ZIP.
2. Open the extracted folder in VS Code.
3. Open **Terminal → New Terminal**.
4. Confirm Node.js is installed:
   `node -v`
5. Install dependencies:
   `npm install`
6. Create `.env` from `.env.example` if you want to connect the existing backend.
7. Start the frontend:
   `npm run dev`
8. Open the localhost URL printed by Vite, normally `http://localhost:5173`.
9. Use the left navigation to open the five new patient-discovery features.

For a production build:
`npm run build`

The generated `dist/` folder can then be served with:
`npm run preview`


## Presentation / Demo Mode

This build is configured for a mentor presentation without a backend. `VITE_DEMO_MODE` defaults to `true`, so dashboard, reports, timeline, comparison, trends, glossary and upload processing use simulated data. The five added patient-discovery features also include a single consistent demo patient: **Ananya Sharma, 42, Female**.

### New-feature demo flow
1. **Doctor Visit Prep Kit:** prefilled patient symptoms/medicines → generate a question list.
2. **Multilingual Support:** switch between English and Indian-language previews.
3. **Patient Health Assistant:** ask about hemoglobin, creatinine, glucose or general report questions.
4. **Specialist Locator:** enter a symptom → see specialty mapping → view the live OpenStreetMap demo map and clinic cards.
5. **3D Interactive Anatomy:** enter a symptom or select a body region → rotate the model → open the Specialist Locator.

The map is the only part that needs an internet connection; it loads live OpenStreetMap tiles in an iframe and does not require an API key.

### Run
```bash
npm install
npm run dev
```

To connect a real backend later, create `.env.local` with:
```text
VITE_DEMO_MODE=false
VITE_API_BASE_URL=http://localhost:5000
```
