Push-Location public

$pythonVersion = python -c 'import sys; print(sys.version_info[:])'

IF ($pythonVersion.StartsWith("(2, "))
{
    python -m SimpleHTTPServer 3000
}
ELSE
{
    python -m http.server 3000
}

Pop-Location