import './App.css';
import {Routes, Route, useSearchParams} from 'react-router-dom'
import Login from "./components/Login";
import LoginRedirectCallBack from "./components/LoginRedirectCallBack";
import Home from "./components/Home";
import Chat from "./components/Chat";
import Match from "./components/Match";
import Setting from "./components/Setting";
import Feedback from "./components/Setting/Feedback";
import Support from "./components/Setting/Support";
import Filter from "./components/Match/Filter";
import { Profile } from "./components/Profile";
import {UserContextProvider} from "./components/Context/UserContext";
import Navbar from "./components/Navbar";
import {useEffect} from "react";
import WebSocketComponent from './components/WebSocket/WebSocketComponent';
import ChatScreen from "./components/Chat/ChatScreen";
import PublicChatScreen from "./components/Chat/PublicChatScreen";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {I18nextProvider} from "react-i18next";
import i18n from "./i18n";

// Define the languages your application supports
const supportedLanguages = ['en', 'vi']; // replace with your supported languages

// Function to check if a language is supported
const isSupportedLanguage = (language) => {
    if (!language) return false;
    const languageCode = language.substr(0, 2); // get the first 2 characters of the language code
    return supportedLanguages.includes(languageCode);
};

function App() {
    const [searchParams] = useSearchParams();
    useEffect(() => {
    }, [searchParams]);
    // Effect to handle language change from local storage
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'language' && isSupportedLanguage(e.newValue)) {
                i18n.changeLanguage(e.newValue);
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Cleanup
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // Effect to set language from local storage or browser on initial load
    useEffect(() => {
        let language = localStorage.getItem('language');
        if (!language || !isSupportedLanguage(language)) {
            language = navigator.language || navigator.userLanguage;
        }
        if (isSupportedLanguage(language)) {
            i18n.changeLanguage(language);
        }
    }, []);
  return (
    <div className="App">
        <I18nextProvider i18n={i18n}>
            <UserContextProvider>
                <WebSocketComponent>
                    <Routes>
                        <Route path='' element={<Login />} />
                        <Route path='home' element={<Home />} />
                        <Route path="chat">
                            <Route path="" element={<Chat />} />
                            <Route path=":id" element={<ChatScreen />} />
                            <Route path="public" element={<PublicChatScreen />} />
                        </Route>
                        <Route path="match">
                            <Route path="" element={<Match />} />
                            <Route path="filter" element={<Filter />} />
                        </Route>
                        <Route path="setting">
                            <Route path="" element={<Setting />} />
                            <Route path='profile' element={<Profile />} />
                            <Route path='feedback' element={<Feedback />} />
                            <Route path='support' element={<Support />} />
                        </Route>
                        <Route path='callBack' element={<LoginRedirectCallBack />} />
                    </Routes>
                    {searchParams.get('isHideNavBar') !== 'true' && <Navbar/>}
                    <ToastContainer limit={1}/>
                </WebSocketComponent>
            </UserContextProvider>
        </I18nextProvider>
    </div>
  );
}

export default App;
