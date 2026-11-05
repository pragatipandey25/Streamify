import { useState } from "react";
import Navbar from "./Components/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Video from "./Pages/Video/Video";
import Search from "./Pages/Search/Search";
import Login from "./Pages/Login/Login";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/useAuth";

const MainApp = () => {
  const { user } = useAuth();
  const [sidebar, setSidebar] = useState(true);

  if (!user) {
    return <Login />;
  }

  return (
    <div>
      <Navbar setSidebar={setSidebar} />
      <Routes>
        <Route path="/" element={<Home sidebar={sidebar} />} />
        <Route path="/video/:categoryId/:videoId" element={<Video />} />
        <Route path="/search/:query" element={<Search sidebar={sidebar} />} />
        <Route path="*" element={<Home sidebar={sidebar} />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
};

export default App;
