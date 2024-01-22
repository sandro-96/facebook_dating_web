import './App.css';
import { Routes, Route } from 'react-router-dom'
import Login from "./components/Login";
import {UserContextProvider} from "./components/Context/UserContext";
import Signup from "./components/Login/Signup";

function App() {
  return (
    <div className="App">
        <UserContextProvider>
            <Routes>
                <Route path='' element={<Login />} />
                <Route path='signUp' element={<Signup />} />
            </Routes>
        </UserContextProvider>
    </div>
  );
}

export default App;
