#!/bin/bash
for ((i=1;i<=100;i+=1)); do
  diff debug/$i.txt solve_debug/$i.txt --brief
  diff answers/11/$i.txt solve_answers/11/$i.txt --brief
  diff answers/12/$i.txt solve_answers/12/$i.txt --brief
done
