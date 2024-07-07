import "./App.css"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Overview from "./pages/Overview"
import DormDetails from "./pages/DormDetails"
import ModifyDorms from "./pages/ModifyDorms"
import EditDorm from "./pages/EditDorm"
import AddDorm from "./pages/AddDorm"

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Overview />} />
        <Route path='/admin/dorms' element={<ModifyDorms />} />
        <Route path='/admin/dorms/:id' element={<EditDorm />} />
        <Route path='/admin/dorms/add' element={<AddDorm />} />
        <Route path='/dorms/:id' element={<DormDetails />} />
      </Routes>
    </Router>

  )
}