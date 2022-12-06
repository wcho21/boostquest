#!/bin/bash
for ((i=1;i<=100;i+=1)); do
  diff answers/31/$i.txt solve_answers/31/$i.txt --brief
  diff answers/32/$i.txt solve_answers/32/$i.txt --brief
done
