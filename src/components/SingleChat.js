import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/ChatProvider'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FiLock } from 'react-icons/fi'
import { HiPaperAirplane } from 'react-icons/hi'
import { isLastMessage, isSameSender, isSameSenderMargin } from '../config/ChatLogic'
import io from 'socket.io-client'

const ENDPOINT = 'http://localhost:5000'
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState('')
    const [socketConnected, setSocketConnected] = useState(false)
    const { user, selectedChat, setSelectedChat } = ChatState()
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)

    const fetchMessages = async () => {
        if (!selectedChat) return
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            }
            setLoading(true)
            const { data } = await axios.get(`https://gossip1-0-backend.onrender.com/api/message/${selectedChat._id}`, config)
            setMessages(data)
            setLoading(false)

            socket.emit('join chat', selectedChat._id)
        } catch (error) {
            toast.error('Something wrong loading chat!')
        }
    }

    useEffect(() => {
        fetchMessages()
        selectedChatCompare = selectedChat
    }, [selectedChat])

    useEffect(() => {
        socket = io(ENDPOINT)
        socket.emit('setup', user)
        socket.on('connected', () => setSocketConnected(true))
        socket.on('typing', () => setIsTyping(true))
        socket.on('stop typing', () => setIsTyping(false))
    }, [])

    useEffect(() => {
        socket.on('message recieved', (newMessageReceived) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
                // give notification
            }
            else {
                setMessages([...messages, newMessageReceived])
            }
        })
    })

    const sendMessage = async (e) => {
        e.preventDefault()
        socket.emit('stop typing', selectedChat._id)
        if (newMessage.trim() === '') {
            toast.error('Type something to send!')
        }
        else {
            setNewMessage('')
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`
                    }
                }
                const { data } = await axios.post(`https://gossip1-0-backend.onrender.com/api/message`, {
                    content: newMessage,
                    receiver: selectedChat._id
                }, config)
                socket.emit('new message', data)
                setMessages([...messages, data])
            } catch (error) {
                toast.error('Something wrong!')
            }
        }
    }

    const typingHandler = (e) => {
        setNewMessage(e.target.value)

        //typing indicator logic
        if(!socketConnected) return
        if(!typing){
            setTyping(true)
            socket.emit('typing', selectedChat._id)
        }

        let lastTypingTime = new Date().getTime()
        var timerLength = 3000
        setTimeout(() => {
            var timeNow = new Date().getTime()
            var timeDiff = timeNow - lastTypingTime

            if(timeDiff >= timerLength && typing){
                socket.emit('stop typing', selectedChat._id)
                setTyping(false)
            }
        }, timerLength);
    }

    return (
        !selectedChat ? (
            <div className='notSelectedScreen'>
                <img src="/img/screen.png" alt="" />
                <div className="nssText">No chats selected, select a chat to get started chatting</div>
                <div className="nssNote"><FiLock />Your chats are end to end encrypted</div>
            </div>
        ) : (
            <div className='selectedScreen'>
                {loading ? (
                    <div className="messageArea">loading...</div>
                ) : (
                    <div className="messageArea">
                        {messages && messages.map((m, i) => (
                            <div style={{ display: 'flex', gap: '.2rem' }} key={m._id}>
                                {(isSameSender(messages, m, i, user._id) || isLastMessage(messages, m, i, user._id)) && (
                                    <img src={m.sender.pic} style={{ width: '30px', height: '30px', borderRadius: '50%' }} title={m.sender.name} />
                                )}
                                <div key={m._id} style={{ background: `${m.sender._id === user._id ? '#e95f76' : '#ddd'}`, marginLeft: isSameSenderMargin(messages, m, i, user._id) }} className='chatSpan'>{m.content}</div>
                            </div>
                        ))}
                    </div>
                )}
                <div className="sendArea">
                    {isTyping ? <div className='sendAreaTyping'><img src="/img/typing.gif" alt="" /></div> : <></>}
                    <form>
                        <input type="text" placeholder='Type a message...' onChange={typingHandler} value={newMessage} />
                        <button type='submit' onClick={sendMessage}><HiPaperAirplane /></button>
                    </form>
                </div>
            </div>
        )
    )
}

export default SingleChat