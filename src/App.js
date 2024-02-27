import './App.css';
import { Routes, Route } from 'react-router-dom'
import Login from "./components/Login";
import LoginRedirectCallBack from "./components/LoginRedirectCallBack";
import Home from "./components/Home";
import {UserContextProvider} from "./components/Context/UserContext";
import Signup from "./components/Login/Signup";

function App() {
  return (
    <div className="App">
        <UserContextProvider>
            <Routes>
                <Route path='' element={<Login />} />
                <Route path='home' element={<Home />} />
                <Route path='callBack' element={<LoginRedirectCallBack />} />
                <Route path='signUp' element={<Signup />} />
            </Routes>
        </UserContextProvider>
    </div>
  );
}

export default App;
