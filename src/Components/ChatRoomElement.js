import React from "react";




const ChatElement = (props) => {

    return (<div className="people-online">

        <h5 className="mb-3">People Online</h5>

        <ul className="list-group">
            {props.users.map((item,key) => (
            <li key={key} onClick={((e) => props.selectGroup(e, item))} className="list-group-item d-flex justify-content-between align-items-center">
                    <span> <img className="thumb" src={item.profileUrl} alt={item.nickname} />{item.nickname} <small>({item.connectionStatus})</small></span>
                </li>
            ))}
        </ul>

        </div>)

}


export default ChatElement;