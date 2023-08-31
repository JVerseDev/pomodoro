import React, { useEffect, useRef, useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';


function Calendar() {
  const [events, setEvents] = useState([]);
  const authorizeButtonRef = useRef();
  const signoutButtonRef = useRef();
  

  const API_KEY = 'AIzaSyChqLmz0zC1xtWkm7ZSnVt3sHnMnseWFqg';
  const CLIENT_ID = '671899705668-9h78cagbtbc53konsf1h13rpl5manfp5.apps.googleusercontent.com';
  const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
  const SCOPES = 'https://www.googleapis.com/auth/calendar';


  useEffect(() => {
    // Load the Google API client library
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = initGoogleAPI;
    document.body.appendChild(script);

    return () => {
      // Clean up: Remove the script tag
      document.body.removeChild(script);
    };
  }, []);

  const initGoogleAPI = () => {
    window.gapi.load('client:auth2', initClient);
  };
  

  const initClient = () => {
    window.gapi.client.init({ //THIS IS THE OTHER ONE I MISSED. Make sure to include "window.gapi to intiailize globally"
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: [DISCOVERY_DOC],
      scope: SCOPES,
      plugin_name:'Flow Timer' //THIS IS THE MOST IMPORTANT PART THAT I MISSED
    }).then(() => {
      // Enable the authorize button
      authorizeButtonRef.current.disabled = false;
      authorizeButtonRef.current.addEventListener('click', handleAuthClick);
      signoutButtonRef.current.addEventListener('click', handleSignoutClick);
    });
  };

  const handleAuthClick = () => {
    window.gapi.auth2.getAuthInstance().signIn().then(() => {
      listUpcomingEvents();
    });
  };

  const handleSignoutClick = () => {
    window.gapi.auth2.getAuthInstance().signOut().then(() => {
      setEvents([]);
    });
  };

  const listUpcomingEvents = () => {
    window.gapi.client.calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 10,
      orderBy: 'startTime',
    }).then(response => {
      const events = response.result.items;
      setEvents(events);
    });
  };


  return (
    <div>
        
        <h1>Google Calendar API Example</h1>
        <button ref={authorizeButtonRef} disabled>Authorize</button>
        <button ref={signoutButtonRef}>Sign Out</button>
        <ul>
            {events.map(event => (
            <li key={event.id}>
                {event.summary} - {new Date(event.start.dateTime).toLocaleString()}
            </li>
            ))}
        </ul>

    </div>
  );
}

export default Calendar;
