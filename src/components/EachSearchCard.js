import React from 'react'
import { ChatState } from '../context/ChatProvider'

const EachSearchCard = ({suser, handleFunction }) => {
    return (
        <div className="skeletonCard" onClick={handleFunction} key={suser._id}>
            <div className="skeleton-left flex1">
                <img src={suser.pic === '' ? 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg' : suser.pic} alt="" />
            </div>
            <div className="skeleton-right flex2">
                <div style={{ fontWeight: "600" }}>{suser.name}</div>
                <div style={{ fontSize: ".8rem" }}>{suser.email}</div>
            </div>
        </div>
    )
}

export default EachSearchCard