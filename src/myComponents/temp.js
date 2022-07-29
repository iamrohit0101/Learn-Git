mergeDocuments = async() => {
    let documents = []; documents = await this.getAllDocuments(); 
    let upDocuments = []; upDocuments = await this.getUserByToken();
    console.log('doc ',documents)
    console.log('up doc ',upDocuments)
    let temp = [];
    documents.forEach(element => {
      let data = {
        document:{id:element.id, name:element.name},
        status:"Not Submited",
        url:''
      }
      upDocuments.forEach(upele=>{
        if(upele.document.id===element.id){
          data = {
            document:{id:element.id, name:element.name},
            status:upele.status,
            url:upele.status
          }
        }
      });
      temp.push(data)
    });
}

// admin table

<table className="table">
                    <thead>
                      <tr>
                        <th scope="col">Id</th>
                        <th scope="col">Document Name</th>
                        <th scope="col">Upload Document</th>
                        <th scope="col">Document Status</th>
                      </tr>
                    </thead>
                    
                    <tbody>
                        
                      {
                          this.state.mergeDocs.map((ele,ind)=>
                          <tr key={ind}>
                            <td>{ele.document.id}</td>
                            <td>{ele.document.name}</td>
                            <td>
                             { 
                            (ele.status==="pending" || ele.status==="accepted") ? "Can't Upload" : 
                            <div className="form-group">
                            <form onSubmit={(e)=>{this.uploadFile(e,this.state.userId, ele.document.id)}}>
                                {/* <label for="exampleFormControlFile1">Example file input</label> */}
                                <input required onChange={(e) =>{this.setState({fileInfo:e.target.files[0]})}} type="file" className="form-control-file" id="exampleFormControlFile1" accept='image/*'/>
                                <button type='submit'>Upload</button>
                            </form>
                            </div>
    }

                            </td>
                            <td>{ele.status}</td>
                          </tr>
                          )
                        }
                      
                    </tbody>
                </table> 