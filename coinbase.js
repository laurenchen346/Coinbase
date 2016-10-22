const repl = require('repl');
var request = require('superagent');
var __ = require('underscore');

var replServer = repl.start({prompt: 'CoinbaseLauren> ', eval: myEval});
function myEval(cmd, context, filename, callback){
        var commandList = cmd.split(" ");
        var execute = commandList[0].trim().toUpperCase();
        if(execute==='BUY'){return BUY(commandList);}
        if(execute==='SELL'){return SELL(commandList);}
        if(execute==='ORDERS'){return ORDERS();}
        callback(null, result);
        return;
}

function exchangeRate(action, amount, currency){
        var order = action + " " + amount + " " + currency + " ";
        request.get("https://api.coinbase.com/v1/currencies/exchange_rates")
          .set('Accept', 'application/json')
          .end(function(error, res){
                var jsonVar = res.body;
                if(currency != null){
                  var unit_btc_curr = "btc_to_" + currency;
                  var unit_curr_btc = currency + "_to_btc";
                  var rate_btc_curr = jsonVar[unit_btc_curr];
                  var rate_curr_btc = jsonVar[unit_curr_btc];
                  addOrderToList(action, amount, currency);
                  console.log("Order to " + order + " worth of BTC queued @ "+ rate_btc_curr + " " + "BTC/" + currency.toUpperCase() + " ("+ rate_curr_btc + " BTC)");
                }
                });
                }
function BUY(args){
        var action = args[0].trim().toUpperCase();
        if(args[1]==null){
            console.log("Invalid or No Amount specified. Please try again!");
        }
        else if(args[1]!=null){
                var amount = args[1].trim();
                if(args[2] != null){
                        var currency = args[2].trim().toUpperCase();
                        checkCurrency(currency, action, amount);
                }
                else if(args[2] == null){
                        if(args[1] > 0){
                                addOrderToList(action, amount, null);
                                console.log("Order to " + action + " "+ amount + " BTC queued");
                        }
                }
          }
        return;
}
function SELL(args){
        var action = args[0].trim().toUpperCase();
         if(args[1]==null){
            console.log("Invalid or No Amount specified. Please try again!");
        }
        else if(args[1]!=null){
                var amount = args[1].trim();
                if(args[2] != null){
                        var currency = args[2].trim().toUpperCase();
                        checkCurrency(currency, action, amount);
                }
                else if(args[2] == null){
                        if(args[1] > 0){
                                addOrderToList(action, amount, null);
                                console.log("Order to " + action + " " + amount + " BTC queued");
                        }
                }
        }
}
var orderList = [];

function addOrderToList(order, amount, currency){
        var curr = "BTC"
        if(currency != null){ curr = currency;}
        var newOrder = {
                        'time': new Date(),
                        'orderType': order.toUpperCase(),
                        'amount': amount,
                        'currency': curr.toUpperCase(),
                        'status': 'UNFILLED'}
        orderList.push(newOrder);
}
function ORDERS(){
        console.log("\n === CURRENT ORDERS === ");

        __.map(orderList,
                function(err, index){
                  order = orderList[index];
                  console.log(order.time + " : " + order.orderType + " "
                + order.amount + order.currency+":  " + order.status);
                 })
}
function checkCurrency(currency,action, amount){
        var isValid = false;
        request.get('https://api.coinbase.com/v1/currencies')
          .set('Accept', 'application/json')
          .end(function(error, res){
                var check_json = res.body
                __.filter(check_json,
                function(error, index){
                if(check_json[index][1] === currency){
                        isValid = true;
                        exchangeRate(action,amount, currency.toLowerCase());
                            }
                          }
        );
                if(isValid === false){
                  console.log("No known exchange rate for BTC/"
                                + currency + ". "+"Order failed");
                }
        });
}

