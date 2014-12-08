# Performance Platform big screen view

This project is a JavaScript application for displaying data from
the Performance Platform fullscreen on a large display, for example
in building receptions and offices.

The style was inspired by @demotive's [gds-performance-slides](https://github.com/Demotive/gds-performance-slides) ([available on Heroku](https://gds-screens-slides.herokuapp.com/)).

## Setup
This project uses [gulp.js][gulp] to build. Install it with `npm install -g gulp` or just run
`npm install` in this project and use the local version at `./node_modules/gulp/bin/gulp.js`.

[gulp]: http://gulpjs.com/

## Running the app

The app uses the [Performance Platform client](https://github.com/alphagov/performanceplatform-client.js). Run npm install to make sure you have the up-to-date copy.

To start a development server:

```
gulp server
```

Then hit a valid dashboard URL eg. http://localhost:8080/carers-allowance

To run the tests:

```
npm tests
```
