import React, { useState } from 'react'
import { IoMdClose } from 'react-icons/io'
import { ChatState } from '../context/ChatProvider'
import axios from 'axios'
import { toast } from 'react-toastify'
import EachSearchCard from './EachSearchCard'
import SelectedUserCard from './SelectedUserCard'

const CreateGroupModal = ({ closeModal }) => {
    const [grpChatName, setGrpChatName] = useState()
    const [selectedUsers, setSelectedUsers] = useState([])
    const [search, setSearch] = useState('')
    const [searchResult, setSearchResult] = useState([])

    const { user, chats, setChats } = ChatState()

    const handleSearch = async (query) => {
        setSearch(query)
        if (query) {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    }
                }

                const { data } = await axios.get(`http://localhost:5000/api/user?search=${search}`, config)
                setSearchResult(data)
            } catch (err) {
                toast.error('Failed to load search Result')
            }
        }
    }
    const handleSubmit = async() => {
        if(!grpChatName || !selectedUsers){
            toast.error('Please Fill all the fields!')
            return
        }
        if(selectedUsers.length < 2){
            toast.error('Must select minimum 2 persons')
            return
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.post(`http://localhost:5000/api/chat/group`, {
                name: grpChatName,
                users: JSON.stringify(selectedUsers.map((su => su._id)))
            }, config)

            setChats(data, ...chats)
            toast.success('New Group Created!')
        } catch (error) {
            toast.error('Failed to load chat Result')
        }
    }

    const handleDelete = (userToDel) => {
        setSelectedUsers(selectedUsers.filter(sel => sel._id !== userToDel._id))
    }

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast.error('User Already Added!')
        }

        setSelectedUsers([...selectedUsers, userToAdd])
    }
    return (
        <>
            <div className="createGrpModalWrap">
                <div className="createGrpModal">
                    <div className="closeBtn" onClick={closeModal}><IoMdClose /></div>

                    <div className="cgmHeading">Create Group</div>
                    <form>
                        <input type="text" placeholder='Set Group Name' onChange={(e) => setGrpChatName(e.target.value)} />
                    </form>
                    <form>
                        <input type="search" placeholder='Search Users' onChange={(e) => handleSearch(e.target.value)} />
                    </form>

                    <div className="selectedUserWrap">
                        {selectedUsers.map(selUser => (
                            <SelectedUserCard key={selUser._id} user={selUser} handleFunction={() => handleDelete(selUser)}>{selUser.name}</SelectedUserCard>
                        ))}
                    </div>

                    <div className="searchedUserWrap">
                        {searchResult?.slice(0, 4).map(gsuser => (
                            <EachSearchCard key={gsuser.id} suser={gsuser} handleFunction={() => handleGroup(gsuser)} />
                        ))}
                    </div>
                    <button onClick={handleSubmit}>Create Group</button>
                </div>
            </div>
        </>
    )
}

export default CreateGroupModal