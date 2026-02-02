import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import AuthProvider from "./context/AuthContext";
import RoleProvider from "./context/RoleContext";
import SocketProvider from "./context/SocketContext";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RoleProvider>
          <SocketProvider>
            <AppRoutes />
          </SocketProvider>
        </RoleProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
