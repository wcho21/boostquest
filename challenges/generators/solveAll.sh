#!/bin/bash

echo "1-road"
cd 1-road
python generateAllInputCases.py
python solveAll.py

echo "2-potato"
cd ../2-potato
python generateAllInputCases.py
python solveAll.py

echo "3-proof-of-work"
cd ../3-proof-of-work
python generateAllInputCases.py
python solveAll.py

# TODO: restore missing scripts for 4th problem
