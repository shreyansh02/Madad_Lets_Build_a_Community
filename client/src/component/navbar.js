import React, { useContext, useRef, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { UserContext } from '../App'
import M from 'materialize-css'
import { Types } from 'mongoose'
const Navbar = () => {  
  const searchModel = useRef(null)
  const [search, setSearch] = useState("") 
  const[userDetails,setUserDetails]=useState([]) 
  useEffect(() => {
    M.Modal.init(searchModel.current) 
  }, [])
  const { state, dispatch } = useContext(UserContext)
  const history = useHistory()
  const renderList = () => {
    if (state) { 
      return [
        <li key="1"><i data-target="modal1" className="large material-icons modal-trigger" style={{ color: "black" }}>search</i></li>,
        <li key="2"><Link to="/profile">Profile</Link></li>,
        <li key="3"><Link to="/createpost">Createpost</Link></li>,
        <li key="4"><Link to="/myfollowingpost">My following Posts</Link></li>,
        <li key="5"><Link to="/signin">
          <button className="btn #d32f2f red darken-2" onClick={() => {
            
            localStorage.clear()
            dispatch({ type: "CLEAR" }) 
            
            history.push('/signin')
          }}>Logout</button>
        </Link></li>
      ]
    }
    else {
      return [
        <li key="6"><Link to="/signin" className="self2">Signin</Link></li>,
        <li key="7"><Link to="/signup" className="self2">Signup</Link></li>,
        <li key="8"><Link to="/aboutus" className="self2">Aboutus</Link></li>

      ]
    }
  }
  
  const fetchUsers=(query)=>{
   
   setSearch(query) 
   fetch('/search-users',{
     method:"post",
     headers:{
       "Content-Type":"application/json"
     },
     body:JSON.stringify({
       query:query 
     })
   })
   .then(res=>res.json())
   .then(result=>{
      
      setUserDetails(result.user) 
   })
  }
  return (

    <>
      <nav>
        <div className="nav-wrapper #bbdefb blue lighten-4">

          <Link to={state ? "/" : "/signin"} className="brand-logo center" >मदद</Link>


          <a href="#" data-target="mobile-demo" class="sidenav-trigger"><i class="material-icons">menu</i></a>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            {renderList()}

          </ul>

        </div>
        <div id="modal1" className="modal parag1" ref={searchModel} >
          <div className="modal-content">
            <input type="text" placeholder="Search Users" value={search} onChange={(e) => {
              fetchUsers(e.target.value) 
            }} />
            <ul className="collection">
              {
               
                userDetails.map(item=>{
                return <Link to={item._id!==state._id?"/profile/"+item._id:"/profile"} onClick={()=>{
                  
                  M.Modal.getInstance(searchModel.current).close()
                  
                  setSearch('')
                }}><li className="collection-item">{item.email}</li></Link>
                })
              }
            </ul>

          </div>
          <div className="modal-footer">
            <button className="modal-close waves-effect waves-green btn-flat"onClick={()=>setSearch('')} >Close</button>
          </div>
        </div>

      </nav>
      <ul className="sidenav" id="mobile-demo">
        {renderList()}
      </ul>
    </>
  )
}
export default Navbar




