import React, { Component } from 'react'
// import AboutAdmin from './About';
import { Navigate } from 'react-router-dom'
import superagent from 'superagent'

export default class About extends Component {
  constructor () {
    super()
    this.logOut = this.logOut.bind(this)
    this.state = {
      token: localStorage.getItem('token'),

      documentList: [],
      userId: null,
      userEntity: {},
      sub: 'submited',
      uploadedDocumentList: [],
      mergeDocs: [],
      logout: false,
      allUsers: [],
      onlyUsers: [],
      singleUser: {},
      singleUserDocs: [],
      fileInfo: {},
      imgUrl: '',
      newDocumentName:''
    }
    // console.log('token ',this.state.token);
    // console.log('name ', this.state.userName)
    // console.log('name ',this.state.userPassword);
  }
  componentDidMount () {
    // this.getUserDetails();

    this.getUserByToken()
    // this.mergeDocuments()

    this.getAllUsers()

  }

  //   getOnlyUsers = () => {
  //     let temp=[]
  //   }
  getAllUsers = async () => {
    let data = await superagent
      .get('http://localhost:8080/adminlogin')
      .set({ Authorization: 'Bearer ' + this.state.token })

    //    this.setState({uploadedDocumentList:data.body.uploadedDocuments,userId:data.body.id})
    let temp = []
    temp = data.body
    this.setState({ allUsers: data.body })
    console.log('all users ', temp)
    let onlyUser = []
    temp.forEach(ele => {
      if (ele.userRole === 'User') {
        onlyUser.push(ele)
      }
    })
    this.setState({ onlyUsers: onlyUser })
    console.log('only users', this.state.onlyUsers)
    return data.body.uploadedDocuments
  }

  mergeDocuments = async () => {
    let documents = []
    documents = await this.getAllDocuments()
    let upDocuments = []
    upDocuments = await this.getUserByToken()
    console.log('doc ', documents)
    console.log('up doc ', upDocuments)

    let temp = []
    documents.forEach(element => {
      let data = {
        document: { id: element.id, name: element.name },
        status: 'Not Submited',
        url: ''
      }
      upDocuments.forEach(upele => {
        if (upele.document.id === element.id) {
          data = {
            document: { id: element.id, name: element.name },
            status: upele.status,
            url: upele.url
          }
        }
      })
      temp.push(data)
    })
    this.setState({ mergeDocs: temp })
    console.log('merget data', this.state.mergeDocs)
  }

  getUserByToken = async () => {
    let data = await superagent
      .get('http://localhost:8080/getUserByToken')
      .set({
        'Content-Type': 'application/json',
        "Authorization": 'Bearer ' + this.state.token
      })

    this.setState({
      uploadedDocumentList: data.body.uploadedDocuments,
      userId: data.body.id,
      userEntity:data.body
    })
    return data.body.uploadedDocuments
  }

  getAllDocuments = async () => {
    let data = await superagent
      .get('http://localhost:8080/getAllDocuments')
      .set({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.state.token
      })

    this.setState({ documentList: data.body })
    console.log(this.state.documentList)
    console.log(data.body)
    return data.body
  }



 

  logOut = () => {
    localStorage.clear()
    this.setState({
      logout: true
    })
    // this.props.navigate('/Home');
  }

  adminResponse = async (userObj, docId, verification) => {
    let data = {
      userId:userObj.id,
      uploadedDocId: docId,
      verification
    }
    console.log(data)

    await superagent
      .post('http://localhost:8080/adminresponse', data)
      .set({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.state.token
      })
      .then(response => {
        console.log(response)
        this.getAllUsers()
        this.setSingleUser(userObj.userName)
      })
      .catch(e => {
        console.log(e)
      })
   
  }

  setImgUrl = url => {
    console.log('url : ', url)

    this.setState({ imgUrl: url })
  }

  getUserByUserName = async(userName) => {

    let data = await superagent
      .get(`http://localhost:8080/getUserByUserName/${userName}`)
      .set({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.state.token
      })
      console.log("user -- > ",data.body)
    return data
  }
  setSingleUser = async(userName) => {
    
    let userData = await this.getUserByUserName(userName);

    this.setState({
      singleUserDocs: userData.body.uploadedDocuments,
      singleUser: userData.body })
    
    
    // let docSpan = document.getElementById("document-span");
    // if(await this.state.userData.body.uploadedDocuments.length>0){
    //   docSpan.innerHTML="";
    // } else {
    //   docSpan.innerHTML="Not Submited any Document";
    //   docSpan.style.color='red';
    // }

      // console.log("single user" ,this.state.singleUser)
    console.log("user docs",this.state.singleUserDocs)
  }

  addNewDocument = async()=> {
    
    let data = {
      name:this.state.newDocumentName
    }
    if(this.state.newDocumentName===''){
      console.log("please enter the document name");
    } else {
      await superagent
      .post('http://localhost:8080/addNewDocument',data)
      .set({'Authorization': 'Bearer ' + this.state.token})
      .then(response => {
        console.log(response)
      })
      .catch(e => {
        console.log(e)
      })
    }
  }

  setDocumentSpan = () => {
    
  }
  render () {
    if (this.state.userEntity.userRole === 'User') {
      return <Navigate to={'/About'} />
    }
    if (localStorage.getItem('token') == null) {
      return <Navigate to={'/UserLogin'} />
    }
    if (this.state.logout === true) {
      console.log('check11')
      return <Navigate to={'/UserLogin'} />
    } else {
      return (
        <div>
          <h2 style={{ margin: '3vh auto' }}>Admin Details</h2>
          <br />

          <div
            className='container'
            style={{ width: '60%', margin: '4vh auto' }}
          >
            <ul className='list-group'>
              <li className='list-group-item'>
                <h5>Name : {this.state.userEntity.userName}</h5>
              </li>
              <li className='list-group-item'>
                <h5>Email : {this.state.userEntity.email}</h5>
              </li>
              
            </ul>
          </div>

          <button
            className='btn btn-sm btn-danger'
            onClick={() => {
              this.logOut()
            }}
          >
            Log out
          </button>
          <br />
          <br />

          <h2>All Users</h2>
          <div className='container' style={{"width":"80%","border":"2px solid skyblue","borderRadius":"10px"}}>
          <table className='table' >
            <thead>
              <tr>
                <th scope='col'>Id</th>
                <th scope='col'>User Name</th>
                <th scope='col'>User Email</th>
                <th scope='col'>User Status</th>
                <th scope='col'>KYC Status</th>
              </tr>
            </thead>

            <tbody>
              {this.state.onlyUsers.map((ele, ind) => (
                <tr key={ind}>
                  <td>{ind + 1}</td>
                  <td>{ele.userName}</td>
                  <td>{ele.email}</td>
                  <td>
                    <button
                      onClick={() => {
                        this.setSingleUser(ele.userName);
                        this.setDocumentSpan();
                      }}
                      type='button'
                      className='btn btn-sm btn-primary'
                      data-bs-toggle='modal'
                      data-bs-target='#exampleModal'
                    >
                      Show
                    </button>
                  </td>
                  <td>
                    {ele.isKYC === false ? (
                      <h6>Incomplete</h6>
                    ) : (
                      <h6>Completed</h6>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          </div>
            <br/>
        <div className='container'>
          <h6>Click to add new Document for KYC</h6> 
                    <button
                      data-bs-dismiss='modal'
                      type='button'
                      className='btn btn-sm btn-primary'
                      data-bs-toggle='modal'
                      data-bs-target='#addNewDocument'
                    >
                      Add Document
                    </button>
        </div>


          <div
            className='modal fade'
            id='exampleModal'
            tabIndex='-1'
            aria-labelledby='exampleModalLabel'
            aria-hidden='true'
          >
            <div className='modal-dialog'>
              <div className='modal-content'>
                <div className='modal-header'>
                  <h5 className='modal-title' id='exampleModalLabel'>
                    {this.state.singleUser.userName} 's Documents
                  </h5>
                  <button
                    type='button'
                    className='btn-close'
                    data-bs-dismiss='modal'
                    aria-label='Close'
                  ></button>
                </div>
                <div className='modal-body'>
                  <table className='table'>
                    <thead>
                      <tr>
                        <th scope='col'>Id</th>
                        <th scope='col'>Document Name</th>
                        <th scope='col'>Document Image</th>
                        <th scope='col'>Response</th>
                      </tr>
                    </thead>

                    <tbody>
                      {this.state.singleUserDocs.map((ele, ind) => (
                        <tr key={ind}>
                          <td>{ind + 1}</td>
                          <td>{ele.document.name}</td>
                          <td>
                            <img 
                              src={`http://localhost:8080/download/${ele.url}`}
                              onClick={() => {
                                this.setImgUrl(
                                  `http://localhost:8080/download/${ele.url}`
                                )
                              }}
                              data-bs-toggle='modal'
                              data-bs-target='#exampleModal1'
                              style={{ "width": '15%' }}
                            />
                          </td>
                          <td>
                            {ele.status === 'accepted' ||
                            ele.status === 'rejected' ? (
                              <h6>{ele.status}</h6>
                            ) : (
                              <>
                                <button
                                  type='button'
                                  
                                  onClick={(
                                    userId,
                                    uploadedDocId,
                                    verification
                                  ) => {
                                    this.adminResponse(
                                      this.state.singleUser,
                                      ele.id,
                                      1
                                    )
                                    
                                  }}
                                  className='btn btn-sm btn-success'
                                  style={{ marginBottom: '5px' }}
                                >
                                  Accept
                                </button>
                                <button
                                  type='button'
                                  
                                  onClick={(
                                    userId,
                                    uploadedDocId,
                                    verification
                                  ) => {
                                    this.adminResponse(
                                      this.state.singleUser,
                                      ele.id,
                                      0
                                    )
                                  }}
                                  className='btn btn-sm btn-danger'
                                >
                                  Reject
                                </button>{' '}
                              </>
                            )}
                          </td>
                          
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {console.log("----------",this.state.singleUserDocs.length)}
                  <span id="document-span" ></span>
                </div>
                <div className='modal-footer'>
                  <button
                    type='button'
                    className='btn btn-secondary'
                    data-bs-dismiss='modal'
                  >
                    Close
                  </button>
                  
                </div>
              </div>
            </div>
          </div>


          <div
            className='modal fade'
            id='exampleModal1'
            tabIndex='-1'
            aria-labelledby='exampleModalLabel'
            aria-hidden='true'
          >
            <div className='modal-dialog'>
              <div className='modal-content'>
                <div className='modal-header'>
                  <h5 className='modal-title' id='exampleModalLabel'>
                    Image Preview
                  </h5>
                  <button
                    type='button'
                    className='btn-close'
                    data-bs-dismiss='modal'
                    aria-label='Close'
                  ></button>
                </div>
                <div className='modal-body'>
                  <img style={{"width":"-webkit-fill-available"}} alt="not img" src={this.state.imgUrl} />
                </div>
                <div className='modal-footer'>
                  <button
                    type='button'
                    className='btn btn-secondary'
                    data-bs-dismiss='modal'
                  >
                    Close
                  </button>
                  <button
                    type='button'
                    className='btn btn-primary'
                    onClick={() => {
                      window.location.href = this.state.imgUrl
                    }}
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            className='modal fade'
            id='addNewDocument'
            tabIndex='-1'
            aria-labelledby='exampleModalLabel'
            aria-hidden='true'
          >
            <div className='modal-dialog'>
              <div className='modal-content'>
                <div className='modal-header'>
                  <h5 className='modal-title' id='exampleModalLabel'>
                    Add Document
                  </h5>
                  <button
                    type='button'
                    className='btn-close'
                    data-bs-dismiss='modal'
                    aria-label='Close'
                  ></button>
                </div>
                <div className='modal-body'>
                    <label>Enter Document Name : </label> <br/>
                    <input type="text" value={this.state.newDocumentName} onChange={(e)=>{this.setState({newDocumentName:e.target.value})}} />
                </div>
                <div className='modal-footer'>
                  <button
                    type='button'
                    className='btn btn-secondary'
                    data-bs-dismiss='modal'
                  >
                    Close
                  </button>
                  <button
                    type='button'
                    className='btn btn-primary'
                    onClick={()=>{this.addNewDocument()}}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>


        </div>
      )
    }
  }
}
