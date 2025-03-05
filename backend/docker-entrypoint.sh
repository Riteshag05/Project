#!/bin/sh

# Start backend server
cd /app/backend
node dist/main.js &

# Start frontend server
cd /app
serve -s frontend -l 5000 &

# Wait for any process to exit
wait -n

# Exit with status of process that exited first
exit $?