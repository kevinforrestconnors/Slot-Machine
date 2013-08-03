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
        position: [],
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

    // Slot objects

    var slot = {

        1: {

            num: 1,
            x: 150,
            y: 150,
            speed: 0,
            obj: 0,
            img: 'slot7.png',

        },

        2: {

            num: 2,
            x: 400,
            y: 150,
            speed: 0,
            obj: 0,
            img: 'slot7.png',

        },

        3: {

            num: 3,
            x: 650,
            y: 150,
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

        },

        'bar': {

            points: 2000,
            mult: 2,
            img: 'slotbar.png',
            type: 'points',

        },

        'bells': {

            points: 1500,
            mult: 1,
            img: 'slotbells.png',
            type: 'points',

        },

        'redgem': {

            points: 1000,
            mult: 1,
            img: 'slotredgem.png',
            type: 'gem',

        },

        'greengem': {

            points: 1000,
            mult: 1,
            img: 'slotgreengem.png',
            type: 'gem',

        },

        'bluegem': {

            points: 1000,
            mult: 1,
            img: 'slotbluegem.png',
            type: 'gem',

        },

        'melon': {

            points: 500,
            mult: 2,
            img: 'slotmelon.png',
            type: 'fruit',

        },

        'cherry': {

            points: 100,
            mult: 3,
            img: 'slotcherry.png',
            type: 'fruit',

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
        };
        j1 = 0;
        j2 = 0;
        j3 = 0;

        for (var key in slot) { // restore defaults

            slot[key].y = 150;
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

        $("canvas").drawImage({
            source: slot[slotNum].img,
            x: slot[slotNum].x,
            y: slot[slotNum].y,
        });

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

        if (slotNum == 1) {
            c.clearRect(0, 50, 275, 250);
        } 
        else if (slotNum == 2) {
            c.clearRect(275, 50, 525, 250);
        } 
        else if (slotNum == 3) {
            c.clearRect(525, 50, 775, 250);
        }

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

        if (game === false) {

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
    
                } // end fo
    
            } // end for 
            
            var wheel1incr = 0;
            var wheel2incr = 0;
            var wheel3incr = 0;
            
            slot1intr = setInterval(function () {
                
                spin(1, wheel1incr);
                wheel1incr++;
                if (wheel1incr === 8) {
                    wheel1incr = 0;
                }
                
            }, 500);
            
            slot2intr = setInterval(function () {
                
                spin(2, wheel2incr);
                wheel2incr++;
                if (wheel2incr === 8) {
                    wheel2incr = 0;
                }
                
            }, 500);
            
            slot3intr = setInterval(function () {
                
                spin(3, wheel3incr);
                wheel3incr++;
                if (wheel3incr === 8) {
                    wheel3incr = 0;
                }
                
            }, 500);
            
            scoreInterval = setInterval(function() {
                
                $('.score').text('Score: ' + numberWithCommas(calculatePoints())); // Insert score with commas (50000 -> 50,000)
            
            }, 500);
            
            $('.buttonsContainer').append('<input type="button" class="stop1 center" value="Stop Slot 1">');
            $('.buttonsContainer').append('<input type="button" class="stop2 center" value="Stop Slot 2">');
            $('.buttonsContainer').append('<input type="button" class="stop3 center" value="Stop Slot 3">');
            
            $('.stop1').click(function () {
                
                clearInterval(slot1intr);
                drawSlot(1);
                $(this).remove();
                if ($('.stop2').length == 0 && $('.stop3').length == 0) {
                    $('.spin').click();
                }
                
            }); // end stop1 click
            
            $('.stop2').click(function () {
                
                clearInterval(slot2intr);
                drawSlot(2);
                $(this).remove();
                if ($('.stop1').length == 0 && $('.stop3').length == 0) {
                    $('.spin').click();
                }
                
            }); // end stop2 click
            
            $('.stop3').click(function () {
                
                clearInterval(slot3intr);
                drawSlot(3);
                $(this).remove();
                if ($('.stop1').length == 0 && $('.stop2').length == 0) {
                    $('.spin').click();
                }
                
            }); // end stop3 click

            $('.spin').val('Stop All!');
            game = true;

        } else {
            
            $('.spin').val('Spin slots!');
            clearInterval(slot1intr);
            clearInterval(slot2intr);
            clearInterval(slot3intr);
            $('.stop1').remove();            
            $('.stop2').remove();
            $('.stop3').remove();
            game = false;

        }

    });
    
    
    
    

});