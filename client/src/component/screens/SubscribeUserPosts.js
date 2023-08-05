import React, { useState, useEffect,useContext } from 'react'


import {Link} from 'react-router-dom'

import {UserContext} from '../../App'
const Home = () => {
    const [data, setData] = useState([]); 
    const {state,dispatch}=useContext(UserContext) 
    
    const [readMore, setReadMore] = useState(false); 
    const linkName = readMore ? 'Read Less << ' : 'Read More >> '

    
    useEffect(() => {
        fetch('/getsubpost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json()) 
            .then(result => {
                //console.log(data)
                console.log("yahan tak aya hai", result) 
                
                setData(result.posts); 
                //console.log("set bhi ho gya hai..")
            })
    }, []) 
    
    
    
    const likepost=(id)=>{
        fetch("/like",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt") 
            },
            body:JSON.stringify({
                postId:id 
            
            })
        })
        .then(res=>res.json())
        .then(result=>{
            
            const newData=data.map(item=>{
                if(item._id==result._id)
                {
                    
                    return result 
                }
                else{
                    return item 
                }
            })
            setData(newData) 
        }).catch(err=>{
            console.log(err)
        })
    }

    // 2nd fucntional component to make the 2nd network request regarding unlike post..
    const unlikepost=(id)=>{
        fetch("/unlike",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt") 
            },
            body:JSON.stringify({
                postId:id 
            
            })
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result)
            
            const newData=data.map(item=>{
                if(item._id==result._id)
                {
                    
                    return result 
                }
                else{
                    return item  
                }
            })
            setData(newData) 
        })
        .catch(err=>{
            console.log(err)
        })
    }
    const makeComment=(text,postId)=>{
       fetch("/comment",{
           method:"put",
           headers:{
               "Content-Type":"application/json" ,
               "Authorization":"Bearer "+localStorage.getItem("jwt")
           },
           body:JSON.stringify({
               postId:postId,
               text:text
           })
       })
       .then(res=>res.json())
       .then(result=>{
         
         console.log("yahan se print ho rha hai",result)
         const newData=data.map(item=>{
            if(item._id==result._id)
            {
                
                return result 
            }
            else{
                return item  
            }
        })
        setData(newData)
       })
       .catch(err=>{
           console.log(err)
       })
    }
    
    const deletePost=(postid)=>{
        fetch(`/deletepost/${postid}`,{
            method:"delete",
            headers:{
                Authorization:"Bearer "+localStorage.getItem("jwt") 
            }
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result)
            
            const newData=data.filter(item=>{
                return item._id !== result._id
            })
            setData(newData)
        })
    }
    
    const deleteComment=(postid,commentid)=>{
        fetch(`/deletecomment/${postid}/${commentid}`,{
            method:"delete",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result)
            
            const newData=data.map(item=>{
                if(item._id==result._id)
                {
                    return result;
                }else{
                    return item;
                }
            })
            setData(newData)
        })
    }
    const x = readMore ? 'Read Less.. ' : 'Read More.. '
    return (
        <div className="home">
            {
                data.map((item) => {
                    return (
                        <div className="card home-card" key={item._id}>
                            <h5 style={{padding:"5px"}}><Link to={item.postedby._id!==state._id?"/profile/"+item.postedby._id:"/profile"}>{item.postedby.name}</Link> {item.postedby._id==state._id && <i className="material-icons" style={{float:"right"}}
                            onClick={()=>deletePost(item._id)} 
                            >delete</i>}</h5>
                            <div className="card-image">
                                <img src={item.photo} />
                            </div>
                            <div className="card-content">
                                <i className="material-icons" style={{ color: "red" }}>favorite</i>
                                {
                                  
                                    item.likes.includes(state._id) 
                                    ?<i className="material-icons" onClick={()=>unlikepost(item._id)}>thumb_down</i>
                                    :<i className="material-icons" onClick={()=>likepost(item._id)}>thumb_up</i>
                                }
                                
                                
                                <h6>{item.likes.length} likes</h6>
                                <h6><b>Title: </b> <i>{item.title}</i></h6>
                                <a style={{justifyContent:true}}><b>Description :</b> <i>{!readMore && item.body.slice(0,item.body.length/4)}</i></a>
              <a onClick={()=>{setReadMore(!readMore)}}><i className="read-more-link">{readMore && item.body.slice(0,item.body.length)}{" "}<a className="read-more-link"><b>{x}</b></a>
              </i>
              </a>


                                <p><i class="material-icons">local_phone:</i> <i>{item.phone}</i></p>
                                <p><b>Address: </b> <i>{item.address}</i></p>
                                {
                                    item.comments.map(record=>{
                                        return(
                                            
                                        <h6 key={record._id}> 

                                        {console.log(record)}
                                        {record.postedby._id==state._id && <i className="tiny material-icons" onClick={()=>deleteComment(item._id,record._id)} >delete</i>} 
                                        <span style={{fontWeight:"500"}}>{record.postedby.name} </span>{record.text}</h6>
                                        
                                        )
                                    })
                                }
                                <form onSubmit={(e)=>{
                                    e.preventDefault()
                                   
                                   console.log(e.target[0].value)
                                   {makeComment(e.target[0].value,item._id)} 
                                }}>
                               <input type="text" placeholder="add a comment" /></form>
                            </div>
                        </div>
                    )
                })
            }


        </div>
    )
}
export default Home

