import React from 'react'
import { IoMdClose } from 'react-icons/io'

const SelectedUserCard = ({user, handleFunction}) => {
    return (
        <>
            <div className="selectedUserCard">{user.name} <div style={{display: "flex", alignItems: "center"}}onClick={handleFunction}><IoMdClose /></div></div>
        </>
    )
}

export default SelectedUserCard