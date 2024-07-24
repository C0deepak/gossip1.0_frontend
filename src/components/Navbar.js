import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiBell, FiSearch } from 'react-icons/fi'
import SearchSidebar from './SearchSidebar'
import { ChatState } from '../context/ChatProvider'
import { getSender, getSenderEmail, getSenderImg } from '../config/ChatLogic'

const Navbar = () => {
    const [searchSide, setSearchSide] = useState(false)
    const navigate = useNavigate()
    const { user, selectedChat } = ChatState()

    const logoutHandler = () => {
        localStorage.removeItem('userInfo')
        navigate('/')
    }

    return (
        <nav>
            <div className="navLogo">
                <img src="/img/logo2.jpg" alt="" />
                <div className='navProfile'>
                    <img src={user.pic === '' ? "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" : user.pic} alt="" />
                    <div className="navProfileInfo">
                        <div className='nuiEach'>
                            <div className="npiName">{user.name}</div>
                            <div className="npiEmail">{user.email}</div>
                        </div>
                        <div className='nuiEach' style={{ cursor: "pointer" }} onClick={logoutHandler}>Logout</div>
                    </div>
                </div>
            </div>
            {selectedChat ? (
                <div className='navUser'>
                    {selectedChat.isGroupChat === "false" ? (
                        <div className="navUser">
                            <img src={getSenderImg(user, selectedChat.users) === '' ? 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg' : (getSenderImg(user, selectedChat.users))} alt="" />
                            <div className="navUserInfo">
                                <div className="nuiName">{getSender(user, selectedChat.users)}</div>
                                <div className="nuiEmail">{getSenderEmail(user, selectedChat.users)}</div>
                            </div>
                        </div>
                    ) : (
                        <div className="navUser">
                            <img src="/img/group.webp" alt="" />
                            <div className="navUserInfo">
                                <div className="nuiName">{selectedChat.chatName}</div>
                                <div className="nuiPer">
                                    {selectedChat.users.map((user) => (
                                        <div>{user.name} | </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )
                    }
                </div>
            ) : (
                <div className="navUser welcomeText">
                    Welcome to Gossip...
                </div>
            )}
            <div className="navRight">
                <div className="navNot"><FiBell /></div>
                <div className="navSer">
                    <div onClick={() => { setSearchSide(!searchSide) }}><FiSearch /></div>
                    {searchSide && <SearchSidebar user={user} />}
                </div>
            </div>
        </nav>
    )
}

export default Navbar