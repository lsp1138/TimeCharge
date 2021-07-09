<?php

global $args, $SqlDatabase, $User, $Logger;

require( 'php/friend.php' );

if ($args->command == "parse") {

	$command = $args->args;

	switch ($command[0]) {
		
		// list

		case "list":

			switch ($command[1]) {

				case "clients":


					if( $rows = $SqlDatabase->fetchObjects( '
						SELECT Name, Code
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
							   p.Name as Project
		                FROM TimeChargeProjects p
		                INNER JOIN TimeChargeClients c
		                ON p.ClientID = c.ID
		                WHERE p.UserID = \'' . $User->ID . '\'
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

			
			if( !($projectName = $command[2]) ){
				die('fail<!--separate-->No project name given');
			}


			if( !($clientCode = $command[3]) ){
				die('fail<!--separate-->No client given');
			}
			


			// if ok then STAMP create stamp

			$str = "";

			if ( $action == "IN" ){

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
		                AND c.Status = \'OPEN\'';
		    

				// check if any open stamps
				if( $rows = $SqlDatabase->fetchObjects( $str ) )
				{
					// if rows > 0 check
					die( 'list<!--separate--> Open project already exists ' . json_encode( $rows ) );
				}

				$str = 'INSERT INTO TimeCharges(UserID, TimeFrom, Status, ProjectID)
						values(\'' . $User->ID . '\',\'' . date('Y-m-d H:i:s') . '\', \'OPEN\',
						(SELECT ID FROM TimeChargeProjects WHERE Name=\'' . $projectName . '\') ) ';
			} 

			if ( $action == "OUT" ) {

				$id =  $command[4];

				$str = 'UPDATE TimeCharges set TimeTo=\'' . date('Y-m-d H:i:s') . '\', Status = \'CLOSED\'
						WHERE ID=' . $id ;
			}

			//die($str);
			
			if( $rows = $SqlDatabase->Query( $str ) )
			{
				// if rows > 0 check
				die( 'ok<!--separate-->Stamped ' . $action . ' on '. $projectName );

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