define(['ready!ymaps', 'jquery', 'module', 'bootstrap'], function (ymaps, jQuery, module) {

var config = module.config();

function MapSearchView(map) {
    this._map = map;
    this._control = null;
}

MapSearchView.prototype = {
    constructor: MapSearchView,
    render: function (data) {
        this._control = this._createControl(data);

        this._map.controls
            .add(this._control, config.position);
    },
    clear: function () {
        this._map.controls
            .remove(this._control);

        this._control = null;
    },
    _createControl: function (data) {
        return new ymaps.control.SearchControl({
            layout: SearchControlLayout
        });
    }
};

SearchControlLayout = ymaps.templateLayoutFactory.createClass(
    '<form class="form-search">' +
        '<div class="input-append">' +
            '<input type="text" class="span4 search-query" data-provide="typeahead">' +
            '<button type="submit" class="btn' + (config.theme? ' btn-' + config.theme : '') + '">' + config.title + '</button>' +
        '</div>' +
    '</form>', {

    build: function () {
        SearchControlLayout.superclass.build.call(this);

        this.onSubmit = ymaps.util.bind(this.onSubmit, this);
        this.onFieldChange = ymaps.util.bind(this.onFieldChange, this);
        this.dataSource = ymaps.util.bind(this.dataKladrSource, this);

        this.form = jQuery('.form-search')
            .on('submit', this.onSubmit);

        this.field = jQuery('.search-query')
            .on('change', this.onFieldChange)
            .typeahead(jQuery.extend({ source: this.dataSource }, config.typeahead));

        this.getData().state.events.add('change', this.onStateChange, this);
        // this.getData().control.events.add('resultshow', this.onShowResult, this);
    },

    clear: function () {
        // this.getData().control.events.remove('resultshow', this.onShowResult, this);
        this.getData().state.events.remove('change', this.onStateChange, this);
        this.field.off();
        this.form.off('submit', this.onSubmit);

        SearchControlLayout.superclass.clear.call(this);
    },

    onFieldChange: function () {
        if(this.field.is(':focus')) {
            this.form.trigger('submit');
        }
    },

    dataKladrSource: function (query, callback) {
        jQuery.ajax({
            url: config.kladr.url,
            dataType: 'jsonp',
            data: jQuery.extend({ query: query }, config.kladr),
            context: this,
            success: function (json) {
                var results = [];

                for(var i = 0, len = json.result.length; i < len; i++) {
                    var result = json.result[i],
                        parent = result.parents && result.parents[0];

                    results.push(
                        (parent && (parent.name + ' ' + parent.type + ', ') || '') +
                        result.type + ' ' + result.name
                    );
                }

                callback(results);
            }
        });
    },

    onSubmit: function (e) {
        e.preventDefault();

        this.events.fire('search', {
            request: this.field.val()
        });
    },

    onStateChange: function () {
        var results = this.getData().state.get('results'),
            result = results && results[0];

        if(result) {
            result.options.set('preset', 'twirl#darkgreenStretchyIcon');
            result.properties.set('iconContent', result.properties.get('name'));
            // Можно определить свой макет иконки.
            // result.options.set('iconLayout', ymaps.templateLayoutFactory.createClass('<i class="icon-google_maps icon-large"/>'));
            // result.options.set('iconOffset', [-8, -28]);
            // Открытие балуна на результате
            // result.events.add('mapchange', this.onShowResult, this);
        }
    },

    onShowResult: function (e) {
        /*
        var index = e.get('resultIndex'),
            result = this.getData().control.getResult(index);

        result.then(function (res) {
            res.balloon.open();
            console.log('result: ', res);
        }, function (err) {
            console.log('error: ', err);
        });
        */
        e.get('target').events.remove('mapchange', this.onShowResult, this);
        e.get('target').balloon.open();
    }
});

return MapSearchView;

});
