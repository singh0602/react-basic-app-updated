import React, { Component } from 'react';
import SendBird from "sendbird";
/*import SendBirdSyncManager from "sendbird-syncmanager";*/



import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


import {geocodeByAddress } from 'react-places-autocomplete';

import Geocode from "react-geocode";

import ChatRoomGroups from './Components/ChatRoomGroups';
import ChatRoomElement from './Components/ChatRoomElement';
import ChatElement from './Components/ChatElement';




const userId='singh002';
const nickname='singh002';

const sb = new SendBird({ appId : '9DA1B1F4-0BE6-4DA8-82C5-2E81DAB56F23' });

sb.connect(userId, nickname, (user, error) => {
    if (error) {
    // Handle error.
}
/*console.log('User')
 console.log(user)*/




});

sb.updateCurrentUserInfo(nickname, null,  function(response, error) {
    if (error) {
        // Handle error.

    }
});



class App extends Component {

    /*constructor (props) {
     super(props);
     *//*this.state = {
     photoIndex: 0,
     isOpen: false
     };*//*
     }*/

    state = {
        users:[],
        groups:[],
        modal: false,
        locationModal: false,
        groupName: '',
        userIDS: '',
        messages: [],
        message: '',
        locationName: '',
        channelUrl: null,
        startLocation: '',
        endLocation: '',
        startCoordinates: '',
        endCoordinates: '',
        locationError: '',
        groupError: '',
        marker: null,
        center:{},
        isCurrentLocation: false,
    }


    componentDidMount = () => {

        Geocode.setApiKey("AIzaSyAkoe98NAkKlGghynXBqFjVdMrYK4RDoOI");
        // get online users
        let thisClassComponent = this;
        var applicationUserListQuery = sb.createApplicationUserListQuery();
        applicationUserListQuery.next(function(users, error) {
            if (error) {
                // Handle error.
            }
            thisClassComponent.setState({
                users: users
            });
            //console.log(users)
        });




        var channelListQuery = sb.GroupChannel.createMyGroupChannelListQuery();
        channelListQuery.includeEmpty = true;
        channelListQuery.order = 'latest_last_message'; // 'chronological', 'latest_last_message', 'channel_name_alphabetical', and 'metadata_value_alphabetical'
        channelListQuery.limit = 30;    // The value of pagination limit could be set up to 100.

        if (channelListQuery.hasNext) {
            channelListQuery.next(function(groupChannels, error) {
                if (error) {
                    // Handle error.
                }

                thisClassComponent.setState({
                    groups: groupChannels
                });
                console.log(thisClassComponent.state.groups)
            });
        }

        this.loadGroupMessages()
    }



    loadGroupMessages = () => {
        let thisClassComponent = this;
        if(this.state.channelUrl!==null){
            sb.GroupChannel.getChannel(this.state.channelUrl, function(groupChannel, error) {

                if (error) {
                    // Handle error.
                }

                // There should only be one single instance per channel view.
                var listQuery = groupChannel.createPreviousMessageListQuery();
                listQuery.limit = '20';
                listQuery.reverse = 'false';
                listQuery.includeMetaArray = true;  // Retrieve a list of messages along with their metaarrays.

                // Retrieving previous messages.
                listQuery.load(function(messages, error) {

                    if (error) {
                        // Handle error.
                    }
                    console.log(messages)
                    thisClassComponent.setState({
                        messages: messages
                    });
                });

            })
        }
    }


    sendGroupMessage = () => {

        let thisClassComponent = this;
        if(this.state.channelUrl!==null){
            /*var CHANNEL_URL='sendbird_group_channel_81263321_b873dff19366229b45f1bd15ba6ea3a3b36ea2fe';*/
            sb.GroupChannel.getChannel(this.state.channelUrl, function(groupChannel, error) {
                if (error) {
                    // Handle error.
                }

                console.log(groupChannel)
                // Implement what is needed with the contents of the response in the "groupChannel" parameter.

                const params = new sb.UserMessageParams();
                params.message = thisClassComponent.state.message;
                params.customType = 'MESG';
                params.data = 'data';
                params.mentionType = 'users';                       // Either 'users' or 'channel'
                //params.mentionedUserIds = ['singh006', 'singh90'];        // Or mentionedUsers = Array<User>;
                params.metaArrays = [];
                //params.translationTargetLanguages = ['fe', 'de'];   // French and German
                params.pushNotificationDeliveryOption = 'default';  // Either 'default' or 'suppress'

                groupChannel.sendUserMessage(params, function(message, error) {
                    if (error) {
                        // Handle error.
                    }

                    /*thisClassComponent.setState({
                     messages: thisClassComponent.state.messages.concat({message})
                     });*/

                    let messages = thisClassComponent.state.messages;
                    messages.push(message);

                    thisClassComponent.setState({
                        messages: messages
                    })

                    console.log(thisClassComponent.state.messages)
                });

            });

            thisClassComponent.setState({
                message: ''
            });
        }
    }


    openGroupModal = () => {

        this.setState({
            modal:!this.state.modal
        });


    }


    openLocationModal = () => {

        this.setState({
            locationModal:!this.state.locationModal,
            locationName:'',
            startLocation:'',
            endLocation:'',
            startCoordinates: '',
            endCoordinates: '',
            locationError:''
        });


    }

    updateGroupName  = (event) => {
        this.setState({groupName: event.target.value});
    }

    updateUserIDS  = (event) => {
        this.setState({userIDS: event.target.value});
    }

    handleSubmit  = (event) => {

        var errorMess='';
        if(!this.state.groupName){
            errorMess+='Name, ';
        }
        if(!this.state.userIDS){
            errorMess+=' User, ';
            event.stopPropagation();
            event.nativeEvent.stopImmediatePropagation();
        }
        if(errorMess!==''){
            this.setState({groupError:'Error: '+errorMess+' are required'})
            console.log('a')
            event.preventDefault();
            event.stopPropagation();
            event.nativeEvent.stopImmediatePropagation();

        }else{
            this.setState({groupError:''})
        }


        let thisClassComponent = this;
        console.log(this.state.groupName)

        var COVER_IMAGE_OR_URL='https://image.freepik.com/free-vector/couple-talking-chatting-video-calling_23-2148520030.jpg';
        var GROUP_NAME=this.state.groupName;
        var userIds = ['singh006', this.state.userIDS];

        // When 'distinct' is false
        sb.GroupChannel.createChannelWithUserIds(userIds, false, GROUP_NAME, COVER_IMAGE_OR_URL, 'data_dummy', function(groupChannel, error) {

            if (error) {
                console.log(error)
            }

            let groups = thisClassComponent.state.groups;
            groups.push(groupChannel);

            thisClassComponent.setState({
                groups: groups
            })
            thisClassComponent.openGroupModal()
        });


        event.preventDefault();
    }


    updateLocationName  = (event) => {
        this.setState({locationName: event.target.value});
    }

    updateStartLocation  = (event) => {

        this.setState({
            startLocation: event,
            isCurrentLocation: false
        },() => {
            console.log(this.state.startLocation)
    });
    /*console.log(event.target.value)*/


    /*this.setState({startLocation: event.target.value});
     console.log(this.state.startLotion)*/

}


updateEndLocation  = (event) => {

    this.setState({
        endLocation: event
    },() => {
        console.log(this.state.endLocation)
});


/*console.log(event.target.value)*/


/*this.setState({endLocation: event.target.value});
 console.log(this.state.endLocation)*/

}

setMarkers = (event) => {

    this.setState({
        marker:{
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        }
    })

    this.setState({
        startCoordinates:{
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        }
    })

    console.log(this.state.marker)


}

getPosition = () => {
    return new Promise((res, rej) => {
        navigator.geolocation.getCurrentPosition(res, rej)
});
}


    getCurrentLocation  = (event) => {



        var thisClassComponent=this;

        navigator.geolocation.getCurrentPosition(getCoordinates);

        function getCoordinates(position) {
            console.log(position)
            thisClassComponent.setState({
                startCoordinates:{
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }
            })

            thisClassComponent.setState({
                marker:{
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                },
                center:{
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }
            })


            Geocode.fromLatLng(position.coords.latitude, position.coords.longitude).then(
                response => {
                const address = response.results[0].formatted_address;

                thisClassComponent.setState({
                    startLocation: address,
                    isCurrentLocation: true
                })
                },
                error => {
                    console.error(error);
                }
            );
        }
    event.preventDefault();
    }

handleMapMessageSubmit  = (event) => {


    var errorMess='';
    if(!this.state.locationName){
        errorMess+='Name, ';
    }
    if(!this.state.startLocation){
        errorMess+=' Start Location, ';
    }
    if(!this.state.endLocation){
        errorMess+=' End Location, ';
    }
    if(errorMess!==''){
        this.setState({locationError:'Error: '+errorMess+' are required'})
        event.preventDefault();
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
    }else{
        this.setState({locationError:''})
    }

    var thisClassComponent=this;

    if(this.state.startCoordinates===''){

        Geocode.fromAddress(this.state.startLocation).then(
            response => {
            thisClassComponent.state.startCoordinates = response.results[0].geometry.location;
    })
}


    Geocode.fromAddress(this.state.endLocation).then(
        response => {

        thisClassComponent.state.endCoordinates = response.results[0].geometry.location;
    /*console.log(lat, lng);*/

    var Distance=thisClassComponent.haversineDistance(thisClassComponent.state.startCoordinates, thisClassComponent.state.endCoordinates, true);

    thisClassComponent.state.message='<div class="location-message"><h3>Mileage</h3><hr /><p><span>Name: </span>'+thisClassComponent.state.locationName+'</p><hr /><p><span>Start Location: </span>'+thisClassComponent.state.startLocation+'</p><hr /><p><span>End Location: </span>'+thisClassComponent.state.endLocation+'</p><hr /><p><span>Milage: </span>'+Distance+' miles</p></div>'


    this.sendMessage()

},
error => {
    console.error(error);
}
);



/*this.setState({message: this.state.locationName});

 this.setState({
 message: this.state.locationName
 },() => {
 this.sendGroupMessage();
 });
 this.setState({locationName: ''});
 this.openLocationModal()*/

this.openLocationModal();
event.preventDefault();

}


haversineDistance = (coords1, coords2, isMiles) => {
    function toRad(x) {
        return x * Math.PI / 180;
    }

    var lon1 = coords1.lat;
    var lat1 = coords1.lng;

    var lon2 = coords2.lat;
    var lat2 = coords2.lng;

    var R = 6371; // km

    var x1 = lat2 - lat1;
    var dLat = toRad(x1);
    var x2 = lon2 - lon1;
    var dLon = toRad(x2)
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;

    if(isMiles) d /= 1.60934;

    return d;
}


updateMessage = (event) => {
    this.setState({message: event.target.value});
}


sendMessage = (event) => {


    /*console.log(this.state.message)*/

    this.sendGroupMessage();

}

handleKeyPress = (event) => {
    if(event.key === 'Enter'){
        this.sendMessage()
    }
}

selectGroup = (event,item) => {
    this.setState({
        channelUrl: item.url
    });

    this.setState({
        channelUrl: item.url
    },() => {

        this.loadGroupMessages()
});

}


handleStartSelect = async (value) => {
    const results = await geocodeByAddress(value)
    this.setState({
        startLocation: results[0].formatted_address
    })
}

handleEndSelect = async (value) => {
    const results = await geocodeByAddress(value)
    this.setState({
        endLocation: results[0].formatted_address
    })
}


render() {
    return (

        <div>
            <div className="container">
                <div className="row">
                    <div className="col-lg-12 text-center">
                        <h1 className="page-header-title mt-4">Basic Chatting Application</h1>
                        <p className="page-header-text mb-4">Lorem Ipsum is simply dummy text of the printing and typesetting industry</p>

                        <hr />
                    </div>
                </div>
            </div>

            <div className="container">
                <section className="section">
                    <div className="row">
                        <div className="col-md-3 text-center">

                            <ChatRoomGroups groups={this.state.groups} users={this.state.users} openGroupModal={this.openGroupModal} modal={this.state.modal} groupName={this.state.groupName} handleSubmit={this.handleSubmit} updateGroupName={this.updateGroupName} updateUserIDS={this.updateUserIDS} selectGroup={this.selectGroup} channelUrl={this.state.channelUrl} groupError={this.state.groupError}></ChatRoomGroups>

                        </div>

                        <div className="col-md-6 text-center">



                    {this.state.channelUrl !== null &&

                        <ChatElement messages={this.state.messages} message={this.state.message} sendMessage={this.sendMessage} updateMessage={this.updateMessage} locationModal={this.state.locationModal} openLocationModal={this.openLocationModal} handleMapMessageSubmit={this.handleMapMessageSubmit} locationName={this.state.locationName} updateLocationName={this.updateLocationName} startLocation={this.state.startLocation} updateStartLocation={this.updateStartLocation} endLocation={this.state.endLocation} updateEndLocation={this.updateEndLocation} getCurrentLocation={this.getCurrentLocation} start={this.state.start} end={this.state.end} zoom={this.state.zoom}  handleStartSelect={this.handleStartSelect} handleEndSelect={this.handleEndSelect} handleKeyPress={this.handleKeyPress} userId={userId} locationError={this.state.locationError} marker={this.state.marker} setMarkers={this.setMarkers} isCurrentLocation={this.state.isCurrentLocation} center={this.state.center}></ChatElement>

                    }




                    </div>


                    <div className="col-md-3 text-center">
                        <ChatRoomElement users={this.state.users}></ChatRoomElement>
                    </div>



                </div>
            </section>
        </div>
            </div>
        );
}
}



export default App;
