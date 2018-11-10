import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from 'firebase';
import firebaseConfig from './firebase.json';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';


class App extends Component {
  constructor(props){
    super(props);
    firebase.initializeApp(firebaseConfig);

    this.state = {
      entries: [
        {id:1,date:"17.08.2017",time:"14:02",duration:"28",isInStore: false},
        {id:2,date:"15.08.2018",time:"18:56",duration:"25",isInStore: false},
        {id:3,date:"03.08.2018",time:"20:12",duration:"31",isInStore: false},
      ], nextId : 0
    };
    this.handleNewListEntry = this.handleNewListEntry.bind(this);
    this.handlleRemoveListEntry = this.handlleRemoveListEntry.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }
  render() {

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to the swim logger</h1>
        </header>
        <h3>Add a Swim:</h3>
        <TableControls onItemSubmitted={this.handleNewListEntry}></TableControls>
        <h3>List of logged swimms:</h3>
        <Table tableData={this.state.entries} handleRemoveEntry={this.handlleRemoveListEntry} handleSave={this.handleSave} ></Table>
      </div>
    );
  }
  handleNewListEntry(event){
    let db = firebase.firestore();
    let id = db.collection("swims").doc().key;
    this.setState({entries:[...this.state.entries, {id:id,date:event.date,time:event.time,duration:event.duration,isInStore: false}]});
    this.handleSave(event);
  }
  handlleRemoveListEntry(rid,event){
    const newListEntries = this.state.entries.filter(entries => {return entries.id !== rid});
    this.setState({entries: [...newListEntries]})
  }
  handleSave(event){
    event.preventDefault();
    console.log("called handleSave");
    let db = firebase.firestore();
    db.collection("swims").doc();
    this.state.entries.forEach(e => {
      if (!e.isInStore){
        db.collection("swims").add({
          date: e.date,
          duration: e.duration,
          time: e.time
      }).then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
      }
    });
    this.readFirebaseData();
  }
  readFirebaseData(){
    let newArr = null;
    var db = firebase.firestore();
    db.collection("swims").get().then((querySnapshot) => { 
      newArr = querySnapshot.docs.map(function(doc){
        return {id : doc.id,date: doc.data().date,time: doc.data().time,duration: doc.data().duration,isInStore: true};
      });
      this.setState({
        entries:newArr
      });
  });
  }

  componentDidMount(){
    this.readFirebaseData();
  }
}
class TableControls extends Component {
  constructor(props){
    super(props)
    this.state = {
      date: '',
      time: '',
      duration: '',
  };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }
  render(){
    return (
      <div id="controlContainer">
      <form onSubmit={this.handleSubmit} class="inputForm">
      <label>Date of Swim:<input name="date" type="date" value={this.state.value} onChange={this.handleInputChange}></input></label><br></br>
      <label>Time of Swim:<input name="time" type="time" value={this.state.value} onChange={this.handleInputChange}></input></label><br></br>
      <label>Duration of Swim (minutes):<input name="duration" type="number" value={this.state.value} onChange={this.handleInputChange}></input></label>
      <input type="submit" value="Submit"></input>
      </form>
      </div>
    )
  }
  
  handleSubmit(event){
    this.props.onItemSubmitted(this.state);
    event.preventDefault();
  }

  handleInputChange(event){
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }
}

class Table extends Component {
  constructor(props){
    super(props)

  }
  
  render() {
    let listItems = null;
    if(this.props.tableData.length > 0){
      listItems = this.props.tableData.map((entry) =>
      <tr key={entry.id}>
        <td>{entry.date}</td>
        <td>{entry.time}</td>
        <td>{entry.duration}</td>
        <td><button onClick={(e) => this.handleRemoveEntry(entry.id,e)}>X</button></td>
      </tr>
      );
  } else {
    listItems = <tr key='0'>
      <td>No entries in the Table!</td>
    </tr>

  }
    return (
      <div id="tableContainer">
      <table><tbody>
         <tr>
        <th>Date</th>
        <th>Time</th>
        <th>Duration</th>
        <th>Remove Entry</th>
        </tr>
        {listItems}
        </tbody></table>
        <button onClick={(e) => this.handleSaveTable(e)}>Änderungen Speichern</button>
    </div>
   );
  }
  handleRemoveEntry(id,event){
    this.props.handleRemoveEntry(id,event);
  }
  handleSaveTable(event){
    this.props.handleSave(event);
  }
}

 
export default App;
