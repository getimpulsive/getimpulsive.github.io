
function Listener (textareaId, onError) {
    var that = this;

    this.reset = function() {
        var recognizer = new window.SpeechRecognition();
        var transcription = document.getElementById(textareaId);

        // Recogniser doesn't stop listening even if the user pauses
        recognizer.continuous = true;

        var resettedResultIndex = null;

        // Start recognising
        recognizer.onresult = function(event) {
            var string = '';
            var isFinal;
            transcription.textContent = '';

            for (var i = event.resultIndex; i < event.results.length; i++) {
                isFinal = event.results[i].isFinal;
                var result = event.results[i][0].transcript;

                if (isFinal) {
                    string = result;              }
                else {
                    string += result;
                }
                transcription.textContent = string;
                if (that.onResult) {
                    that.onResult(string, isFinal);
                }
            }
        };

        recognizer.interimResults = true;
        recognizer.start();
    };

    window.SpeechRecognition = window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    null;

    if (window.SpeechRecognition === null) {
        if(onError) {
            onError();
        }
    }
    else {
        this.reset();
    }
}
