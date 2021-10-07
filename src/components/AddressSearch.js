import { Component } from 'react';
import axios from 'axios';
import './style.css';

class SearchAPI extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiData: {},
      address: "",
      found: false
    }
  }

  handleInputChange = (event) => {
    this.setState({ address: event.target.value });
  }

  handleSearchClick = async () => {
    let address = this.state.address;
    let key = ""; // Google Cloud API key
    let linkToAPI = "https://www.googleapis.com/civicinfo/v2/representatives?key=" + key + "&address=" + address;

    try {
      let response = await axios.get(linkToAPI);
      this.setState({ apiData: response.data, found: true });
    } catch (error) {
      if (error.response) {
        /*
         * The request was made and the server responded with a
         * status code that falls out of the range of 2xx
         */
        this.setState({ found: false });
        console.log(`Error: Not found - ${error.response.data}`); // Not Found
        console.log(`Error: 404 - ${error.response.status}`); // 404
      }

    }
  }
  // TODO: move main info here
  makeTable = () => {
    let currData = this.state.apiData;
    console.log(currData);
    let table = [];
    // table.push(
    //   <tr key={currData.id}>
    //     <td>Height: {currData.height}</td>
    //     <td>Weight: {currData.weight}</td>
    //   </tr>
    // );
    return table;
  }

  makeList = () => {
    let officials = this.state.apiData.officials;
    let offices = this.state.apiData.offices;
    let list = officials.map((official, index) => {
      return (
        <>
          <ul>
            <img height={100} weight={100} src={official.photoUrl ? official.photoUrl: "https://www.pngitem.com/pimgs/m/421-4212266_transparent-default-avatar-png-default-avatar-images-png.png"} />
            <ul key={index}>
              <li>Name: {official.name}</li>
              <li>Address: {official.address && official.address.map((address) => <span>{address.line1}, {address.city}, {address.state} {address.zip}</span>)}</li>
            </ul>
          </ul>
          <hr />
        </>
      );
    });
    return list;
  }

  render() {
    return (
      <div className="container">
        <div className="search">
          <h1>Enter an address and zipcode!</h1>
          <input type="text" value={this.state.address} onChange={this.handleInputChange} placeholder="695 Park Ave 10065" />
          <button onClick={this.handleSearchClick}>View Representatives</button>
        </div>
        {this.state.found
          ? <div>
            <h1>{this.state.apiData.name}</h1>
            <table id="data">
              <tbody>
                {this.makeTable()}
              </tbody>
            </table>
            <p>Your Representatives</p>
            <ul>{this.makeList()}</ul>
          </div>
          : <h4>No results</h4>
        }
      </div>
    );
  }
}

export default SearchAPI;



