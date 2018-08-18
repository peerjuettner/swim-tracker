import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      entries: [
        {id:1,date:"17.08.2017",time:"14:02",duration:"28"},
        {id:2,date:"15.08.2018",time:"18:56",duration:"25"},
        {id:3,date:"03.08.2018",time:"20:12",duration:"31"},
      ],
      nextId: 4,
    };
    this.handleNewListEntry = this.handleNewListEntry.bind(this);
    this.handlleRemoveListEntry = this.handlleRemoveListEntry.bind(this);
  }
  render() {

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to the swim logger</h1>
        </header>
        <h3>Add a Swim:</h3>
        <TableControls onItemSubmitted={this.handleNewListEntry}></TableControls>
        <h3>List of logged swimms:</h3>
        <Table tableData={this.state.entries} handleRemoveEntry={this.handlleRemoveListEntry} ></Table>
      </div>
    );
  }
  handleNewListEntry(event){
    //event.id = this.state.
    this.setState({entries:[...this.state.entries, {id:this.state.nextId,date:event.date,time:event.time,duration:event.duration}]});
    //this.setState({nextId:this.state.nextId+1});
  }
  handlleRemoveListEntry(rid,event){
    const newListEntries = this.state.entries.filter(entries => {return entries.id !== rid});
    this.setState({entries: [...newListEntries]})
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
      <form onSubmit={this.handleSubmit}>
      <label>Date of Swim:<input name="date" type="date" value={this.state.value} onChange={this.handleInputChange}></input></label>
      <label>Time of Swim:<input name="time" type="time" value={this.state.value} onChange={this.handleInputChange}></input></label>
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
  state = {  }
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
        <button onClick={this.handleSaveTable}>Änderungen Speichern</button>
    </div>
   );
  }
  handleRemoveEntry(id,event){
    this.props.handleRemoveEntry(id,event);
  }
}

 
export default App;
