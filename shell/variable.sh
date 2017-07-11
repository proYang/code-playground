#!/bin/bash
name="slaneyang"
echo $name
echo ${name}
echo "Hello ${name}"


readonly name
name="yang"
echo ${name}

echo ${#name}
printf "${name} \n next line"
echo "${name} \n next line"

echo `date`
