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
  }

  public render() {
    const { itemSelected } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to MMO Market Tracker</h1>
        </header>

        <ItemSearch items={this.state.items} selectNewItem={this.selectNewItem} searchByName={this.fetchItems}/>
        
        {(itemSelected)?
          <div>
            <SalesReport currentItem={this.state.currentItem} records={this.state.records} />
          </div>
        : ""}
      </div>
    );
  }

  private selectNewItem(newItem: any) {
		this.setState({
      currentItem: newItem,
      itemSelected: true
		})
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
				currentItem,
				records: json
			})
    })
    .catch(err => {alert("Error: " + err)});
	}

	private methodNotImplemented() {
		alert("Method not implemented")
	}
}

export default App;
