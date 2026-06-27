import AppNavigator from "./Navigation/AppNavigator";
import { AppThemeProvider } from "./Context/AppThemeContext";

export default function App() {
  return (
    <AppThemeProvider>
      <AppNavigator />
    </AppThemeProvider>
  );
}
