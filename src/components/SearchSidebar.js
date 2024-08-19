import React, { useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import SkeletonData from './SkeletonData'
import { toast } from 'react-toastify'
import axios from 'axios'
import EachSearchCard from './EachSearchCard'
import { ChatState } from '../context/ChatProvider'

const SearchSidebar = () => {
    const {user, setSelectedChat, chats, setChats} = ChatState()
    const [search, setSearch] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState()

    const handleSearch = async (e) => {
        e.preventDefault()
        if (!search) {
            toast.error('Write something to search')
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            }

            const { data } = await axios.get(`http://localhost:5000/api/user?search=${search}`, config)
            setLoading(false)
            setSearchResult(data)
        } catch (error) {
            toast.error('Failed to load search Result')
        }
    }

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true)
            const config = {
                headers: {
                    'content-type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.post(`https://gossip1-0-backend.onrender.com/api/chat`,{userId}, config)
            if(!chats.find((c) => c._id === data._id)) setChats([data, ...chats])
            setSelectedChat(data)
            setLoadingChat(false)
        } catch (error) {
            toast.error('Failed to load chat Result')
        }
    }

    return (
        <div className='searchSide'>
            <form>
                <div className="inputField">
                    <input type="search" placeholder='Search User...' value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <button type="submit" className='searchBtn' onClick={handleSearch}><FiSearch /></button>
            </form>
            <div className="searchData">
                <div className="skeletonData">
                    {loading ? (
                        <SkeletonData />) : (
                        searchResult.map((suser) => (
                            <EachSearchCard key={suser.id} suser={suser} handleFunction={() => accessChat(suser._id)} />
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default SearchSidebar