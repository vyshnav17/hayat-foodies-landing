import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { GoogleOAuthProvider } from '@react-oauth/google';

// Placeholder Client ID - User needs to replace this
// Placeholder Client ID - User needs to replace this
const GOOGLE_CLIENT_ID = "496762144925-3lp3sel7egc41sm2sicdo026frhv13eo.apps.googleusercontent.com";

createRoot(document.getElementById("root")!).render(
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <App />
    </GoogleOAuthProvider>
);
