import React, { Component } from 'react';
import './SideBar.css';
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import LogoImg from './images/logo.png';

class SideBar extends Component {

    constructor(props) {
        super(props);
        this.initFilters();
        this.state = {
            checked: [],
            expanded: [],
        };
        this.handleVisibleFacilities = this.handleVisibleFacilities.bind(this);
        this.handleInformation = this.handleInformation.bind(this);
        this.handleExtras = this.handleExtras.bind(this);
    }

    initFilters() {
        let jsn = {};
        this.visibleFacilities = ["parkAndRide", "terrain", "garage", "carpool", "onstreet", "otherPlaces"];
        this.information = ["capacity", "tariffs", "restrictions", "openingTimes", "contactPersons", "accessPoint"]; // ["capacity", "tariffs", "restrictions", "openingTimes", "contactPersons"];
        this.extras = ["noDynamic", "private", "public"];

    }

    componentDidMount() {
        var coll = document.getElementsByClassName("collapsible");
        var i;

        for (i = 0; i < coll.length; i++) {
            coll[i].addEventListener("click", function () {
                this.classList.toggle("active");
                var content = this.nextElementSibling;
                if (content.style.display === "block") {
                    content.style.display = "none";
                } else {
                    content.style.display = "block";
                }
            });
        }
    }

    handleVisibleFacilities(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        let temp = this.visibleFacilities;




        var index = temp.indexOf(name);    // <-- Not supported in <IE9
        if (index !== -1) {
            temp.splice(index, 1);
        }

        else {
            temp.push(name)
        }
        this.visibleFacilities = temp;



        if (this.props.onChangeVisFacilities)
            this.props.onChangeVisFacilities(temp)
    }
    handleExtras(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        let temp = this.extras;




        var index = temp.indexOf(name);    // <-- Not supported in <IE9
        if (index !== -1) {
            temp.splice(index, 1);
        }

        else {
            temp.push(name)
        }
        this.extras = temp;



        if (this.props.onChangeExtras)
            this.props.onChangeExtras(temp)
    }


    handleInformation(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        let temp = this.information;




        var index = temp.indexOf(name);    // <-- Not supported in <IE9
        if (index !== -1) {
            temp.splice(index, 1);
        }

        else {
            temp.push(name)
        }
        this.information = temp;




        if (this.props.onChangeInformation)
            this.props.onChangeInformation(temp)


    }



    renderedSideBar() {

    }

    render() {
        return (
            // side bar
            // content


            <div className="sideBar">
                <h1 className="title">Open Parking</h1>
                <img id="logo" src={LogoImg} alt="logo" width="31" height="40"></img>
                <hr></hr>
                <h4 className="title">Visible facilities</h4>
                <div>
                    <input class="styled-checkbox" type="checkbox" id="parkAndRide" name="parkAndRide"
                        value="parkAndRide" onChange={this.handleVisibleFacilities} defaultChecked={true} />
                    <label for="parkAndRide">Park + Ride</label>
                </div>
                <div>
                    <input class="styled-checkbox" type="checkbox" id="terrain" name="terrain"
                        value="terrain" onChange={this.handleVisibleFacilities} defaultChecked={true}/>
                    <label for="terrain">Terrain</label>
                </div>
                <div>
                    <input class="styled-checkbox" type="checkbox" id="garage" name="garage"
                        value="garage" onChange={this.handleVisibleFacilities} defaultChecked={true} />
                    <label for="garage">Garage</label>
                </div>
                <div>
                    <input class="styled-checkbox" type="checkbox" id="carpool" name="carpool"
                        value="carpool" onChange={this.handleVisibleFacilities} defaultChecked={true} />
                    <label for="carpool">Carpool</label>
                </div>
                <div>
                    <input class="styled-checkbox" type="checkbox" id="onstreet" name="onstreet"
                           value="onstreet" onChange={this.handleVisibleFacilities} defaultChecked={true} />
                    <label for="onstreet">Onstreet</label>
                </div>
                <div>
                    <input class="styled-checkbox" type="checkbox" id="otherPlaces" name="otherPlaces"
                        value="otherPlaces" onChange={this.handleVisibleFacilities} defaultChecked={true} />
                    <label for="otherPlaces">Other places</label>
                </div>

                <h4 className="title">Information</h4>
                <div>
                    {/*<input class="styled-checkbox" type="checkbox" id="capacity" name="capacity"*/}
                           {/*value="capacity" onChange={this.handleInformation}/>*/}
                    <label for="capacity">Capacity</label>
                    <div class="btn-group-sm btn-group-toggle float-right" data-toggle="buttons">
                        <label class="btn btn-danger ml-2 mr-2 p-2"><input type="radio" name="capacity" autocomplete="off"/></label>
                        <label class="btn btn-secondary ml-2 mr-2 p-2 active"><input type="radio" name="capacity" autocomplete="off" checked/></label>
                        <label class="btn btn-success ml-2 mr-2 p-2"><input type="radio" name="capacity" autocomplete="off"/></label>
                    </div>
                </div>
                <div>
                    {/*<input class="styled-checkbox" type="checkbox" id="tariffs" name="tariffs"*/}
                           {/*value="tariffs" onChange={this.handleInformation}/>*/}
                    <label for="tariffs">Tariffs</label>
                    <div class="btn-group-sm btn-group-toggle float-right" data-toggle="buttons">
                        <label class="btn btn-danger ml-2 mr-2 p-2"><input type="radio" name="tariffs" autocomplete="off"/></label>
                        <label class="btn btn-secondary ml-2 mr-2 p-2 active"><input type="radio" name="tariffs" autocomplete="off" checked/></label>
                        <label class="btn btn-success ml-2 mr-2 p-2"><input type="radio" name="tariffs" autocomplete="off"/></label>
                    </div>
                </div>
                <div>
                    {/*<input class="styled-checkbox" type="checkbox" id="restrictions" name="restrictions"*/}
                           {/*value="restrictions" onChange={this.handleInformation}/>*/}
                    <label for="restrictions">Restrictions</label>
                    <div class="btn-group-sm btn-group-toggle float-right" data-toggle="buttons">
                        <label class="btn btn-danger ml-2 mr-2 p-2"><input type="radio" name="restrictions" autocomplete="off"/></label>
                        <label class="btn btn-secondary ml-2 mr-2 p-2 active"><input type="radio" name="restrictions" autocomplete="off" checked/></label>
                        <label class="btn btn-success ml-2 mr-2 p-2"><input type="radio" name="restrictions" autocomplete="off"/></label>
                    </div>
                </div>
                <div>
                    {/*<input class="styled-checkbox" type="checkbox" id="openingTimes" name="openingTimes"*/}
                           {/*value="openingTimes" onChange={this.handleInformation}/>*/}
                    <label for="openingTimes">Opening Times</label>
                    <div class="btn-group-sm btn-group-toggle float-right" data-toggle="buttons">
                        <label class="btn btn-danger ml-2 mr-2 p-2"><input type="radio" name="openingTimes" autocomplete="off"/></label>
                        <label class="btn btn-secondary ml-2 mr-2 p-2 active"><input type="radio" name="openingTimes" autocomplete="off" checked/></label>
                        <label class="btn btn-success ml-2 mr-2 p-2"><input type="radio" name="openingTimes" autocomplete="off"/></label>
                    </div>
                </div>
                <div>
                    {/*<input class="styled-checkbox" type="checkbox" id="contactPersons" name="contactPersons"*/}
                           {/*value="contactPersons" onChange={this.handleInformation}/>*/}
                    <label for="contactPersons">Contact Person</label>
                    <div class="btn-group-sm btn-group-toggle float-right" data-toggle="buttons">
                        <label class="btn btn-danger ml-2 mr-2 p-2"><input type="radio" name="contactPersons" autocomplete="off"/></label>
                        <label class="btn btn-secondary ml-2 mr-2 p-2 active"><input type="radio" name="contactPersons" autocomplete="off" checked/></label>
                        <label class="btn btn-success ml-2 mr-2 p-2"><input type="radio" name="contactPersons" autocomplete="off"/></label>
                    </div>
                </div>
                <div>
                    {/*<input class="styled-checkbox" type="checkbox" id="accessPoint" name="accessPoint"*/}
                           {/*value="accessPoint" onChange={this.handleInformation}/>*/}
                    <label for="accessPoint">Access point</label>
                    <div class="btn-group-sm btn-group-toggle float-right" data-toggle="buttons">
                        <label class="btn btn-danger ml-2 mr-2 p-2"><input type="radio" name="accessPoint" autocomplete="off"/></label>
                        <label class="btn btn-secondary ml-2 mr-2 p-2 active"><input type="radio" name="accessPoint" autocomplete="off" checked/></label>
                        <label class="btn btn-success ml-2 mr-2 p-2"><input type="radio" name="accessPoint" autocomplete="off"/></label>
                    </div>
                </div>


                <h4 className="title">Extra</h4>

                <div data-tooltip="Show facilities without dynamic data?" data-tooltip-position="right" >
                    <input class="styled-checkbox-extra" type="checkbox" id="noDynamic" name="noDynamic"
                        value="noDynamic" onChange={this.handleExtras} defaultChecked={true} />
                    <label for="noDynamic">No dynamic data</label>
                </div>
                <div>
                    <input class="styled-checkbox-extra" type="checkbox" id="private" name="private"
                        value="private" onChange={this.handleExtras} defaultChecked={true} />
                    <label for="private">Private</label>
                </div>
                <div>
                    <input class="styled-checkbox-extra" type="checkbox" id="public" name="public"
                        value="public" onChange={this.handleExtras} defaultChecked={true} />
                    <label for="public">Public</label>
                </div>
            </div>
        );
    }
}

export default SideBar;
