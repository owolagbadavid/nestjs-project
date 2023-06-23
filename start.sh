#!/bin/sh

# Start the first process
npm run migration:run

# Start the second process
if [ $? -eq 0 ]; then
    npm run start:dev
else
    echo "Migration failed"
fi