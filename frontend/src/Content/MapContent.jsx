import React, { Component } from 'react';
import $ from 'jquery';
import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.heat';
import './MapContent.css';
import onstreetIcon from './images/onstreet-legend.png';
import privateIcon from './images/private-legend.png';


class MapContent extends Component {

    constructor(props) {
        super(props)
    }

    componentWillReceiveProps(nextProps) {
        let main = this;
        if (nextProps.filters !== this.props.filters) {
            $.getJSON("http://127.0.0.1:8000/parkingdata/rectangle/" + this.map.getBounds().toBBoxString() + "/?format=json", function (json) {
                let facilities = json;
                main.filterMarkers(facilities, main.cluster);
            });

        }
    }


    componentDidUpdate(prevProps, prevState) {
        if (prevProps.filters !== this.props.filters) {
            // this.filterMarkers(this.facilities, this.cluster)
        }
    }

    renderMap() {
        let map = L.map('mapid', {
            center: [52.1326, 5.2913],
            zoom: 8
        });
        L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaXNsYWQiLCJhIjoiY2pqbzZiczU0MTV5aTNxcnM5bWY1Nnp4YSJ9.C9UeB-y3MTGiU8Lv7_m5dQ', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        }).addTo(map);
        return map;
    }


    filter(markersToAdd, i) {
        let main = this;
        if (!main.extra.includes("onStreet") && markersToAdd[i].facilityType === "onstreet") {
            delete markersToAdd[i];
            return;
        }
        if (!main.extra.includes("offStreet") && markersToAdd[i].facilityType === "offstreet") {
            delete markersToAdd[i];
            return;
        }
        if (!main.extra.includes("noDynamic") && markersToAdd[i].dynamicDataUrl === null) {
            delete markersToAdd[i];
            return;
        }
        if (!main.extra.includes("private") && (markersToAdd[i].dynamicDataUrl !== null && markersToAdd[i].limitedAccess === true)) {
            delete markersToAdd[i];
            return;
        }
        if (!main.extra.includes("public") && (markersToAdd[i].dynamicDataUrl !== null && markersToAdd[i].limitedAccess === false)) {
            delete markersToAdd[i];
            return;
        }
        if (markersToAdd[i].usage !== null) {
            if (!main.vis.includes("parkAndRide") && (markersToAdd[i].usage.toLowerCase().includes("ride") || markersToAdd[i].usage.toLowerCase().includes("p en r") || markersToAdd[i].usage.toLowerCase().includes("p+r"))) {
                delete markersToAdd[i];
                return;
            }
            if (!main.vis.includes("garage") && markersToAdd[i].usage.toLowerCase().includes("garage")) {
                delete markersToAdd[i];
                return;
            }
            if (!main.vis.includes("carpool") && markersToAdd[i].usage.toLowerCase().includes("carpool")) {
                delete markersToAdd[i];
                return;
            }
            if (!main.vis.includes("permit") && markersToAdd[i].usage.toLowerCase().includes("vergunning")) {
                delete markersToAdd[i];
                return;
            }
            if (!main.vis.includes("otherPlaces") && (!markersToAdd[i].usage.toLowerCase().includes("vergunning") &&
                !markersToAdd[i].usage.toLowerCase().includes("carpool") &&
                !markersToAdd[i].usage.toLowerCase().includes("garage") &&
                !markersToAdd[i].usage.toLowerCase().includes("ride") &&
                !markersToAdd[i].usage.toLowerCase().includes("p en r") &&
                !markersToAdd[i].usage.toLowerCase().includes("p+r"))) {
                delete markersToAdd[i];
                return;
            }
        } else if (!main.vis.includes("otherPlaces")) {
            delete markersToAdd[i];
            return;
        }




    }

    filterMarkers(facilities, cluster) {
        Array.prototype.clean = function (deleteValue) {
            for (let i = 0; i < this.length; i++) {
                if (this[i] === deleteValue) {
                    this.splice(i, 1);
                    i--;
                }
            }
            return this;
        };

        let ParkingIcon = L.Icon.extend({
            options: {
                iconSize: [36, 36],
                iconAnchor: [18, 36],
                popupAnchor: [0, -36]
            }
        });

        this.vis = this.props.filters.visFacilities;
        this.inf = this.props.filters.information;
        this.extra = this.props.filters.extras;

        let goodIcon = new ParkingIcon({ iconUrl: require('./images/parking-good.png') });
        let averageIcon = new ParkingIcon({ iconUrl: require('./images/parking-average.png') });
        let badIcon = new ParkingIcon({ iconUrl: require('./images/parking-bad.png') });
        let onStreetIcon = new ParkingIcon({ iconUrl: require('./images/parking-onstreet.png') });
        let privateIcon = new ParkingIcon({ iconUrl: require('./images/parking-private.png') });


        let main = this;

        cluster.clearLayers();
        let markersToAdd = facilities.slice(0);
        for (let i = 0; i < markersToAdd.length; i++) {
            main.filter(markersToAdd, i);
        }
        markersToAdd.clean(undefined);

        let markers = [];
        markersToAdd.forEach(function (facility) {
            let correct = 0;
            let mark = L.marker([facility.latitude, facility.longitude]);
            mark.bindPopup();

            mark.on("popupopen", function () {
                let popup = "<b>" + facility.name + "</b><br>Loading data...";
                mark.getPopup().setContent(popup);
                popup = "<b>" + facility.name + "</b>";
                if (facility.facilityType === "offstreet") {
                    if (facility.dynamicDataUrl !== undefined || facility.dynamicDataUrl !== null) {
                        $.getJSON("http://127.0.0.1:8000/parkingdata/request/dynamicurl/" + facility.uuid + "/", function (data) {
                            if (data.parkingFacilityDynamicInformation !== undefined && data.parkingFacilityDynamicInformation.facilityActualStatus.parkingCapacity !== undefined) {
                                correct++;
                                popup += "<br> vacant spaces: " + data.parkingFacilityDynamicInformation.facilityActualStatus.vacantSpaces + "/" + data.parkingFacilityDynamicInformation.facilityActualStatus.parkingCapacity;
                            }
                        });
                    }
                    $.getJSON("http://127.0.0.1:8000/parkingdata/request/staticurl/" + facility.uuid + "/", function (data) {
                        if (data.parkingFacilityInformation !== undefined) {
                            popup += "<br>Limited API access: " + facility.limitedAccess +
                                "<br>Location: " + facility.latitude + " " + facility.longitude +
                                "<br>Tariffs: " + (data.parkingFacilityInformation.tariffs !== undefined && data.parkingFacilityInformation.tariffs.length > 0 ? "Available" : "<span class='text-danger'>No Tariffs available</span>") +
                                "<br>Opening Hours: " + (data.parkingFacilityInformation.openingTimes !== undefined && data.parkingFacilityInformation.openingTimes.length > 0 ? "Available" : "<span class='text-danger'>No opening hours available</span>") +
                                "<br>Contact Person: " + (data.parkingFacilityInformation.contactPersons !== undefined && data.parkingFacilityInformation.contactPersons.length > 0 ? "Available" : "<span class='text-danger'>No contact persons available</span>") +
                                "<br>Constraints: " + (facility.usage !== null && data.parkingFacilityInformation.specifications[0].minimumHeightInMeters !== undefined && data.parkingFacilityInformation.specifications[0].minimumHeightInMeters.length !== 0 ? "Available" : "<span class='text-danger'>No parking restrictions available</span>");

                            mark.getPopup().setContent(popup);
                        } else {
                            popup += "<br>parking static data not available";
                            mark.getPopup().setContent(popup);
                        }
                    });
                } else {
                    popup += "<br>This is an onstreet parking spot";
                    mark.getPopup().setContent(popup);

                }
            });
            if (facility.limitedAccess === false) {
                if (facility.mark !== "onstreet") {
                    if (facility.mark === "bad") {
                        mark.setIcon(badIcon);
                    } else if (facility.mark === "average") {
                        mark.setIcon(averageIcon);
                    } else {
                        mark.setIcon(goodIcon);
                    }
                } else {
                    mark.setIcon(onStreetIcon);
                }
            } else {
                mark.setIcon(privateIcon)
            }
            markers.push(mark);
        });

        cluster.addLayers(markers);

        this.updateHeatmapPoints(markersToAdd);
    }

    updateHeatmapPoints(facilities) {
        if ($("#heatmap-switch input").prop("checked")) {
            let heatPoints = { good: [], average: [], bad: [] };
            for (let i = 0; i < facilities.length; i++) {
                if (facilities[i].mark in heatPoints) {
                    heatPoints[facilities[i].mark].push([facilities[i].latitude, facilities[i].longitude, 1]);
                }
            }
            for (let mark in heatPoints) {
                this.heatmaps[mark].setLatLngs(heatPoints[mark]);
                this.heatmaps[mark].redraw();
            }
        }
    }

    componentDidMount() {

        this.loaded = true;
        this.map = this.renderMap();
        let main = this;
        let facilities = [];
        let cluster = L.markerClusterGroup({
            disableClusteringAtZoom: 13
        });
        this.map.addLayer(cluster);

        $("#layers div input").prop("checked", true);


        $.getJSON("http://127.0.0.1:8000/parkingdata/rectangle/" + main.map.getBounds().toBBoxString() + "/?format=json", function (json) {
            facilities = json;
            main.filterMarkers(facilities, cluster);

        });


        this.map.on("moveend", function () {
            $.getJSON("http://127.0.0.1:8000/parkingdata/rectangle/" + main.map.getBounds().toBBoxString() + "/?format=json", function (json) {

                facilities = json;
                main.filterMarkers(facilities, cluster);

            });
        });

        let heatmapSwitch = $("#heatmap-switch input");
        heatmapSwitch.on("click", function () {
            let showHeatmap = heatmapSwitch.prop("checked");
            for (let mark in main.heatmaps) {
                // Remove heatmap by default, and add it if the switch is checked
                main.map.removeLayer(main.heatmaps[mark]);
                if (showHeatmap) {
                    main.map.addLayer(main.heatmaps[mark]);
                }
            }

            main.filterMarkers(facilities, cluster);
        });


        // Create three heatmap layers, they will be populated in filterMarkers
        // There is one layer per marker color, there is no way to do it with
        // only one heatmap
        let heatmapColors = [
            ["bad", "#d55e00"], // Vermillion
            ["average", "#e69f00"], // Orange
            ["good", "#56b4e9"],  // Sky blue
        ];
        this.heatmaps = {};
        for (let i = 0; i < heatmapColors.length; i++) {
            this.heatmaps[heatmapColors[i][0]] = L.heatLayer([], {
                radius: 35,
                blur: 15,
                minOpacity: 0.6,
                max: 1,
                gradient: { 0: heatmapColors[i][1], 1: heatmapColors[i][1] }
            });
            this.heatmaps[heatmapColors[i][0]].addTo(this.map);
        }

        this.facilities = facilities;
        this.cluster = cluster

    }


    render() {
        // get visible facilities
        //this.map.fire("moveend");


        return (

            <div id="mapParent">
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.3.1/dist/leaflet.css"
                    integrity="sha512-Rksm5RenBEKSKFjgI3a41vrjkw4EVPlJ3+OiI65vTjIdo9brlAacEuKOiQ5OFh7cOI1bkDwLqdLw3Zg0cRJAAQ=="
                    crossorigin="" />
                <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.3.0/dist/MarkerCluster.css" />

                <div id="search-container"></div>

                <div id="mapid"></div>

                <div className="legend-field">
                    <span className="legend-label">Data availability of facilities</span>
                    <br></br>
                    <div className="legend-field-text">
                        <div id="color-and-text" data-tooltip="Private parking." data-tooltip-position="bottom">
                            <img id="onstreetIcon" src={privateIcon} alt="icon" width="15px" height="15px"></img>
                            <span>private</span>
                        </div>
                        <div id="color-and-text" data-tooltip="On-street parking." data-tooltip-position="bottom">
                            <img id="onstreetIcon" src={onstreetIcon} alt="icon" width="15px" height="15px"></img>
                            <span>On-street</span>
                        </div>
                        <div id="color-and-text" data-tooltip="All 6 necessary fields are filled in." data-tooltip-position="bottom">
                            <div class="small-box blue"></div>
                            <span>Excellent</span>
                        </div>
                        <div id="color-and-text" data-tooltip="3, 4 or 5 fields of 6 are filled in." data-tooltip-position="bottom">
                            <div class="small-box orange"></div>
                            <span>Mediocre</span>
                        </div>
                        <div id="color-and-text" data-tooltip="Less than half the fields are filled in." data-tooltip-position="bottom">
                            <div class="small-box red"></div>
                            <span>Poor</span>
                        </div>
                    </div>
                </div>

                <div className="switch-field" id="heatmap-switch">
                    <label className="heat-label">Heat view</label>
                    <div class="container" className="switch-total">
                        <label class="switch"><input type="checkbox" />
                            <div></div>
                        </label>
                    </div>
                </div>
            </div>
        )


    }
}

export default MapContent;
