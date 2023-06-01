#!/bin/bash

glances -t=1 --quiet -w --disable-webui >/dev/null &
cpu=""
while [ "${cpu}" == "" ]; do
    sensors=$(curl -s 'http://127.0.0.1:61208/api/3/sensors')
    cpu=$(curl -s 'http://127.0.0.1:61208/api/3/cpu')
    sleep 1
done
echo "{\"sensors\":${sensors}, \"cpu\":${cpu}}"
kill $!
