import './App.css'
import Siderbar from './components/Siderbar'
import Country from './container/Country'
import CurrentCity from './container/CurrentCity'
import Getstart from './container/Getstart'
import { Route, Routes, useLocation, useSearchParams } from 'react-router-dom'
import Motion from './container/Motion'

function App() {
  return (
  
    <Routes>
      <Route path="/" element={<Getstart />} />
      <Route path="/currentcity" element={<CurrentCity />} />
      <Route path="/siderbar/*" element={<Siderbar />} />
      <Route path='/country' element={<Country/>}/>
      <Route path='/motion' element={<Motion/>}/>
    </Routes>
  )
}

export default App
