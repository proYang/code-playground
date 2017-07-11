#!/bin/bash
./hello.sh
for file in `ls ./`
do
  printf "${file}\n" >> bash.log
done
echo `date` >> bash.log
printf "\n\n\n\n" >> bash.log