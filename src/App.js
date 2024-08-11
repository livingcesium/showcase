import './App.css';
import React from 'react';
import { Route, Routes} from 'react-router-dom';
import Navbar from './components/Nav';
import Workspace from './components/Workspace';
import DBtest from './components/DBTest';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="dbtest" element={<DBtest/>}/>
      </Routes>
    </div>
  );
}


function Home() {
  return (
    <div>
      <Workspace />
    </div>
  )
}

export default App;
