import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [{
        id: 1,
        name: "Ocean Avenue",
        artist: "Yellowcard",
        album: "Ocean Avenue"
      },
      {
        id: 2,
        name: "Way Away",
        artist: "Yellowcard",
        album: "Ocean Avenue"
      },
      {
        id: 3,
        name: "Believe",
        artist: "Yellowcard",
        album: "Ocean Avenue"
      }],
      playlistName:  "My Playlist",
      playlistTracks: [{
        id: 4,
        name: "Starlight",
        artist: "Taylor Swift",
        album: "Red"
      },
      {
        id: 5,
        name: "Shake It Off",
        artist: "Taylor Swift",
        album: "1989"
      },
      {
        id: 6,
        name: "Mine",
        artist: "Taylor Swift",
        album: "Speak Now"
      }]
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
  }

  addTrack(track) {
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }
    this.setState({playlistTracks: this.state.playlistTracks.concat(track)});
  }

  removeTrack(track) {
    this.setState({playlistTracks: this.state.playlistTracks.filter(savedTrack => savedTrack.id !== track.id)});
  }

  updatePlaylistName(name) {
    this.setState({playlistName:name});
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist name={this.state.playlistName} tracks={this.state.playlistTracks} removeTrack={this.removeTrack} onNameChange={this.updatePlaylistName}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
