import React from "react";

import {Modal,Button} from 'react-bootstrap';


const ChatRoomGroups = (props) => {

    return (<div className="people-online">


        <Button className="mb-4" onClick={props.openGroupModal}>Create Group</Button>


        <Modal show={props.modal} onHide={props.openGroupModal}>
            <Modal.Header><h4>Please Enter Details</h4></Modal.Header>
            <Modal.Body>

                <form onSubmit={props.handleSubmit}>

                    <div className="form-group">
                    <label>Name</label>
                        <input type="text" className="form-control" value={props.groupName} onChange={props.updateGroupName} />
                    </div>


                    <div className="form-group">
                        <label>Select Users for group</label>
                        <select className="form-control" onChange={props.updateUserIDS} >
                        {props.users.map((item,key) => (
                            <option key={key}>{item.nickname} </option>
                        ))}
                        </select>
                        </div>

                    {props.groupError ? (
                    <div class="alert alert-danger" role="alert">
                        {props.groupError}
                    </div>
                    ) : null}

                    <input className="btn btn-primary" type="submit" value="Submit" />
                </form>


            </Modal.Body>

            <Modal.Footer> <Button className="btn-secondary" onClick={props.openGroupModal}>Close</Button> </Modal.Footer>
        </Modal>


        <ul className="list-group selectable-list">
            {props.groups.map((item,key) => (
                <li key={key} onClick={((e) => props.selectGroup(e, item))} className="list-group-item d-flex justify-content-between align-items-center " >
                        <span className={(item.url === props.channelUrl ? 'active' : '')}> <img className="thumb" src={item.coverUrl} alt={item.name} />{item.name} </span>

                </li>

            ))}
        </ul>

        </div>)

}


export default ChatRoomGroups;