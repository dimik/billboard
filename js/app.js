requirejs.config({
    baseUrl: 'js/lib',
    paths: {
        ymaps: '//api-maps.yandex.ru/2.0/?lang=ru-RU&load=package.full&coordorder=longlat',
        jquery: '//yandex.st/jquery/2.0.3/jquery.min',
        bootstrap: '//yandex.st/bootstrap/2.3.2/js/bootstrap.min',
        ready: 'ymaps-ready'
    },
    config: {
        'map-view': {
            // ID контейнера с картой.
            container: 'map',
            state: {
                center: [37.573856, 55.751574],
                zoom: 9,
                behaviors: ['default', 'scrollZoom']
            },
            options: {},
            placemarkOptions: {
            preset: 'islands#blueCircleDotIcon'
            },
            clusterOptions: {
                preset: 'twirl#blueClusterIcons',  
                
         'map-list-view': {
            title: 'Выберите станцию метро',
            theme: 'warning',
            position: { right: 25, top: 5 }
        },           
          }      
        },
                'map-search-view': {
            title: 'Поиск',
            theme: 'info',
            kladr: {
                url: 'http://kladr-api.ru/api.php',
                contentType: 'street',
                cityId: '7700000000000',
                withParent: 0,
                limit: 5,
                token: '52024d6c472d040824000221',
                key: '6cf033712aa73a4a26db39d72ea02bb682c8e390'
            },
            typeahead: {
                items: 5,
                minLength: 3
            },
            position: { left: 25, top: 5 }
        },
        'geoobjects-model': {
            // Урл до файла с данными.
            url: 'data.json'
        }
    },
    /*map: {
        '*': { jquery: 'jquery-private' },
        'jquery-private': { jquery: 'jquery' }
    },*/
    shim: {
        ymaps: {
            exports: 'ymaps'
        },
        bootstrap: {
            deps: ['jquery'],
            exports: '$.fn.typeahead'
        },
        jquery: {
            exports: '$'
        }
    },
    // enforceDefine: true,
    waitSeconds: 0
});

require(['offices-map'], function (Offices) {
    var offices = new Offices();

    offices.init();
});
