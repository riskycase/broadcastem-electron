# ![Logo](./icon-64x64.png) Broadcast 'em
A file server based on node.js that allows sharing files over HTTP on the same
 local network, and possibly over the internet if bridging is used

## Badges
[![Build Status](https://travis-ci.com/riskycase/file-server.svg?branch=master)](https://travis-ci.com/riskycase/file-server)
[![Coverage report](https://gitlab.com/riskycase/file-server/badges/master/coverage.svg)](https://gitlab.com/riskycase/file-server/-/commits/master)
[![Depfu](https://badges.depfu.com/badges/676150a60ab4fce2f90451fc5422a308/status.svg)](https://depfu.com)
[![Depfu](https://badges.depfu.com/badges/676150a60ab4fce2f90451fc5422a308/overview.svg)](https://depfu.com/gitlab/riskycase/file-server?project_id=12583)
[![Maintainability](https://api.codeclimate.com/v1/badges/1211097ff94e3af18c35/maintainability)](https://codeclimate.com/github/riskycase/file-server/maintainability)

## Setup

* Make sure node.js is installed along with npm, and yarn is available (npm 
install -g yarn)
* Open a command line tool (Command Prompt or Powershell for Windows and bash
shell in Linux)
* Clone the repo `git clone https://github.com/riskycase/file-server.git` or 
your own fork
* Navigate to the folder `cd file-server`
* Install all dependencies `yarn install`
* Start the server using the inbuilt script `npm start`
* Open a browser and go to `localhost:3000` to make sure everything is working

## Usage

### Options

```
	Usage
	  $ npm start [options] [files]
	  files is an array of paths to files you want to share

	Options
	  --destination, -d	PATH	Save uploaded files to folder specified in path (defaults to uploads folder in app directory)
	  --list, -l		PATH	Read files to share from the list given in path
	  --port, -p		PORT	Start server on specified port (default 3000)

	Examples
	  $ npm start 
```

* Start the server from the usage options given
* Get the IP address of the current device (which is host) on the local network
(let us assume it to be `192.168.1.2`)
* On another device present on the same network, open the following link:
`(IP address):(port)` (here `192.168.1.2:3000`)
* Download the files shared and/or upload any files you want to share to the 
host device
* Retrieve the files sent from the uploads folder
