import "./index.scss"
import React, {useEffect} from "react";

export const Chat = () => {
    useEffect(() => {
    }, []);

    return (
        <div className="chat-wrap">
            <h2>Đoạn chat</h2>
            <div className="content-wrap">
                <div className="item-wrap">
                    <span className="fs-6 fw-bold">Người dùng 1</span>
                </div>
                <div className="item-wrap">
                    <span className="fs-6 fw-bold">Người dùng 2</span>
                </div>
                <div className="item-wrap">
                    <span className="fs-6 fw-bold">Người dùng 3</span>
                </div>
            </div>
        </div>
    )
}
Chat.propTypes = {};

export default Chat;