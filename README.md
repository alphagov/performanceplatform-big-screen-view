# Performance Platform big screen view

This project is a JavaScript application for displaying data from
the Performance Platform fullscreen on a large display, like maybe in building receptions and offices and teleprompters and cinemas before the films start and also turbo-trons and maybe even Google Glass where space is at a premium so you need big numbers to really get the message across.

The style was inspired by @demotive's [gds-performance-slides](https://github.com/Demotive/gds-performance-slides) ([available on Heroku](https://gds-screens-slides.herokuapp.com/)).

## Setup

#### getting the right version of node

Firstly, it is recommended that you set up Node Version Manager on your host. See the ([nvm]) README for installation instructions.

[nvm]: https://github.com/creationix/nvm

Now install the specified version of node (specified in the `.nvmrc` file [e.g. 6.11.2]) using nvm:

```bash
nvm install 6.11.2
```

To check you have the correct version of node installed:

```bash
nvm which

Found '/Users/<username>/<path to>/performanceplatform-big-screen-view/.nvmrc' with version <6.11.2>
/Users/<username>/.nvm/versions/node/v6.11.1/bin/node
```

Now tell nvm to use the version of node specified in the `.nvmrc` file:

```bash
nvm use
```

#### installing dependencies

This project uses [gulp.js][gulp] to build. Install it with `npm install -g gulp` or just run
`npm install` in this project and use the local version at `./node_modules/gulp/bin/gulp.js`.

[gulp]: http://gulpjs.com/

## Running the app

The app uses the [Performance Platform client](https://github.com/alphagov/performanceplatform-client.js). Run `npm install` to make sure you have an up-to-date version of this repo which hasn't been touched in 2 years.

To start a development server:

```
gulp server
```

Then hit a valid dashboard URL eg. http://localhost:8080/public/performance/big-screen/carers-allowance

To run the tests:

```
npm test
```

**Note**

There are a set of functional tests that are intended only to be run on the continuous integration environment. They _can_ be run locally, but the side effect is that they rewrite the root-level `config.json` file, so you will need to revert it after running the tests.

These tests are not run locally by default
