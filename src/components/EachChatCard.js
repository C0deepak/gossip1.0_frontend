import React from 'react'

const EachChatCard = (props) => {
    return (
        <div className="eachChatCard" onClick={props.handleFunction}>
            <img src={props.img === '' ? 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg' : props.img} alt="" />
            <div className="eachChatInfo">
                <div className="eachChatName">{props.name}</div>
                <div className="eachChatMsg">{props.latestMessage}</div>
            </div>
        </div>
    )
}

export default EachChatCard