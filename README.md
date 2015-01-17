## _readline_
> Read a file line by line.

## Install

## Important. In node 10 there is a core module named readline. Please use linebyline instead, it is the same module just renamed:
[Npm linebyline](https://www.npmjs.com/package/linebyline)

```sh
npm install linebyline
```

## Test
```sh
npm install .
npm test

```


## What's this?

Simple streaming readline module for NodeJS. Reads a file and buffer new lines emitting a _line_ event for each line.

## Usage
```js
  var readline = require('linebyline'),
      rl = readline('./somefile.txt');
  rl.on('line', function(line) {
    // do something with the line of text
  })
  .on('error', function(e) {
    // something went wrong
  });
```

## License

BSD © [Craig Brookes](http://craigbrookes.com/)
