import './App.css';
import React, { useState, useEffect } from 'react';
import { Route, Routes} from 'react-router-dom';
import Navbar from './components/Nav';
import Workspace from './components/Workspace';


function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

// Body components

function Home() {
  return (
    <div>
      <Workspace />
    </div>
  );
}

export default App;
