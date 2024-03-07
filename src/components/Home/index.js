import "./index.scss"
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {UserContext} from "../Context/UserContext";
import Navbar from "../Navbar";
import Profile from "../Profile";

const Home = () => {
    const { isAuthenticated } = useContext(UserContext);
    const [data, setData] = useState([])
    const [selectedTab, setSelectedTab] = useState('chat');
    useEffect(() => {
        if (isAuthenticated) {
            loadGroups()
        }
    }, []);
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
                selectedTab === 'profile' ? <Profile></Profile>
                    : <div>{selectedTab}</div>
            }
            <Navbar selectedTab={selectedTab} setSelectedTab={(tab) => setSelectedTab(tab)} />
        </div>
    )
}
Home.propTypes = {};

export default Home;