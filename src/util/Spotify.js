import React from 'react';

let accessToken;
const clientId = "7accc3b7243444fd9f2420733287e72e";
const redirectURI = "http://spotify-project.surge.sh";

const Spotify = {

  getAccessToken: function() {
    if(accessToken) {
      return accessToken;
    }
    const tokenUrl = window.location.href.match(/access_token=([^&]*)/);
    let expiresIn = window.location.href.match(/expires_in=([^&]*)/);
    if (tokenUrl && expiresIn) {
      accessToken = tokenUrl[1];
      expiresIn = expiresIn[1];
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      //redirect to spotify
      window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
    }
  },
  search: function(term) {
    const accessToken = this.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if(!jsonResponse.tracks) {
        return [];
      }

      const trackItems = jsonResponse.tracks.items.map(track => {
        return {
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        };
      });

      return trackItems;
    });
  },
  savePlaylist: function(name, trackURIs) {

    // If playlist is empty - do nothing
    if (!name || !trackURIs || trackURIs.length === 0) return;

    const accessToken = this.getAccessToken();
    const headers = {
      Authorization: `Bearer ${accessToken}`
    };
    // Spotify user &  playlist info
    let userId;
    let playListId;
    // Get user id
    return fetch("https://api.spotify.com/v1/me", {
      headers: headers
    }).then(response => {
      return response.json()
    }).then(jsonResponse => {
      userId = jsonResponse.id
    }).then(() => { // Create the playlist on Spotify with name
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          name: name
        })
      }).then(response => {
        return response.json()
      }).then(jsonResponse => { //Set playlist id
        playListId = jsonResponse.id
      }).then(() => { // Add tracks to the playlist
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playListId}/tracks`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({
            uris: trackURIs
          })
        });
      });
    });
  }
};

export default Spotify;
