#!/bin/bash

echo "Copying build to Storage"
gsutil defacl ch -u AllUsers:READER gs://$STORAGE_BUCKET
gsutil rsync -R /tmp/workspace/dist gs://$STORAGE_BUCKET
gsutil setmeta -h "Cache-Control:private" \
  gs://$STORAGE_BUCKET/*.js