import React, { Component } from 'react';
import * as d3 from "d3";
import './Treemap.css'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import Legend from './Legend'
import ReactTooltip from 'react-tooltip'
import { Table, Button, Container, Row } from 'reactstrap';
var colorDict = {
    "good": "goodBG",
    "average": "avgBG",
    "bad": "badBG"
}

const QUALITYDATA = ["bad", "average", "good"]
const LEVELS = ["country", "region", "province", "city"]
var fieldsDict = []

class Treemap extends Component {

    constructor(props) {
        super(props);
        this.initFieldsDict();
        this.stackedTree = []
        this.reset = false
        this.goPrev = this.goPrev.bind(this)
        //this.root = d3.hierarchy(data);
        this.requiredAttr = ["accessPoints", "tariffs", "contactPersons", "minimumHeightInMeters", "capacity", "openingTimes", "dynamicDataUrl"]

    }

    initFieldsDict() {
        fieldsDict["accessPoints"] = "Access point"
        fieldsDict["tariffs"] = "tarrifs"
        fieldsDict["contactPersons"] = "Contacts"
        fieldsDict["minimumHeightInMeters"] = "Height restrict. "
        fieldsDict["capacity"] = "max capacity"
        fieldsDict["openingTimes"] = "opening times"
        fieldsDict["dynamicDataUrl"] = "Dynamic Url"

    }

    componentDidMount() {
        if (this.props.data) {
            this.root = d3.hierarchy(this.props.data);
            this.drawMap(this.root)
        }
    }

    drawMap(data) {
        this.root = data
        if (!this.root)
            return


        d3.select('.heatMap').selectAll("*").remove()
        d3.select('svg').selectAll("*").remove()
        d3.select('svg').append('g')
        let svgGroup = d3.select('svg g')
        svgGroup.selectAll("*").remove();
        let thiss = this
        var treemap = d3.treemap()
        // treemap.tile(d3.treemapSquarify)
        treemap.tile(d3.treemapBinary)
        treemap.paddingOuter(5)

        let svgW = d3.select('svg').node().getBBox()


        treemap.size([document.documentElement.clientWidth * .8
            , document.documentElement.clientHeight * 0.8])
            .paddingTop(20)
            .paddingInner(2);

        this.root.sum(function (d) {
            return d.value;
        })

        treemap(this.root);

        // "parent"-rectangles
        let nodes = d3.select('svg g')
            .selectAll('g')
            .data(this.root.descendants())
            .enter()
            .append('g')
            .attr('transform', function (d) { return 'translate(' + [d.x0, d.y0] + ')' })
            .on('click', d => thiss.listenForZooms(d.data.name, d.parent))

        //.on('mouseOn', d => thiss.setHover(d.data.name, d.parent))
        //.onmouseout, deletehover   

        let dict = {}
        //children
        let childnodes = nodes
            .append('rect')
            .attr('width', function (d) {
                dict[d.data.name] = d.x1 - d.x0
                return d.x1 - d.x0;
            })
            .attr('height', function (d) { return d.y1 - d.y0; })
            .attr('class', d => thiss.getColorByName(d.data.name))
            .attr('id', d => this.getId(d.data.name))
            .on("mouseover", d => { thiss.handleMouseOverNode(null, d.data.name, d.parent) })
            .on("mouseout", d => thiss.handleMouseOutNode(null, d.data.name, d.parent))
        // .on('click', d => /*thiss.listenForZooms(d.data.name)*/ console.log( d))

        nodes
            .append('text')
            .attr('id', d => thiss.getId(d.data.name) + "text")
            .attr('dx', 4)
            .attr('style', "color:blue;")
            .attr('dy', 14)
            .attr('width', function (d) { return dict[d]; })
            .attr('height', function (d) { return d.y1 - d.y0; })
            .text(function (d) {

                if (["bad", "average", "good"].indexOf(d.data.name) < 0) {

                    let dataname = d.data.name
                    if (d.data.name === null)
                        dataname = "Unknown"
                    while (thiss.textSize(dataname).width > dict[d.data.name]) {
                        dataname = dataname.substring(0, dataname.length - 1)
                    }
                    return dataname;
                }
                else{
                    let value = d.data.value !== 0 ? d.data.value : ""
                    
                    return "" + value
                }
            })
    }

    handleMouseOverNode(obj, name, parent) {

        let rect = d3.select("#" + this.getId(name))
        let text = d3.select("#" + this.getId(name) + "text")

        if (QUALITYDATA.indexOf(name) > -1 && parent !== null && parent.data !== null && parent.data.name !== null) { //if mark is hovered 
            // handle parent
            rect = d3.select("#" + this.getId(parent.data.name))
            text = d3.select("#" + this.getId(parent.data.name) + "text")
        }


        rect.attr("stroke", "#1111FF")
            .attr("stroke-width", 5)

        text.attr("font-weight", "bold")


    }

    getId(name) {

        if (name) {
            return name.split("'").join("_").split(" ").join("_").split("'").join("");

        }
        return ""


    }

    handleMouseOutNode(obj, name, parent) {

        let rect = d3.select("#" + this.getId(name))
        let text = d3.select("#" + this.getId(name) + "text")

        if (QUALITYDATA.indexOf(name) > -1 && parent !== null && parent.data !== null && parent.data.name !== null) {
            // handle parent
            rect = d3.select("#" + this.getId(parent.data.name))
            text = d3.select("#" + this.getId(parent.data.name) + "text")
        }


        rect.attr("stroke-width", 1)
            .attr("stroke", "#000000")
        text.attr("font-weight", "normal")


    }


    wrap(width, padding) {
        var self = d3.select(this),
            textLength = self.node().getComputedTextLength(),
            text = self.text();
        while (textLength > (width - 2 * padding) && text.length > 0) {
            text = text.slice(0, -1);
            self.text(text + '...');
            textLength = self.node().getComputedTextLength();
        }
    }



    textSize(text) {
        if (!d3) return;
        var container0 = d3.select('body').append('div')
        var container = container0.append('svg');
        container.append('text').attr("x", -0).attr("y", -0).text(text);
        var size = container.node().getBBox();
        container0.remove();
        return { width: size.width, height: size.height };
    }


    notEmptyArray(v) {


        return (v !== "[]")
    }


    getColorByName(name) {
        return colorDict[name]
    }

    listenForZooms(name, parent = null) {

        if (["bad", "average", "good"].indexOf(name) > -1) {
            name = parent.data.name
        }
        if (this.props.onZoomChange) {
            this.stackedTree.push({ "data": this.props.data, "name": this.props.data.name })
            if (this.props.level !== 3) {

                this.props.onZoomChange(name)
            }
            else {
                this.props.onZoomChange(name, 3)
            }

        }
    }

    drawMapView(data) {
        this.generateTable(data)
    }

    generateBreadCrums(data, level) {

    }

    goPrev() {

        if (this.props.onDezoom) {
            this.props.onDezoom(this.reset)
        }

    }

    getTitleDict(str) {

        if (str === "nl")
            return "The Netherlands"
        else if (str === "region/none")
            return "Facilities with no location"

        return str

    }
    render() {

        let breadCrums = "Loading data..."
        let buttonZoomOut = null
        let noButton = null
        let active = this.level === 3 ? "active" : "inactive"

        if (this.props.data /*&& this.props.level && this.props.level !== 3*/) {


            if (!this.props.level || this.props.level !== 3) {
                breadCrums = this.generateBreadCrums(this.props.data, this.props.level)
                this.drawMap(d3.hierarchy(this.props.data))
            }
            else if (this.props.level && this.props.level === 3) {


                this.drawMapView(this.props.data) //heatmap
            }

            if (this.props.data.name) {
                breadCrums = this.props.data.name
            }

            if (breadCrums !== "Loading data..." && this.props.level > 0 ) {
                buttonZoomOut = (<Button outline color="primary" onClick={this.goPrev}>Zoom out</Button>)
            }

          


            breadCrums = this.getTitleDict(breadCrums)

            if (this.props.data.name === "region/none") {
                this.reset = true
            }
            else {
                this.reset = false
            }

            if(this.reset !== true){
                noButton = <Button outline color="primary" onClick={this.setReset.bind(this)}>no location</Button>
            }


        }
        return (
            <div>

                <div className="dashboard-head">

                    <h1>{breadCrums}</h1>
                    <div className="two-buttons">
                        <div id="single-button">
                            {buttonZoomOut}
                        </div>
                        <div id="single-button">
                            { noButton}
                        </div>
                    </div>
                    <Legend />
                </div>

                <div className="dashboard-table {active}">
                    <Table className="heatMap" width={0} />
                </div>

                <div className="dashboard-data">
                    <svg className="TreemapData"  >
                    </svg>
                </div>
            </div>
        );
    }


    generateTable(data) {


        d3.select(".heatMap").selectAll("*").remove()
        var table = d3.select('.heatMap')
        var thead = table.append('thead') // create the header
        var tbody = table.append('tbody');
        d3.select('svg').selectAll("*").remove()


        let columns = ["name"].concat(this.requiredAttr)

        thead.append('tr')
            .selectAll('th')
            .data(columns).enter()
            .append('th')
            .attr("class", (d, i) => "th-" + d)
            .text(function (column) { return fieldsDict[column]; });

        this.setAllParkings(tbody, columns, data)
    }

    /**
     * TO DO: Catch wrong response / time out
     */
    async setAllParkings(tbody, column, data) {


        for (let i = 0; i < data.length; i++) {

            if (data[i].mark === "onstreet" || this.checkInformationFilters(data[i]))
                continue

            let resultJson = data[i]

            //generate row
            this.generateRow(tbody, column, resultJson, data[i]["longitude"], data[i].mark)

        }

    }

    /**
    Only show the facilities with the required stuff */
    checkInformationFilters(node) {
        let required = this.props.filters.information

        if (required && required.length > 0) { //check if all checked are included 

            for (let i = 0; i < required.length; i++) {

                if (["capacity", "minimumHeightInMeters"].indexOf(required[i]) > -1) {// special treatment
                    // if empty return true
                }
            }

            //everthing is included
            return false

        }
        return false // nothing is required or all required fields are included

    }

    setReset() {

        if (this.props.setReset) {
            this.props.setReset();
        }
    }

    handleMouseOverTd(inp, d) {
        var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 1)
            .style("left", (d.y + 120) + "px")
            .style("top", (d.x - 20) + "px")
            .html(
                "<div>" + inp + "</div>"
            );

    }

    createTextTool(text) {

        /*    var div = d3.select("body").append("div").html(text)
                .attr("class", "tooltip")
                .style("opacity", 1)
                .style("left", (d.y+120) + "px")
                .style("top", (d.x-20) + "px")
        	
    
    
        return  div*/
    }
    generateRow(tbody, columns, data, longitude, mark = "") {

        // data = JSON.parse(data)
        let tr = tbody.append('tr')
        let v = ""
        let thiss = this

        if (!data) {
            return
        }

        for (let j = 0; j < columns.length; j++) {
            let classN = ""
            if (columns[j] === "name") {

                classN += " heatCellName"//normal cell
                classN += " nameBorder" + mark
                tr.append('td')
                    .attr("class", classN)
                    .attr("data-tip", "")
                    .attr("data-for", data[columns[j]])
                    .append('a')
                    .attr("href", "http://api.openparking.nl/parkingdata/html/" + data["uuid"])
                    .attr("target", "_blank")
                    .text(data[columns[j]])
                // .on("mouseover", d => {thiss.handleMouseOverTd(data[columns[j]], this)})


            }
            else if (columns[j] === "longitude") {

                classN += " heatCell"//colored heatcell
                classN += ((longitude !== null) ? " validCell" : " invalidCell") // is this field in the json?
                tr.append('td')
                    .attr("class", classN)

                    .text("" + longitude)
            }
            else {
                classN += " heatCell "
                v = this.getValueJsonResult(columns[j], data)


                if (v && this.notEmptyArray(v) && v !== false) {
                    classN += " validCell"  // is this field in the json?
                }
                else {
                    classN += " invalidCell"  // is this field in the json?
                }

                if(columns[j] === "dynamicDataUrl" && classN === "validCell"){
                    v = "<a href='" + v + "'>" + "Available" + "</a>"
                }

                tr.append('td')
                    .attr("class", classN)
                    .text(v)

            }
        }

    }


    getValueJsonResult(key, node) {

        return node[key]

        /*if ((key === "capacity" || key === "minimumHeightInMeters") 
                && node && node["specifications"] 
                && node["specifications"].length > 0) {

            let nodeCapacity = node["specifications"][0]

            if (!nodeCapacity)
                return null

            if (nodeCapacity[key]) {
                return nodeCapacity[key]

            }
            return null // No capacity found

        }
        else {

            try {

                return (JSON.stringify(node[key]))
            }
            catch (e) {
                console.log(e)
                return null // not found
            }
        }*/
    }
}

export default Treemap;
