import React from 'react';
import Return from 'screens/return';
import Main from 'screens/main';
import NotFound from 'screens/notFound';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MODE } from 'modules/constants';

function App(): React.JSX.Element {
  return (
    <BrowserRouter
      basename={MODE === 'production' ? process.env.PUBLIC_URL : '/'}
    >
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/return" element={<Return />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
