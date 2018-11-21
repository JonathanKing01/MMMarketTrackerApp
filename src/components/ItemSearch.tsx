import * as React from 'react';

import '../App.css';


interface IProps {
    items: any[],
    selectNewItem: any,
    searchByName: any
  }

export default class ItemSearch extends React.Component<IProps, {}> {

    constructor(props: any) {
        super(props)
        this.selectNewItem = this.selectNewItem.bind(this);
        this.searchByName = this.searchByName.bind(this);
    }

    public render() {
        return (
            <div>
            <p className="Search-bar">
                <input type="text" id="search-item-textbox" className="Search-box" placeholder="Search By Item Name" />
                <div className="Search-button" onClick = {this.searchByName}>Search</div>
            </p>

            <div className="table-div">
            <table className="table">
                <tbody>
                    {this.createTable()}
                </tbody>
            </table>
            </div>
            </div>
        );
    }

    private createTable() {
        const table:any[] = []
        const itemList = this.props.items
        if (itemList == null) {
            return table
        }

        for (let i = 0; i < itemList.length; i++) {
            const children = []
            const item = itemList[i]
            children.push(<td className="Table-row" key={"name" + i}>{JSON.stringify(item).replace(/"/g,"")}</td>)
            table.push(<tr key={i+""} id={i+""} onClick= {this.selectRow.bind(this, i)}>{children}</tr>)
        }
        return table
    }

    private selectRow(index: any) {
        const selectedItem = this.props.items[index]
        if (selectedItem != null) {
            this.props.selectNewItem(selectedItem)
        }
    }

    private selectNewItem(index: any) {
        const selectedItem = this.props.items[index]
        if (selectedItem != null) {
            this.props.selectNewItem(selectedItem)
        }
    }

    private searchByName() {
        const textBox = document.getElementById("search-item-textbox") as HTMLInputElement
        if (textBox === null) {
            return;
        }
        const name = textBox.value 
        this.props.searchByName(name)  
    }
}
