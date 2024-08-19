import React, { useEffect, useState } from 'react'
import { FiUsers } from 'react-icons/fi'
import EachChatCard from './EachChatCard'
import { ChatState } from '../context/ChatProvider'
import axios from 'axios'
import { toast } from 'react-toastify'
import { getSender, getSenderImg } from '../config/ChatLogic'
import CreateGroupModal from './CreateGroupModal'

const ChatSidebar = ({ fetchAgain }) => {
    const [modalOpen, setModalOpen] = useState(false)
    const [loggedUser, setLoggedUser] = useState()
    const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState()

    const closeModal = () => {
        setModalOpen(false)
    }

    const fetchChats = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.get(`https://gossip1-0-backend.onrender.com/api/chat`, config)
            setChats(data)
        } catch (error) {
            toast.error('Failed to load chat Result')
        }
    }

    const selectChat = (chat) => {
        setSelectedChat(chat)
    }

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem('userInfo')))
        fetchChats()

    }, [fetchAgain])
    return (
        <>
            <div className="chatSidebar">
                <div className="chatSideTop">
                    <div className="cstHead">My Chats</div>
                    <div className="groupBtn" onClick={() => setModalOpen(true)}>New Group <FiUsers /></div>
                </div>

                {chats ? (
                    <div className="chatSideChats">
                        {
                            chats.map((chat) => (
                                <EachChatCard handleFunction={() => { selectChat(chat) }} key={chat._id} name={chat.isGroupChat === "false" ? (getSender(loggedUser, chat.users)) : (chat.chatName)} img={chat.isGroupChat === "false" ? (getSenderImg(loggedUser, chat.users)) : "/img/group.webp"} latestMessage={chat.latestMessage?.content}/>
                            ))
                        }
                    </div>
                ) : ("Loading")}
            </div>

            {modalOpen && <CreateGroupModal closeModal={closeModal} />}

        </>
    )
}

export default ChatSidebar