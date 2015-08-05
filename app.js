var msb = require('msb');
var elasticsearch = require('elasticsearch');
var channelMonitor = msb.channelMonitor;
var logger = require('./lib/logger');
var helpers = require('./lib/helpers');
var packageJson = require('./package');

var esHosts = (process.env.MSB_ES_URLS || 'localhost:9200').split(',');

var client = new elasticsearch.Client({
  hosts: esHosts
});

logger.on('message', function(message) {
  if (message.topics.response) logger.ensureConsumerForTopic(message.topics.response);

  var timestamp = message.meta.createdAt = new Date(message.meta.createdAt);
  var monthStr = ('0' + (timestamp.getUTCMonth() + 1)).substr(-2);
  var dateStr = ('0' + timestamp.getUTCDate()).substr(-2);
  var indexName = packageJson.name + '-' + timestamp.getUTCFullYear() + monthStr + dateStr;

  client.create({
    index: indexName,
    id: message.id,
    type: helpers.topicWithoutInstanceId(message.topics.to),
    timestamp: timestamp,
    body: {
      correlationId: message.correlationId,
      topics: message.topics,
      tags: message.tags,
      meta: message.meta,
      ack: message.ack,
      payload: message.payload
    }
  }, function(err) {
    if (err) {
      console.error(err, message);
    }
  });
});

channelMonitor
.on('updated', logger.onUpdatedChannels)
.startMonitoring();

console.log('Running : ' + packageJson.name + '.v' + packageJson.version);
