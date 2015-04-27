var http = require('http'),
  hock = require('hock');

var kpiDashboard = require('../functional/responses/kpi-dashboard.json');
var kpiWithDeltaDashboard = require('../functional/responses/kpi-with-delta-dashboard.json');
var realtimeDashboard = require('../functional/responses/realtime-dashboard.json');

var transactionServicesData = require('../functional/responses/transactional-services-data.json');
var realtimeData = require('../functional/responses/realtime-data.json');

var mock = hock.createHock();

//dashboards
mock
  .get('/public/dashboards?slug=kpi')
  .max(Infinity)
  .reply(200, kpiDashboard, {
    'Access-Control-Allow-Origin': '*'
  });
mock
  .get('/public/dashboards?slug=kpi-with-delta')
  .max(Infinity)
  .reply(200, kpiWithDeltaDashboard, {
    'Access-Control-Allow-Origin': '*'
  });
mock
  .get('/public/dashboards?slug=realtime')
  .max(Infinity)
  .reply(200, realtimeDashboard, {
    'Access-Control-Allow-Origin': '*'
  });

//data-requests
mock
  .get('/data/transactional-services/summaries?sort_by=_timestamp%3Adescending&filter_by=service_id%3Adwp-carers-allowance-new-claims&filter_by=type%3Aseasonally-adjusted&flatten=true&limit=5')
  .any()
  .reply(200, transactionServicesData, {
    'Access-Control-Allow-Origin': '*'
  });

mock
  .get('/data/carers-allowance/realtime?limit=722&sort_by=_timestamp%3Adescending&flatten=true')
  .any()
  .reply(200, realtimeData, {
    'Access-Control-Allow-Origin': '*'
  });

var server = http.createServer(mock.handler);
server.listen(1337, function () {
  console.log('Mock stagecraft/backdrop listening on 1337!');
});
