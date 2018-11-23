import * as React from 'react';
import MediaStreamRecorder from 'msr'

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
        this.searchNameByVoice = this.searchNameByVoice.bind(this);
        this.postAudio = this.postAudio.bind(this);
        this.searchByPrice = this.searchByPrice.bind(this);
    }

    public render() {
        return (
            <div>
            <p className="Search-bar">
                <input type="text" id="search-item-textbox" className="Search-box" placeholder="Search By Item Name" />
                <div className="Search-button" onClick = {this.searchByName}>Search</div>
                <div className="btn" onClick={this.searchNameByVoice}><i className="fa fa-microphone" /></div>
            </p>

            <div className="table-div">
            <table className="table"> 
                <thead>
                    <th className="Table-header"> Name </th>
                </thead>
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
            children.push(<td className="Table-cell" key={"name" + i}>{JSON.stringify(item).replace(/"/g,"")}</td>)
            table.push(<tr className="Table-row" key={i+""} id={i+""} onClick= {this.selectRow.bind(this, i)}>{children}</tr>)
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
        var name = textBox.value 

        //Run query through luis to extract entities and interpret non-name queries
        var res: any;
        var url = "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/088f9107-c58e-46be-9522-a4e8cb2136d9?subscription-key=0c3bb008a4c640c99d728c11a6c4daa8&timezoneOffset=-360&q="
        fetch(url + name, {
            method: 'GET'
        }).then((response) => {
            return response.json()
        }).then((response) => {
            res = response

            var entities = res.entities
            // Check for item matches
            var itemName = ""
            var number = ""
            for(let i = 0; i<entities.length; i++){
                if(entities[i].type == "Item")
                    itemName = entities[i].entity
                else if(entities[i].type == "builtin.number")
                    number= entities[i].entity
            }
            if(itemName == ""){
                if(res.topScoringIntent.intent == "PriceMatch.GreaterThan"){
                    this.searchByPrice(number, true)
                } else if (res.topScoringIntent.intent == "PriceMatch.LessThan"){
                    this.searchByPrice(number, false)
                } else {
                    this.props.searchByName(name) 
                }
        } else {
            this.props.searchByName(itemName)  
        }
        }).catch((error) => {
            console.log("Error", error)
        });

        
    }

    private searchByPrice(number: any, greaterThan: any){
        alert("Price search not yet supported")
    }

    private searchNameByVoice(){
        const mediaConstraints = {
            audio: true
        }
        const onMediaSuccess = (stream: any) => {
            const mediaRecorder = new MediaStreamRecorder(stream);
            mediaRecorder.mimeType = 'audio/wav'; // check this line for audio/wav
            mediaRecorder.ondataavailable = (blob: any) => {
                this.postAudio(blob);
                mediaRecorder.stop()
            }
            mediaRecorder.start(3000);
        }
    
        navigator.getUserMedia(mediaConstraints, onMediaSuccess, onMediaError)
    
        function onMediaError(e: any) {
            console.error('media error', e);
        }
    }

    private postAudio(blobo: any){
        let accessToken: any;
        fetch('https://westus.api.cognitive.microsoft.com/sts/v1.0/issueToken', {
            headers: {
                'Content-Length': '0',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Ocp-Apim-Subscription-Key': '538cabf19170421294c2b8772495198b'
            },
            method: 'POST'
        }).then((response) => {
            // console.log(response.text())
            return response.text()
        }).then((response) => {
            //alert("Token: " + response)
            accessToken = response
        }).catch((error) => {
            console.log("Error", error)
        });

         // posting audio
        fetch('https://westus.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US.', {
            body: blobo, // this is a .wav audio file    
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer' + accessToken,
                'Content-Type': 'audio/wav;codec=audio/pcm; samplerate=16000',
                'Ocp-Apim-Subscription-Key': '538cabf19170421294c2b8772495198b'
            },    
            method: 'POST'
        }).then((res) => {
            return res.json()
        }).then((res: any) => {
            console.log(res)
            //alert("Heard: " + (res.DisplayText as string).slice(0, -1))
            const textBox = document.getElementById("search-item-textbox") as HTMLInputElement
            textBox.value = (res.DisplayText as string).slice(0, -1)
        }).catch((error) => {
            console.log("Error", error)
        });
    }
}
