import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Home } from './routes';
import './index.css';

function App() {
    return (
        <div className='app-main-container'>
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
        </div>
    );
}

export default App;
