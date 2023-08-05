import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
const Aboutus = () => {
  return (
    <>
      <div class="container">
        {/* <!-- Page Content goes here --> */}
        <h3>About Us</h3>
        <b>----------------------------------------------</b>
        <p class="flow-text">
         <b> “No one has ever become poor by giving” ~ Mother Teresa.</b>
          <br/>
          <br/>
          We at  <b>मदद</b>  believe and work towards gifting the deaf, blind and the downtrodden
          sections of the society a new life filled with happiness and joy.
          <br/>
          For the same, we travel places around and post pictures and description of
          the people who are in need of some help, and encourage such posts by
          the people on our page. 
          <br/>
          One who visits our website will be able to see
          the posts, and can offer his/her help to the person and contribute for
          the well being of the society, by contacting over the number shared
          via post. 
          <br/>
          Its your willingness to bestow the indigent or the disabled
          to live and breathe a life like you do! Let’s join hands with open
          arms to cherish the purpose of “Charity”, not only to bring those
          people a life but to experience and feel the real happiness within us
          that lies unfolded!
        </p>
      </div>
      <br/>
      <div className="container-full">
      <footer class="page-footer #212121 grey darken-4">
          <div class="container">
            <div class="row">
              <div class="col l6 s12">
                <h5 class="white-text">About Me</h5>
                <h6 class="grey-text text-lighten-4">
                  Parag Roy
                </h6>
                <h6 class="grey-text text-lighten-4">
                  paragroy1408@gmail.com
                </h6>
                
              </div>
              <div class="col l4 offset-l2 s12">
                <h5 class="white-text">Links</h5>
                <ul>
                  <li><a class="grey-text text-lighten-3" target="_blank" href="https://github.com/PARAGROY1408?tab=repositories">Github</a></li>
                  <li><a class="grey-text text-lighten-3" target="_blank" href="https://www.linkedin.com/in/parag-roy-ab571b171/">Linked In</a></li>
                  
                </ul>
              </div>
            </div>
          </div>
          <div class="footer-copyright">
            
          </div>
        </footer>
        </div>
    </>
  );
};
export default Aboutus;