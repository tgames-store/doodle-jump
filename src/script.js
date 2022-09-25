// RequestAnimFrame: a browser API for getting smooth animations
window.requestAnimFrame = ( function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

// todo: Исправить внешний вид методов

var canvas = document.getElementById('canvas'),
ctx = canvas.getContext('2d');

const playButton = document.getElementById('start-button');
let handlePlayButton = playButton.addEventListener('click', init);

const resetButton =  document.getElementById('reset');
resetButton.addEventListener('click', reset);

const skipButton = document.getElementById('skip-button');
skipButton.addEventListener('click', showGoMenu);

const watchAdsButton = document.getElementById('watch-ads-button');
watchAdsButton.addEventListener('click', handleWatchAds);

const containerButton = document.querySelector('.btn-container');
var continueMenu = document.getElementById("continue-menu");
var gameOverMenu = document.getElementById("gameOverMenu");

// var width = 422,
// height = 552;
let width = Math.min(window.innerWidth, 500);
let height = window.innerHeight;
let listenerResize;
let spareLife = true;
let countShowAds = 3;
let timeoutAds;
let continueGame = false;

listenerResize = window.addEventListener('resize', handleResize)
function handleResize() {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    width = Math.min(window.innerWidth, 500);
    height = window.innerHeight;
}

function handleWatchAds() {
    try {
        tgames.showRewardedAd()
            .then(() => {
                reset();
            })
        spareLife = false;
        continueGame = true;
        clearTimeout(timeoutAds);
    } catch (e) {
        console.log(e)

        spareLife = false;
        continueGame = true;

        reset();
        clearTimeout(timeoutAds);
    }

    countShowAds--;
}

canvas.width = width;
canvas.height = height;

//Variables for game
var platforms = [],
image = document.getElementById("sprite"),
player, platformCount = 10,
position = 0,
gravity = 0.2,
animloop,
flag = 0,
menuloop, broken = 0,
dir, score = 0, firstRun = true;

//Base object
var Base = function() {
    this.height = 5;
    this.width = width;

    //Sprite clipping
    this.cx = 0;
    this.cy = 614;
    this.cwidth = 100;
    this.cheight = 5;

    this.moved = 0;

    this.x = 0;
    this.y = height - this.height;

    this.draw = function() {
        try {
            ctx.drawImage(
                image,
                this.cx,
                this.cy,
                this.cwidth,
                this.cheight,
                this.x,
                this.y,
                this.width,
                this.height
            );
        } catch (e) {}
    };
};

var base = new Base();

//Player object
var Player = function() {
    this.vy = 11;
    this.vx = 0;

    this.isMovingLeft = false;
    this.isMovingRight = false;
    this.isDead = false;

    this.width = 55;
    this.height = 40;

    //Sprite clipping
    this.cx = 0;
    this.cy = 0;
    this.cwidth = 110;
    this.cheight = 80;

    this.dir = "left";

    this.x = width / 2 - this.width / 2;
    this.y = height;

    //Function to draw it
    this.draw = function() {
        try {
            if (this.dir == "right") {
                this.cy = 121;
            } else if (this.dir == "left") {
                this.cy = 201;
            } else if (this.dir == "right_land") {
                this.cy = 289;
            } else if (this.dir == "left_land") {
                this.cy = 371;
            }

            ctx.drawImage(
                image,
                this.cx,
                this.cy,
                this.cwidth,
                this.cheight,
                this.x,
                this.y,
                this.width,
                this.height
            );
        } catch (e) {}
    };

    this.jump = function() {
        this.vy = -8;
        // document.getElementById('audio').innerHTML='<audio src="sounds/jump.mp3" preload="auto" autoplay autobuffer></audio>'
    };

    this.jumpHigh = function() {
        this.vy = -16;
        // document.getElementById('audio').innerHTML='<audio src="sounds/jump.mp3" preload="auto" autoplay autobuffer></audio>'
    };
};

player = new Player();

//Platform class

function Platform() {
    this.width = 70;
    this.height = 17;

    this.x = Math.random() * (width - this.width);
    this.y = position;

    position += (height / platformCount);

    this.flag = 0;
    this.state = 0;

    //Sprite clipping
    this.cx = 0;
    this.cy = 0;
    this.cwidth = 105;
    this.cheight = 31;

    //Function to draw it
    this.draw = function() {
        try {
            if (this.type == 1) {
                this.cy = 0;
            } else if (this.type == 2) {
                this.cy = 61;
            } else if (this.type == 3 && this.flag === 0) {
                this.cy = 31;
            } else if (this.type == 3 && this.flag == 1) {
                this.cy = 1000;
            } else if (this.type == 4 && this.state === 0) {
                this.cy = 90;
            } else if (this.type == 4 && this.state == 1) {
                this.cy = 1000;
            }

            ctx.drawImage(
                image,
                this.cx,
                this.cy,
                this.cwidth,
                this.cheight,
                this.x,
                this.y,
                this.width,
                this.height
            );
        } catch (e) {}
    };

    //Platform types
    //1: Normal
    //2: Moving
    //3: Breakable (Go through)
    //4: Vanishable
    //Setting the probability of which type of platforms should be shown at what score
    if (score >= 5000) {
        this.types = [2, 3, 3, 3, 4, 4, 4, 4];
    } else if (score >= 2000 && score < 5000) {
        this.types = [2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4];
    } else if (score >= 1000 && score < 2000) {
        this.types = [2, 2, 2, 3, 3, 3, 3, 3];
    } else if (score >= 500 && score < 1000) {
        this.types = [1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3];
    } else if (score >= 100 && score < 500) {
        this.types = [1, 1, 1, 1, 2, 2];
    } else {
        this.types = [1];
    }

    this.type = this.types[Math.floor(Math.random() * this.types.length)];

    //We can't have two consecutive breakable platforms otherwise it will be impossible to reach another platform sometimes!
    if (this.type == 3 && broken < 1) {
        broken++;
    } else if (this.type == 3 && broken >= 1) {
        this.type = 1;
        broken = 0;
    }

    this.moved = 0;
    this.vx = 1;
}

for ( var i = 0; i < platformCount; i++ ) {
    platforms.push(new Platform());
}

//Broken platform object
var Platform_broken_substitute = function() {
    this.height = 30;
    this.width = 70;

    this.x = 0;
    this.y = 0;

    //Sprite clipping
    this.cx = 0;
    this.cy = 554;
    this.cwidth = 105;
    this.cheight = 60;

    this.appearance = false;

    this.draw = function() {
        try {
            if (this.appearance === true) {
                ctx.drawImage(
                    image,
                    this.cx,
                    this.cy,
                    this.cwidth,
                    this.cheight,
                    this.x,
                    this.y,
                    this.width,
                    this.height
                );
            } else {
                return;
            }
        } catch (e) {}
    };
};

var platform_broken_substitute = new Platform_broken_substitute();

//Spring Class
var spring = function() {
    this.x = 0;
    this.y = 0;

    this.width = 26;
    this.height = 30;

    //Sprite clipping
    this.cx = 0;
    this.cy = 0;
    this.cwidth = 45;
    this.cheight = 53;

    this.state = 0;

    this.draw = function() {
        try {
            if (this.state === 0) {
                this.cy = 445;
            } else if (this.state == 1) {
                this.cy = 501;
            }

            ctx.drawImage(
                image,
                this.cx,
                this.cy,
                this.cwidth,
                this.cheight,
                this.x,
                this.y,
                this.width,
                this.height
            );
        } catch (e) {}
    };
};

var Spring = new spring();

function init() {
    tgames.gameStarted();
    document.getElementById('start-menu').style.display = 'none';
    // document.removeEventListener('click', handlePlayButton);
    handleResize();

    //Variables for the game
    let	dir = "left",
    jumpCount = 0;

    const leftButton = document.getElementById('left-btn');
    const rightButton = document.getElementById('right-btn');
    containerButton.style.display = 'flex';
    firstRun = false;

    //Function for clearing canvas in each consecutive frame

    function paintCanvas() {
        ctx.clearRect(0, 0, width, height);
    }

    function handleKeydown(event) {
        var key = event.keyCode;

        if (key == 37) {
            dir = "left";
            player.isMovingLeft = true;
        } else if (key == 39) {
            dir = "right";
            player.isMovingRight = true;
        }

        if (key == 32) {
            if ( firstRun === true ) {
                init();
            } else {
                reset();
            }
        }
    };

    function handleKeyup(event) {
        var key = event.keyCode;

        if (key == 37) {
            dir = "left";
            player.isMovingLeft = false;
        } else if (key == 39) {
            dir = "right";
            player.isMovingRight = false;
        }
    };

    function handleTouchStart(event, side) {
        event.preventDefault();
        if (side === 'left') {
            leftButton.style.background = 'red';
            dir = "left";
            player.isMovingLeft = true;
        } else if (side === 'right')  {
            rightButton.style.background = 'red';
            dir = "right";
            player.isMovingRight = true;
        }
    }

    function handleTouchEnd(event, side) {
        event.preventDefault();
        if (side === 'left') {
            leftButton.style.background = 'darkgrey';
            dir = "left";
            player.isMovingLeft = false;
        } else if (side === 'right'){
            rightButton.style.background = 'darkgrey';
            dir = "right";
            player.isMovingRight = false;
        }
    }

    // Player related calculations and functions

    function playerCalc() {
        if (dir == "left") {
            player.dir = "left";
            if (player.vy < -7 && player.vy > -15) {
                player.dir = "left_land";
            }
        } else if (dir == "right") {
            player.dir = "right";
            if (player.vy < -7 && player.vy > -15) {
                player.dir = "right_land";
            }
        }

        // add controls with keyboard
        document.onkeydown = handleKeydown;
        document.onkeyup = handleKeyup;

        // add btn controls for mobile
        leftButton.addEventListener('touchstart', (event) => handleTouchStart(event, 'left'));
        rightButton.addEventListener('touchstart', (event) => handleTouchStart(event, 'right'));

        leftButton.addEventListener('touchend', (event) => handleTouchEnd(event, 'left'));
        rightButton.addEventListener('touchend', (event) => handleTouchEnd(event, 'right'));

        // Accelerations produces when the user hold the keys
        if (player.isMovingLeft === true) {
            player.x += player.vx;
            player.vx -= 0.15;
        } else {
            player.x += player.vx;
            if ( player.vx < 0 ) {
                player.vx += 0.1;
            }
        }

        if (player.isMovingRight === true) {
            player.x += player.vx;
            player.vx += 0.15;
        } else {
            player.x += player.vx;
            if (player.vx > 0) {
                player.vx -= 0.1;
            }
        }

        //Jump the player when it hits the base
        if ((player.y + player.height) > base.y && base.y < height) {
            player.jump();
        }

        // Gameover if it hits the bottom
        if (base.y > height && (player.y + player.height) > height && player.isDead != "lol") {
            player.isDead = true;
            // document.getElementById('audio').innerHTML='<audio src="sounds/jump.mp3" preload="auto" autoplay autobuffer></audio>'
        }

        // Make the player move through walls
        if (player.x > width) {
            player.x = 0 - player.width;
        } else if (player.x < 0 - player.width) {
            player.x = width;
        }

        // Movement of player affected by gravity
        if (Math.ceil(player.y) >= Math.floor(height / 2 - player.height / 2)) {
            player.y += player.vy;
            player.vy += gravity;
        } else {
            //When the player reaches half height, move the platforms to create the illusion of scrolling and recreate the platforms that are out of viewport...
            platforms.forEach(function(p, i) {
                if (player.vy < 0) {
                    p.y -= player.vy;
                }

                if (p.y > height) {
                    platforms[i] = new Platform();
                    platforms[i].y = p.y - height;
                }

            });

            base.y -= player.vy;
            player.vy += gravity;

            if ( player.vy >= 0 ) {
                player.y += player.vy;
                player.vy += gravity;
            }

            if (!(Math.ceil(player.y + 2) >= Math.floor(height / 2 - player.height / 2))) {
                score++;
            }
        }

        //Make the player jump when it collides with platforms
        collides();

        if (player.isDead === true) {
            gameOver();
        }
    }

    //Spring algorithms

    function springCalc() {
        var s = Spring;
        var p = platforms[0];

        if (p.type == 1 || p.type == 2) {
            s.x = p.x + p.width / 2 - s.width / 2;
            s.y = p.y - p.height - 10;

            if (s.y > height / 1.1) {
                s.state = 0;
            }

            s.draw();
        } else {
            s.x = 0 - s.width;
            s.y = 0 - s.height;
        }
    }

    //Platform's horizontal movement (and falling) algo

    function platformCalc() {
        var subs = platform_broken_substitute;

        platforms.forEach(function(p, i) {
            if (p.type == 2) {
                if (p.x < 0 || p.x + p.width > width) {
                    p.vx *= -1;
                }

                p.x += p.vx;
            }

            if (p.flag == 1 && subs.appearance === false && jumpCount === 0) {
                subs.x = p.x;
                subs.y = p.y;
                subs.appearance = true;

                jumpCount++;
            }

            p.draw();
        });

        if (subs.appearance === true) {
            subs.draw();
            subs.y += 8;
        }

        if (subs.y > height) {
            subs.appearance = false;
        }
    }

    function collides() {
        //Platforms
        platforms.forEach(function(p, i) {
            if (
                player.vy > 0 &&
                p.state === 0 &&
                (player.x + 15 < p.x + p.width) &&
                (player.x + player.width - 15 > p.x) &&
                (player.y + player.height > p.y) &&
                (player.y + player.height < p.y + p.height)
            ) {
                if (p.type == 3 && p.flag === 0) {
                    p.flag = 1;
                    jumpCount = 0;

                    return;
                } else if (p.type == 4 && p.state === 0) {
                    player.jump();
                    p.state = 1;
                } else if (p.flag == 1) {
                    return;
                } else {
                    player.jump();
                }
            }
        });

        //Springs
        var s = Spring;
        if (player.vy > 0 &&
            (s.state === 0) &&
            (player.x + 15 < s.x + s.width) &&
            (player.x + player.width - 15 > s.x) &&
            (player.y + player.height > s.y) &&
            (player.y + player.height < s.y + s.height)
        ) {
            s.state = 1;
            player.jumpHigh();
        }

    }

    function updateScore() {
        var scoreText = document.getElementById("score");
        scoreText.innerHTML = score;
    }

    function gameOver() {
        tgames.gameOver( score );
        // tgames.showRewardedAd();

        containerButton.style.display = 'none';
        platforms.forEach(function(p, i) {
            p.y -= 12;
        });

        if ( player.y > height/2 && flag === 0 ) {
            player.y -= 8;
            player.vy = 0;
        } else if (player.y < height / 2 ) {
            flag = 1;
        } else if ( player.y + player.height > height ) {
            if (spareLife) {
                showContinueMenu();

                spareLife = false;
            } else {
                showGoMenu();
            }
            hideScore();
            player.isDead = "lol";
        }
    }

    //Function to update everything

    function update() {
        paintCanvas();
        platformCalc();

        springCalc();

        playerCalc();
        player.draw();

        base.draw();

        updateScore();
    }

    menuLoop = function(){
        return;
    };

    animloop = function() {
        update();
        requestAnimFrame(animloop);
    };

    animloop();

    hideMenu();
    showScore();
}

function reset() {
    containerButton.style.display = 'flex';
    document.getElementById('reset-menu').style.display = 'none';

    hideGoMenu();
    showScore();
    player.isDead = false;

    flag = 0;
    position = 0;
    if (!continueGame) {
        score = 0;
        tgames.gameStarted();
    }

    continueGame = false;

    base = new Base();
    player = new Player();
    Spring = new spring();
    platform_broken_substitute = new Platform_broken_substitute();

    platforms = [];
    for (var i = 0; i < platformCount; i++) {
        platforms.push(new Platform());
    }
}

//Hides the menu
function hideMenu() {
    var menu = document.getElementById("mainMenu");
    menu.style.zIndex = -1;
}

//Shows the game over menu
function showGoMenu() {
    continueMenu.style.zIndex = -1;
    continueMenu.style.display = "none";
    clearTimeout(timeoutAds);
    spareLife = true;

    document.getElementById('line').style.display = 'none';
    document.getElementById('reset-menu').style.display = 'flex';
    document.getElementById('reset-button')
        .addEventListener('click', reset)

    if (countShowAds === 0 || countShowAds < 0) {
        tgames.showRewardedAd();
        countShowAds = 3;
    }

    var scoreText = document.getElementById("go_score");
    scoreText.innerHTML = "Ваш результат " + score + " очков!";
    countShowAds--;
}

function showContinueMenu() {
    continueMenu.style.zIndex = 1;
    continueMenu.style.display = "flex";

    document.getElementById('line').style.display = 'block';

    timeoutAds = setTimeout(() => {
        showGoMenu();
    },8000);
}

//Hides the game over menu
function hideGoMenu() {
    continueMenu.style.zIndex = -1;
    continueMenu.style.display = "flex";

    gameOverMenu.style.zIndex = -1;
    gameOverMenu.style.visibility = "hidden";
}

//Show ScoreBoard
function showScore() {
    var menu = document.getElementById("scoreBoard");
    menu.style.zIndex = 1;
}

//Hide ScoreBoard
function hideScore() {
    var menu = document.getElementById("scoreBoard");
    menu.style.zIndex = -1;
}

function playerJump() {
    player.y += player.vy;
    player.vy += gravity;

    if (player.vy > 0 &&
        (player.x + 15 < 260) &&
        (player.x + player.width - 15 > 155) &&
        (player.y + player.height > 475) &&
        (player.y + player.height < 500)
    ) {
        player.jump();
    }

    if (dir == "left") {
        player.dir = "left";
        if (player.vy < -7 && player.vy > -15) {
            player.dir = "left_land";
        }
    } else if (dir == "right") {
        player.dir = "right";
        if (player.vy < -7 && player.vy > -15) {
            player.dir = "right_land";
        }
    }

    //Adding keyboard controls
    document.onkeydown = function(e) {
        var key = e.keyCode;

        if (key == 37) {
            dir = "left";
            player.isMovingLeft = true;
        } else if (key == 39) {
            dir = "right";
            player.isMovingRight = true;
        }

        if(key == 32) {
            if ( firstRun === true ) {
                init();
                firstRun = false;
            } else {
                reset();
            }
        }
    };

    document.onkeyup = function(e) {
        var key = e.keyCode;

        if (key == 37) {
            dir = "left";
            player.isMovingLeft = false;
        } else if (key == 39) {
            dir = "right";
            player.isMovingRight = false;
        }
    };

    //Accelerations produces when the user hold the keys
    if (player.isMovingLeft === true) {
        player.x += player.vx;
        player.vx -= 0.15;
    } else {
        player.x += player.vx;
        if (player.vx < 0) {
            player.vx += 0.1;
        }
    }

    if (player.isMovingRight === true) {
        player.x += player.vx;
        player.vx += 0.15;
    } else {
        player.x += player.vx;
        if (player.vx > 0) {
            player.vx -= 0.1;
        }
    }

    // Jump the player when it hits the base
    if ((player.y + player.height) > base.y && base.y < height) {
        player.jump();
    }

    // Make the player move through walls
    if (player.x > width) {
        player.x = 0 - player.width;
    } else if (player.x < 0 - player.width) {
        player.x = width;
    }

    player.draw();
}

function update() {
    ctx.clearRect(0, 0, width, height);
    // playerJump();
}

menuLoop = function() {
    update();
    requestAnimFrame(menuLoop);
};

menuLoop();
hideMenu();












let premissionGranted = false;

if (window.DeviceOrientationEvent) {
    // Мы узнали, что у пользователя есть доступ к гироскопу
    if (typeof(DeviceOrientationEvent) !== 'undefined' && typeof(DeviceOrientationEvent.requestPermission) === 'function') {
        // Ios 13 device
        // Теперь нам нужно попросить у него доступ
        document.getElementById('alpha').addEventListener('click', requestAccess);
    } else {
        // Not ios 13 device
    }
}

function requestAccess() {
    DeviceOrientationEvent.requestPermission()
        .then(response => {
            alert(response)
            if (response == 'granted') {
                premissionGranted = true;
                window.addEventListener('deviceorientation', handleFunc, false);
            }
        })
        .catch(error => console.log(error))
}

function handleFunc(event) {
    if (!premissionGranted) {
        return;
    }
    let alpha = event.alpha;
    let beta = event.beta;
    let gamma = event.gamma;
    console.log('device!')

    document.getElementById('alpha').innerHTML = `alpha - ${alpha}`;
    document.getElementById('betta').innerHTML = `gamma - ${beta}`;
    document.getElementById('gamma').innerHTML = `betta - ${gamma}`;
}
