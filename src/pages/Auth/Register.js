import React, { useState } from 'react'
import './Auth.css'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios'

const Register = () => {
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [pic, setPic] = useState('')
    const [loading, setLoading] = useState(false)
    const postDetails = (pics) => {
        setLoading(true)
        if (pics === undefined) {
            toast.warning('You may select an Avatar')
            setLoading(false)
            return
        }

        if (pics.type === 'image/jpeg' || pics.type === 'image/png') {
            const data = new FormData()
            data.append('file', pics)
            data.append('upload_preset', 'Gossip')
            data.append('cloud_name', 'cloud123deepak')
            fetch('https://api.cloudinary.com/v1_1/cloud123deepak/image/upload', {
                method: 'post',
                body: data
            }).then((res) => res.json())
                .then(data => {
                    setPic(data.url.toString())
                    console.log(data.url.toString())
                    setLoading(false)
                })
                .catch((err) => {
                    console.log(err)
                    setLoading(false)
                })
        } else {
            toast.error('Please select an Image of type jpeg or png')
            setLoading(false)
            return
        }
    }
    const submitHandler = async (e) => {
        e.preventDefault()
        setLoading(true)
        if (!name || !email || !password) {
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
            const { data } = await axios.post('https://gossip1-0-backend.onrender.com/api/user/register', { name, email, password, pic }, config)
            toast.success('Registration successfull!')
            localStorage.setItem('userInfo', JSON.stringify(data))
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
                        <div className="heading1">Welcome TO GOSSIP</div>
                        <div className="subHeading1">Connect, Engage, and Explore!</div>
                        <p>Join our vibrant and diverse community, where you'll encounter individuals from all walks of life. Explore new cultures, broaden your horizons, and build connections that transcend geographical boundaries.</p>
                    </div>
                    <div className="awRight">
                        <div className="heading">register</div>
                        <form className="authForm">
                            <div className="inputField">
                                <input type="text" placeholder='Username' value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className="inputField">
                                <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="inputField">
                                <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            <div className="inputField">
                                <input type="file" onChange={(e) => postDetails(e.target.files[0])} />
                            </div>
                            {loading ? (<button type="submit" className="loading" onClick={submitHandler}>Loading</button>) : (<button type="submit" className="authBtn" onClick={submitHandler}>Register</button>)}
                            <div className="authOr">Already User? <Link to='/login'><span style={{ color: "var(--app-color)" }}>Login</span></Link></div>
                        </form>
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
            </div>
        </>
    )
}

export default Register