import React, { Component } from 'react'
import superagent from "superagent"
export default class Rohit extends Component {
    // constructor(props){
    //     super(props)
        
    //   }

      uploadFile=(e)=>{
        console.warn(e.target.files)

        const files=e.target.files;

        const formData = new FormData();
        formData.append('file',files[0]);
        
        superagent
        .post('http://localhost:8080/uploadFile',formData)
        .end((error, response) => {
          if (error) {
            console.log('\n' + error);
          }
          console.log(response);
        });
    }
      render() {
        return (
        <div>
            <input type="file" name="img" onChange={(e)=>this.uploadFile(e)}/>
        </div>
        );
      }
}
