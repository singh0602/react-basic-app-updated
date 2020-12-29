import React from 'react';

const Avatar = (props) => {

    return(
        <span className="avatar-cont text-center">
            <img className="avatar" src={props.profileUrl} alt={props.profileUrl} />
            <p className="m-0">{props.userID}</p>
        </span>
        );

}

export default Avatar;