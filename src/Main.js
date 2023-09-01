import React, { useEffect, useRef, useState } from 'react';
import { gapi } from "gapi-script" //this was the differentiator. https://stateful.com/blog/google-calendar-react
import {Button, CardBody, Tooltip, useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter} from "@nextui-org/react";
import Settings from './media/Settings';
import Intro from './Intro'
import Pomodoro from './Pomodoro';
import Tasks from './Tasks'
import TimerContext from './TimerContext';



function Main() {
  const [events, setEvents] = useState([]);
  const [finishedLoading, setFinishedLoading] = useState(false)
  const authorizeButtonRef = useRef();
  const signoutButtonRef = useRef();
  const [googleCalAvailable, setGoogleCalAvailable] = useState(false)
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const { pomodorosCompleted,  pomodoroEvents, timerTypes} = React.useContext(TimerContext)

  

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
    gapi.load('client:auth2', initClient);
  };
  

  const initClient = () => {
    gapi.client.init({ //THIS IS THE OTHER ONE I MISSED. Make sure to include "gapi to intiailize globally"
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: [DISCOVERY_DOC],
      scope: SCOPES,
      plugin_name:'Flow Timer' //THIS IS THE MOST IMPORTANT PART THAT I MISSED
    }).then(() => {
      // Enable the authorize button
      
      //checks if user is authenticated on load
      const authInstance = window.gapi.auth2.getAuthInstance();
      if (authInstance.isSignedIn.get()) {
        setGoogleCalAvailable(true)
      } else {
        setGoogleCalAvailable(false)
      }
      setFinishedLoading(true)
      
    });
  };

  const handleAuthClick = () => {
    gapi.auth2.getAuthInstance().signIn().then(() => {
      listUpcomingEvents();
      setGoogleCalAvailable(true) 
    });
  };

  const handleSignoutClick = () => {
    gapi.auth2.getAuthInstance().signOut().then(() => {
      setEvents([]);
      setGoogleCalAvailable(false) 
    });
  };

  const listUpcomingEvents = () => {
    gapi.client.calendar.events.list({
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

  /* old - still works 
  const addEvent = async(calendarID, event) => {
    const request = await gapi.client.calendar.events.insert({
      calendarId: 'primary',
      resource: formatEvent(pomodoroEvents[0].timerType, pomodoroEvents[0].timeStart, pomodoroEvents[0].timeEnd)
    });
    gapi.load("client", request);
    console.log(request)
  };
  */

  //new one from chat gpt
  //TODO: MARK AS FREE INSTEAD OF BUSY + DIFF COLORS
  const addEvent = async(selectedTimer, startT, endT, durationMins, selectedTask) => {
      const event = {

        summary: selectedTimer + ' for ' + durationMins + 'mins',
        description: ' Task: ' + selectedTask.title + ' ' + `Pomodoros: ${selectedTask.pomodoros.completed} / ${selectedTask.pomodoros.total}`, 
        location: "",
        start: {
          dateTime: startT,
          timeZone: "America/Los_Angeles",
        },
        end: {
          dateTime: endT,
          timeZone: "America/Los_Angeles",
        },
        
      };
    
    try {
      const response = await window.gapi.client.calendar.events.insert({
        calendarId: 'primary', // Use 'primary' for the user's primary calendar
        resource: event,
      });

      console.log('Event created:', response.result);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  //add subtle animation when google calendar is connected. Component loaded
  return (
    <div>
      <div className="flex w-[512px]">
          <div className='flex items-center absolute right-4 top-2'>
              {finishedLoading &&
                <div className='flex items-center'>
                  <div className={`w-3 h-3 ${googleCalAvailable ? "bg-emerald-400" : "outline outline-2 border-gray-500"} rounded-full mr-2`}/>
                  <p className='text-sm'>{googleCalAvailable ? "Connected" : "Not Connected"} to Google Calendar</p>
                </div>
              }
              <Button onPress={onOpen} variant='light' isIconOnly><Settings /></Button>
            </div>
           
          <div>

          <Modal 
            size={'md'} 
            isOpen={isOpen} 
            isDismissable={true}
            onOpenChange={onOpenChange}
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">Google Calendar API</ModalHeader>
                  <ModalBody>
                    <Button ref={authorizeButtonRef} onPress={handleAuthClick}>Authorize</Button>
                    <Button ref={signoutButtonRef} onPress={handleSignoutClick}>Sign Out</Button>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <Button color="primary" onPress={onClose}>
                      Action
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
          
          </div>
      </div>
      <Intro pomodorosCompleted={pomodorosCompleted}/>
      <Pomodoro timerTypes={timerTypes} addEventToCal={addEvent} googleCalAvailable={googleCalAvailable}/>
      <Tasks />
    </div>
  );
}

export default Main;
