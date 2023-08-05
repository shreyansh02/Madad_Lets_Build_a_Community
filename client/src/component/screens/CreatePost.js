import {React,useState,useEffect} from 'react'
import {Links, useHistory} from 'react-router-dom'
import M from 'materialize-css'

const CreatePost = () => {
    const [title,setTitle]=useState();
    const[body,setBody]=useState();
    const[image,setImage]=useState();
    const[phone,setPhone]=useState();
    const[address,setAddress]=useState();
    const[url,setUrl]=useState();
    const history=useHistory();
    
    useEffect(()=>{
        if(url)
        {
        
        fetch("/createpost",{
            method:"post",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
               
            },
            body:JSON.stringify({
                title:title,
                body:body,
                phone:phone,
                address:address,
                pic:url,
                
            })
        }).then(res=>res.json)
        .then(data=>{
            //console.log(data) ye data aya hai backend se..
            console.log("ye backend se aa rha hai",data);
            if(data.error)
            {
                M.toast({html: data.error,classes:"#c62828 red darken-3"})
            }
            else{
                M.toast({html: "Created Post Successfully",classes:"#388e3c green darken-2"})
                history.push('/') 
            }
        })
        }
    },[url]

    
    
    const Postdetails=()=>{
        /* we have to post the image to the cloud*/
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
    return (
        <div className="card input-filed"
        style={{
           margin:"30px auto",
           maxWidth:"500px",
           padding:"20px",
           textAlign:"center"
        }}>
            <input type="text" placeholder="title" value={title} onChange={(e)=>{
                setTitle(e.target.value)
            }} />
            <input type="text" placeholder="body" value={body} onChange={(e)=>[
                setBody(e.target.value)
            ]} />
            <input type="text" placeholder="Phone" value={phone} onChange={(e)=>[
                setPhone(e.target.value)
            ]} />
            <input type="text" placeholder="Address" value={address} onChange={(e)=>[
                setAddress(e.target.value)
            ]} />
            <div className="file-field input-field">
                <div className="btn #64b5f6 blue darken-1">
                    <span>Upload Image</span>
                    <input type="file"  onChange={(e)=>{
                        setImage(e.target.files[0])
                    }}/>
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={()=>(Postdetails())} >Submit Post</button>
        </div>
    )
}
export default CreatePost
// style={{}} this what we give is the inline css...
