import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Dashboard from './components/Dashboard'
import ArithmeticPractice from './pages/ArithmeticPractice'
import GeometricPractice from './pages/GeometricPractice'
import AlternatingPractice from './pages/AlternatingPractice'
import FunctionPractice from './pages/FunctionPractice'
import Landing from './pages/Landing'
import Profile from './pages/Profile'
import AdditionPractice from './pages/AdditionPractice'
import MultiplicationPractice from './pages/MultiplicationPractice'
import DivisionPractice from './pages/DivisionPractice'
import FractionPractice from './pages/FractionPractice'
import DecimalPractice from './pages/DecimalPractice'
import DecimalSortingPractice from './pages/DecimalSortingPractice'
import CartesianChallenge from './pages/CartesianChallenge'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/practice/arithmetic" element={<ArithmeticPractice />} />
          <Route path="/practice/addition" element={<AdditionPractice />} />
          <Route path="/practice/multiplication" element={<MultiplicationPractice />} />
          <Route path="/practice/division" element={<DivisionPractice />} />
          <Route path="/practice/fractions" element={<FractionPractice />} />
          <Route path="/practice/sorting-decimals" element={<DecimalSortingPractice />} />
          <Route path="/practice/decimals" element={<DecimalPractice />} />
          <Route path="/practice/cartesian" element={<CartesianChallenge />} />
          <Route path="/practice/geometric" element={<GeometricPractice />} />
          <Route path="/practice/alternating" element={<AlternatingPractice />} />
          <Route path="/practice/functions" element={<FunctionPractice />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
