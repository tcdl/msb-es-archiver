var _ = require('lodash');
var debug = require('debug')('msb:es-archiver');
var msb = require('msb');
var channelManager = msb.channelManager;
var EventEmitter = require('events').EventEmitter;
var logger = module.exports = new EventEmitter();

var consumersByTopic = {};

logger.onUpdatedChannels = function(doc) {
  var channelInfoByTopic = doc.infoByTopic;
  var topics = Object.keys(channelInfoByTopic);
  var existingConsumerTopics = Object.keys(consumersByTopic);

  // Find consumers to add
  var newTopics = _.reject(topics, logger._inThisArrFn, existingConsumerTopics);
  newTopics.forEach(logger._addConsumerForTopic);

  // Find consumers to remove
  var removedTopics = _.select(existingConsumerTopics, logger._notInThisArrFn, topics);
  removedTopics.forEach(logger._removeConsumerForTopic);

  if (newTopics.length || removedTopics.length) {
    debug(existingConsumerTopics.length + ' +' + newTopics.length + ' -' + removedTopics.length + ' =' + Object.keys(consumersByTopic).length, topics);
  }
};

logger._logMessage = function(message) {
  logger.emit('message', message);
};

logger._addConsumerForTopic = function(topic) {
  var shouldBeDurable = !topic.match(/\:(ack|response)\:[0-9a-f]+$/);
  var consumer = consumersByTopic[topic] = (channelManager.createRawConsumer || channelManager.createConsumer)(topic, { durable: shouldBeDurable });
  consumer.on('message', logger._logMessage);
};

logger._removeConsumerForTopic = function(topic) {
  var consumer = consumersByTopic[topic];
  delete(consumersByTopic[topic]);

  consumer.removeListener('message', logger._logMessage);
  consumer.close();
};

logger._inThisArrFn = function(val) {
  return ~this.indexOf(val);
};

logger._notInThisArrFn = function(val) {
  return !~this.indexOf(val);
};
