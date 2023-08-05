import { React, useState,useEffect } from 'react' 
import { Link, useHistory } from 'react-router-dom' 
import M from 'materialize-css'


const Signup = () => {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState("")
    const[phone,setPhone]=useState("")
    const[aboutus,setAboutus]=useState("")
    const [url, setUrl] = useState(undefined)
    const history = useHistory();
     
    
    useEffect(()=>{
        if(url)
        {
            uploadFields()
        }
    },[url])
    const uploadPic=()=>{
         
         const data=new FormData()
         data.append("file",image)
         data.append("upload_preset","insta-clone")
         data.append("cloud_name","paragpramodroy")
 
         
         fetch("	https://api.cloudinary.com/v1_1/paragpramodroy/image/upload",{
             method:"post",
             body:data
         })
         .then(res=>res.json()) 
         .then(data=>{
             console.log(data)
             
            setUrl(data.url)
         })
         .catch(err=>{
             console.log(err)
         })
    }
    
    const uploadFields=()=>{
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(email)) {
            M.toast({ html: "Invalid Email-id", classes: "#c62828 red darken-3" })
            return
        }
        fetch("/signup", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body:JSON.stringify({
                name: name,
                password: password,
                email: email,
                phone:phone,
                aboutus:aboutus,
                pic:url,
            })
        }).then(res => res.json())
            .then(data => { 
                //console.log(data)
                
                if (data.error) {
                    M.toast({ html: data.error, classes: "#c62828 red darken-3" })
                }
                else {
                    M.toast({ html: data.message, classes: "#388e3c green darken-2" })
                    history.push('/signin')
                }
            })
            .catch(err => {
                console.log(err)
            })
    }
    const Postdata = () => {  
        if(image)
        {
            uploadPic()
        }else{
            uploadFields()
        }
       

    }
    return (
        <div className="mycard input-field">
            <div className="card auth-card">
                <h2> मदद </h2>
                <input type="text" placeholder="Name/NGOName" value={name} onChange={(e) => {
                    setName(e.target.value)
                }} />
                <input type="text" placeholder="Email" value={email} onChange={(e) => {
                    setEmail(e.target.value)
                }} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => {
                    setPassword(e.target.value)
                }} />
                <input type="text" placeholder="Contactno" value={phone} onChange={(e) => {
                    setPhone(e.target.value)
                }} />
                <input type="text" placeholder="Aboutus" value={aboutus} onChange={(e) => {
                    setAboutus(e.target.value)
                }} />
                <div className="file-field input-field">
                    <div className="btn #64b5f6 blue darken-1">
                        <span>Upload Pic</span>
                        <input type="file" onChange={(e) => {
                            setImage(e.target.files[0])
                        }} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
                <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={() => Postdata()}>SignUp
                </button>
                <h5>
                    <Link to="/signin">Already have an account ??</Link>
                </h5>
            </div>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            
        </div>

    )
}
export default Signup
