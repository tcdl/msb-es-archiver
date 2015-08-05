# msb-es-archiver
Listens to all channels and archives messages to Elasticsearch.

## Configuration

Use environment variables when running the application.

In addition to standard [MSB environment variables](https://github.com/tcdl/msb#environment-variables):
- **MSB_ES_URLS** A comma-delimited (no spaces) list of Elastic Search URLs, e.g. `MSB_ES_URLS=http://user:pass@server1:9200,http://user:pass@server2:9200` or simply `MSB_ES_URLS=http://127.0.0.1:9200`

## Usage

You should clone this repo and run `npm install` then `npm start`. Please remember to provide the neccesary configuration, as above.

If you are setting up [Kibana](https://www.elastic.co/products/kibana), the Index Pattern should be `[msb-es-archiver-]YYYYMMDD`.
