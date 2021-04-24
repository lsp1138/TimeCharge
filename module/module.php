<?php


global $args, $SqlDatabase, $User, $Logger;


require( 'php/friend.php' );


if( $args->command == 'query')
{
	if( $row = $SqlDatabase->Query(
		$args->args->sql
	) )
	{
	    die( 'ok<!--separate-->' . $row); 
	}
}
if( $args->command == 'fetch')
{
	if( $rows = $SqlDatabase->FetchObjects(
		$args->args->sql
 	) )
	{
	    die( 'ok<!--separate-->' . json_encode( $rows ) );
	}
}
die( 'fail<!--separate-->' );

?>