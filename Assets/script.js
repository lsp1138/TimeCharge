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

    // Calendar properties
    let start_hr = 6;
    let start_min = 0;
    let end_hr = 22;


    refreshRecords();

    // Initialize default view
    SetTimeColumn( start_hr, start_min, end_hr);

    let test = {
        "Client": "TestClient",
        "Project": "TestProject",
        "timeFromParsed": {
            "hour": 14,
            "min": 10
        },
        "timeToParsed": {
            "hour": 16,
            "min": 35
        },
        "day": 4
    }
    PlaceRecord(test, start_hr, start_min);
    // PlaceRecord("HP", "Order project", "4 / 5", [10,20], [12, 30], 6, 0);
}

// set a project bar 

let refreshRecords = function () {
    // get all this weeks (by default) records
    let m = new Module("timecharge");
    m.onExecuted = function (code, data) {
        if ( code=="ok" ) {
            // console.log(data);
            jData = JSON.parse(data);
            console.log(code, jData);
            for(let i=0; i < jData.length; i++){
                //console.log(jData[i].Client, jData[i].Project, jData[i].timeToParsed.hour, jData[i].timeFromParsed.hour);
                PlaceRecord(jData[i], 6, 0 );
            }

        } else {
            console.log(code, data);
        }
    }
    m.execute('getcharges');
}


let setDateBar = function( chargeDate, shiftDays=0 ) {
    
    let dateStr = chargeDate.toLocaleDateString('en-NO', {
        weekday: 'short', // "Sat"
        month: 'short', // "June"
        day: '2-digit', // "01"
        year: 'numeric' // "2019"
    });
    
    console.log(dateStr);

    ge( 'dateBar' ).innerHTML = "<span onClick='shiftWeek(-1)'> <b><<</b> </span>" + 
        dateStr + "<span onClick='shiftWeek(+1)'> <b>>></b> </span>";

}

let shiftWeek = function( shift ) {
    console.log(shift);    
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
        } else if (code=="ok") {
            console.log("in ok");
            ge( 'output').innerHTML = data;
        } else {
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
    let total_hr = end_hr - start_hr;
    chart = document.getElementById('chart');
    
    for(let i=1; i<=total_hr; i++){
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

//PlaceRecord("OD", "Shopsync", "5 / 6", [9,40], [14,30], 6, 0);

function PlaceRecord(data, cal_start_hr, cal_start_min) {
  
    let weekMap = [ 
        "3 / 4",
        "4 / 5",
        "5 / 6",
        "6 / 7",
        "7 / 8",
        "8 / 9",
        "9 / 10"
    ];

    record = document.createElement("div");
    // caluclate total hours

    let startHr = data.timeFromParsed.hour;
    let endHr = data.timeToParsed.hour;

    let startMin = data.timeFromParsed.minute;
    let endMin = data.timeToParsed.minute;

    let day = data.day;

    console.log(data);

    let duration = (
            (endHr - startHr)  + (endMin - startMin)/60
        ).toFixed(2) + " hours";

    record.innerHTML = data.Client + " " + data.Project + " " + duration;
    record.classList.add("record");
    console.log(weekMap[day-1]);
    record.style['grid-column'] = weekMap[day-1];

    let startGrid = TimeToGrid(startHr,startMin,cal_start_hr, cal_start_min);
    let endGrid = TimeToGrid(endHr,endMin, cal_start_hr, cal_start_min);

    record.style['grid-row'] = startGrid + " / " + endGrid;
    chart.appendChild(record);
}

function TimeToGrid(hour, minute, start_hr, start_min) {
    let grid_hr = hour - start_hr;
    let grid_min = minute - start_min;
    return grid_hr * 60 + grid_min;
}

