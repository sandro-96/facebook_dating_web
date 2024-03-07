import "./index.scss"
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {UserContext} from "../Context/UserContext";

const Home = () => {
    const { isAuthenticated } = useContext(UserContext);
    const [data, setData] = useState([])
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
                data.map((value, index) => (
                    <div key={index}>
                        <p>{value.name}</p>
                        <button onClick={() => updateGroupName(value.key)}>Edit</button>
                    </div>
                ))
            }

        </div>
    )
}
Home.propTypes = {};

export default Home;