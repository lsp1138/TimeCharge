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

    // Initialize default view
    SetTimeColumn( start_hr, start_min, end_hr);
    PlaceRecord("OD", "Shopsync", "5 / 6", [9,40], [14,30], 6, 0);
    PlaceRecord("HP", "Order project", "4 / 5", [10,20], [12, 30], 6, 0);
}

// set a project bar 

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
    console.log(args);

    // any input error correction here if needed

    let m = new Module('timecharge');
    m.onExecuted = function ( code, data ) {
        if ( code == "ok" ) {
            printOut( data );
        } else {
            console.log( "in else ", code, data );
        }
    }
    m.execute( 'parse', args );
}



function printOut( str ) {
    ge( 'output' ).innerHTML = str;
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

function PlaceRecord(client, description, day, 
                     start, end, start_hr, start_min) {
    record = document.createElement("div");
    let total_hrs = (
            end[0] - start[0] + (end[1] - start[1])/60
        ).toFixed(2) + " hours";
    record.innerHTML = client + " " + 
        description + " " + total_hrs;
    record.classList.add("record");
    record.style['grid-column'] = day;
    record.style['grid-row'] = TimeToGrid(start[0],start[1],start_hr, start_min) + 
    " / " + TimeToGrid(end[0],end[1], start_hr, start_min);
    chart.appendChild(record);
}

function TimeToGrid(hour, minute, start_hr, start_min) {
    let grid_hr = hour - start_hr;
    let grid_min = minute - start_min;
    return grid_hr * 60 + grid_min;
}

