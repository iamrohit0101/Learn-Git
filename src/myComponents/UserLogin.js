import React, { Component } from 'react'
import Home from './Home'
import superagent from 'superagent'
import {Link} from 'react-router-dom';
// import { useNavigate } from "react-router-dom"
export default class UserLogin extends Component {

    constructor(){
        super();
        this.state={
            userName:'',
            password:'',
            checkForFinalValid:false
        }
    }

    handleSubmit = async(e)=>{

        e.preventDefault();
        let finalValidate=document.getElementById("final-validate");
        if(this.state.userName.length<5 && this.state.password.length<8){
            finalValidate.innerHTML="Please Fill Valid Creds";
            finalValidate.style.color="red";
            console.log("invalid details");
            
        }
        else{
            finalValidate.innerHTML="";
            console.log("login success");
            const data = {
                userName:this.state.userName,
                password:this.state.password
            }
            await superagent.post('http://localhost:8080/userlogin',data)
            .set("Accept","application/json")
            .then(result=>{
                // window.alert("Data Added");
                console.log("successfully operated")
                // console.log("jwt generated -----------------:",result)
                console.log(result)
                
                if(result.status===200){
                    //save token
                    localStorage.setItem('token', result.body.jwtToken)
                    // localStorage.setItem('userName',result.body.userEntity.userName)
                    // localStorage.setItem('email',result.body.userEntity.email)
                    // localStorage.setItem('isKYC',result.body.userEntity.isKYC)
                    // localStorage.setItem('userRole',result.body.userEntity.userRole)
    
                    console.log("loged in successful with  ",result);
                    console.log("loged in successful with  ",result.body);
                    
                    (result.body.userEntity.userRole==="Admin")?window.location.href = "/AboutAdmin":window.location.href = "/About"
                }
                else{
                    alert("invalid user cred");
                }
            }).catch(err=>{
                // if(err.status!==200){
                    finalValidate.innerHTML="Please Fill Valid Creds";
                    finalValidate.style.color="red";
                    console.log("invalid details");
                    // alert("invalid cred");
                // }
                console.log(err.status);
            })
    
            return <Home />
        }

        
    }; 

    userNameValidate = userName => {
        let userNameSpan = document.getElementById('username-span')
        if (userName.length <= 5) {
          userNameSpan.innerHTML = 'UserName length must be more than 5'
          userNameSpan.style.color = 'red'
          this.setState({checkForFinalValid:false})
        }
         else if(userName.length > 14) {
            userNameSpan.innerHTML = 'UserName length must be less than 15'
            userNameSpan.style.color = 'red'
            this.setState({checkForFinalValid:false})
        }  
        else {
            userNameSpan.innerHTML="";
            this.setState({checkForFinalValid:true})
          }
    }
    passwordValidate = (password) => {

        var passwordSpan = document.getElementById("password-span");
        var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
        if (re.test(password)) {
          // alert("done");
          this.setState({checkForFinalValid:true})
          passwordSpan.innerHTML = "";
          return true;
        }
        else {
          passwordSpan.innerHTML = "Password Min length 8, followed by one symbol and 2 numbers";
          passwordSpan.style.color = "red";
          this.setState({checkForFinalValid:false})
          return false;
        }
      }

    
  render() {
    return (
      <div className="p-3 mb-2 bg-secondary text-white">
        
        <div style={{width:"50%",margin:"10vh auto"}}className="p-3 mb-2 bg-seconday text-white" >
            <h2>Log In</h2>
            <div>
                <span id="final-validate"></span>
            </div>
        <form onSubmit={this.handleSubmit} >
        
        <div className="row mb-3">
                <label htmlFor="uname" className="col-sm-2 col-form-label">User Name</label>
                <div className="col-sm-10">
                <input type="text" value={this.state.userName} onChange = {(e)=>{this.setState({userName: e.target.value})}} className="form-control" id="uname"/>
                <span id="username-span"></span>
                </div>
            </div>
           
            <div className="row mb-3">
                <label htmlFor="pwd" className="col-sm-2 col-form-label">Password</label>
                <div className="col-sm-10">
                <input type="password" value={this.state.password} onChange = {(e)=>{this.setState({password: e.target.value})}} className="form-control" id="pwd"/>
                <span id="password-span"></span>
                </div>
            </div>

            {
                console.log(this.state.userName," ",this.state.password)
            }
            <div style={{margin:"5vh 3vw"}}>
            <button type="submit" className="btn btn-primary">Log in</button><br/><br/>
            <span>If not registered ? click below</span>
            <Link className="btn btn-primary mx-3" to="/UserRegister" role="button">Register</Link>
            </div>

            

        </form>
        </div>

      </div>
    )
  }
}
