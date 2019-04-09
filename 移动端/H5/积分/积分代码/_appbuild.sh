#!/bash/sh
now () {
    date +"%Y-%m-%d %H:%M:%S"
}

if [[ $NODE_ENV == "fat" || $NODE_ENV == "development" ]]; then
    npm run build:test
elif [[ $NODE_ENV == "pre" ]]; then
    npm run pre
else
    npm run build
fi
