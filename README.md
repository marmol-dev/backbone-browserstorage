# backbone-localstorage
Backbone Model and Collection stored in localstorage

## Installation
`bower install backbone-browserstorage`

or 

`git clone https://github.com/tomymolina/backbone-browserstorage.git`

 
## Usage

### Backbone.LocalStorageModel (or Backbone.BrowserStorageModel)
The same usage as Backbone.Model. When you create the object you have to pass as second argument an object with an attribute key `localStorageKey` and a string as value.

**Example:** 

```javascript 
var Settings = Backbone.LocalStorageModel.extend({
    defaults: {
        time: 5,
        visible: false
    }
});
    
var settings = new Settings({time: 6}, {localStorageKey: 'settings'});
```


### Backbone.LocalStorageCollection (or Backbone.BrowserStorageCollection)
The same usage as Backbone.Collection. When you create the collection you have to pass the `localStorageKey` (in the same way as Backbone.LocalStorageModel).

**Example:**

```javascript
var Board = Backbone.Model.extend({});

var Boards = Backbone.LocalStorageCollection.extend({
    model: Board
});

var boards = new Boards([], {localStorageKey: 'boards'});
```

## License
[Apache License 2.0](http://github.com/tomymolina/backbone-browserstorage/LICENSE)
