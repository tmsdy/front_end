#!/bin/sh
cd /Users/fei_han/Desktop/learn/front_end/nodeJs/new_learn/base/logs
cp access.log ./access/$(date +%Y-%m-%d).access.log
echo "" > access.log