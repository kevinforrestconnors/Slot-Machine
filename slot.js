// Slot Machine -- Kevin Connors 2013

$(function() {

    // Vars 
    var i = 0; // General increments
    var j = 0;
    var k = 0;            
    var c = document.getElementById('machineWindow').getContext('2d');
    c.width = 800;
    c.height = 300;
    var image = {
        height: 200,
        width: 250,
    }
    var slotArray = [
        [],
        [],
        []
    ];
    var slotWheel = {
        1: [],
        2: [],
        3: [],
        position: [0,0,0],
    };
    var currentObj = {
        1: 2,
        2: 2,
        3: 2,
    };
    
    var game = false; // Slots spinning?

    // General functions

    function randomInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // Draw initial slots
    for (i = 1; i < 7; i += 2) { // omg first time I have used a bigger increment than i++
        $("canvas").drawImage({
            source: "slot7.png",
            x: (125 * i) + 25,
            y: 150,
        });
    } // draw 3 7s
    
    $("canvas").drawImage({
        source: "slotmelon.png",
        x: 150,
        y: -50,
    });
    
    $("canvas").drawImage({
        source: "slotcherry.png",
        x: 400,
        y: -50,
    });
        
    $("canvas").drawImage({
        source: "slotbells.png",
        x: 650,
        y: -50,
    }); // melon cherry bells on top
    
    $("canvas").drawImage({
        source: "slotredgem.png",
        x: 150,
        y: 350,
    });
    
    $("canvas").drawImage({
        source: "slotgreengem.png",
        x: 400,
        y: 350,
    });
    
    $("canvas").drawImage({
        source: "slotbluegem.png",
        x: 650,
        y: 350,
    }); // 3 gems on bottom
    

    // Slot objects

    var slot = {

        1: {

            num: 1,
            x: 150,
            y: 0,
            speed: 0,
            obj: 0,
            img: 'slot7.png',

        },

        2: {

            num: 2,
            x: 400,
            y: 0,
            speed: 0,
            obj: 0,
            img: 'slot7.png',

        },

        3: {

            num: 3,
            x: 650,
            y: 0,
            speed: 0,
            obj: 0,
            img: 'slot7.png',

        },

    }; // end slot obj

    var prizes = {

        'seven': {

            points: 100,
            mult: 7,
            img: 'slot7.png',
            type: 'points',
            name: 'Lucky 7',

        },

        'bar': {

            points: 2000,
            mult: 2,
            img: 'slotbar.png',
            type: 'points',
            name: 'BAR',

        },

        'bells': {

            points: 0,
            mult: 8,
            img: 'slotbells.png',
            type: 'points',
            name: 'Bells',

        },

        'redgem': {

            points: 5000,
            mult: 1,
            img: 'slotredgem.png',
            type: 'gem',
            name: 'Ruby',

        },

        'greengem': {

            points: 3000,
            mult: 1,
            img: 'slotgreengem.png',
            type: 'gem',
            name: 'Emerald',

        },

        'bluegem': {

            points: 2000,
            mult: 1,
            img: 'slotbluegem.png',
            type: 'gem',
            name: 'Sapphire',

        },

        'melon': {

            points: 500,
            mult: 2,
            img: 'slotmelon.png',
            type: 'fruit',
            name: 'Melon',

        },

        'cherry': {

            points: 100,
            mult: 3,
            img: 'slotcherry.png',
            type: 'fruit',
            name: 'Cherry',

        },

    }; // end prizes obj

    // Game functions

    function resetGame() { // restore defaults
        
        $('.stop1').remove();            
        $('.stop2').remove();
        $('.stop3').remove();

        slotArray = [
            [],
            [],
            []
        ];
        
        slotWheel = {
            1: [],
            2: [],
            3: [],
            position: [0,0,0],
        };
        
        currentObj = {
            1: 2,
            2: 2,
            3: 2,
        };
        
        getSlotOrder(1); // fill the slots
        getSlotOrder(2);
        getSlotOrder(3);
        
        var keys = [];
    
        for (var prop in prizes) {
    
            if (prizes.hasOwnProperty(prop)) {
    
                keys.push(prop);
    
            } // end if
    
        } // end for 
    
        for (j = 1; j < 4; j++) { // fill all slotwheels
    
            for (i = 0; i < 8; i++) {
    
                slotWheel[j][i] = prizes[keys[slotArray[j - 1][i] - 1]];
    
            } // end for
    
        } // end for 
        
        console.log(slotWheel[1],slotWheel[2],slotWheel[3]);

    } // end resetGame()


    function getRandomSlot() { // from prizes pick a random slot

        var keys = [];

        for (var prop in prizes) {

            if (prizes.hasOwnProperty(prop)) {

                keys.push(prop);

            } // end if

        } // end for 

        var rand = randomInteger(0, 7);
        var choice = keys[rand];

        return prizes[choice];

    } // end getRandomSlot()

    
    function drawSlot(slotNum) {
        
        if (slotNum == 1) {
            c.clearRect(0, 0, 275, c.height);
        } 
        else if (slotNum == 2) {
            c.clearRect(275, 0, image.width, c.height);
        } 
        else if (slotNum == 3) {
            c.clearRect(525, 0, image.width, c.height);
        }
        
        var p = 0;
        
        for (i = 0; i < 8; i++) {
            
            $("canvas").drawImage({
                source: slotWheel[slotNum][i].img,
                x: 150 + (image.width * (slotNum - 1)), // 150, 400, 650
                y: (image.height * i) - 50 - slotWheel.position[slotNum - 1], 
            });
            
            p++;

        } // end for
        
        for (i = 0; i < 2; i++) {
            
            $("canvas").drawImage({
                source: slotWheel[slotNum][i].img,
                x: 150 + (image.width * (slotNum - 1)), // 150, 400, 650
                y: (image.height * p) - 50 - slotWheel.position[slotNum - 1], 
            });
            
            p++;
            
        }

    } // end drawSlot()
 
 
    function getSlotOrder(slot) {

        var slotOrder = slotArray[slot - 1];
        slotOrder = [];

        while (slotOrder.length < 9) {

            slotOrder.push(randomInteger(1, 8));

            for (i = 0; i < slotOrder.length - 1; i++) {

                for (j = i + 1; j < slotOrder.length - 1; j++) {

                    if (slotOrder[i] === slotOrder[j]) {

                        slotOrder.splice(j, 1); // used slice instead of splice before... heh now I know the difference

                    } // end if

                } // end jfor

            } // end ifor

        } // end while

        slotOrder.splice(8, 1);

        slotArray[slot - 1] = slotOrder;

    } // end getSlotOrder()


    function spin(slotNum,incr) {

        slot[slotNum].obj = slotWheel[slotNum][incr];
        slot[slotNum].img = slot[slotNum].obj.img;
        drawSlot(slotNum);

    } // end spin()


    function correctSlotPosition(slotNum) { // get closest to y: 150. the most complicated code here; it doesn't even make sense
        
        if (currentObj[slotNum] !== undefined) {
            
            j = 1;
            k = 1;
            
            slotWheel.position[slotNum - 1] = Math.round(slotWheel.position[slotNum - 1]); // use integers or % won't work
            
            while (slotWheel.position[slotNum - 1] % image.height !== 0) { // adjust for image height (200)
                
                slotWheel.position[slotNum - 1] += k;
                k *= -1;
                j *= -1;
                k += j; // k is equal to the distance from y: 150.  how this works: goes up 1, down 2 etc: (+1, -2, +3, -4, +5, -6...)
                
            } // end while
        
            currentObj[slotNum] -= 2; // To adjust for starting at slot 2, which is done because it works visually to line up the slots for some reason
            
            if (k < 0 || k == 1) { // I have no fucking idea why this works but it does
                currentObj[slotNum] += 1;    
            }
            
            if (currentObj[slotNum] == -2) { // loop back
                currentObj[slotNum] = 6;
            } 
            
            if (currentObj[slotNum] == -1) { // loop back
                currentObj[slotNum] = 7;
            }
            
            if (currentObj[slotNum] == 8) { // loop forward
                currentObj[slotNum] = 0;
            }
            
            spin(slotNum, currentObj[slotNum]); // actually change the value
            delete currentObj[slotNum]; // so it doesn't execute |currentObj[slotNum] -= 2;| or the others and change values when all 3 slots are done
            
        }
        
        
        
    } // end correctSlotPosition()


    function calculatePoints() {

        var pointsAdd = 0; // base points
        var pointsMulti = 1; // multiplied by this
        var totalPoints = 0;

        for (i = 1; i < 4; i++) { // add points
            
            pointsAdd += slot[i].obj.points;
            pointsMulti *= slot[i].obj.mult;
            
        } // end for

        totalPoints = pointsAdd * pointsMulti;

        if ((slot[1].obj == slot[2].obj) && (slot[2].obj == slot[3].obj)) { // if a triple match

            totalPoints *= 10;
            
            if (slot[1].obj.name === 'Bells' && slot[2].obj.name === 'Bells' && slot[3].obj.name === 'Bells') { 
                // if 3 bells give a set amount of points because bells add score is 0, so 3 bells = 0 * 216 = 0 which sucks
                
                totalPoints = 216000; // 216,000 (1000 * the bells multiplier so it's a fitting number, not arbitrary)
                
            }
            
            $('#machineWindow').css({ // glow
                '-webkit-filter': 'grayscale(0%)',
                '-mox-filter': 'grayscale(0%)',   
            });
            

        } // end if
        else if ((slot[1].obj.type === slot[2].obj.type) && (slot[2].obj.type === slot[3].obj.type)) { // if similar types

            switch (slot[1].obj.type) {

            case 'points':
                totalPoints *= 2;
                break;

            case 'gem':
                totalPoints *= 5;
                break;

            case 'fruit':
                totalPoints *= 10;
                break;

            } // end switch
            
            $('#machineWindow').css({ //glow less brightly
                '-webkit-filter': 'grayscale(20%)',
                '-mox-filter': 'grayscale(20%)',   
            });

        } // end elseif
        else {
            
            $('#machineWindow').css({ //return to normal less bright
                '-webkit-filter': 'grayscale(40%)',
                '-mox-filter': 'grayscale(40%)',   
            });
            
        } // end else
        
        $('.score').text('Score: ' + numberWithCommas(totalPoints)); // Insert score with commas (50000 -> 50,000)
        return totalPoints;

    } // end calculatePoints()

    // Binds
    
    var slot1intr;
    var slot2intr;
    var slot3intr;

    $('.spin').click(function () { // Start and Stop
    
        $('#machineWindow').toggleClass('blur'); // blur the edges

        if (game === false) {

            resetGame();
            
            slot[1].speed = randomInteger(12, 38);
            slot[2].speed = randomInteger(12, 38);
            slot[3].speed = randomInteger(12, 38);
            
            var wheel1incr = 0, wheelSpeed1 = image.height / slot[1].speed;
            var wheel2incr = 0, wheelSpeed2 = image.height / slot[2].speed;
            var wheel3incr = 0, wheelSpeed3 = image.height / slot[3].speed;   
            
            var redrawNum = 1600;
            
            slot1intr = setInterval(function () {

                if (wheel1incr % slot[1].speed === 0) { // Change obj every slot[1].speed ms
                    
                    spin(1, currentObj[1]);
                    currentObj[1]++;
                    
                    if (currentObj[1] === 8) { // cycle through the wheel
                        currentObj[1] = 0;
                    }   // end if
                    
                } // end if
                    
                slotWheel.position[0] += wheelSpeed1; // Move slots at the same pace as the object is being changed
                
                if (slotWheel.position[0] >= redrawNum) { // cycle through the wheel
                    slotWheel.position[0] = 0;
                }
                
                drawSlot(1);
                wheel1incr++;
                calculatePoints();
                
            }, 1); // end interval
            
            slot2intr = setInterval(function () {
                
                if (wheel2incr % slot[2].speed === 0) { // Change obj every slot[1].speed ms
                    
                    spin(2, currentObj[2]);
                    currentObj[2]++;
                    
                    if (currentObj[2] === 8) { // cycle through the wheel
                        currentObj[2] = 0;
                    }   // end if
                    
                } // end if
                    
                slotWheel.position[1] += wheelSpeed2; // Move slots at the same pace as the object is being changed
                
                if (slotWheel.position[1] >= redrawNum) { // cycle through the wheel
                    slotWheel.position[1] = 0;
                }
                
                drawSlot(2);
                wheel2incr++;
                calculatePoints();
                
            }, 1); // end interval
            
            slot3intr = setInterval(function () {
                
                if (wheel3incr % slot[3].speed === 0) { // Change obj every slot[1].speed ms
                    
                    spin(3, currentObj[3]);
                    currentObj[3]++;

                if (currentObj[3] === 8) { // cycle through the wheel
                        currentObj[3] = 0;
                    }   // end if
                    
                } // end if
                    
                slotWheel.position[2] += wheelSpeed3; // Move slots at the same pace as the object is being changed
                
                if (slotWheel.position[2] >= redrawNum) { // cycle through the wheel
                    slotWheel.position[2] = 0;
                }
                
                drawSlot(3);
                wheel3incr++;
                calculatePoints();
                
            }, 1); // end interval
            
            $('.buttonsContainer').append('<input type="button" class="stop1 stop" value="Stop Slot 1">');
            $('.buttonsContainer').append('<input type="button" class="stop2 stop" value="Stop Slot 2">');
            $('.buttonsContainer').append('<input type="button" class="stop3 stop" value="Stop Slot 3">');
            
            var wheelsSpinning = 3;
            
            $('.stop1').click(function () {
                console.log(slot);
                clearInterval(slot1intr);
                drawSlot(1);
                correctSlotPosition(1);
                wheelsSpinning--;
                calculatePoints();
                
                $(this).css({ // blur out buttons
                    'background': '#CCC',
                    'color': '#777',
                    'border': '1px solid #FFF', 
                    })
                .val(slot[1].obj.name); // replace name
                
                if (wheelsSpinning === 0) { // If all wheels are stopped, then remove buttons and game ends
                    $('.spin').click();
                }
                
                $(this).unbind();
                
            }); // end stop1 click
            
            $('.stop2').click(function () {
                console.log(slot);
                clearInterval(slot2intr);
                drawSlot(2);
                correctSlotPosition(2);
                wheelsSpinning--;
                calculatePoints();
                
                $(this).css({ // blur out buttons
                    'background': '#CCC',
                    'color': '#777',
                    'border': '1px solid #FFF',
                    })
                .val(slot[2].obj.name); // replace name
                
                if (wheelsSpinning === 0) { // If all wheels are stopped, then remove buttons and game ends
                    $('.spin').click();
                }
                
                $(this).unbind();
                
            }); // end stop2 click
            
            $('.stop3').click(function () {
                console.log(slot);
                clearInterval(slot3intr);
                drawSlot(3);
                correctSlotPosition(3);
                wheelsSpinning--;
                calculatePoints();
            
                $(this).css({ // blur out buttons
                    'background': '#CCC',
                    'color': '#777',
                    'border': '1px solid #FFF',
                    })
                .val(slot[3].obj.name); // replace name
                
                if (wheelsSpinning === 0) { // If all wheels are stopped, then remove buttons and game ends
                    $('.spin').click();
                }
                
                $(this).unbind();
                
            }); // end stop3 click

            $('.spin').val('Stop All!');
            game = true;
            

        } 
        
        else { // If game is running
            
            clearInterval(slot1intr);
            clearInterval(slot2intr);
            clearInterval(slot3intr);
            
            correctSlotPosition(1);
            correctSlotPosition(2);
            correctSlotPosition(3);
            
            calculatePoints();
            
            $('.stop1').css({ // blur out buttons
                'background': '#CCC',
                'color': '#777',
                'border': '1px solid #FFF',
            }).val(slot[1].obj.name); // replace name
            
            $('.stop2').css({ // blur out buttons
                'background': '#CCC',
                'color': '#777',
                'border': '1px solid #FFF',
            }).val(slot[2].obj.name); // replace name
            
            $('.stop3').css({ // blur out buttons
                'background': '#CCC',
                'color': '#777',
                'border': '1px solid #FFF',
            }).val(slot[3].obj.name); // replace name
            
            $('.spin').val('Spin slots!');
            game = false;

        } // end else

    }); // end Spin All / Stop All keybind
    
    
    
    

}); // end script






