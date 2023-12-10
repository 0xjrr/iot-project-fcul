#!/bin/sh
# wait-for-mysql.sh

set -e

host="$1"
shift
cmd="$@"

until mysqladmin ping -h "$host" --silent; do
  echo 'Waiting for MySQL to become available...'
  sleep 1
done

echo 'MySQL is up and available!'
exec $cmd
