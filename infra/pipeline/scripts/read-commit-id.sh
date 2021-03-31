#!/usr/bin/env bash

# This script generates a commit sha short hash used by Jenkinsfile to tag/label docker images

get_commit_sha () {
	echo $(cd $1; git rev-parse --short HEAD)
}

if [[ $1 != "" ]]; then
	repo_dir=$1
else
	repo_dir="."
fi

short_sha=$(get_commit_sha $repo_dir)

echo $short_sha
