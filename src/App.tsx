import * as React from 'react';
import './App.css';

import logo from './MMMTrackerLogo.png';
import ItemSearch from './components/ItemSearch';
import SalesReport from './components/SalesReport';

interface IState {
  items: any[],
  records: any[],
  itemSelected: boolean,
  currentItem: any
}

class App extends React.Component<{}, IState>{
  constructor(props: any) {
    super(props)
    this.state = {
                  items: [{"item":"N/A"}],
                  records: [],
                  itemSelected: false,
                  currentItem: {"id":0, "item":"N/A","price":"0","date":"2018-11-20T01:57:36.268Z"}
                }     	
                this.fetchItems("")
                this.methodNotImplemented = this.methodNotImplemented
                this.fetchItems = this.fetchItems.bind(this).bind(this)
                this.fetchItem = this.fetchItem.bind(this)
                this.selectNewItem = this.selectNewItem.bind(this)
                // this.AddRecord = this.AddRecord.bind(this)
  }

  public render() {
    const { itemSelected } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to MMO Market Tracker</h1>
        </header>

        <ItemSearch items={this.state.items} selectNewItem={this.selectNewItem} searchByName={this.fetchItems}/>
        
        {(itemSelected)?
          <div>
            <SalesReport currentItem={this.state.currentItem} initRecords={this.state.records}/>
          </div>
        : ""}
      </div>
    );
  }

  private selectNewItem(newItem: any) {
    
    this.fetchItem(newItem)
    this.forceUpdate()
	}

  private fetchItems(item: any) {
		let url = "https://mmmarkettrackerapi.azurewebsites.net/api/MarketSaleRecord/"
    if (item == "") {
		  url += "items"
    } else {
      url += "itemSearch/" + item
    }

    fetch(url, {
      method: 'GET'
    })
    .then((response) => {
      return response.json();
    })
    .then(json => {
			let currentItem = {"id":0, "item":"N/A","price":"0","date":"2018-11-20T01:57:36.268Z"}
			this.setState({
				currentItem,
				items: json
			})
    })
    .catch(err => {alert("Error: " + err)});
	}

  private fetchItem(item: any) {
    alert("Fetching item: " + item)
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
      alert("Response code: " + response.statusText)
      return response.json();
    })
    .then(json => {
      alert("Response body: " + JSON.stringify(json))
      let currentItem = json[0]
			if (currentItem === undefined) {
				currentItem = {"id":0, "item":"N/A","price":"0","date":"2018-11-20T01:57:36.268Z"}
			}
			this.setState({
				currentItem,
        itemSelected: true,
				records: json
			})
    })
    .catch(err => {alert("Error: " + err)});
	}

	private methodNotImplemented() {
		alert("Method not implemented")
  }
  
  // private AddRecord(item: any) {
  //   let url = "https://mmmarkettrackerapi.azurewebsites.net/api/MarketSaleRecord"
    
  //   var dateNew = new Date().toISOString()

    
  //   //alert("Item: " + item)
  //   if(item == null)
  //     return

  //   var bodyString = JSON.stringify({
  //                     id: 0,
  //                     item: this.state.currentItem.item,
  //                     price: item,
  //                     date: dateNew,
  //                   }) 

  //   //alert("Body: " + bodyString)
    

  //   fetch(url, {
  //     method: 'POST',
  //     headers:{
  //       "accept": "application/json",
  //       "Content-Type": "application/json-patch+json"
  //     },
	// 		body: bodyString
  //   })
  //   .then((response : any) => {
	// 		if (!response.ok) {
	// 			alert("Response: " + response.statusText)
	// 		} else {
	// 			location.reload()
	// 		}
	// 	  })
  //   .catch(err => {alert("Error: " + err)});

  //   this.fetchItem(this.state.currentItem)
  //   this.setState({
  //     itemSelected: true
  //   })
  //   //alert("Added Reccord")
	// }
}

export default App;
