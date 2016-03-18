#!/usr/bin/python
import time
import requests
from subprocess import call

# Reading keylogs and counting pressed keys
f = open('/home/logzee/mineme/keys.log', 'r');
log_lines = f.read().split('\n');

count = 0

for line in log_lines:
    line = line[line.find('>')+1:]
    count += len(line)

# Sending request to the MineMe:
# { "chain" : [ "4", "$count" ] }
if count > 0:
	requests.post("http://mineme-logzee.rhcloud.com/ins-handle.jsp", data = '{ "chain" : [ "4", "' + str(count) + '" ] }')

# Erasing keys.log
time.sleep(1)
open('/home/logzee/mineme/keys.log', 'w').close()