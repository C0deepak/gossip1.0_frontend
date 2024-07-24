import React, { useState } from 'react'
import './Auth.css'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios'
import { ChatState } from '../../context/ChatProvider';

const Login = () => {

    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const { setUser } = ChatState()

    const submitHandler = async (e) => {
        e.preventDefault()
        setLoading(true)
        if (!email || !password) {
            toast.error('Please Fill all the fields')
            setLoading(false)
            return
        }
        try {
            const config = {
                headers: {
                    'content-type': 'application/json',
                }
            }
            const { data } = await axios.post('http://localhost:5000/api/user/login', { email, password }, config)
            toast.success('Login successfull!')
            localStorage.setItem('userInfo', JSON.stringify(data))
            setUser(data)
            setLoading(false)
            navigate('/')
        } catch (err) {
            toast.error('Error Occured!')
            setLoading(false)
        }
    }

    return (
        <>
            <div className="auth">
                <div className="authBg"></div>
                <div className="authWrap">
                    <div className="awLeft">
                        <div className="authLogo">
                            <img src="/img/logo1.jpg" alt="" />
                        </div>
                        <div className="heading1">Welcome back</div>
                        <div className="subHeading1">Connect, Engage, and Explore!</div>
                        <p>Join our vibrant and diverse community, where you'll encounter individuals from all walks of life. Explore new cultures, broaden your horizons, and build connections that transcend geographical boundaries.</p>
                    </div>
                    <div className="awRight">
                        <div className="heading">login</div>
                        <form className="authForm">
                            <div className="inputField">
                                <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="inputField">
                                <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            {loading ? (<button type="submit" className="loading" onClick={submitHandler}>Loading</button>) : (<button type="submit" className="authBtn" onClick={submitHandler}>Login</button>)}
                            <div className="authOr">New User? <Link to='/register'><span style={{ color: "var(--app-color)" }}>Register</span></Link></div>
                        </form>
                    </div>
                </div>
            </div>

            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            {/* Same as */}
            <ToastContainer />
        </>
    )
}

export default Login