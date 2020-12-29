import React from "react";
import parse  from "html-react-parser";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarker } from '@fortawesome/free-solid-svg-icons'

import PlacesAutocomplete from 'react-places-autocomplete';

import {Button} from 'react-bootstrap';

import Avatar from './Avatar';
import Map from './Map';
import { Modal} from 'react-bootstrap';

const ChatElement = (props) => {


    return (

        <div className="map">
        <h5 className="map-h2">Chat Here</h5>
        <ul className="messages">
            {props.messages.map((item,key) => (
                <li  key={key} >
                {item.messageType === 'user' &&
                <span >
                    {item._sender.userId === props.userId &&
                        <span className=" message right appeared">
                            <Avatar userID={item._sender.userId} profileUrl={item._sender.profileUrl} ></Avatar>
                            <div className="text_wrapper">
                                <div className="text">{parse(item.message)}</div>
                                <div className="text"></div>
                            </div>
                        </span>
                    }
                    {item._sender.userId !== props.userId &&
                        <span className=" message left appeared">
                            <Avatar userID={item._sender.userId}  profileUrl={item._sender.profileUrl}></Avatar>
                            <div className="text_wrapper">
                                <div className="text">{parse(item.message)}</div>
                                <div className="text"></div>
                            </div>
                        </span>
                    }
                </span>
                }
                {item.messageType === 'admin' &&
                <span>
                    <div className="admin_notification">
                        <div className="text">{parse(item.message)}</div>
                    </div>
                </span>
                }
                </li>
            ))}
        </ul>


        <Button className="btn btn-secondary btn-lg float-left" onClick={props.openLocationModal}>
            <FontAwesomeIcon icon={faMapMarker} />
        </Button>
        <input type="text" className="form-control form-control-lg mx-1 input-message" value={props.message} onChange={props.updateMessage} onKeyPress={props.handleKeyPress} placeholder="Type your message..." />
        <Button className="btn btn-lg" onClick={props.sendMessage} >Send Message</Button>



            <Modal show={props.locationModal} onHide={props.openLocationModal}>
                <Modal.Header><h4>Please Enter Details</h4></Modal.Header>
                <Modal.Body>
                    <form >
                        <div className="form-group">
                            <label>Name</label>
                            <input className="form-control" type="text" value={props.locationName} onChange={props.updateLocationName} />
                        </div>
                        <div className="form-group">


                        <PlacesAutocomplete value={props.startLocation} onChange={((e) => props.updateStartLocation(e))} onSelect={props.handleSelect}>
                        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                        <div>
                            <label>Start Location</label>
                            <button className="btn btn-info btn-sm ml-2" onClick={props.getCurrentLocation}>Current Location</button>
                            <input className="form-control" {...getInputProps({placeholder:"Please Enter Start Location"})} />
                            <div>
                                {loading ? <div>...loading</div> : null}
                                {suggestions.map((suggestion,key) => (
                            <div key={suggestion.placeId} >
                            <div {...getSuggestionItemProps(suggestion)} >{suggestion.description} </div></div>
                                ))
                            }
                            </div>
                        </div>
                        )}
                        </PlacesAutocomplete>
                    </div>

                    {props.isCurrentLocation ? (
                        <div className="form-group">
                            <Map setMarkers={props.setMarkers} marker={props.marker} center={props.center} />
                        </div>
                    ) : null}


                    <div className="form-group">
                        <PlacesAutocomplete value={props.endLocation} onChange={((e) => props.updateEndLocation(e))} onSelect={props.handleSelect}>
                        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                            <div>
                                <label>End Location</label>
                                <input className="form-control" {...getInputProps({placeholder:"Please Enter End Location"})} />
                                <div>
                                {loading ? <div>...loading</div> : null}
                                {suggestions.map((suggestion,key) => (
                                    <div key={suggestion.placeId} >
                                    <div {...getSuggestionItemProps(suggestion)} >{suggestion.description} </div></div>
                            ))
                            }
                            </div>
                        </div>
                    )}
                    </PlacesAutocomplete>
                    </div>
                    {props.locationError ? (

                            <div class="alert alert-danger" role="alert">
                                {props.locationError}
                            </div>
                        ) : null}
                    <input className="btn btn-secondary mr-2" type="submit" value="Cancel" onClick={props.openLocationModal} />
                    <input className="btn btn-primary" type="submit" value="Send" onClick={props.handleMapMessageSubmit} />
                </form>

            </Modal.Body>
            <Modal.Footer> <button className="btn btn-primary" onClick={props.openLocationModal}>Close</button> </Modal.Footer>
        </Modal>


    </div>
)}

export default ChatElement;