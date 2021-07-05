<?php

global $args, $SqlDatabase, $User, $Logger;

require( 'php/friend.php' );

if ($args->command == "parse") {

	$command = $args->args;

	switch ($command[0]) {
		
		case "list":

			switch ($command[1]) {

				case "clients":

					if( $rows = $SqlDatabase->fetchObjects( '
						SELECT *
		                FROM TimeChargeClients
		                WHERE UserID = \'' . $User->ID . '\'
					' ) )
				    {
				        die( 'ok<!--separate-->' . json_encode( $rows ) );
				    }
				    break;

				case "projects":

					if( $rows = $SqlDatabase->fetchObjects( '
						SELECT *
		                FROM TimeChargeProjects
		                WHERE UserID = \'' . $User->ID . '\'
		            ' ) )
				    {
				        die( 'ok<!--separate-->' . json_encode( $rows ) );
				    }
				    break;

				default:
					die("No list command given");
					break;
			
			}
			break;
		
		case "bill":
			
			die("in bill");
			$commandData = $args->args[1];
			if( !$commandData ) {
				die("fail<!--separate-->no data in parse command");
			}
			break;

		default:
			die("Command not recognized");

	}
}

die ('fail');

?>