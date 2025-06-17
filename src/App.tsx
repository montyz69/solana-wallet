import "./App.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "./components/navbar/navbar";
import { Seed } from "./components/seed/seed";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="container">
        <Navbar />
        <Seed />
      </div>
    </ThemeProvider>
  );
}

export default App;
