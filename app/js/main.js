
var H = H || {};
H.game = (function(){
    "use strict";
    //messages shown on overlay
    const _message = {
        win : 'You Win!!',
        lose: 'Game Over'
    };
    const remainMax = 11;       //attempts limit
    const apiURL    = 'https://api.wordnik.com/v4/words.json/randomWord?minLength=5&maxLength=11&api_key=';   //dictionary api endpoint
    let currentWord = '';       //word to guess
    let missed      = '';       //missed letters
    let placeholder = '';       //currently guessed letters
    let remain      = 0;        //remains attempts

    //ui elements
    let _element = {
        startBtn: document.getElementById('start'),
        gameOver: document.getElementById('game-over'),
        placeholder: document.getElementById('placeholder'),
        man: document.getElementById('folk'),
        missed: document.getElementById('missed')
    };

    /**
     * Call API for word
     * @param {string} url
     * @returns {Promise}
     * @private
     */
    const _getWord = function(url) {
        'use strict';
        var xhr = new XMLHttpRequest();
        return new Promise((resolve, reject) => {
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.responseText));
                    } else {
                        reject(xhr.responseText);
                    }
                }
            };
            xhr.open('GET', url);
            xhr.send();
        });
    };

    /**
     * Initialize UI (overlay)
     * @private
     */
    const _initUi = function(){
        _element.gameOver.className = 'overlay hidden';
        _element.startBtn.addEventListener('click', init);
    };

    /**
     * Game init
     *
     */
    const init = function(){
        missed = '';
        placeholder = '';
        remain = 0;
        _initUi();
        _drawFolk(0);
        _getWord(apiURL)
            /** @param {string} data.word */
            .then(function (data) {
                currentWord = data.word;
                console.log('currentWord', currentWord);
                document.addEventListener('keydown', _onKeyPress, false);
                for (let i = 0; i < currentWord.length; ++i) {
                    placeholder += ' ';
                }
                _element.placeholder.innerHTML = _iterate(placeholder);
                _element.missed.innerHTML = '';
            });
    };

    /**
     * Draw stages of hangman
     * @param {int} stage
     * @private
     */
    const _drawFolk = function(stage){
        _element.man.className = 'stage-' + stage;
    };

    /**
     * Iterate through word and decorate letters
     * @param {string} word
     * @returns {string}
     * @private
     */
    const _iterate = function(word){
        // w = word.split('');
        const w =  [...word];
        let letter = '';
        if(w.length < 11){
            const blank = 11 - w.length;
            for(let i=0; i<blank; i++){
                letter += '<span class="blank letter"></span>';
            }
        }
        for(let i=0; i< w.length; i++){
            letter += '<span id="letter_' + i + '" class="letter">' + w[i] + '</span>';
        }
        return letter;
    };

    /**
     * Onkeypress event
     * @param {Event} e
     * @private
     */
    const _onKeyPress = function(e) {
        const keycode = e.keyCode;
        if(_validKey(keycode)) {
            _check(String.fromCharCode(keycode));
        }
    };

    /**
     * Validate for letter currently pressed key
     * @param {int} code
     * @returns {boolean}
     * @private
     */
    const _validKey = function(code){
        if((code > 64 && code < 91)){
            return true;
        }
    };

    /**
     * Main game loop
     * @param {string} input
     * @private
     */
    const _check = function(input){
        const letter = input.toUpperCase();
        let hit = 0;
        for (let i = 0; i < currentWord.length; i++) {
            if (letter == currentWord.substring(i, i + 1).toUpperCase()){
                placeholder = placeholder.substring(0, i) + letter + placeholder.substring(i + 1, placeholder.length + 1);
                hit++;
            }
        }
        _element.placeholder.innerHTML = _iterate(placeholder);
        //fail
        if (hit == 0){
            if(missed.indexOf(letter) < 0) {
                missed += letter;
                remain++;
                _drawFolk(remain);
            }
            console.log('remain', remainMax - remain);
            document.getElementById("missed").innerHTML =  missed;
        }
        //game over
        if(remain == remainMax+1){
            document.getElementById("placeholder").innerHTML = _iterate(currentWord);
            _overlay( _message.lose );
        }
        //win
        if(currentWord.toUpperCase() == placeholder.toUpperCase()){
            _overlay( _message.win );
        }
    };

    /**
     * Show overlay message
     * @param {string} text
     * @private
     */
    const _overlay = function(text){
        var message = _element.gameOver.getElementsByTagName('h1');
            message[0].innerHTML = text;
            _element.gameOver.className = 'overlay';
    };

    return{
        init:init
    }

})();
H.game.init();