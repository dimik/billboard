define(function (require, exports, module) {

var GeoObjectsModel = require('geoobjects-model'),
    MapView = require('map-view'),
    //MapListView = require('map-list-view'),
    MapSearchView = require('map-search-view');

function OfficesMap() {
    this._mapView = new MapView();
    //this._mapListView = new MapListView(this._mapView.getMap());
    this._mapSearchView = new MapSearchView(this._mapView.getMap());
    this._geoObjects = new GeoObjectsModel();
}

OfficesMap.prototype = {
    constructor: OfficesMap,
    init: function () {
        this._geoObjects.load()
            .then(this._onGeoObjects.bind(this))
            // .fail(console.log);
        this._attachHandlers();
    },
   _attachHandlers: function () {
   //   this._mapListView.events
   //         .add('itemselected', this._onListItemSelected, this);
   },
    _detachHandlers: function () {
   //     this._mapListView.events
   //         .remove('itemselected', this._onListItemSelected, this);
   },
   _onListItemSelected: function (e) {
       // this._mapView.showPointsByStation(e.get('content'));
   },
    _onGeoObjects: function () {
        var geoObjects = this._geoObjects.getResult();

        this._mapView.render(geoObjects);
        this._mapSearchView.render();
       // this._mapListView.render(geoObjects);
    }
};

module.exports = OfficesMap;

});
