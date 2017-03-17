#!/usr/bin/env sh

cd public

pythonVersion="$(python -c 'import sys; print(sys.version_info[:])')"

if [[ $pythonVersion == "(2,"* ]];
then
    python -m SimpleHTTPServer 3000
else
    python -m http.server 3000
fi

cd ..