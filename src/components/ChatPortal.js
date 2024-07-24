import React, { useContext, useEffect, useState } from 'react'
import { HiPaperAirplane } from 'react-icons/hi'
import { ChatState } from '../context/ChatProvider'
import SingleChat from './SingleChat'

const ChatPortal = ({ fetchAgain, setFetchAgain }) => {
    const { user, selectedChat, setSelectedChat } = ChatState()
    // console.log(selectedChat.name)

    useEffect(() => {
        //   console.log(selectedChat)
    }, [selectedChat])

    return (
        <>
            <div className="chatPortal">
                <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
            </div>
        </>
    )
}

export default ChatPortal