#!/bin/bash
for ((i=1;i<=100;i+=1)); do
  diff answers/21/$i.txt solve_answers/21/$i.txt --brief
  diff answers/22/$i.txt solve_answers/22/$i.txt --brief
done
