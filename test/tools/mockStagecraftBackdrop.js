var http = require('http'),
  hock = require('hock');

var costPerTransaction = require('../functional/responses/cost-per-transaction-dashboard.json');
var transactionsPerYear = require('../functional/responses/transactions-per-year-dashboard.json');
var transactionServicesData = require('../functional/responses/transactional-services-data.json');

var mock = hock.createHock();

mock
  .get('/public/dashboards?slug=cost-per-transaction')
  .max(Infinity)
  .reply(200, costPerTransaction, {
    'Access-Control-Allow-Origin': '*'
  });
mock
  .get('/public/dashboards?slug=transactions-per-year')
  .max(Infinity)
  .reply(200, transactionsPerYear, {
    'Access-Control-Allow-Origin': '*'
  });
mock
  .get('/data/transactional-services/summaries?sort_by=_timestamp%3Adescending&filter_by=service_id%3Adwp-carers-allowance-new-claims&filter_by=type%3Aseasonally-adjusted&flatten=true&limit=5')
  .any()
  .reply(200, transactionServicesData, {
    'Access-Control-Allow-Origin': '*'
  });

var server = http.createServer(mock.handler);
server.listen(1337, function () {
  console.log('Mock stagecraft/backdrop listening on 1337!');
});
