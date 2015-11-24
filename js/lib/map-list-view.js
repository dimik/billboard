define(['ready!ymaps', 'jquery', 'module', 'bootstrap'], function (ymaps, jQuery, module) {

var config = module.config();

var ListBoxLayout = ymaps.templateLayoutFactory.createClass(
    '<div class="btn-group">' +
        '<button class="btn[if data.theme] btn-$[data.theme][endif] dropdown-toggle" data-toggle="dropdown">$[data.title]&nbsp;<span class="caret"></span></button>' +
        '<ul id="childcontainer" class="dropdown-menu" style="height: 150px; overflow: scroll;"/>' +
    '</div>', {

    build: function () {
        ListBoxLayout.superclass.build.call(this);

        this.childContainerElement = jQuery('#childcontainer').get(0);
        this.events.fire('childcontainerchange', {
            newChildContainerElement: this.childContainerElement,
            oldChildContainerElement: null
        });
    },

    // Переопределим метод, который требует интерфейс IGroupControlLayout.
    getChildContainerElement: function () {
        return this.childContainerElement;
    }
}),

// Создание макета элемента раскрывающегося списка.
ListBoxItemLayout = ymaps.templateLayoutFactory.createClass('<li><a href="#">$[data.content]</a></li>'),

// Создание макета разделителя раскрывающегося списка.
ListBoxSeparatorLayout = ymaps.templateLayoutFactory.createClass('<li class="divider"></li>');

function MapListView(map) {
    this.events = new ymaps.event.Manager();

    this._map = map;
    this._control = null;
}

MapListView.prototype = {
    constructor: MapListView,
    render: function (data) {
        this._control = this._createControl(data);

        this._map.controls
            .add(this._control, config.position);

        this._attachHandlers();
    },
    clear: function () {
        this._detachHandlers();

        this._map.controls
            .remove(this._control);
    },
    _attachHandlers: function () {
        this._control.events
            .add('click', this._onItemSelected, this);
    },
    _detachHandlers: function () {
        this._control.events
            .remove('click', this._onItemSelected, this);
    },
    _onItemSelected: function (e) {
        var item = e.get('target');

        if(!(item instanceof ymaps.control.ListBox)) {
            this.events.fire('itemselected', {
                target: item,
                content: item.data.get('content')
            });
        }
    },
    //_createControl: function (data) {
    //    var stations = {};

    //    data.each(function (geoObject) {
    //        jQuery.each(geoObject.properties.get('subway').split(', '), function (k, v) {
    //            stations[v] = true;
   //         });
        });

        return new ymaps.control.ListBox({
            data: {
                title: config.title,
                theme: config.theme
            },
            items: jQuery.map(Object.keys(stations).sort(), function (station) {
                return new ymaps.control.ListBoxItem({ data: { content: station }}, { layout: ListBoxItemLayout });
            })
        }, {
            layout: ListBoxLayout,
            expandOnClick: false
        });
    }
};

return MapListView;

});
