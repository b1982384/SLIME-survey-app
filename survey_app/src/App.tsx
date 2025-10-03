import { Routes, Route } from 'react-router-dom';
import HomePage from './HomePage'; // updated to the new simple home page
import Questionpage from './questions';
import ResultsPage from './result';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/question" element={<Questionpage />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </div>
  );
}

export default App;
