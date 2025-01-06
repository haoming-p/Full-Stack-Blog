import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./ui_components/AppLayout";
import { useQuery } from "@tanstack/react-query";

import HomePage from "./pages/HomePage";
import DetailPage from "./pages/DetailPage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import CreatePostPage from "./pages/CreatePostPage";
import ProtectedRoute from "./ui_components/ProtectedRoute";
import { useEffect, useState } from "react";
import { getUsername } from "./services/apiBlog";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";

const App = () => {
  const [username, setUsername] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // initialize state from localStorage on first render
  useEffect(() => {
    const token = localStorage.getItem("access");
    const storedUsername = localStorage.getItem("username");

    if (token && storedUsername) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
    } else {
      setIsAuthenticated(false);
      setUsername(null);
    }
  }, []);

  // fetch username if authenticated
  const { data, error } = useQuery({
    queryKey: ["username"],
    queryFn: getUsername,
    enabled: isAuthenticated, // Only run if the user is authenticated
    onSuccess: (data) => {
      setUsername(data.username);
      localStorage.setItem("username", data.username); // Store username for persistence
    },
    onError: () => {
      setIsAuthenticated(false);
      setUsername(null);
    },
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <AppLayout
              isAuthenticated={isAuthenticated}
              username={username}
              setUsername={setUsername}
              setIsAuthenticated={setIsAuthenticated}
            />
          }>
          <Route index element={<HomePage />} />
          <Route path = '*' element = {<NotFoundPage />}/>
          <Route path='profile/:username' element={<ProfilePage authUsername={username}/>} />
          <Route path="blogs/:slug" element={<DetailPage username={username} isAuthenticated={isAuthenticated}/>} />
          
          <Route
            path="signup"
            element={
              <SignUpPage
                setUsername={setUsername}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />

          <Route
            path="signin"
            element={
              <LoginPage
                setIsAuthenticated={setIsAuthenticated}
                setUsername={setUsername}
              />
            }
          />
          <Route
            path="create"
            element={
              <ProtectedRoute>
                <CreatePostPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
