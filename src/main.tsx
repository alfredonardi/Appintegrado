
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./styles/index.css";
  import { migrateStorageKeys } from "./utils/storageMigration";

  // Execute storage migration before app initialization
  migrateStorageKeys();

  createRoot(document.getElementById("root")!).render(<App />);
  