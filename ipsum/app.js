$(document).ready(function(){
    $("span#tweet-it").hover(function() {
        bobble();
    }, function() {
        clearTimeout(bobbler);
    });
});

function bobble() {
    var head = $("img#head");
    var direction = "right";
    rotate(0);
    function rotate(degree) {
        head.css({ WebkitTransform: 'rotate(' + degree + 'deg)'});
        head.css({ '-moz-transform': 'rotate(' + degree + 'deg)'});
        bobbler = setTimeout(function() {
            if (direction != "right") {
                rotate(degree-1);
                if (degree < -1) {direction = "right"};
            } else {
                rotate(++degree);
                if (degree > 1) {direction = "left"};
            };
        },10);
    }
}

