import "./App.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './store';
import { loadUser } from './store/slices/authSlice';

// Import pages
import Overview from "./pages/Overview";
import DormDetails from "./pages/DormDetails";
import ModifyDorms from "./pages/ModifyDorms";
import EditDorm from "./pages/EditDorm";
import AddDorm from "./pages/AddDorm";
import BlogList from "./pages/BlogList";
import BlogPost from "./pages/BlogPost";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

// Import components
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";
import NotificationContainer from "./components/NotificationContainer";

function AppContent() {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Try to load user if token exists
    if (localStorage.getItem('token')) {
      dispatch(loadUser());
    }
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        <NavBar />
        <NotificationContainer />
        <main className="main-content">
          <Routes>
            <Route path='/' element={<Overview />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/blogs' element={<BlogList />} />
            <Route path='/blogs/:id' element={<BlogPost />} />
            <Route path='/dorms/:id' element={<DormDetails />} />
            <Route 
              path='/profile' 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path='/admin/dorms' 
              element={
                <ProtectedRoute requireAdmin>
                  <ModifyDorms />
                </ProtectedRoute>
              } 
            />
            <Route 
              path='/admin/dorms/:id' 
              element={
                <ProtectedRoute requireAdmin>
                  <EditDorm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path='/admin/dorms/add' 
              element={
                <ProtectedRoute requireAdmin>
                  <AddDorm />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}