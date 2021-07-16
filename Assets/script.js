// Calendar properties
let start_hr = 7;
let end_hr = 18;
let total_hr = end_hr - start_hr;

let weekMap = [ 
    "3 / 4",
    "4 / 5",
    "5 / 6",
    "6 / 7",
    "7 / 8",
    "8 / 9",
    "9 / 10"
];

let colorMap = [[ 
    "#b3e2cd",
    "#fdcdac",
    "#cbd5e8",
    "#f4cae4",
    "#e6f5c9"
],[
    "#f0f9e8",
    "#bae4bc",
    "#7bccc4",
    "#43a2ca",
    "#0868ac"
]];


Application.run = function ( msg ) {


    // Add key listener for input field
    ge( 'cmdLine' ).addEventListener( 'keydown' , function (event) {
        if ( event.which==13 ) {
            parseCommand(this.value);
            this.value = '';
        }
    });

    // Set date todays date
    let chosenDate = new Date()
    setDateBar( chosenDate );



    // Initialize default view
    SetTimeColumn( start_hr, end_hr );
    refreshRecords();
    
}

// set a project bar 

let refreshRecords = function () {
    // get all this weeks (by default) records
    let m = new Module("timecharge");
    m.onExecuted = function (code, data) {
        if ( code=="refresh" ) {
            // console.log(data);
            jData = JSON.parse(data);
            //console.log(code, jData);
            let daySum = [
                0,0,0,0,0,0,0
            ];
            for(let i=0; i < jData.length; i++){
                //console.log(jData[i].Client, jData[i].Project, jData[i].timeToParsed.hour, jData[i].timeFromParsed.hour);
                daySum[jData[i].day-1] += jData[i].duration;
                console.log( jData[i] );
                PlaceRecord( jData[i], start_hr, 0 );
            }

            PlaceSums(daySum);

        } else {
            console.log(code, data);
        }
    }
    m.execute('getcharges');
}

let PlaceSums = function ( daySum ) {
    let chart = document.getElementById('chart');
    for ( let i=0; i < daySum.length; i++) {
        div = document.createElement('div');
        div.classList.add("daysum");
        div.innerHTML = daySum[i].toFixed(1);
        div.style['grid-column'] = weekMap[i];
        div.style['grid-row'] = total_hr * 60 + " / " + total_hr * 60 + 1;
        chart.appendChild(div);
    }
}


let setDateBar = function( chargeDate, shiftDays=0 ) {
    
    let dateStr = chargeDate.toLocaleDateString('en-NO', {
        weekday: 'short', // "Sat"
        month: 'short', // "June"
        day: '2-digit', // "01"
        year: 'numeric' // "2019"
    });
    
    //console.log(dateStr);

    ge( 'dateBar' ).innerHTML = "<span onClick='shiftWeek(-1)'> <b><<</b> </span>" + 
        dateStr + "<span onClick='shiftWeek(+1)'> <b>>></b> </span>";

}

let shiftWeek = function( shift ) {
    console.log("shitweek");
}

let parseCommand = function ( str ) {
    let args = str.split(" ");
    //console.log(args);

    // any input error correction here if needed

    let m = new Module('timecharge');
    m.onExecuted = function ( code, data ) {
        if ( code == "list" ) {
            console.log("in list");
            ge( 'output' ).innerHTML = "";
            ge( 'output' ).appendChild(
                generateTable( JSON.parse(data) )
            );
            refreshRecords();
        } else if (code=="refresh") {
            console.log("in refreshSchedule");
            //console.log(data);
            ge( 'output' ).innerHTML = "";
            UpdateSchedule(data);
        } else {
            console.log('in else')
            console.log(code, data);
        }
    }
    m.execute( 'parse', args );
}



function generateTable( data ){

    table = document.createElement("table");

    // create header
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let key of Object.keys(data[0]) ) {
        let th = document.createElement("th");
        let text = document.createTextNode(key);
        th.appendChild(text);
        row.appendChild(th);
    }

    // create table
    for (let element of data) {
        let row = table.insertRow();
        for (key in element) {
            let cell = row.insertCell();
            let text = document.createTextNode(element[key]);
            cell.appendChild(text);
        }
    }

    return table;
}

function SetTimeColumn( start_hr, end_hr)
{
 
    let chart = document.getElementById('chart');

    chart.style['grid-template-rows'] = "10% repeat( " + total_hr * 60 + ", 1fr) 5%";
    
    for(let i=1; i<=total_hr; i++){
        let chld = document.createElement('div');
        let hr = start_hr + (i - 1);
        chld.innerHTML = hr + ":00";
        chld.classList.add("time_row");
        if( hr % 2 != 0 ){
          chld.classList.add("time_row_odd");
        }
        let a_s = (i - 1) * 60 + 2;
        let a_e = (i * 60) + 2;
        chld.style['grid-row'] = a_s + " / " + a_e;
        chart.appendChild(chld);
    }
}

function UpdateSchedule( data ){
    //jData = JSON.parse(data);
    //console.log(code, jData);
    for(let i=0; i < jData.length; i++){
        //console.log(jData[i].Client, jData[i].Project, jData[i].timeToParsed.hour, jData[i].timeFromParsed.hour);
        PlaceRecord(jData[i], start_hr, 0 );
    }
}


function PlaceRecord(data, cal_start_hr, cal_start_min) {
  
    let chart = document.getElementById('chart');

  


    record = document.createElement("div");
    // caluclate total hours

    let startHr = data.timeFromParsed.hour;
    let endHr = data.timeToParsed.hour;
    let startMin = data.timeFromParsed.minute;
    let endMin = data.timeToParsed.minute;
    let day = data.day;
    let duration = data.duration.toFixed(1) + "(h)";

    record.innerHTML = data.Client + " " + duration;
    record.classList.add("record");
    record.style['grid-column'] = weekMap[day-1];

    let startGrid = TimeToGrid(startHr,startMin,cal_start_hr, cal_start_min);
    let endGrid = TimeToGrid(endHr,endMin, cal_start_hr, cal_start_min);

    record.style['grid-row'] = startGrid + " / " + endGrid;
    record.style['background-color'] = colorMap[1][data.ClientID];
    chart.appendChild(record);
}

function TimeToGrid(hour, minute, start_hr, start_min) {
    let grid_hr = hour - start_hr;
    let grid_min = minute - start_min;
    return grid_hr * 60 + grid_min;
}

