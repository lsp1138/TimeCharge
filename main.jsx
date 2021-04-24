Application.run = function ( msg ) {
    
    let v = new View({
       title: "TimeCharge",
       width: 900,
       height: 500
    });
    
    v.onClose = function(){
        Application.quit();   
    }
    
    v.onLoad = function (){
        log.console('start messing about');
        // go to function in view 
        // set event listeners
        // load database
        // set globals
        // set focus to input field
    }
    
    
    let f = new File('Progdir:Assets/main.html');
    f.onLoad = function( data ){
        v.setContent( data );
    }
    f.load();
    
}


