import React, { Component } from "react";
import Gif from "./Gif";
// import da loader img spinner as image
import loader from "./images/loader.svg";
import clearButton from "./images/close-icon.svg";

const randomChoice = (arr) => {
  const randIndex = Math.floor(Math.random() * arr.length);
  return arr[randIndex];
};

const Header = ({ clearSearch, hasResults }) => (
  <div className="header grid">
    {hasResults ? (
      <button onClick={clearSearch}>
        <img src={clearButton} alt="clear images" />
      </button>
    ) : (
      <h1 className="title">Jeƒƒy</h1>
    )}
  </div>
);

const UserHint = ({ loading, hintText }) => (
  <div className="user-hint">
    {loading ? (
      <img className="block mx-auto" src={loader} alt="loading circle" />
    ) : (
      hintText
    )}
  </div>
);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "",
      hintText: "",
      loading: false,
      gifs: [],
    };
  }

  componentDidMount() {
    this.textInput.focus();
  }

  // we want a function that searches the giphy api using fetch and puts the search term into the url
  searchGiphy = async (searchTerm) => {
    this.setState({
      loading: true,
    });

    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=cPydT8IY7TH0bNMQpoqeI5sxLHeOst9H&q=${searchTerm}&limit=125&offset=0&rating=R&lang=en`
      );
      const { data } = await response.json();

      // check if the array of results is empty
      // if it is, we'll throw and error which will stop the code and handle it in the catch
      if (!data.length) {
        throw `Nothing found for ${searchTerm}`;
      }

      // grab a random result from our images
      const randomGif = randomChoice(data);

      const gif = data[0];

      this.setState((prevState, props) => ({
        ...prevState,
        gifs: [...prevState.gifs, randomGif],
        loading: false,
        hintText: `Smash that enter button to see more ${searchTerm}`,
      }));
    } catch (error) {
      this.setState((prevState, props) => ({
        ...prevState,
        hintText: error,
        loading: false,
      }));
    }
  };

  // w create react app we can write methods as arrow functions, meaning we don't need the bind and constructor
  handleChange = (event) => {
    // const value - event.target.value
    const { value } = event.target;
    // by setting the searchTerm in our state and also using that on the input as the value, we have created what is called a controlled input
    this.setState((prevState, props) => ({
      // take the old props and spread them out
      ...prevState,
      // and then overwrite with the ones we want after
      searchTerm: value,
      // set hint only if there's more than 2 characters, otherwise return empty string
      hintText: value.length > 2 ? `Hit enter to search ${value}` : "",
    }));
  };

  // when we have 2 or more chatacters in our search box
  // and press enter, we run a search

  handleKeyPress = (event) => {
    const { value } = event.target;

    if (value.length > 2 && event.key === "Enter") {
      this.searchGiphy(value);
    }
  };

  // here we reset our state by clearing everything out of making it default again
  clearSearch = () => {
    this.setState((prevState, props) => ({
      ...prevState,
      searchTerm: "",
      hintText: "",
      gifs: [],
    }));

    // grab the input and put the focus back on it
    this.textInput.focus();
  };

  render() {
    const { searchTerm, gifs } = this.state;

    // are there gifs?
    const hasResults = gifs.length;

    return (
      <div className="page">
        <Header clearSearch={this.clearSearch} hasResults={hasResults} />
        <div className="search grid">
          {this.state.gifs.map((gif) => (
            <Gif {...gif} />
          ))}
          <input
            className="input grid-item"
            placeholder="type something"
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
            value={searchTerm}
            ref={(input) => {
              this.textInput = input;
            }}
          />
        </div>
        <UserHint {...this.state} />
      </div>
    );
  }
}

export default App;
