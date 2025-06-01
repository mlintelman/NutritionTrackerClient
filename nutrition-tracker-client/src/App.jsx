import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar/Navbar"
import HomePage from "./pages/HomePage"
import LogMealPage from "./pages/LogMealPage"
import SummaryPage from "./pages/SummaryPage"

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/home" element={<HomePage/>} />
        <Route path="/logmeal" element={<LogMealPage/>} />
        <Route path="/summary" element={<SummaryPage/>} />
        <Route path="/" element={<h1>Welcome to the Nutrition Tracker</h1>} />
      </Routes>
    </BrowserRouter>
  )
}
export default App