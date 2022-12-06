#!/bin/bash

echo "1-road"
cd 1-road
./checkAnswers.sh

echo "2-potato"
cd ../2-potato
./checkAnswers.sh

echo "3-proof-of-work"
cd ../3-proof-of-work
./checkAnswers.sh

# TODO: restore missing scripts for 4th problem
