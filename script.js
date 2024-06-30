
// accessing html items
const ball = document.getElementById("ball");    
const upperbar = document.getElementById('upper');
const lowerBar = document.getElementById('lower');
const upperScore = document.getElementById('upper-score');
const lowerScore = document.getElementById('lower-score');

// styling to ball
// ball.style.margin = "250px 0px 0px 620px";

// variables 
var interval;
var score = 0;
let PerName;       // it will store the name of person ; 

// speed variables
var vx = 2; 
var vy = 2;

// initial paddle left 
// window.innerwidth automatically calucluates the width of the window of the user's computer

// l bta ra h kya ki , initially dono paddle(bar) khaan h 
var l = window.innerWidth / 2  - 75 ; // taaki center mein aa jaaye ek baar ; 
var v ;

var a ; // for paddle speed

// java script se hum css change kar re hain , isliye .style kara h agar html change kar re hote toh 
// . innerhtml karte ; 


//<--------------------------------INITIAL KYA HOGI USKE LIYE YE 6 LINE HAI -------------->
// string mein dena hota h isliye "px" aise likha h 
ball.style.marginLeft =  l + 65 +  "px"; // taaki left se ek dum bich mein aa jaye ; 
ball.style.marginTop = innerHeight/2 - 10 + "px";
upperbar.style.left =  l + "px";
upperbar.style.top =   "30px";
lowerBar.style.left =  l + "px";
lowerBar.style.top =  innerHeight - 30 + "px";


// for handling multiple collision
let collision = true;

// for knowing is first game or not
let isFirstGame = true;

// fucntion for first game
function newGame(){
    // input name
    PerName = window.prompt("Enter your name");
    // object for local storage
    let obj = { "name": PerName, "score": 0 };
    // convert obj to string (setItem only take string)


    // local storage , inspect mein jaakar , appliation par dikhta h

    //-------------------------------------------------------------IMPORTANT--------------------------------
    // local storage chrome provide karta h , aur ye values tab tak store hongi jab tak refresh na kar lo ; ya
    // lets say sessoion expire nhi ho jaata ; (iski 2 proprtires main hoti hai, getItem , setItem )


    // JSON java script object hota h , JSON.Stringify uper wale obj ko string bna ra h , kyonki local storage
    // string store kar sakta h , object nhi , isliye uper wale object ko string mein convert kar re ahin 
    localStorage.setItem('player', JSON.stringify(obj));

    // variable for speed
    v =  parseInt(prompt("Enter level "));

    if( v == 2)
    {
        a = 20 ; 
    }
    else if(v == 3)
    {
        
        a = 30 ; 
    }
    else if(v == 4)
    {
        a = 35; 
    }

    vx = v;
    vy = v;
}

// start game function which initialise interval
function start() {   
    // getItem from localstorage (it also returns string)         


    // now humne local storage mein string saver karwayi thi ab us string ko dubara JSON( JAVA OBJECT) bnane ke liye 
    // niche wala step liya h 
    var data = JSON.parse(localStorage.getItem('player'));

    //starting mein default value , true thi first game ki ; 
    if(isFirstGame){
        alert("This is you first game !! Good Luck");
        isFirstGame = false; 
    }
    else{
        alert("Previous max score of " + data.name + " " + data.score);
    }
    
    playSound("Game begin.mpeg") ; 
    // interval 

    // ball ki movement is function se start ho ri h ; 

    // seTime out , 100 ms humne jaise yahaan diya h toh , toh itne milliSecond baad game start karega ; means
    // itne time baad function start karega ; 
    setTimeout(function(){

        // setInterval means har 10 ms baad karta rahega , means ye continuously start karta rahega ; 
        // niche wala setInterval (java script ka inbuilt function hai) ; jo move function har 10 sec mein 
        // move function call kar ra h 

        interval = setInterval(move, 10);
    },500);
    
}

// function for reset the paddle and ball after ending game
function reset() {
    // clear the interval
    clearInterval(interval);
    // initialise all value form start
    score = 0;
    // vx = v;
    // vy = v;
    l = innerWidth /2 - 75 ;
    ball.style.marginLeft =  l + 65 +  "px";
    ball.style.marginTop = innerHeight/2 - 10 + "px";
    upperbar.style.left =  l + "px";
    lowerBar.style.left =  l + "px";
    // collision = true;

    // reccursive call to start
    start();
}


function playSound(audioName)
{
    let audio = new Audio(audioName) ; 
    audio.play() ; 
}
// ball move function   (main function of our code) ;
function move() {
    // cordinates of ball and paddles

    // https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
    // getBoundingClientRect will return a object which will have 6 - 8 values ; like ki top se wo kitni dur hai ;
    // aur uska niche wala kitni dur h ; 

    let cordinates = ball.getBoundingClientRect();
    let upperCord = upperbar.getBoundingClientRect();
    let lowerCord = lowerBar.getBoundingClientRect();


    let x = cordinates.x; // ye bas shortcut h taaki baar baar coordinate.x na use karna padhe
    let y = cordinates.y;

    // FAIL condition---------------

    if (y >= lowerCord.bottom  || cordinates.bottom <= upperCord.top) {

        // playSound("Game over.mpeg") ; 


        let data = JSON.parse(localStorage.getItem('player'));
        // update max score if needed    

        ///if we want to show current score also , then add another alert 
        // ie alert('current score'  +  score)
        
        if (data.score < score) {
            let obj = { "name": PerName, "score": score };
            localStorage.setItem('player', JSON.stringify(obj));
            window.alert("New high score " + score);
        }

        else{
            alert("Your score " + score);
        }
        // reset function

        
        reset();
        return;
    }


    // if lower paddle touch
    if (cordinates.bottom >= lowerCord.top) {
        if (cordinates.right > lowerCord.left && cordinates.left < lowerCord.right && collision) {

            // playSound("ballHit2.mp3") ;
            playSound("hitting sound.mpeg") ;  
            vy = -1 * vy;
            score++;
            console.log("lower");
            collision = false;

            lowerScore.style.display= "block";
            setTimeout(() => {
                lowerScore.style.display= "none";
            }, 1000);
            collision = false;
        }
    }

    // if upper paddle touch 
    if (cordinates.top <= upperCord.bottom) {
        if (cordinates.left > upperCord.left && cordinates.left < upperCord.right && !collision) {
           
            playSound("hitting sound.mpeg") ; 
            vy = -1 * vy;
            score++;
            collision = true;
          
            upperScore.style.display= "block";
            setTimeout(() => {
                upperScore.style.display= "none";
            }, 1000);
            
        }
    }

    // if right touch
    if (cordinates.right >= window.innerWidth) {
         

        vx = -1 * vx;
    }
    // if left side touch
    if (x <= 0) {
         
        vx = -1 * vx;
    }


    // make ball move by inc / dec margins to left and top
    ball.style.marginLeft = x + vx + 'px';
    ball.style.marginTop = y + vy + 'px';
}


// make paddle move by left and right arrow keys

// document matlab pura page ; 

document.addEventListener('keydown', function (event) {
    // key value and max left value

    // right arrow ka keycode 39 hota h 

    // ye isliye kara h taaki thoda sa bhi bar ka hissa screen ke bhaar na jaaye ;  l <= innerWidth - 170
    if (event.keyCode == 39 && l <= window.innerWidth - (150+a)) {
        upperbar.style.left = l + a + 'px';
        lowerBar.style.left = l + a + 'px';
        l += a ;
    }
    // key value and min left value
    else if (event.keyCode == 37 && l >= a) {
        upperbar.style.left = l - a + 'px';
        lowerBar.style.left = l - a + 'px';
        l -= a ;
    }
    
});

// <------------------------------------Game start hone ke baad wo initial value set hogni uper wali fir seedha function ka/
// control yahaan aa jayga ----------------------------------->

// call new game 
newGame();

// start game
start();