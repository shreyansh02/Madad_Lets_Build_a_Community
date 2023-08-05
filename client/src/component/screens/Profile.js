import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../App'
const Profile = () => {
    
    const [mypics, setPics] = useState([])
    

    const [readMore, setReadMore] = useState(false); 
    const linkName = readMore ? 'Read Less << ' : 'Read More >> '


    const { state, dispatch } = useContext(UserContext)

    const [image, setImage] = useState("")
    
    useEffect(() => {
        
        fetch('/mypost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json())
            .then(result => {
                setPics(result.mypost)
                
            })
    }, []) 

    useEffect(() => {
        if (image) {
            const data = new FormData()
            data.append("file", image)
            data.append("upload_preset", "insta-clone")
            data.append("cloud_name", "paragpramodroy")

            
            fetch("	https://api.cloudinary.com/v1_1/paragpramodroy/image/upload", {
                method: "post",
                body: data
            })
                .then(res => res.json()) 
                .then(data => {
                    /*
                    console.log(data)
                   
                    */
                    //setUrl(data.url)
                    console.log(data)
                    

                    fetch('/updatepic', {
                        method: "put",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + localStorage.getItem("jwt")
                        },
                        body: JSON.stringify({
                            pic: data.url
                        })
                    })
                        .then(res => res.json())
                        .then(result => {
                            console.log(result) // ye bacend se aya hai..
                            localStorage.setItem("user", JSON.stringify({ ...state, pic: result.pic }))
                            dispatch({ type: "UPDATEPIC", payload: result.pic })
                        })
                        .catch(err => {
                            console.log(err)
                        })
                    
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, [image])

    const updatePhoto = (file) => { 

        setImage(file) 

    }
    const x = readMore ? 'Read Less.. ' : 'Read More.. '
    return (
        <div style={{ maxWidth: "550px", margin: "0px auto" }}>
            <div style={{
                margin: "18px 0px",
                borderBottom: "1px solid grey"
            }}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-around"
                }}>
                    <div>
                        <img style={{ width: "160px", height: "160px", borderRadius: "80px", padding: "10px" }}
                            src={state ? state.pic : "loading"} />

                    </div>
                    <div>
                        <h5 style={{ justifyContent: true }}> {state ? <b>{state.name}</b> : "loading"}</h5>
                        <h6 style={{ justifyContent: true }}> {state ? state.email : "loading"}</h6>
                        <h6 style={{ justifyContent: true }}>  {state ? state.phone : "loading"}</h6>
               
                        <h6> <i>{state ?
                            <>
                                <a style={{ justifyContent: true }}>{!readMore && state.aboutus.slice(0, state.aboutus.length / 8)}</a>
                                <a onClick={() => { setReadMore(!readMore) }}><i className="read-more-link">{readMore && state.aboutus.slice(0, state.aboutus.length)}{" "}<a className="read-more-link">{<b>{x}</b>}</a>
                                </i>
                                </a>
                            </>
                        : "loading"}</i></h6>
                        <div className="file-field input-field" style={{ margin: "45px" }}>
                            <div className="btn-small #64b5f6 blue darken-1">
                                <span>Edit Pic</span>
                                <input type="file" onChange={(e) => {
                                    updatePhoto(e.target.files[0])
                                }} />
                            </div>
                            <div className="file-path-wrapper">
                                <input className="file-path validate" type="text" />
                            </div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-around", width: "109%" }}>
                            <h6>{mypics.length} Posts</h6>
                            <h6>{state ? state.followers.length : "0"}followers</h6>
                            <h6>{state ? state.following.length : "0"}following</h6>
                        </div>
                    </div>
                </div>

            </div>
            <div className="gallery">
                {
                    // we need to iterate and we will do this by map...
                    mypics.map(item => {
                        return (
                            <img key={item._id} className="item" src={item.photo} alt={item.title} />
                        )
                    })
                }
            </div>
        </div>
    )
}
export default Profile

