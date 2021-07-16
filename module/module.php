<?php

global $args, $SqlDatabase, $User, $Logger;

require( 'php/friend.php' );

if ($args->command == "getcharges") {
	

	$startDate = strtotime('monday this week');
	$endDate = strtotime('monday next week');

	//die(date('Y-m-d H:i:s', $startDate) . " " .date('Y-m-d H:i:s', $endDate) );

	$str = 'SELECT cc.TimeFrom as TimeFrom,
		    cc.TimeTo as TimeTo,
		    p.Name as Project,
		    c.Code as Client,
		    c.ID as ClientID
			FROM TimeCharges cc
			INNER JOIN TimeChargeProjects p
			ON cc.ProjectID = p.ID
			INNER JOIN TimeChargeClients c
			ON c.ID = p.ClientID
			WHERE TimeFrom>= \'' . date('Y-m-d H:i:s', $startDate) . '\' 
				AND TimeFrom<= \'' . date('Y-m-d H:i:s', $endDate) . '\' 
		  		AND TimeTo>= \'' . date('Y-m-d H:i:s', $startDate) . '\'
		  		AND TimeTo<= \'' . date('Y-m-d H:i:s', $endDate) . '\' 
		  		AND cc.UserID = \'' . $User->ID . '\'';

	if( $rows = $SqlDatabase->fetchObjects( $str ) )
	{
		$resultArray = array();
		foreach($rows as $row){
			$rowArray = array();
			$rowArray['Project'] = $row->Project;
			$rowArray['Client'] = $row->Client;
			$rowArray['ClientID'] = $row->ClientID;
			$rowArray['timeToParsed'] = date_parse($row->TimeTo);
			$rowArray['timeFromParsed'] = date_parse($row->TimeFrom);
			$rowArray['duration'] =  
				( $rowArray['timeToParsed']["hour"] - $rowArray['timeFromParsed']["hour"] ) + 
				( $rowArray['timeToParsed']["minute"] - $rowArray['timeFromParsed']["minute"] ) / 60;
			$rowArray['day'] = (int)date('N', strtotime($row->TimeFrom));
			$rowArray['date'] = $row->TimeFrom;

			// timeTo->format("Y-m-d H:i:s");
			array_push($resultArray, $rowArray);
 			//die(print_r($rowArray, 1));
   		}
		die( 'refresh<!--separate-->' . json_encode($resultArray) );
	}

}



if ($args->command == "parse") {

	$command = $args->args;

	switch ($command[0]) {
		
		// list

		case "list":

			switch ($command[1]) {

				case "clients":


					if( $rows = $SqlDatabase->fetchObjects( '
						SELECT ID, Name, Code
		                FROM TimeChargeClients
		                WHERE UserID = \'' . $User->ID . '\'
					' ) )
				    {
				        die( 'list<!--separate-->' . json_encode( $rows ) );
				    }
				    break;

				case "projects":

					if( $rows = $SqlDatabase->fetchObjects( '
						SELECT c.Name as Client, 
							   c.Code as ClientCode,
							   p.Name as Project,
							   p.ID as ID
		                FROM TimeChargeProjects p
		                INNER JOIN TimeChargeClients c
		                ON p.ClientID = c.ID
		                WHERE p.UserID = \'' . $User->ID . '\'
		                ORDER BY c.Name, p.Name
		            ' ) )
				    {
				        die( 'list<!--separate-->' . json_encode( $rows ) );
				    }
				    break;

				case "charges":


					$str = 	'SELECT ch.ID as ID, 
							   ch.TimeFrom as TimeFrom,
							   ch.TimeTo as TimeTo,
							   ch.Status as Status,
							   ch.ProjectID as ProjectID,
							   p.Name as Project,
							   c.Code as ClientCode,
							   c.Name as Client
		                FROM TimeCharges ch
		                INNER JOIN TimeChargeProjects p
		                ON p.ID = ch.ProjectID
		                INNER JOIN TimeChargeClients c
		                ON c.ID = p.ClientID
		                WHERE ch.UserID = \'' . $User->ID . '\' 
		                ORDER BY ch.TimeFrom DESC, ch.TimeTo DESC';
		         
		            //die($str);

					if( $rows = $SqlDatabase->fetchObjects( $str ) )
				    {
				        die( 'list<!--separate-->' . json_encode( $rows ) );
				    }
				    break;


				default:
					die("fail<!--separate-->No list command given");
					break;
			}
			break;

		// stamp
		
		case "stamp":


			if( !($action = $command[1]) ){
				die('fail<!--separate-->No action given (in/out)');
			}

			
			if( !($projectID = $command[2]) ){
				die('fail<!--separate-->No project ID given');
			}


			// if ok then STAMP create stamp
			
			$str = "";

			if ( $action == "in" ){

				$str = 		'SELECT c.ID as ID, 
							   c.TimeFrom as TimeFrom,
							   p.Name as Project
		                FROM TimeCharges c
		                INNER JOIN TimeChargeProjects p
		                ON c.ProjectID = \'' . $projectID . '\'
		                WHERE p.UserID = \'' . $User->ID .'\' 
		                AND c.Status = \'OPEN\'';    

				// check if any open stamps
				if( $rows = $SqlDatabase->fetchObjects( $str ) )
				{
					die( 'list<!--separate--> Open project already exists ' . json_encode( $rows ) );
				}

				$str = 'INSERT INTO TimeCharges(UserID, TimeFrom, Status, ProjectID)
						values(\'' . $User->ID . '\',\'' . date('Y-m-d H:i:s') . '\', \'OPEN\', \'' . $projectID . '\')';

				//die($str);

				if( $rows = $SqlDatabase->Query( $str ) )
				{
					die( 'ok<!--separate-->Stamped ' . $action . ' on '. $projectID );
				}

			} 

			
			if ( $action == "out" ) {
				
				$str = 		'SELECT c.ID as ID, 
							   c.TimeFrom as TimeFrom,
							   p.Name as Project,
							   cc.Name as Client
		                FROM TimeCharges c
		                INNER JOIN TimeChargeProjects p
		                ON c.ProjectID = p.ID
		                INNER JOIN TimeChargeClients cc
		                ON cc.ID = p.ClientID
		                WHERE p.UserID = \'' . $User->ID .'\' 
		                AND c.Status = \'OPEN\' 
		                AND p.ID = \'' . $projectID . '\'';

		    	// check if any open stamps
				if( $rows = $SqlDatabase->fetchObjects( $str ) )
				{
						
					if ( sizeof($rows) == 1)
					{
						//die(print_r($rows[0],1));
						$str = 'UPDATE TimeCharges 
								SET TimeTo=\'' . date('Y-m-d H:i:s') . '\',
									Status = \'CLOSED\'
								WHERE ID=' . $rows[0]->ID;
						//die($str);
						if( $rows = $SqlDatabase->Query( $str ) )
						{
							die( 'ok<!--separate-->Found open project and stamped ');
						}
					}
				}
				

			}

			break;

		case "delete":


			if( !($id = $command[1]) ){
				die('fail<!--separate-->No ID given');
			}

				

			// if ok then STAMP create stamp

			$str = "";

			$str = 	'DELETE from TimeCharges where ID=' . $id;
		    

			
			if( $rows = $SqlDatabase->Query( $str ) )
			{
				// if rows > 0 check
				die( 'ok<!--separate--> Deleted TimeCharge ' . $id );
			}
			break;


		default:
			die("Command not recognized");
	}
}

die ('fail');

?>