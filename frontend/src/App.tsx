import { Routes, Route } from "react-router-dom";
import Login from "./pages/LoginPage/Login";
import Landing from "./pages/LandingPage/Landing";

function App() {
  return (
    <Routes>
      <Route path="/sign-in/*" element={<Login />} />
      <Route path="/" element={<Landing />} />
    </Routes>
  );
}

export default App;