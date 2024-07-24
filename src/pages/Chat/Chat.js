import React, { useEffect, useState } from 'react'
import './Chat.css'
import axios from 'axios'
import { ChatState } from '../../context/ChatProvider'
import Navbar from '../../components/Navbar'
import ChatSidebar from '../../components/ChatSidebar'
import ChatPortal from '../../components/ChatPortal'

const Chat = () => {
    const { user } = ChatState()
    const [fetchAgain, setFetchAgain] = useState(false)

    return (
        <>
            <div className="chat">
                {user && <Navbar />}
                <div className="chatMain">
                    {user && <ChatSidebar fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
                    {user && <ChatPortal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
                </div>
            </div>
        </>
    )
}

export default Chat