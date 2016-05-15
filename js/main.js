var listener = new Listener('listener');
listener.onResult = function(text) {
    console.log(text);
}

$(document).click(function(e) {
    var x = e.pageX;
    var y = e.pageY;

    addNodeAtCursor(x, y, 'hello');
});

function addNodeAtCursor(x, y, text) {

    var $span = $('<span>')
                .text(text);
    var $div = $('<div>')
                    .addClass('node')
                    .css({
                        'left': x+'px',
                        'top': y+'px'
                    });
    $div.append($span);
    $(document.body).append($div);
}
