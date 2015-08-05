var helpers = exports;

helpers.topicWithoutInstanceId = function(topic) {
  return topic.replace(/\:[a-f0-9]+$/, '');
};
