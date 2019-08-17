# google-apps-script-sheets-to-front-end-crud

The Google Sheets (GS) are confortable, powerful and free tool to keep data.
The Google Apps Scripts can handle GET and POST requests and is natively connected to google sheets as data storage.
netlify.com allows to host html+js pages from git.

joined together it may be a solution for numerous business cases.
and it's free, serverles and robust.

here will be the fishbone scrips that I use for GS to Web UI integrations

# Getting started
Separate GS with backend scripts from GS with data. It's safe, scaleable and don't cofuse users.
As scripts works as API and are nested in GS i name those files as GAPI {project name}
here is a template 
https://docs.google.com/spreadsheets/d/1toEbphpNpyR8v6mXPvZFpQ6cNyCpSR8YGydC7iOQMqI/edit?usp=sharing

# GAPI file sheets
a. "config" - it's good idea to keep as much as you can out from script. that makes changes faster and makes script reusable.
b. "web log" - to debug and log web requests and responses i log them here
c. "console" - sometimes results and error detaila need to be printed somewhere.


