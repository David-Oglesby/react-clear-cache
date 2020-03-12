# react-clear-cache

> A component to manage application updates. Changes made to work with a node/react site with node being in the root and react in the client (or whatever you call it) folder.

## Demo

1. Install in react folder
2. Add cd client && node ./node_modules/react-clear-cache/bin/cli.js to node package.json install (i.e. "postinstall": "cd client && node ./node_modules/react-clear-cache/bin/cli.js && npm install && npm install --only=dev --no-shrinkwrap && npm run build")
3. Add clear-cache route to app.js => app.use('/clear-cache', clearCacheRouter);
4. Add following route to ClearCacheRoutes.js
  ```
  router.route('/').post(WrapAsync.main(async (req, res, next) => { 
    return res.status("200").send({
      version:clearCache.version,
    });
  }));
  ```
5. Update react app.js (or index.js)
```
  import { useClearCache } from "react-clear-cache";
  ...
  const App = () => {
    const { isLatestVersion, emptyCacheStorage } = useClearCache({ duration: 600000 }); //every 60 minutes
    if (!isLatestVersion) {
      emptyCacheStorage();
    }
 ...
```


## Install
npm install https://github.com/David-Oglesby/react-clear-cache.git

## Add script in package.json

## Usage

### Using `render props`:

### Using `hooks`:

## Props

### `duration`: number

### `auto`: boolean

## Render props

### `loading`: boolean

### `isLatestVersion`: boolean

### `emptyCacheStorage`: () => void

## Contributors

## License

MIT © [David-Oglesby](https://github.com/David-Oglesby)

## Development

## Note

This is not setup to work with other projects. Try to get https://github.com/noahjohn9259/react-clear-cache to work first. But if you have a react/node site and have trouble getting it to work, send me a message if you need help.
