#!/bin/bash

echo "Copying build to Storage"
gsutil rsync -R /tmp/workspace/dist gs://tokhang.nginamo.com