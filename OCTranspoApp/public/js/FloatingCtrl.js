var FloatingCtrl = (function (FloatingCtrl) {
    FloatingCtrl.init = function () {
        FloatingCtrl.div = $('#floatingCtrl');
        FloatingCtrl.reposition();
    }
    
    FloatingCtrl.reposition = function () {
        var $window     = $(window);
        var padding     = {
            right:  25,
            bottom: 25
        };
        FloatingCtrl.div.css({
            left: ($window.innerWidth() - FloatingCtrl.div.innerWidth() - padding.right) + 'px',
            top: (window.scrollY + $window.innerHeight() - FloatingCtrl.div.innerHeight() - padding.bottom) + 'px'
        });
    }
    
    return FloatingCtrl;
    
} (FloatingCtrl || {}))

// Initialze div
$(document).ready(FloatingCtrl.init);

// Register Show/Hide stop markers button click handler
$('#showStops').click(function () {
    if (Map.allStops === null) {
        $.post('/getAllStopsFromDb', {}).done( function(result) {
            Map.initializeStopMarkers(result);
            afterAction();     
        });
    } else {
        afterAction();
    }

    function afterAction() {
        var shown   = Map.stopMarkersOn();
        var btnText = '';
        Map.toggleStopMarkers(!shown);
        if (shown)
            btnText = 'Show Stops';
        else
            btnText = 'Hide Stops';

        $('#showStops').text(btnText);
    }
});

$(window).scroll(function () {
    console.log('Changing floating ctrl');
    FloatingCtrl.reposition();
});
