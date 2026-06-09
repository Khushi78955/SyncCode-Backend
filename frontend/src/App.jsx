import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateRoom from "./pages/CreateRoom";
import ProtectedRoute from "./components/ProtectedRoute";
import Room from "./pages/Room";

function App() {
  return(
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />

        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/create-room" 
          element={
            <ProtectedRoute>
              <CreateRoom />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/room/:roomId" 
          element={
            <ProtectedRoute>
              <Room />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  )

}

export default App;