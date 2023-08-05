import React, { useEffect, createContext,useReducer,useContext} from 'react'
import Navbar from './component/navbar'
import Signin from './component/screens/Signin'
import Home from './component/screens/Home'
import Profile from './component/screens/Profile'
import Signup from './component/screens/Signup'
import Createpost from './component/screens/CreatePost'
import UserProfile from './component/screens/UserProfile'
import SubscribedUserPost from './component/screens/SubscribeUserPosts'
import Aboutus from './component/screens/Aboutus'
import "./App.css"
import { BrowserRouter, Route, Switch,useHistory } from 'react-router-dom'
import {initialState,reducer} from './reducers/userReducer' 


export const UserContext = createContext()

const Routing = () => {
  const history=useHistory()
  const {state,dispatch}=useContext(UserContext)
  useEffect(()=>{
     const user=JSON.parse(localStorage.getItem("user"))
     console.log(typeof(user),user)
     if(user)
     {
       dispatch({type:"USER",payload:user})
       //history.push('/')
     }
     else{
       history.push('/signin')
     }
  },[]) 
  return (
    <Switch>
      <Route exact path="/">
        <Home></Home>
      </Route>
      <Route path="/signin">
        <Signin></Signin>
      </Route>
      <Route exact path="/profile"> 
        <Profile></Profile>
      </Route>
      <Route path="/signup">
        <Signup></Signup>
      </Route>
      <Route path="/createpost">
        <Createpost></Createpost>
      </Route>
      <Route path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route path="/myfollowingpost">
        <SubscribedUserPost></SubscribedUserPost>
      </Route>
      <Route path="/aboutus">
        <Aboutus></Aboutus>
      </Route>
    </Switch>
  )
}
function App() {
  const[state,dispatch]=useReducer(reducer,initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
    <BrowserRouter>
      <Navbar></Navbar>
      <Routing></Routing>
    </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
