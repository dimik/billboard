define(['ready!ymaps', 'jquery', 'module'], function (ymaps, jQuery, module) {

var config = module.config();

function MapView(options) {
    this._map = this._createMap();

    this._geoObjects = null;
    this._clusterer = null;
    this.events = new ymaps.event.Manager();
};

MapView.prototype = {
    constructor: MapView,
    _createMap: function () {
        return new ymaps.Map(
            config.container,
            config.state,
            config.options
        );
    },
    _attachHandlers: function () {
    },
    _detachHandlers: function () {
    },
    destroy: function () {
        this._map.destroy();
    },
    getMap: function () {
        return this._map;
    },
    render: function (geoObjects) {
        this._geoObjects = geoObjects;
        geoObjects.setOptions(config.placemarkOptions);

        this._clusterer = this._createClusterer(geoObjects);
        this._map.geoObjects.add(this._clusterer);
		this._map.controls.add('zoomControl', { left: 5, top: 39 });
        return this;
    },
    clear: function () {
        this._map.geoObjects.remove(this._clusterer);
        this._geoObjects = null;
        this._clusterer = null;

        return this;
    },
    setBounds: function (bounds) {
        this._map.setBounds(bounds);
    },
    showPointsByStation: function (station) {
        var points = this._geoObjects.search(function (geoObject) {
                return geoObject.properties.get('subway', '').indexOf(station) > -1;
            });

        this._map.setBounds(points.getBounds(), {
            checkZoomRange: true
        });
    },

//  _createClusterer: function (geoObjects) {
//        var BalloonContentLayout = ymaps.templateLayoutFactory.createClass([
//                '<strong>$[properties.name]</strong>',
//                '<br/>$[properties.address]<br/>',
//                '$[properties.cost]<br/>',
//                '<a target="_blank" href="$[properties.url]">подробнее</a>'
//                ].join(''));

//        return geoObjects.clusterize(jQuery.extend({
//            hintContentBodyLayout: ymaps.templateLayoutFactory.createClass('$[properties.name]'),
//            balloonContentBodyLayout: BalloonContentLayout,
//            clusterBalloonItemContentLayout: BalloonContentLayout
//        }, config.clusterOptions));
//    }
//};
 _createClusterer: function (geoObjects) {
        var BalloonContentLayout = ymaps.templateLayoutFactory.createClass([
          '<strong>$[properties.name]</strong>',
          '<br/>$[properties.address]<br/>',
          '$[properties.cost]<br/>',
          '<a target="_blank" href="$[properties.url]">подробнее</a>'
        ].join(''));
        var ClusterBalloonMainContentLayout = ymaps.templateLayoutFactory.createClass('', {
          build: function () {
              ClusterBalloonMainContentLayout.superclass.build.call(this);
              this._stateListener = this.getData().state.events.group()
                .add('change', this._onStateChange, this);

              this.activeObject = this.getData().state.get('activeObject');
              this._initSubLayout();
          },
          clear: function () {
              this._destroySubLayout();
              this._stateListener.removeAll();
              ClusterBalloonMainContentLayout.superclass.clear.call(this);
          },
          _onStateChange: function () {
              var newActiveObject = this.getData().state.get('activeObject');

              if(newActiveObject != this.activeObject) {
                  this.activeObject = newActiveObject;
                  this._destroySubLayout();
                  this._initSubLayout();
              }
          },
          _initSubLayout: function () {
              this._subLayout = new BalloonContentLayout({
                  options: this.options,
                  properties: this.activeObject.properties
              });
              this._subLayout.setParentElement(this.getParentElement());
          },
          _destroySubLayout: function () {
              if(this._subLayout) {
                this._subLayout.setParentElement(null);
                this._subLayout.destroy();
              }
          }
      });
      var ClusterBalloonSidebarItemLayout = ymaps.templateLayoutFactory.createClass([
         '<ymaps class="ymaps-b-cluster-tabs__menu-item[if data.isSelected] ymaps-b-cluster-tabs__menu-item_current_yes[endif]">',
         '<ymaps class="ymaps-b-cluster-tabs__menu-item-text">',
             'Щит <strong>$[properties.itemLetter]</strong>',
         '</ymaps>',
         '</ymaps>'
      ].join(''), {
          build: function () {
              ClusterBalloonSidebarItemLayout.superclass.build.call(this);

              var geoObjectProps = this.getData().properties;
              if(!geoObjectProps.get('itemLetter')) {
                geoObjectProps.set('itemLetter', String.fromCharCode(this.getData().data.get('itemNumber') + 1040));
              }
          }
      });

        return geoObjects.clusterize(jQuery.extend({
            hintContentBodyLayout: ymaps.templateLayoutFactory.createClass('$[properties.name]'),
            balloonContentBodyLayout: BalloonContentLayout,
            clusterBalloonMainContentLayout: ClusterBalloonMainContentLayout,
            clusterBalloonSidebarItemLayout: ClusterBalloonSidebarItemLayout
        }, config.clusterOptions));
    }
};

return MapView;

});
