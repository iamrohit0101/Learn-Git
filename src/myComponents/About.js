import React, { Component } from 'react'
import { Navigate } from 'react-router-dom'

import superagent from 'superagent'

export default class About extends Component {
  constructor () {
    super()
    this.logOut = this.logOut.bind(this)
    this.state = {
      token: localStorage.getItem('token'),
      // userName: localStorage.getItem('userName'),
      // isKYC: localStorage.getItem('isKYC'),
      // email: localStorage.getItem('email'),
      documentList: [],
      userId: null,
      userEntity: {},
      sub: 'submited',
      uploadedDocumentList: [],
      mergeDocs: [],
      logout: false,
      fileInfo: {},
      imgUrl: ''
    }

  }
  componentDidMount () {
    // this.getUserDetails();

    this.getUserByToken()
    this.mergeDocuments()
  }

  mergeDocuments = async () => {
    let documents = []
    documents = await this.getAllDocuments()
    let upDocuments = []
    upDocuments = await this.getUserByToken()
    console.log('documents ', documents)
    console.log('uploaded docs ', upDocuments)

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
      
      if(this.state.userEntity.isKYC===true && data.status==="Not Submited"){
        return;
      }
      temp.push(data)
    })
    this.setState({ mergeDocs: temp })
    console.log('merget docs data', this.state.mergeDocs)
  }

  getUserByToken = async () => {
    let data = await superagent
      .get('http://localhost:8080/getUserByToken')
      .set({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.state.token
      })

    this.setState({
      uploadedDocumentList: data.body.uploadedDocuments,
      userId: data.body.id,
      userEntity:data.body
    })
    console.log("userEntity : ",this.state.userEntity)
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
    // console.log(this.state.documentList)
    console.log('getalldocs', data.body)
    return data.body
  }
 

  uploadFile = (e, userId, docId) => {
    e.preventDefault();
    const formData = new FormData()
    console.log('file info ', this.state.fileInfo)
    formData.append('file', this.state.fileInfo)
    formData.append('userId', userId)
    formData.append('docId', docId)

    let data = superagent
      .post('http://localhost:8080/uploadFile', formData)
      .set({ Authorization: 'Bearer ' + this.state.token })
      .then((response)=>{
        console.log("uploaded file res  ",response)
        this.mergeDocuments();
        document.getElementById("upload-error").innerHTML='';
      })
      .catch((err)=>{
        let uploadErrSpan=document.getElementById("upload-error");
        uploadErrSpan.innerHTML=err.toString().substring(7);
        uploadErrSpan.style.color="red";
        console.log(err)
      })

    return data
  }

  logOut = () => {
    localStorage.clear()
    this.setState({
      logout: true
    })
    // this.props.navigate('/Home');
  }

  setImgUrl = url => {
    console.log('url : ', url)

    this.setState({ imgUrl: url })
  }

  render () {
    if (this.state.userEntity.userRole === 'Admin') {
      return <Navigate to={'/AboutAdmin'} />
    }

    if (localStorage.getItem('token') == null) {
      return <Navigate to={'/UserLogin'} />
    }
    if (this.state.logout === true) {
      return <Navigate to={'/UserLogin'} />
    } else {
      return (
        <div>
          <h2 style={{ margin: '3vh auto' }}>User Details</h2>
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

              {console.log(this.state.userEntity)}
              {console.log(this.state.userEntity.isKYC === false)}
              <li className='list-group-item'>
              {this.state.userEntity.isKYC === false ? <h5>KYC Status : Incomplete</h5> : <h5>KYC Status : Completed</h5>}
              </li>
            </ul>
          </div>

          <span id="upload-error"></span>
          <div className='container' style={{"border":"2px solid skyblue","borderRadius":"10px"}}>
          <table className='table table-striped' >
            <thead>
              <tr>
                <th scope='col'>Id</th>
                <th scope='col'>Document Name</th>
                <th scope='col'>Upload Document</th>
                <th scope='col'>Document Status</th>
              </tr>
            </thead>

            <tbody>
              {this.state.mergeDocs.map((ele, ind) => (

                <tr key={ind}>

                  <td>{ind+1}</td>
                  <td>{ele.document.name}</td>
                  <td>
                    {ele.status === 'pending' || ele.status === 'accepted' ? (
                      // TODO add image tag with file name
                      <img
                        src={`http://localhost:8080/download/${ele.url}`}
                        alt='no img'
                        onClick={() => {
                          this.setImgUrl(
                            `http://localhost:8080/download/${ele.url}`
                          )
                        }}
                        data-bs-toggle='modal'
                        data-bs-target='#exampleModal'
                        style={{ width: '5%' }}
                      />
                    ) : (
                      <div className='form-group'>
                        <form
                          onSubmit={e => {
                            this.uploadFile(
                              e,
                              this.state.userId,
                              ele.document.id
                            )
                          }}
                        >
                          <input
                            required
                            onChange={e => {
                              this.setState({ fileInfo: e.target.files[0] })
                            }}
                            type='file'
                            className='form-control-file'
                            id='exampleFormControlFile1'
                            accept='image/*'
                          />
                          <button className='btn btn-success btn-sm' type='submit'>Upload</button>
                        </form>
                      </div>
                    )}
                  </td>
                  <td>{ele.status}</td>
                  
                  </tr>

              ))}
            </tbody>
          </table>
          </div>
          <br/> 
          <button
            className='btn btn-sm  btn-danger'
            onClick={() => {
              this.logOut()
            }}
          >
            Log out
          </button>

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
                  <img alt='no img' style={{"width":"-webkit-fill-available"}} src={this.state.imgUrl} />
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
        </div>
      )
    }
  }
}
