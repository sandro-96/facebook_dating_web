import './App.css';
import {Routes, Route, useSearchParams} from 'react-router-dom'
import Login from "./components/Login";
import LoginRedirectCallBack from "./components/LoginRedirectCallBack";
import Home from "./components/Home";
import Chat from "./components/Chat";
import Match from "./components/Match";
import Setting from "./components/Setting";
import Filter from "./components/Match/Filter";
import Profile from "./components/Profile";
import {UserContextProvider} from "./components/Context/UserContext";
import Navbar from "./components/Navbar";
import {useEffect, useState} from "react";

function App() {
    const [selectedTab, setSelectedTab] = useState('home');
    const [searchParams] = useSearchParams();
    useEffect(() => {
    }, [searchParams]);
  return (
    <div className="App">
        <UserContextProvider>
            <Routes>
                <Route path='' element={<Login />} />
                <Route path='home' element={<Home />} />
                <Route path='chat' element={<Chat />} />
                <Route path="match">
                    <Route path="" element={<Match />} />
                    <Route path="filter" element={<Filter />} />
                </Route>
                <Route path="setting">
                    <Route path="" element={<Setting />} />
                    <Route path='profile' element={<Profile />} />
                </Route>
                <Route path='callBack' element={<LoginRedirectCallBack />} />
            </Routes>
            {searchParams.get('isHideNavBar') !== 'true' && <Navbar/>}
        </UserContextProvider>
    </div>
  );
}

export default App;
