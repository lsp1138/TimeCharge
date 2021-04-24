Application.run = function ( msg ) {
    
    
    ge('cmdLine').addEventListener('keydown', function (event) {
        if ( event.which==13 ) {
            ParseCommand(this.value);
            this.value = '';
        }
    });
    
    // set globals
    SetTimeColumn( 6, 0, 22);
    PlaceRecord("OD", "Shopsync", "5 / 6", [9,40], [14,30], 6, 0);
    PlaceRecord("HP", "Order project", "4 / 5", [10,20], [12, 30], 6, 0);
    
}


function ParseCommand(command){
    // call back after parseCommand
    
    
    listProjects();
    
    //SendRecord(data);
    // parse the command
    // if then else split
    // define data......{ } 
    // sendRecord ( data )
}



function listProjects(){
    dbQuery(
        'fetch', {
            sql: 'SELECT c.Name as Client, p.Name as Project \
                  FROM TimeChargeClients c \
                  INNER JOIN TimeChargeProjects p \
                  ON c.ID = p.ClientID \
                  GROUP BY c.Name, p.Name'
        }, function ( data ) {
            dataJson = JSON.parse(data);
            let str = 'Clients and Projects';
            for(let a=0; a<dataJson.length; a++){
                 str += '<br>' + dataJson[a].Client + 
                        ' ' + dataJson[a].Project ;
            }
            ge( 'output' ).innerHTML = str;
        } 
    );
}

function dbQuery(command, sql, success, fail){
    let m = new Module( 'timecharge' );
    m.onExecuted = function ( code, data ){
        if ( code == 'ok' ) {
            if ( success && typeof(success) == "function" ) {
                success( data );
            }
        }
        else if ( fail && typeof(fail) == "function" ) {
            fail( data );
        }
    };
    m.execute( command, sql );
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
