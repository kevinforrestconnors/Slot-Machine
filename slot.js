// Slot Machine

$(function() {

    // Vars 
    var i = 0; // General increments
    var j = 0;
    var k = 0;            
    var c = document.getElementById('machineWindow').getContext('2d');
    c.width = 800;
    c.height = 300;
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
    }
    
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
    });
    
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
    });
    

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

            points: 1500,
            mult: 1,
            img: 'slotbells.png',
            type: 'points',
            name: 'Bells',

        },

        'redgem': {

            points: 1000,
            mult: 1,
            img: 'slotredgem.png',
            type: 'gem',
            name: 'Ruby',

        },

        'greengem': {

            points: 1000,
            mult: 1,
            img: 'slotgreengem.png',
            type: 'gem',
            name: 'Emerald',

        },

        'bluegem': {

            points: 1000,
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

    function resetGame() {

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

        for (var key in slot) { // restore defaults

            slot[key].y = 0;
            slot[key].speed = 0;

        }

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
            c.clearRect(0, 0, 275, 300);
        } 
        else if (slotNum == 2) {
            c.clearRect(275, 0, 250, 300);
        } 
        else if (slotNum == 3) {
            c.clearRect(525, 0, 250, 300);
        }
        
        var p = 0;
        
        for (i = 0; i < 8; i++) {
            
            $("canvas").drawImage({
                source: slotWheel[slotNum][i].img,
                x: 150 + (250 * (slotNum - 1)), // 150, 400, 650
                y: (200 * i) - 50 - slotWheel.position[slotNum - 1], 
            });
            
            p++;

        } // end for
        
        for (i = 0; i < 2; i++) {
            
            $("canvas").drawImage({
                source: slotWheel[slotNum][i].img,
                x: 150 + (250 * (slotNum - 1)), // 150, 400, 650
                y: (200 * p) - 50 - slotWheel.position[slotNum - 1], 
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



    function calculatePoints() {

        var currentSlots = [];
        var pointsAdd = 0; // base points
        var pointsMulti = 1; // multiplied by this
        var totalPoints = 0;

        for (var slotsKey in slot) {

            currentSlots.push(slot[slotsKey].obj);

        } // end for var key in slots

        for (i = 0; i < 3; i++) {

            for (var prizeKey in prizes) {

                if (prizes[prizeKey].img == currentSlots[i].img) {

                    pointsAdd += prizes[prizeKey].points;
                    pointsMulti *= prizes[prizeKey].mult;

                } // end if slot match

            } // end for var key in prizes

        } // end for i

        totalPoints = pointsAdd * pointsMulti;

        if ((currentSlots[0] == currentSlots[1]) && (currentSlots[1] == currentSlots[2])) { // if a triple match

            totalPoints *= 10;

        } else if ((currentSlots[0].type === currentSlots[1].type) && (currentSlots[1].type === currentSlots[2].type)) { // if similar types

            switch (currentSlots[0].type) {

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

        } // end elseif

        return totalPoints;

    } // end calculatePoints()

    // Binds
    
    var slot1intr;
    var slot2intr;
    var slot3intr;

    $('.spin').click(function () { // Start and Stop
    
        $('#machineWindow').toggleClass('blur'); // blur the edges

        if (game === false) {
            
            $('.stop1').remove();            
            $('.stop2').remove();
            $('.stop3').remove();

            resetGame();
            
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
            
            slot[1].speed = randomInteger(15,50);
            slot[2].speed = randomInteger(15,50);
            slot[3].speed = randomInteger(15,50);
            
            var wheel1incr = 50, currentObj1 = 2, wheelSpeed1 = 200 / slot[1].speed;
            var wheel2incr = 50, currentObj2 = 2, wheelSpeed2 = 200 / slot[2].speed;
            var wheel3incr = 50, currentObj3 = 2, wheelSpeed3 = 200 / slot[3].speed;   
            
            var redrawNum = 1600;
            
            slot1intr = setInterval(function () {
                
                if (wheel1incr % slot[1].speed === 0) { // Change obj every slot[1].speed ms
                    
                    spin(1, currentObj1);
                    currentObj1++;
                    
                    if (currentObj1 === 8) { // cycle through the wheel
                        currentObj1 = 0;
                    }   // end if
                    
                } // end if
                    
                slotWheel.position[0] += wheelSpeed1; // Move slots at the same pace as the object is being changed
                
                if (slotWheel.position[0] >= redrawNum) { // cycle through the wheel
                    slotWheel.position[0] = 0;
                }
                
                drawSlot(1);
                wheel1incr++;
                
                $('.score').text('Score: ' + numberWithCommas(calculatePoints())); // Insert score with commas (50000 -> 50,000)
                
            }, 1); // end interval
            
            slot2intr = setInterval(function () {
                
                if (wheel2incr % slot[2].speed === 0) { // Change obj every slot[1].speed ms
                    
                    spin(2, currentObj2);
                    currentObj2++;
                    
                    if (currentObj2 === 8) { // cycle through the wheel
                        currentObj2 = 0;
                    }   // end if
                    
                } // end if
                    
                slotWheel.position[1] += wheelSpeed2; // Move slots at the same pace as the object is being changed
                
                if (slotWheel.position[1] >= redrawNum) { // cycle through the wheel
                    slotWheel.position[1] = 0;
                }
                
                drawSlot(2);
                wheel2incr++;
                
                $('.score').text('Score: ' + numberWithCommas(calculatePoints())); // Insert score with commas (50000 -> 50,000)
                
            }, 1); // end interval
            
            slot3intr = setInterval(function () {
                
                if (wheel3incr % slot[3].speed === 0) { // Change obj every slot[1].speed ms
                    
                    spin(3, currentObj3);
                    currentObj3++;
                    
                    if (currentObj3 === 8) { // cycle through the wheel
                        currentObj3 = 0;
                    }   // end if
                    
                } // end if
                    
                slotWheel.position[2] += wheelSpeed3; // Move slots at the same pace as the object is being changed
                
                if (slotWheel.position[2] >= redrawNum) { // cycle through the wheel
                    slotWheel.position[2] = 0;
                }
                
                drawSlot(3);
                wheel3incr++;
                
                $('.score').text('Score: ' + numberWithCommas(calculatePoints())); // Insert score with commas (50000 -> 50,000)
                
            }, 1); // end interval
            
            $('.buttonsContainer').append('<input type="button" class="stop1 stop" value="Stop Slot 1">');
            $('.buttonsContainer').append('<input type="button" class="stop2 stop" value="Stop Slot 2">');
            $('.buttonsContainer').append('<input type="button" class="stop3 stop" value="Stop Slot 3">');
            
            var wheelsSpinning = 3;
            
            $('.stop1').click(function () {
                
                clearInterval(slot1intr);
                drawSlot(1);
                wheelsSpinning--;
                
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
                
                clearInterval(slot2intr);
                drawSlot(2);
                wheelsSpinning--;
                
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
                
                clearInterval(slot3intr);
                drawSlot(3);
                wheelsSpinning--;
                
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
            

        } else { // If game is running
            
            $('.spin').val('Spin slots!');
            clearInterval(slot1intr);
            clearInterval(slot2intr);
            clearInterval(slot3intr);
            
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
            
            game = false;

        } // end else

    }); // end Spin All / Stop All keybind
    
    
    
    

}); // end script