import * as React from 'react';
import {Chart} from 'react-google-charts'
import FacebookLogin from 'react-facebook-login';
import '../App.css';

interface IProps {
    currentItem:any,
    initRecords:any,
}

interface IState{
  selectedRow:any,
  displayItem:any,
  records:any,
  currentUsername:any,
  LocalUpdate: boolean
}

export default class SalesReport extends React.Component<IProps, IState> {

  constructor(props: any) {
    super(props)  
    this.state = {
      selectedRow: null,
      displayItem: this.props.currentItem,
      records:this.props.initRecords,
      currentUsername:null,
      LocalUpdate: false
    }    
    alert("Rendering records: " + JSON.stringify(this.state.records))
    this.methodNotImplemented = this.methodNotImplemented.bind(this)
    this.createChart = this.createChart.bind(this)
    this.selectRow = this.selectRow.bind(this)
    this.AddRecord = this.AddRecord.bind(this)
    this.UpdateRecord = this.UpdateRecord.bind(this)
    this.DeleteRecord = this.DeleteRecord.bind(this)
    this.fetchItem = this.fetchItem.bind(this)
    this.responseFacebook = this.responseFacebook.bind(this)
  }

  public render() {
    const { currentItem } = this.props;
    const { displayItem } = this.state;
    const { selectedRow } = this.state;
    //alert("Current Item: " + currentItem.item + ", Selected Item: " + displayItem.item)
    if(displayItem.item != currentItem.item){
      this.setState({
        displayItem:currentItem,
        records: this.props.initRecords
      })
    }
    return (
      
      <div className="Report">
        <p className="Name-tag">{currentItem.item}</p>
        {this.createChart()}

         <div className="records-table-div">
          <table className="table">
            <tbody>
              {this.createTable()}
            </tbody>
          </table>
        </div>

        <p className="Input-form">
          {(selectedRow==null)?
            <div>
              <input type="text" id="item-price-textbox" className="Search-box" placeholder="Price" />
              <input type="text" id="item-date-textbox" className="Search-box" placeholder= "Time"/>
            </div>
          : ""}
          {(selectedRow!=null)?
            <div>
              <input type="text" id="item-price-textbox" className="Search-box" placeholder={selectedRow.price} />
              <p id="item-date-textbox" className="report-Table-row"> />{new Date(selectedRow.date).getUTCHours() + "." + new Date(selectedRow.date).getUTCMinutes()}</p>
            </div>
          : ""}
          <div className="Add-button" onClick = {this.AddRecord}>Add</div>
          <div className="Update-button" onClick = {this.UpdateRecord}>Update</div>
          <div className="Delete-button" onClick = {this.DeleteRecord}>Delete</div>
        </p>
            
        <div className="FB-login">
          <FacebookLogin
          appId="730792807313455"
          autoLoad={true}
          fields="name,email,picture"
          callback={this.responseFacebook} />
        </div>
        
        </div>
    );
  }

  private responseFacebook(response:any){
    alert("FB response recieved");
    alert(JSON.stringify(response.name));
    this.setState({
      currentUsername: JSON.stringify(response.name).replace(/"/g,"")
    })
  }

  private createChart() {
    var table:any[] = []
    const itemList = this.state.records;

    
    table.push(["Time", "Price"])
    var day = new Date().getUTCDay()
    alert("Date: " + day)
    selectedRow: itemList[0];
    for (let i = 0; i < itemList.length; i++) {
      const item = itemList[i]
      if(new Date(item.date).getUTCDay() >= day-2){
        //alert(new Date(item.date).getUTCDate())
        table.push([new Date(item.date).getUTCDate()
           + (new Date(item.date).getUTCHours()*0.01)
           + (new Date(item.date).getUTCMinutes()*0.0001), 
             Number(item.price)])
      }
    }

    

    const options = {
      title: this.props.currentItem,
      curveType: "function",
      legend: { position: "bottom" }
    };

    return (
      <div>
        <Chart 
          className = "chart"
          chartType="LineChart"
          width="800px"
          height="400px"
          data={table}
          options = {options}
        />
      </div>
    );
}

  private createTable() {
        const table:any[] = []
        const itemList = this.state.records
        if (itemList == null) {
            return table
        }

        var day = new Date().getUTCDay()
        for (let i = 0; i < itemList.length; i++) {
            const children = []
            const item = itemList[i]
            if(new Date(item.date).getUTCDay() >= day-2){
              children.push(<td className="report-Table-row" key={"price" + i}>{item.price}</td>)
              children.push(<td className="report-Table-row" key={"date" + i}>{new Date(item.date).getUTCHours() 
                                                                              + "." + new Date(item.date).getUTCMinutes() 
                                                                                + ", " + new Date(item.date).getUTCDate()}</td>)
              if(item.username==null)
                item.username = "-"
              children.push(<td className="report-Table-row" key={"name" + i}>{item.username}</td>)
              table.push(<tr key={i+""} id={i+""} onClick= {this.selectRow.bind(this, i)}>{children}</tr>)
            }
        }
        return table
    }
  
  private selectRow(index: any) {
    this.setState({
      selectedRow: this.state.records[index]
    })
  }
  
	private methodNotImplemented() {
		alert("Method not implemented")
  }
  
  private AddRecord() {

    const priceInput = document.getElementById("item-price-textbox") as HTMLInputElement
    var item = priceInput.value

    let url = "https://mmmarkettrackerapi.azurewebsites.net/api/MarketSaleRecord"
    
    var dateNew = new Date().toISOString()

    if(item == null)
      return

    var bodyString = JSON.stringify({
                      id: 0,
                      item: this.props.currentItem.item,
                      price: item,
                      username: this.state.currentUsername,
                      date: dateNew,
                    }) 

    //alert("Body: " + bodyString)
    

    fetch(url, {
      method: 'POST',
      headers:{
        "accept": "application/json",
        "Content-Type": "application/json-patch+json"
      },
			body: bodyString
    })
    .then((response : any) => {
			if (!response.ok) {
				//alert("Response: " + response.statusText)
			} else {
				location.reload()
			}
		  })
    .catch(err => {alert("Error: " + err)});

    this.fetchItem(this.props.currentItem)
    this.setState({
      LocalUpdate:true,
      displayItem : this.props.currentItem
    })
  }
  
  private UpdateRecord() {

    const priceInput = document.getElementById("item-price-textbox") as HTMLInputElement
    var item = priceInput.value

    let url = "https://mmmarkettrackerapi.azurewebsites.net/api/MarketSaleRecord/" + this.state.selectedRow.id
    
    //alert("Row: " + JSON.stringify(this.state.selectedRow))

    var bodyString = JSON.stringify({
                      id: Number(this.state.selectedRow.id),
                      item: this.props.currentItem.item,
                      price: Number(item),
                      date: this.state.selectedRow.date,
                    }) 

    alert("Body: " + bodyString)

    fetch(url, {
      method: 'PUT',
      headers:{
        "accept": "application/json",
        "Content-Type": "application/json-patch+json"
      },
			body: bodyString
    })
    .then((response : any) => {
			if (!response.ok) {
				//alert("Response: " + response.statusText)
			} else {
				location.reload()
			}
		  })
    .catch(err => {alert("Error: " + err)});

    this.fetchItem(this.props.currentItem)
    this.setState({
      LocalUpdate:true,
      displayItem : this.props.currentItem
    })
  }

  private DeleteRecord() {

    var id = this.state.selectedRow.id

    let url = "https://mmmarkettrackerapi.azurewebsites.net/api/MarketSaleRecord/" + this.state.selectedRow.id

    if(id == null)
      return

    var bodyString = JSON.stringify({
                      id: id,
                    }) 

    //alert("Body: " + bodyString)
    

    fetch(url, {
      method: 'DELETE',
      headers:{
        "accept": "application/json",
        "Content-Type": "application/json-patch+json"
      },
			body: bodyString
    })
    .then((response : any) => {
			if (!response.ok) {
				//alert("Response: " + response.statusText)
			} else {
				location.reload()
			}
		  })
    .catch(err => {alert("Error: " + err)});

    this.fetchItem(this.props.currentItem)
    this.setState({
      LocalUpdate:true,
      displayItem : this.props.currentItem
    })
  }

  private fetchItem(item: any) {
		let url = "https://mmmarkettrackerapi.azurewebsites.net/api/MarketSaleRecord"
		if (item !== "") {
		  url += "?item=" + item
    } else {
      url += "?item=Ogre"
    }

    fetch(url, {
      method: 'GET'
    })
    .then((response) => {
      return response.json();
    })
    .then(json => {
      let currentItem = json[0]
			if (currentItem === undefined) {
				currentItem = {"id":0, "item":"N/A","price":"0","date":"2018-11-20T01:57:36.268Z"}
			}
			this.setState({
        records:json
      })
    })
    .catch(err => {alert("Error: " + err)});
	}
}
