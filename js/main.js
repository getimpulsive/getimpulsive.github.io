var WORDS_TO_NUMBERS = {
    'zero': 0,
    'one': 1,
    'two': 2,
    'three': 3,
    'four': 4,
    'five': 5,
    'six': 6,
    'seven': 7,
    'eight': 8,
    'nine': 9,
    'ten': 10,
    'eleven': 11,
    'twelve': 12,
    'thirteen': 13,
    'fourteen': 14,
    'fifteen': 15,
    'sixteen': 16,
    'seventeen': 17,
    'eighteen': 18,
    'nineteen': 19,
    'twenty': 20
}

var StringHelper = StringHelper || {};
StringHelper.format = function(formatString) {
  var args = arguments
  return formatString.replace(/{(\d+)}/g, function(match, matchNumber) {
    return args[parseInt(matchNumber)+1]
  })
};

function photoSearch(query, callback, numPhotos) {
    query = encodeURI(query);

    var url = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=0445640a9152dbfbcf619996da792930&tags=' + query +'&safe_search=0&per_page=20';
    $.getJSON(url + "&format=json&jsoncallback=?", function(data){
        var photos = data.photos.photo.map(function(item) {
            return 'https://images.weserv.nl/?url=' + "farm"+ item.farm +".static.flickr.com/"+ item.server +"/"+ item.id +"_"+ item.secret +"_m.jpg";
        });
        function shuffle(a) {
            var j, x, i;
            for (i = a.length; i; i -= 1) {
                j = Math.floor(Math.random() * i);
                x = a[i - 1];
                a[i - 1] = a[j];
                a[j] = x;
            }
        }
        shuffle(photos);
        callback(photos);
    });
}


jQuery.fn.singleDoubleClick = function(single_click_callback, double_click_callback, timeout) {
  return this.each(function(){
    var clicks = 0, self = this;
    jQuery(this).click(function(event){
      clicks++;
      if (clicks == 1) {
        setTimeout(function(){
          if(clicks == 1) {
            single_click_callback.call(self, event);
          } else {
            double_click_callback.call(self, event);
          }
          clicks = 0;
      }, timeout || 150);
      }
    });
  });
}


var mouseX;
var mouseY;
var textArea = null;
var firstTime = true;
var mute;

$(document).on('mousemove mouseenter', function() {
    mouseX = event.pageX;
    mouseY = event.pageY;
});

function onError() {
    $('#directions').css('display', 'none');
    $('#error').css('display', 'block');
}

var listener = new Listener('listener', onError);
listener.onResult = function(text, isFinal) {
    if (isFinal === false) {
        if (textArea === null)  {
            textArea = createNodeAtCursor(mouseX, mouseY - 25, text);
        }
        else {
            textArea.text(text);
        }
    }
    else {
        console.log(text)
        var hasQueryParam = false;
        ['have', 'give', 'find', 'show', 'get'].forEach(function(term) {
            if (text.indexOf(term) > -1) {
                hasQueryParam = true;
            }
        });

        var hasPhotoParam = false;
        ['picture', 'photo', 'image'].forEach(function(term) {
            if (text.indexOf(term) > -1) {
                hasPhotoParam = true;
            }
        });

        if (hasQueryParam && hasPhotoParam) {
            var words = text.split(" ");
            var keyword = words[words.length - 1]; // words[words.length - 2] + ' ' + words[words.length - 1];
            console.log(keyword)
            photoSearch(keyword, function(imageUrls) {
                var number = text.replace(/[^0-9.]/g, "");
                var isNumeral = number !== '';

                var isWordNumber = _.intersection(text.split(" "), _.keys(WORDS_TO_NUMBERS)).length > 0

                if (isNumeral || isWordNumber) {
                    var number;
                    if (isNumeral) {
                        number = number
                    }
                    else {
                        var wordNumber =  _.intersection(text.split(" "), _.keys(WORDS_TO_NUMBERS))[0];
                        number = WORDS_TO_NUMBERS[wordNumber];
                    }

                    imageUrls.forEach(function(imageUrl, i) {
                        if (i < number) {
                            imageHtmlString = StringHelper.format('<img src="{0}">', imageUrls[i]);
                            textArea = createNodeAtCursor(mouseX + i*50, mouseY + i*20, imageHtmlString);
                        }
                    });
                }
                else {
                    textArea.html(StringHelper.format('<img src="{0}">', imageUrls[0]));

                }

                textArea = null;
            })
        }
        else {
            textArea.text(text);
            textArea = null;
        }
    }

    if (firstTime) {
        $('#directions').remove();
        $('#hints').css('display', 'block');
    }
}

var timeout = null;
$(document).mousemove(function(){
    // clearTimeout(timeout);

    // timeout = setTimeout(function() {
        textArea = null;
        listener.reset()
    // }, 500);
});

var $selected;

$(document).on('click', function(e) {
    if ($selected && $(e.target).prop('tagName')  === 'HTML') {
        $selected.removeClass('selected');
    }
});

$(document).unbind('keydown').bind('keydown', function (event) {
    var doPrevent = false;
    if (event.keyCode === 8) {
        var d = event.srcElement || event.target;
        if ((d.tagName.toUpperCase() === 'INPUT' &&
             (
                 d.type.toUpperCase() === 'TEXT' ||
                 d.type.toUpperCase() === 'PASSWORD' ||
                 d.type.toUpperCase() === 'FILE' ||
                 d.type.toUpperCase() === 'SEARCH' ||
                 d.type.toUpperCase() === 'EMAIL' ||
                 d.type.toUpperCase() === 'NUMBER' ||
                 d.type.toUpperCase() === 'DATE' )
             ) ||
             d.tagName.toUpperCase() === 'TEXTAREA') {
            doPrevent = d.readOnly || d.disabled;
        }
        else {
            if ($selected) {
                $selected.remove();
            }

            doPrevent = true;

        }
    }

    if (doPrevent) {
        event.preventDefault();
    }
});


$(document).on('keyup', function(e) {
    if (e.keyCode === 8) {
        e.preventDefault();
    }
});

$(document).bind('keyup keydown', function(e){
    mute = e.shiftKey;
    if (mute) {
        listener.stop();
    }
    else {
        try {
            listener.start();
        }
        catch(err) {

        }

    }
});



function createNodeAtCursor(x, y, text) {
    $span = $('<span>').html(text);
    var $div = $('<div>')
                    .addClass('node')
                    .css({
                        'left': x+'px',
                        'top': y+'px'
                    })
                    .draggable()
                    .css('position', 'absolute')
                    .singleDoubleClick(
                        function(e) {
                            e.stopPropagation();

                            if($div.hasClass('selected')) {
                                $div.removeClass('selected');
                                $selected = null;
                            }
                            else if($div.hasClass('selected') === false) {
                                if ($selected) {
                                    $selected.removeClass('selected');
                                }
                                if ($div.find('input').length === 0) {
                                    $div.addClass('selected');
                                    $selected = $div;
                                }
                            }
                        },
                        function() {
                            var $img = $div.find('img');
                            if ($img.length > 0) {
                                var imageUrl = $img.attr('src');
                                var win = window.open(imageUrl, '_blank');
                            }
                        }
                    );

    if ((text.indexOf('img') > -1) === false) {
        $div.editable('dblclick')
    }

    $div.append($span);

    $(document.body).append($div);

    return $span;
}
