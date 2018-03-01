import 'bootstrap/dist/css/bootstrap.min.css';
require('blockrain');

const Eth = require('ethjs-query');
var eth;
var highScores = {};

function startApp(web3) {
    eth = new Eth(web3.currentProvider);
    $('#ethAddress').val(web3.eth.defaultAccount);
}


function refreshHighScores() {
    $.get("http://localhost:5000/high_score", (result) => {
        var changed = false;
        if (result.scores && result.scores.length > 0) {
            changed = highScores != result.scores;
            highScores = result.scores;
        }
        if (changed) {
            $("#highScoreTable tbody tr").remove();
            $.each(highScores, function(index, highScore) {
                var str = (
                    '<tr><td>' + highScore[0] +
                    '</td><td>' + highScore[1] + '</td></tr>'
                );
                $("#highScoreTable tbody").append(str);
            });
        }
    });
}

function initializeSite() {
    refreshHighScores();
    $('#tetris').blockrain({
        speed: 25,
        onGameOver: onGameOver
    });
}

function refreshId() {
    $('#ethAddress').val(web3.eth.defaultAccount);
}

function startGame() {
    $('#tetris').blockrain('pause');

    $.get("http://localhost:5000/high_score", (result) => {
        if (result.scores && result.scores.length > 0) {
            highScores = result.scores;
            var highScoreAddress = result.scores[0][0];
            
            if (highScoreAddress ==  web3.eth.defaultAccount) {
                $('#tetris').blockrain('resume');
                return;
            }

            var transaction = {
                from: web3.eth.defaultAccount,
                to: highScoreAddress,
                value: web3.toWei(0.01, 'ether'),
                data: ''
            };

            eth.sendTransaction(transaction)
            .then(function (receipt) {
                $('#tetris').blockrain('resume');
                return;
            })
            .catch(function (error) {
                $('#tetris').blockrain('gameover');
                return;
            })
        } else {
            $('#tetris').blockrain('resume');
        }
    });
}

function initializeListeners() {
    $('#refreshIdButton').click(refreshId);
    $('.blockrain-btn').click(startGame);
}

function onGameOver(score) {
    if (score === 0 || !web3.eth.defaultAccount) {
        return;
    }
    $.get("http://localhost:5000/high_score/" + web3.eth.defaultAccount + "/" + score, ()=> {
        refreshHighScores();
    });
}

window.addEventListener('load', function() {
    // Check if Web3 has been injected by the browser:
    if (typeof web3 !== 'undefined') {
        // You have a web3 browser! Continue below!
        startApp(web3);
        initializeSite();
        initializeListeners();
    } else {
        window.alert("Please install MetaMask");
    }
});
