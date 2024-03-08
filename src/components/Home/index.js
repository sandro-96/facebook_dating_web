import "./index.scss"
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {UserContext} from "../Context/UserContext";
import Navbar from "../Navbar";
import Profile from "../Profile";
import Constant from "../Utils/Constant";
import Match from "../Match";
import Chat from "../Chat";

const Home = () => {
    const { isAuthenticated, contextStatus } = useContext(UserContext);
    const [data, setData] = useState([])
    const [selectedTab, setSelectedTab] = useState('chat');
    useEffect(() => {
        if (isAuthenticated && contextStatus === Constant.CONTEXT_STATUS.SUCCESS) {
            loadGroups()
        }
    }, [contextStatus]);
    const loadGroups = () => {
        axios.get('fbd_groups').then(res => {
            res.data && setData(res.data._embedded.fbd_groups)
        })
    }
    const updateGroupName = (id) => {
        axios.patch(`fbd_groups/${id}`, {name: 'kkkk'})
    }
    return (
        <div className="d-flex flex-column">
            {
                selectedTab === 'chat' && <Chat></Chat>
            }
            {
                selectedTab === 'match' && <Match></Match>
            }
            {
                selectedTab === 'profile' && <Profile></Profile>
            }
            <Navbar selectedTab={selectedTab} setSelectedTab={(tab) => setSelectedTab(tab)} />
        </div>
    )
}
Home.propTypes = {};

export default Home;