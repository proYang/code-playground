#!/bin/bash
a=21
b=20
if [ $a == $b ]
then
  echo '=='
elif [ $a -gt $b ]
then
  echo '>'
elif [ $a -lt $b ]
then 
  echo '<'
else 
  echo 'nothing'
fi