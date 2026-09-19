import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';

import Upload from './pages/upload';
import Home from './pages/home';
import Signin from './pages/signin';
import Lost from './pages/lost';
import Movies from './pages/movies';
import { useEffect, useState } from 'react';
import Navigate from './navigator';
import { useAuth } from './authContext';




function App() {

const { user, loading } = useAuth();

    console.log(user);



  return (
    <div className="bg-light" style={{ minHeight: "100vh" }}>



      <Routes>



        <Route path="/" element={<Navigate to="/"><Home /></Navigate>} />
        <Route path="/upload" element={<Navigate to="/upload"><Upload /></Navigate>} />

        <Route path="movies" element={<Navigate to="/movies"><Movies /></Navigate>} />


        <Route path="/signin" element={<Signin />} />
        <Route path='/*' element={<Navigate to="/"><Lost /></Navigate>} />

      </Routes>

    </div>
  );
}


export default App;
