# RELEASE CONTROL PANEL

[![Build Status](https://travis-ci.org/hmrc/release-control-panel-ui.svg?branch=master)](https://travis-ci.org/hmrc/release-control-panel-ui) [ ![Download](https://api.bintray.com/packages/hmrc/releases/release-control-panel-ui/images/download.svg) ](https://bintray.com/hmrc/releases/release-control-panel-ui/_latestVersion)

A tool made by the CATO team to see what can be released in the next iteration.
This particular repository contains only the UI part of the tool.
Backend of the tool can be found here: [https://github.com/HMRC/release-control-panel-api](https://github.com/HMRC/release-control-panel-api)

## Installation 
Before the first run of the UI please make sure you have installed Python 2.7 or 3.5 on your local environment.
It will be used for hosting any resources included in this application. All Javascript and CSS files were
pre-compiled for your ease of use so there's no need to compile them yourself.

## Starting local server
To start the server just run following command.

**Windows**
Open Powershell and run:
```bash
start-server.ps1
```

**Linux and macOS (OS X)**
Open Terminal and run:
```bash
start-server.sh
```

You should see the familiar output of Python HTTP Server being printed into the console:
```
Serving HTTP on 0.0.0.0 port 3000 (http://0.0.0.0:3000/) ...
```

## Compiling the sources manually
In order to compile the tools sources by yourself you'll have to install Node.js on your computer. I'm currently using `v6.1.0`
but I know it works fine on `v7.7.3` which is current at the time of writing this document.

Next step would be to pull required packages from npm. Open the command line of your choice, navigate to the project root directory 
(where this README.md file is located) and run: `npm install`

This should install the latest packages required for the development of this project.

Next step would be to start the build server which makes sure all the changes you make to source files gets compiled into the files
used in the browser. To do that just execute following command in the root directory of the project:
```bash
npm run-script continuous
```

You're all set. Happy coding!