# setup
* license: MIT (to use wallaby open source license)

## Testing
to be able to run test e.g. with `npm run test` or with wallaby (open source)
* https://www.browserstack.com/guide/fixing-cannot-use-import-statement-outside-module-jest
* install jest: `npm install --save-dev jest`
* install babel to fix module import/export issue:
  * `npm install --save-dev babel-jest @babel/core @babel/preset-env`
  * create babel.config.js
    ```
    module.exports = {
        presets: ['@babel/preset-env'],
        plugins: ['@babel/plugin-transform-modules-commonjs']
    };
    ```
  * update jest.config.js
    ```
    module.exports = {
        transform: {
            "^.+\\.(js|jsx)$": "babel-jest"
        }
    }; 
    ```
  * create wallaby.js and LICENSE-file
    ```
    module.exports = function () {
        return {
          // autoDetect: true,
        };
    };
    ```
  * update test-task in package.json: `"test": "jest"`

