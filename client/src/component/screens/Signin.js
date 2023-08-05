import { React, useState, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom' 
import M from 'materialize-css'
import { UserContext } from '../../App'
import { Footer } from 'react-bootstrap';



const Signin = () => {
    const { state, dispatch } = useContext(UserContext)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const history = useHistory() 


    const Postdata = () => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(email)) {
            M.toast({ html: "Invalid Email-id", classes: "#c62828 red darken-3" })
            return
        }
        fetch("/signin", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                password: password,
                email: email
            })
        }).then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.error) {
                    M.toast({ html: data.error, classes: "#c62828 red darken-3" })
                }
                else {
                    localStorage.setItem("jwt", data.token)
                    localStorage.setItem("user", JSON.stringify(data.user)) 
                    dispatch({ type: "USER", payload: data.user })
                    M.toast({ html: "signedin successfully", classes: "#388e3c green darken-2" })
                    history.push('/') 
                }
            })
            .catch(err => {
                console.log("the error is ", err)
            })
    }
    return (
        <div className="mycard input-field">
            <div className="card auth-card">
                <h2> मदद </h2>
                <input type="text" placeholder="email" value={email} onChange={(e) => {
                    setEmail(e.target.value) 
                }} />
                <input type="password" placeholder="password" value={password} onChange={(e) => {
                    setPassword(e.target.value) 
                }} />
                <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={() => Postdata()}>Login
                </button>
                <h5>
                    <Link to="signup">Don't have an account ??</Link>
                </h5>
            </div>

        </div>


    )
}
export default Signin
