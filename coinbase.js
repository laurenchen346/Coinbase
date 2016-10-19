const repl = require('repl');
var request = require('superagent');
var __ = require('underscore');
var url = "https://api.coinbase.com/v1/currencies/exchange_rates";

repl.start({prompt: '> ', eval: myEval});


