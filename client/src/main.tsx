import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Import Remix icon CSS
const remixIconLink = document.createElement("link");
remixIconLink.href = "https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css";
remixIconLink.rel = "stylesheet";
document.head.appendChild(remixIconLink);

// Import Google Fonts
const googleFontsLink = document.createElement("link");
googleFontsLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@600;700&display=swap";
googleFontsLink.rel = "stylesheet";
document.head.appendChild(googleFontsLink);

// Set title
document.title = "RedeSocial";

createRoot(document.getElementById("root")!).render(<App />);
