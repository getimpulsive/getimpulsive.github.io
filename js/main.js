var mouseX;
var mouseY;
var textArea = null;

$(document).mousemove(function() {
    mouseX = event.pageX;
    mouseY = event.pageY;
    textArea = createNodeAtCursor(mouseX, mouseY, '');
});

var listener = new Listener('listener');

listener.onResult = function(text, isFinal) {
    if (isFinal === false) {
        if (textArea === null)  {
            textArea = createNodeAtCursor(mouseX, mouseY, text);
        }
        else {
            textArea.text(text);
        }
    }
    else {
        textArea.text(text);
        textArea = null;
    }
}

$(document).mousemove(function(){
    listener.reset();
    textArea = null;
});


function createNodeAtCursor(x, y, text) {
    $span = $('<span>').text(text);
    var $div = $('<div>')
                    .addClass('node')
                    .css({
                        'left': x+'px',
                        'top': y+'px'
                    });
    $div.append($span);
    $(document.body).append($div);

    return $span;
}
