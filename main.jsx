Application.run = function ( msg ) {
    
    let v = new View({
       title: "TimeCharge",
       width: 900,
       height: 500
    });
    
    v.onClose = function(){
        Application.quit();   
    }
    
    let f = new File('Progdir:Assets/main.html');
    f.onLoad = function( data ){
        v.setContent( data );
    }
    f.load();  
}


