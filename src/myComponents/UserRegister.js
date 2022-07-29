import React, { Component } from 'react'
import superagent from 'superagent'
import { Link } from 'react-router-dom'

export default class UserRegister extends Component {
  constructor() {
    super()
    this.state = {
      userName: '',
      password: '',
      email:'',
      userCPassword: '',
      // value:'rohit',
      selectedValue: null,
      // cityId: null,
      // cityName: '',
      checkForFinalValid:false
    }
  }

  componentDidMount() {
  }

  getAllCountry = e => {
    superagent.get('http://localhost:8080/getAllCountry').then(response => {
      this.setState({
        countryList: response.body
      })
    })
  }

  getAllState = e => {
    {
      let sId = document.getElementById('stateId')
      sId.selected = true
      sId.disabled = true

      let cId = document.getElementById('cityId')
      cId.selected = true
      cId.disabled = true
    }

    superagent
      .get(
        'http://localhost:8080/getAllState/' +
        this.state.countryList[e.target.value].countryId
      )
      .then(response => {
        this.setState({
          stateList: response.body,
          cityList: []
        })
      })
    // console.log("state list",this.state.stateList);
  }

  getAllCity = e => {
    {
      let cId = document.getElementById('cityId')
      cId.selected = true
      cId.disabled = true
    }

    superagent
      .get(
        'http://localhost:8080/getAllCity/' +
        this.state.stateList[e.target.value].stateId
      )
      .then(response => {
        this.setState({
          cityList: response.body
        })
      })
  }

  onChangeState = () => {
    this.getAllCity()
  }

  handleSubmit = async e => {
    e.preventDefault()
    let finalValid = document.getElementById("final-valid");
    if(this.state.checkForFinalValid===true){
      finalValid.innerHTML="";
      console.log(this.state.checkForFinalValid,"you validate it success");

      const data = {
        userName: this.state.userName,
        email: this.state.email,
        password: this.state.password
      }
      console.log(data)
  
      await superagent
        .post('http://localhost:8080/registerNewUser', data)
        .set('Accept', 'application/json')
        .then(result => {
          // window.alert("Data Added");
          console.log('successfully operated')
          console.log(result)
          if (result.status === 202) {
            //save token
            localStorage.setItem('token', result.body.jwtToken)
            // localStorage.setItem('userName',result.body.userEntity.userName)
            // localStorage.setItem('email',result.body.userEntity.email)
            // localStorage.setItem('isKYC',result.body.userEntity.isKYC)
            console.log('loged in successful with  ', result)
           
            window.location.href = '/About'

          } else {
            alert('invalid cred')
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
    else{
      finalValid.innerHTML="Please Fill the Every Field Before Submit";
      finalValid.style.color="red";
      console.log(this.state.checkForFinalValid,"you donot validate it success");
    } 
  }

 
  setCityId = e => {
    this.setState({ cityId: parseInt(e.target.value) })
  }
  checkCity(){
    let citySpan = document.getElementById("citySpan");
    if(this.state.cityId==null){
        citySpan.innerHTML="Please Select City";
        citySpan.style.color="red";
        // this.setState({checkForFinalValid:false})
      }else{
        citySpan.innerHTML="";
        // this.setState({checkForFinalValid:true})
    }
  }
  // -------------------------------

  userNameValidate = userName => {
    let userNameSpan = document.getElementById('username-span')

    if (userName.length <= 5) {
      userNameSpan.innerHTML = 'UserName length must be more than 5'
      userNameSpan.style.color = 'red'
      this.setState({checkForFinalValid:false})
    }
 else {
      if (userName.length > 14) {
        userNameSpan.innerHTML = 'UserName length must be less than 15'
        userNameSpan.style.color = 'red'
        this.setState({checkForFinalValid:false})
      } else {
        let userFound = false
        superagent
          .get('http://localhost:8080/checkUserByUserName/' + userName)
          .then(response => {
            if (response.body === true) {
              userNameSpan.innerHTML = 'You can use this UserName'
              userNameSpan.style.color = 'green'
              this.setState({checkForFinalValid:true})
            } else {
              userNameSpan.innerHTML = 'UserName already exist'
              userNameSpan.style.color = 'red'
              this.setState({checkForFinalValid:false})

            }
            userFound = response.body
            console.log('userFound status', userFound)
          })
          .catch(err => {
            console.log(err)
          })
      }
    }
  }

  emailValidate = (email) => {
    var emailSpan = document.getElementById("email-span");
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
  {
    emailSpan.innerHTML = ''
    emailSpan.style.color = 'green'
    this.setState({checkForFinalValid:true})
    // return (true)
  }else {
    emailSpan.innerHTML = 'Invalid Email'
    emailSpan.style.color = 'red'
    this.setState({checkForFinalValid:false})
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
      passwordSpan.innerHTML = "Password Min length 8, followed by Capital letter and  number";
      passwordSpan.style.color = "red";
      this.setState({checkForFinalValid:false})
      return false;
    }
  }

  passwordMatching = (cPassword) => {
    
    console.log(cPassword,"-----",this.state.password);
    let cPasswordSpan = document.getElementById("cpassword-span");
    if(cPassword!==this.state.password){
      cPasswordSpan.innerHTML="Password not matches";
      cPasswordSpan.style.color="red";
      this.setState({checkForFinalValid:false})
    }
    else{
      cPasswordSpan.innerHTML="";
      this.setState({checkForFinalValid:true})
    }
  }


  render() {
    return (
      <div className="p-3 mb-2 bg-secondary text-white">
        <div style={{ width: '50%', margin: '10vh auto' }} className="p-3 mb-2 bg-light text-black py-6">

          <h5>Registeration From</h5><br/>

          <div>
            <span id="final-valid">
            </span>
          </div><br/>

          <form onSubmit={this.handleSubmit}>
            <div className='row mb-3'>
              <label htmlFor='uname' className='col-sm-2 col-form-label'>
                User Name
              </label>
              <div className='col-sm-10'>
                <input
                  type='text'
                  value={this.state.userName}
                  onChange={e => {
                    this.userNameValidate(e.target.value)
                    this.setState({ userName: e.target.value })
                  }}
                  className='form-control'
                  id='uname'
                />
                <span id='username-span'></span>
              </div>
            </div>
            <div className='row mb-3'>
              <label htmlFor='email' className='col-sm-2 col-form-label'>
                Email :
              </label>
              <div className='col-sm-10'>
                <input
                  type='email'
                  value={this.state.email}
                  onChange={e => {
                    this.emailValidate(e.target.value)
                    this.setState({ email: e.target.value })
                    // this.firstNameValidate(e.target.value)
                  }}
                  className='form-control'
                  id='email'
                />
                <span id='email-span'></span>

              </div>
            </div>
            
            <div className='row mb-3'>
              <label htmlFor='pwd' className='col-sm-2 col-form-label'>
                Password
              </label>
              <div className='col-sm-10'>
                <input
                  type='password'
                  value={this.state.password}
                  onChange={e => {
                    this.setState({ password: e.target.value })
                    this.passwordValidate(e.target.value);
                  }}
                  className='form-control'
                  id='pwd'
                />
                <span id='password-span'></span>
              </div>
            </div>
            <div className='row mb-3'>
              <label htmlFor='cpwd' className='col-sm-2 col-form-label'>
                Comfirm Password
              </label>
              <div className='col-sm-10'>
                <input
                  type='password'
                  value={this.state.userCPassword}
                  onChange={e => {
                    this.setState({ userCPassword: e.target.value });
                    this.passwordMatching(e.target.value);
                  }}
                  className='form-control'
                  id='cpwd'
                />
                <span id='cpassword-span'></span>
              </div>
            </div>
            
            <br/><br/>

            {/* <h3>{this.state.cityId}</h3> */}

            <button type='submit' className='btn btn-primary'>
              Sign in
            </button>
            <div style={{margin:"5vh 3vw"}}>
            <span>If already registered ? click here </span>
            <Link className="btn btn-primary mx-3" to="/UserLogin" role="button">Log In</Link>
            </div>

          </form>
        </div>
      </div>
    )
  }
}
