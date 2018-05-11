#!/bin/bash

echo "Copying build to Storage"
gsutil cp -r /tmp/workspace/dist/**.* gs://tokhang.nginamo.com