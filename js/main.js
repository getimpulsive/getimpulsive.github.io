$(document).click(function(e) {
    var x = e.pageX;
    var y = e.pageY;

    var $span = $('<span>')
                .text('hello world');
    var $div = $('<div>')
                    .addClass('node')
                    .css({
                        'left': x+'px',
                        'top': y+'px'
                    });
    $div.append($span);
    $(document.body).append($div);
});
