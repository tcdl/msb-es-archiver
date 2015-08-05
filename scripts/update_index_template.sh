#!/bin/bash
if [ -z "$MSB_ES_URLS" ]; then echo "MSB_ES_URLS must be provided to load index template"; exit 0; fi;
MSB_ES_URL=`echo $MSB_ES_URLS | grep -o "[^\,]*"`
echo $MSB_ES_URL/_template/msb-es-archiver
cat scripts/support/template.json | curl -XPUT $MSB_ES_URL/_template/msb-es-archiver -d @-
