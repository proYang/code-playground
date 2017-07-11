#!/bin/bash

run(){
  name='yang'
  echo "This is a function"
  return ${name}
}
echo "----即将调用----"
run
echo "$?"
echo "----调用结束----"