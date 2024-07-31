import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login, Dashboard } from "@layout";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute"; 

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard/*" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
