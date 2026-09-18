import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Upload from './pages/upload';
import Home from './pages/home';
import Signin from './pages/signin';
import Lost from './pages/lost';
import Movies from './pages/movies';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/signin" element={<Signin />} />

        <Route path="movies" element={<Movies />} />

        <Route path='/*' element={<Lost />} />

      </Routes>
    </BrowserRouter>
  );
}


export default App;
