/* global app, L */
/*require([
	"esri/Map",
	"esri/views/MapView",
	"dojo/domReady!"
], function(Map, MapView) {
	var map = new Map({
		basemap: "streets"
	});

	var view = new MapView({
		container: "map",
		map: map,
		zoom: 15,
		center: [-75.163596, 39.952388]
	});
});*/

app.map = (function ()
{
  // the leaflet map object
  var _blankmap,
		_psmap,
		_ermap,
		_view,
    _baseLayerGroup, //= new L.LayerGroup(),
    _labelLayerGroup, //= new L.LayerGroup(),
    _overlayLayerGroup, //= new L.LayerGroup(),
    _parcelLayerGroup; //= new L.LayerGroup(),

  return {

    initMap : function () {
      app.state.map = {};
      app.state.map.clickedOnMap = false;
			localStorage.setItem('clickedOnMap', false);
      // the next 2 variables hold names for checking what is on the map
      app.state.map.nameBaseLayer;
      app.state.map.nameLabelsLayer;
			app.state.map.nameParcelLayer;
      app.state.map.namesOverLayers = [];
      // the next 2 objects hold the actual layers
      app.state.map.tileLayers = {};
      app.state.map.mapServices = {};
			app.state.map.shouldPan = true;

			app.state.map.layers = [];

      var CITY_HALL = [39.952388, -75.163596];

			/*require([
	      "esri/Map",
	      "esri/views/MapView",
	      "dojo/domReady!"
	    ], function(Map, MapView) {
				console.log('hello');
	      _map = new Map({
	        basemap: "streets"
	      });

	      _view = new MapView({
	        container: "map",
	        map: _map,
	        zoom: 15,
	        center: [-75.163596, 39.952388]
	      });
			});*/

			require(
				[
		      "esri/views/MapView",
		      "esri/WebMap",
          "esri/widgets/Legend",
		      "dojo/domReady!"
		    ],
				function(MapView, WebMap, Legend) {
		      _testmap = new WebMap({
		        portalItem: {
							//id: "1731f25ea9a24fb181c1049f7e94ff9a"
              id: "0878acc58e384f45be23e3f1a5120aab"
		        }
		      });
					app.state.map = _testmap

          _testmap.then(function () {
            // This function will execute once the promise is resolved
            console.log("_testmap loaded successfully");
            _.forEach(_testmap.layers.items, function(item, i){
              //console.log('in loop on ' + i);
              //var layer = {}
              //layer.title = item.title;
              //layer.id = item.id;
              //app.config.agoStuff.push(item.title);
              var title1 = item.title.replace(/\s+/g, '');
              var title2 = title1.replace(/,/g , '');
              app.config.agoStuff[title2] = item.id;
            });

            _.forEach(app.config.categories, function(category) {

              //var anchor = $('<a id="topic-link-' + category.replace(/\s+/g, '') + '" class="topic-link" href="#">');
              //var span = $('<span class="topic-link-icon flaticon-copy">');
              var accordian = $('#topic-' + category.replace(/\s+/g, ''));
              //console.log('accordian is: ');
              //console.log(accordian);

              //var table = $('<table>');
              var form = $('<form action="#/">'),
                fieldset = $('<fieldset class="options">'),
                ul = $('<ul class="no-bullet">');

              _.forEach(app.config.csv[category.replace(/\s+/g, '')], function(layer, i) {
                var agoInfo = app.config.agoStuff[i]
                console.log(agoInfo);
                var li = $('<li>'),
                  label = $('<label for="checkbox-'+i+'">'),
                  //input = $('<input id="checkbox-'+layer.Raw_name.substr(layer.Raw_name.indexOf('.')+1)+'" name="checkbox" type="checkbox">');
                  input = $('<input id="checkbox-'+agoInfo+'" name="checkbox" type="checkbox">');
                label.append(input);
                label.append(layer.Display_name);
                li.append(label);
                ul.append(li);
                /*var label = layer.Display_name,
                  tr = $('<tr onclick="app.map.layerOn(\''+i+'\')" id="row-'+i+'">'),
                  th = $('<th id="layer-'+i+'">');
                  //td = $('<td id="layer-'+i+'">');
                th.text(label);
                tr.append(th);
                //tr.append(td);
                table.append(tr);*/
              })
              fieldset.append(ul);
              form.append(fieldset);
              accordian.append(form);
            });
            $('.topic-link').click(function (e) {
              e.preventDefault();
              //console.log('clicked a topic');
              var $this = $(this),
                  topicName = $this.attr('id').replace('topic-link-', '');
              app.toggleTopic(topicName);
            });
            $(':checkbox').on('click', function(input) {
              console.log(input.currentTarget.checked);
              if(input.currentTarget.checked === true){
                console.log(input.currentTarget.id + ' was turned on');
                app.map.layerOn(input.currentTarget.id.substr(input.currentTarget.id.indexOf("-") + 1));
              } else {
                console.log(input.currentTarget.id + ' was turned off');
                app.map.layerOff(input.currentTarget.id.substr(input.currentTarget.id.indexOf("-") + 1));
              }
            });
          });



		      _view = new MapView({
		        map: _testmap,
		        container: "map"
		      });

          _legend = new Legend({
            view: _view,
            //layerInfos: [{
            //  layer: featureLayer,
            //  title: "NY Educational Attainment"
            //}]
          });

          app.config.agoStuff = {}


          // Add widget to the bottom right corner of the view
          //_view.ui.add(_legend, "bottom-right");
		    }
			);

/*
		require([
		"esri/Map",
		//"esri/WebMap",
		//"esri/layers/WebTileLayer",
		//"esri/views/SceneView",
		"esri/views/MapView",
		"esri/layers/TileLayer",
		"esri/layers/FeatureLayer",
		"esri/Basemap",
		//"dojo/dom",
		//"dojo/on",
		"dojo/domReady!"
	],
	function(Map, MapView, TileLayer, FeatureLayer, Basemap, dom, on) {

		var basemapLyr = new TileLayer({
			url: "//tiles.arcgis.com/tiles/fLeGjb7u4uXqeF9q/arcgis/rest/services/CityBasemap/MapServer",
			// This property can be used to uniquely identify the layer
			id: "basemap",
			visible: true
		});

		theBasemap = new Basemap({
			baseLayers: [basemapLyr],
			title: "PhillyBasemap",
			id: "phillyBasemap",
		});

		var policeStationsLyr = new FeatureLayer({
			url: "//services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Police_Stations/FeatureServer",
			// This property can be used to uniquely identify the layer
			//id: "police",
			//visible: false
		});

		var fireDeptLyr = new FeatureLayer({
			url: "//services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Fire_Dept_Facilities/FeatureServer",
			//id: "fire",
			//opacity: 0.9
		});

		_map = new Map({
			basemap: theBasemap,
			//layers: [policeStationsLyr, fireDeptLyr]
		});
		//_map.add(transportationLyr);
		_view = new MapView({
			container: "map",
			map: _map,
			zoom: 15,
			center: [-75.163596, 39.952388]
		});


		//var streetsLyrToggle = dom.byId("streetsLyr");

		//on(streetsLyrToggle, "change", function() {
		//	transportationLyr.visible = streetsLyrToggle.checked;
		//});
	});
*/

/*			app.state.map.waterDisclaimer = 'The property boundaries displayed on the map are for reference only and may not be used in place of recorded deeds or land surveys. Boundaries are generalized for ease of visualization. Source: Philadelphia Water'
			app.state.map.DORDisclaimer = 'The property boundaries displayed on the map are for reference only and may not be used in place of recorded deeds or land surveys. Dimension lengths are calculated using the GIS feature. Source: Department of Records.'
			$('.basetooltip').on('mouseover', function(){
				if (!app.state.activeTopic || app.state.activeTopic != 'deeds' && app.state.activeTopic != 'zoning'){
					app.map.baseToolTip.onMouseover(app.state.map.waterDisclaimer);
				} else {
					app.map.baseToolTip.onMouseover(app.state.map.DORDisclaimer);
				}
			});
			$('.basetooltip').on('mouseout', function(){
				app.map.baseToolTip.onMouseout();
			})
*/

      // Basemaps
/*      app.state.map.tileLayers.baseMapLight = L.esri.tiledMapLayer({
        url: app.config.esri.baseMapLightUrl,
        maxZoom: 22,
        name: 'baseMapLight',
        type: 'base',
        zIndex: 1,
      });

			app.state.map.tileLayers.baseMapDORParcels = L.esri.tiledMapLayer({
        url: app.config.esri.baseMapDORParcelsUrl,
        maxZoom: 22,
        name: 'baseMapDOR',
        type: 'base',
        zIndex: 1,
      });

      app.state.map.tileLayers.baseMapImagery2016 = L.esri.tiledMapLayer({
        url: app.config.esri.baseMapImagery2016Url,
        maxZoom: 22,
        name: 'baseMapImagery2016',
        type: 'base',
        zIndex: 2,
      });

      app.state.map.tileLayers.baseMapImagery2015 = L.esri.tiledMapLayer({
        url: app.config.esri.baseMapImagery2015Url,
        maxZoom: 22,
        name: 'baseMapImagery2015',
        type: 'base',
        zIndex: 3,
      });

      app.state.map.tileLayers.baseMapImagery2012 = L.esri.tiledMapLayer({
        url: app.config.esri.baseMapImagery2012Url,
				maxZoom: 22,
        name: 'baseMapImagery2012',
        type: 'base',
        zIndex: 4,
      });

      app.state.map.tileLayers.baseMapImagery2010 = L.esri.tiledMapLayer({
        url: app.config.esri.baseMapImagery2010Url,
        maxZoom: 22,
        name: 'baseMapImagery2010',
        type: 'base',
        zIndex: 5,
      });

      app.state.map.tileLayers.baseMapImagery2008 = L.esri.tiledMapLayer({
        url: app.config.esri.baseMapImagery2008Url,
        maxZoom: 22,
        name: 'baseMapImagery2008',
        type: 'base',
        zIndex: 6,
      });

      app.state.map.tileLayers.baseMapImagery2004 = L.esri.tiledMapLayer({
        url: app.config.esri.baseMapImagery2004Url,
        maxZoom: 22,
        name: 'baseMapImagery2004',
        type: 'base',
        zIndex: 7,
      });

      app.state.map.tileLayers.baseMapImagery1996 = L.esri.tiledMapLayer({
        url: app.config.esri.baseMapImagery1996Url,
        maxZoom: 22,
        name: 'baseMapImagery1996',
        type: 'base',
        zIndex: 8,
      });

      app.state.map.tileLayers.parcels = L.esri.tiledMapLayer({
        url: app.config.esri.parcelsUrl,
        maxZoom: 22,
        name: 'parcelOverlay',
        type: 'overlay',
        zIndex: 9,
      });

      // Overlays - Labels
      app.state.map.tileLayers.overlayBaseLabels = L.esri.tiledMapLayer({
        url: app.config.esri.overlayBaseLabelsUrl,
        maxZoom: 22,
        name: 'overlayBaseLabels',
        type: 'labels',
        zIndex: 100,
      });

			app.state.map.tileLayers.overlayBaseDORLabels = L.esri.tiledMapLayer({
        url: app.config.esri.overlayBaseDORLabelsUrl,
        maxZoom: 22,
        name: 'overlayBaseLabelsDOR',
        type: 'labels',
        zIndex: 100,
      });

      app.state.map.tileLayers.overlayImageryLabels = L.esri.tiledMapLayer({
        url: app.config.esri.overlayImageryLabelsUrl,
        maxZoom: 22,
        name: 'overlayImageryLabels',
        type: 'labels',
        zIndex: 101,
      })

      // Overlays - Other
      // right now this is not used
      app.state.map.tileLayers.overlayZoning = L.esri.tiledMapLayer({
        url: app.config.esri.overlayZoningUrl,
        maxZoom: 22,
        name: 'overlayZoning',
        type: 'overlay',
        zIndex: 10,
      });

      // right now this is used, and set to dynamicMapLayer instead of FeatureLayer
      app.state.map.mapServices.zoningMap = L.esri.dynamicMapLayer({
        url: app.config.esri.zoningMapUrl,
        maxZoom: 22,
        name: 'zoningMap',
        type: 'overlay',
        zIndex: 13,
      });

			app.state.map.mapServices.water = L.esri.dynamicMapLayer({
				url: app.config.esri.waterUrl,
				maxZoom: 22,
				name: 'water',
				type: 'overlay',
				zIndex: 14,
			});

			app.state.map.mapServices.politicalDivisions = L.esri.dynamicMapLayer({
				url: app.config.esri.politicalDivisionsUrl,
				maxZoom: 22,
				name: 'politicalDivisions',
				type: 'overlay',
				zIndex: 15,
			});

			app.state.map.zoningOpacitySlider = new L.Control.opacitySlider();
			//app.state.map.zoningOpacitySlider.setOpacityLayer(app.state.map.mapServices.zoningMap);
			//app.state.map.zoningOpacitySlider.setPosition('topleft');
			app.state.map.waterOpacitySlider = new L.Control.opacitySlider();
			//app.state.map.waterOpacitySlider.setOpacityLayer(app.state.map.mapServices.water);
			//app.state.map.waterOpacitySlider.setPosition('topleft');
*/
			/*app.state.map.mapServices.waterParcels = L.esri.dynamicMapLayer({
				url: '//gis.phila.gov/arcgis/rest/services/Water/pv_data/MapServer/0',
				maxZoom: 22,
				name: 'waterParcels',
				type: 'overlay',
				zIndex: 14,
			});*/


      // Now add to map
/*      _baseLayerGroup.addLayer(app.state.map.tileLayers.baseMapLight);
      _baseLayerGroup.addTo(_map);
      _labelLayerGroup.addLayer(app.state.map.tileLayers.overlayBaseLabels);
      _labelLayerGroup.addTo(_map);

      // The next are not used initially
      _overlayLayerGroup.addTo(_map);
      _parcelLayerGroup.addTo(_map);
      _nearbyActivityLayerGroup.addTo(_map);
			_electionFeatureGroup.addTo(_map);
      _stViewMarkersLayerGroup.addTo(_map);
      // add names of layers on the map to the DOM
      app.map.domLayerList();
*/
      // Controls
/*      new L.Control.Zoom({position: 'topright'}).addTo(_map);

      var basemapToggleButton = L.easyButton({
        id: 'baseToggleButton',
        position: 'topright',
        states: [{
          stateName: 'toggleToImagery',
          icon:      '<img src="css/images/imagery_small.png">',
          title:     'Toggle To Imagery',
          onClick: function(control) {
            toggleBasemap();
            control.state('toggletoBasemap');
          }
        }, {
          stateName: 'toggletoBasemap',
          icon:      '<img src="css/images/basemap_small.png">',
          title:     'Toggle To Basemap',
          onClick: function(control) {
            toggleBasemap();
            control.state('toggleToImagery');
          }
        }]
      });
      basemapToggleButton.addTo(_map);

      app.state.map.historicalImageryButtons = [
        L.easyButton({
          id: '2016ToggleButton',
          states:[{
            stateName: 'dateSelected',
            icon: '<strong class="aDate">2016</strong>',
            title: 'Show 2016 Imagery',
            onClick: function(control) {
            }
          }, {
            stateName: 'dateNotSelected',
            icon: '<strong class="aDate">2016</strong>',
            title: 'Show 2016 Imagery',
            onClick: function(control) {
              toggleYear(control, app.state.map.tileLayers.baseMapImagery2016);
              app.state.map.lastYearViewed = app.state.map.tileLayers.baseMapImagery2016;
            }
          }]
        }),
        L.easyButton({
          id: '2015ToggleButton',
          states:[{
            stateName: 'dateNotSelected',
            icon: '<strong class="aDate">2015</strong>',
            title: 'Show 2015 Imagery',
            onClick: function(control) {
              toggleYear(control, app.state.map.tileLayers.baseMapImagery2015);
              app.state.map.lastYearViewed = app.state.map.tileLayers.baseMapImagery2015;
            }
          }, {
            stateName: 'dateSelected',
            icon: '<strong class="aDate">2015</strong>',
            title: 'Show 2015 Imagery',
            onClick: function(control) {
            }
          }]
        }),
        L.easyButton({
          id: '2012ToggleButton',
          states:[{
            stateName: 'dateNotSelected',
            icon: '<strong class="aDate">2012</strong>',
            title: 'Show 2012 Imagery',
            onClick: function(control) {
              toggleYear(control, app.state.map.tileLayers.baseMapImagery2012);
              app.state.map.lastYearViewed = app.state.map.tileLayers.baseMapImagery2012;
            }
          }, {
            stateName: 'dateSelected',
            icon: '<strong class="aDate">2012</strong>',
            title: 'Show 2012 Imagery',
            onClick: function(control) {
            }
          }]
        }),
        L.easyButton({
          id: '2010ToggleButton',
          states:[{
            stateName: 'dateNotSelected',
            icon: '<strong class="aDate">2010</strong>',
            title: 'Show 2010 Imagery',
            onClick: function(control) {
              toggleYear(control, app.state.map.tileLayers.baseMapImagery2010);
              app.state.map.lastYearViewed = app.state.map.tileLayers.baseMapImagery2010;
            }
          }, {
            stateName: 'dateSelected',
            icon: '<strong class="aDate">2010</strong>',
            title: 'Show 2010 Imagery',
            onClick: function(control) {
            }
          }]
        }),
        L.easyButton({
          id: '2008ToggleButton',
          states:[{
            stateName: 'dateNotSelected',
            icon: '<strong class="aDate">2008</strong>',
            title: 'Show 2008 Imagery',
            onClick: function(control) {
              toggleYear(control, app.state.map.tileLayers.baseMapImagery2008);
              app.state.map.lastYearViewed = app.state.map.tileLayers.baseMapImagery2008;
            }
          }, {
            stateName: 'dateSelected',
            icon: '<strong class="aDate">2008</strong>',
            title: 'Show 2008 Imagery',
            onClick: function(control) {
            }
          }]
        }),
        L.easyButton({
          id: '2004ToggleButton',
          states:[{
            stateName: 'dateNotSelected',
            icon: '<strong class="aDate">2004</strong>',
            title: 'Show 2004 Imagery',
            onClick: function(control) {
              toggleYear(control, app.state.map.tileLayers.baseMapImagery2004);
              app.state.map.lastYearViewed = app.state.map.tileLayers.baseMapImagery2004;
            }
          }, {
            stateName: 'dateSelected',
            icon: '<strong class="aDate">2004</strong>',
            title: 'Show 2004 Imagery',
            onClick: function(control) {
            }
          }]
        }),
        L.easyButton({
          id: '1996ToggleButton',
          states:[{
            stateName: 'dateNotSelected',
            icon: '<strong class="aDate">1996</strong>',
            title: 'Show 1996 Imagery',
            onClick: function(control) {
              toggleYear(control, app.state.map.tileLayers.baseMapImagery1996);
              app.state.map.lastYearViewed = app.state.map.tileLayers.baseMapImagery1996;
            }
          }, {
            stateName: 'dateSelected',
            icon: '<strong class="aDate">1996</strong>',
            title: 'Show 1996 Imagery',
            onClick: function(control) {
            }
          }]
        })
      ];

      // build a toolbar with them
      theEasyBar = L.easyBar(app.state.map.historicalImageryButtons, {
        position: 'topright'
      })

      // adds and removes baseLayer and overlay
      function toggleBasemap() {
        if (app.state.map.nameBaseLayer == 'baseMapLight' || app.state.map.nameBaseLayer == 'baseMapDOR') {
          _baseLayerGroup.clearLayers();
          _labelLayerGroup.clearLayers();
          if (app.state.map.lastYearViewed) {
            _baseLayerGroup.addLayer(app.state.map.lastYearViewed);
            _baseLayerGroup.addLayer(app.state.map.tileLayers.parcels);
          } else {
            _baseLayerGroup.addLayer(app.state.map.tileLayers.baseMapImagery2016);
            _baseLayerGroup.addLayer(app.state.map.tileLayers.parcels);
          }
          _labelLayerGroup.addLayer(app.state.map.tileLayers.overlayImageryLabels);
          theEasyBar.addTo(_map);

        } else {
          _baseLayerGroup.clearLayers();
          _labelLayerGroup.clearLayers();
					if(app.state.activeTopic != 'deeds'){
	          _baseLayerGroup.addLayer(app.state.map.tileLayers.baseMapLight);
	          _labelLayerGroup.addLayer(app.state.map.tileLayers.overlayBaseLabels);
					} else {
						app.state.map.tileLayers.baseMapDORParcels.addTo(_baseLayerGroup);
						app.state.map.tileLayers.overlayBaseDORLabels.addTo(_labelLayerGroup);
					}
          theEasyBar.remove();
        }
        app.map.domLayerList();
      };


      function toggleYear(control, requestedLayer) {
        // gray all buttons
        for (i = 0; i < app.state.map.historicalImageryButtons.length; i++) {
          //console.log(app.state.map.historicalImageryButtons[i].options.id);
          app.state.map.historicalImageryButtons[i].state('dateNotSelected');
        };
        _baseLayerGroup.clearLayers();
        _baseLayerGroup.addLayer(requestedLayer);
        _baseLayerGroup.addLayer(app.state.map.tileLayers.parcels);

        // highlight current button
        control.state('dateSelected');
        app.map.domLayerList();

      };
*/
      // set map state and localStorage on init, drag, dragend, and zoom
      //app.map.LSinit();

      // listen for map events
      /*_map.on('click', app.map.didClickMap);
      _map.on('drag', app.map.LSdrag);
      _map.on('dragend', app.map.LSdragend);
      _map.on('zoomend', app.map.LSzoomend);
      _map.on('moveend', function(){
        app.map.LSmoveend();
      });*/


      // watch localStorage for changes to:
      //1. stViewOpen, 2. stViewCoords, 3. stViewYaw 4. stViewHfov
      // there is a problem, in that when it reopens all of these things trigger it to redraw
      $(window).bind('storage', function (e) {
        // if Cyclomedia window closes, remove marker
        if (e.originalEvent.key == 'stViewOpen' && e.originalEvent.newValue == 'false') {
        };
        if (e.originalEvent.key == 'stViewOpen' && e.originalEvent.newValue == 'true') {
          app.map.LSretrieve();
        };
        if (e.originalEvent.key == 'stViewCoords'){
        };
        if (e.originalEvent.key == 'stViewYaw'){
        };
        if (e.originalEvent.key == 'stViewHfov'){
        };
      });
    }, // end of initMap

/*		writeCsvServices: function() {
			//console.log('starting writeCsvServices');
			app.state.map.csvServices = {};
			_.forEach(app.config.categories, function(category) {
				//console.log('loop 1 started');
				app.state.map.csvServices[category.replace(/\s+/g, '')] = {};

				_.forEach(app.config.csv[category.replace(/\s+/g, '')], function(service) {
					//console.log('loop2 started')
					//app.state.map.csvServices[category.replace(/\s+/g, '')][service.Display_name.replace(/\s+/g, '')] = L.esri.dynamicMapLayer({
					app.state.map.csvServices[category.replace(/\s+/g, '')][service.Display_name.replace(/\s+/g, '')] = L.esri.featureLayer({
		        url: app.config.overlays[service.Display_name.replace(/\s+/g, '')+'Url'],
						//url: '//services.arcgis.com/fLeGjb7u4uXqeF9q/ArcGIS/rest/services/City_Facilities_pub/FeatureServer/0',
		        //maxZoom: 22,
		        //name: 'overlay',
		        //type: 'overlay',
						useCors: 'false',
		        //zIndex: 10,
		      });
				});
			});
		},
*/
		layerOn: function(layer) {
			console.log('layer passed was ' + layer);
      console.log(_testmap);
			//_overlayLayerGroup.clearLayers();
			//_overlayLayerGroup.addLayer(app.state.map.csvServices[app.state.activeTopic][layer]);//.addTo(_overlayLayerGroup);
      _.forEach(_testmap.layers.items, function(item, i){
        if(item.id == layer){
        //if(item.id == "City_Facilities_pub_7690"){
          console.log('found it!');
          console.log(item);
          item.visible = true;
        }
      })


      /*_legend = new Legend({
        view: _view,
        //layerInfos: [{
        //  layer: featureLayer,
        //  title: "NY Educational Attainment"
        //}]
      });*/

      // Add widget to the bottom right corner of the view
      _view.ui.add(_legend, "bottom-right");
      //var mapLayer = _testmap.layers.get(layer);
      //console.log(mapLayer);
      //_testmap.layers.items[4].visible = 'true';
			//app.map.domLayerList();
			//app.state.map.layers.push(app.state.map.csvServices[app.state.activeTopic][layer])
			//L.esri.legendControl(app.state.map.csvServices[app.state.activeTopic][layer]).addTo(_map);

			/*var ids = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 21, 22, 23];
			app.state.map.layers = ids.map(function(id) {
			  return L.esri.featureLayer({
			      url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Water_Network/FeatureServer/' + id,
			      useCors: false
			    }).addTo(_map);
			});*/

			/*app.state.map.layers.push(new L.esri.featureLayer({
					//url: 'https://services.arcgis.com/fLeGjb7u4uXqeF9q/ArcGIS/rest/services/Commercial_Corridors/FeatureServer/0',
					//url: app.config.overlays.CommercialCorridorsUrl,
					url: 'https://services.arcgis.com/fLeGjb7u4uXqeF9q/ArcGIS/rest/services/RainBarrel_Installed/FeatureServer/0',
			    //url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Military/FeatureServer/3',
			    useCors: false,
			  }));//.addTo(_map));*/


			//L.esri.legendControl(app.state.map.layers).addTo(_map);
			//L.esri.legendControl(layers).addTo(_map);
		},

		layerOff: function(layer) {
			//_overlayLayerGroup.removeLayer(app.state.map.csvServices[app.state.activeTopic][layer]);
			//app.map.domLayerList();
      console.log('running layerOff');
      _.forEach(_testmap.layers.items, function(item, i){
        if(item.id == layer){
          console.log('found it!');
          console.log(item);
          //item.set('visible', 'false');
          item.visible = false;
        }
      })
		},

    // add names of layers on the map to the DOM
    domLayerList: function() {
      _map.eachLayer(function(layer){
        if (layer.options.name && layer.options.type == 'base') {
          app.state.map.nameBaseLayer = layer.options.name;
        } else if (layer.options.name && layer.options.type == 'labels') {
          app.state.map.nameLabelsLayer = layer.options.name;
        } else if (layer.options.name && layer.options.type == 'parcel') {
					app.state.map.nameParcelLayer = layer.options.name;
				}
      });
      app.state.map.namesOverLayers = [];
      _map.eachLayer(function(layer){
        if (layer.options.name && layer.options.type == 'overlay') {
          app.state.map.namesOverLayers.push(layer.options.name);
        };
      });
      app.state.map.namesAppealsMarkers = [];
      _map.eachLayer(function(layer){
        if (layer.options.name && layer.options.type == 'appealsMarker') {
          app.state.map.namesAppealsMarkers.push(layer.options.name);
        }
      })
    },

    renderAisResult: function (obj) {
			console.log('starting to run renderAisResult');
      if (app.state.dor) this.drawParcel();
			// if (app.state.activeTopic == 'elections') {
			// 	app.map.removeElectionInfo();
			// 	app.map.addElectionInfo();
			// }
    },

    didClickMap: function (e) {
      // set state
      app.state.map.clickedOnMap = true
			localStorage.setItem('clickedOnMap', true);
      app.state.map.shouldPan = false;

      // query parcel layer
      // var parcelQuery = L.esri.query({url: app.config.parcelLayerUrl});
      // parcelQuery.contains(e.latlng)
      // parcelQuery.run(app.didGetParcelQueryResult);
      if (app.state.map.clickedCircle){
        console.log('clicked a circle');
        app.state.map.clickedCircle = false;
      } else {

      app.getParcelByLatLng(e.latlng, function () {

				if(app.state.activeTopic == 'deeds' || app.state.activeTopic == 'zoning') {
					var parcel = app.state.dor.features[0],
	            parcelAddress = app.util.concatDorAddress(parcel);

	        // if the parcel address is null or falsy, don't proceed
	        var parcelHouseNumber = app.util.cleanDorAttribute(parcel.properties.HOUSE);
				} else {
					var parcel = app.state.waterGIS.features[0],
						parcelAddress = parcel.properties.ADDRESS;
						parcelHouseNumber = parcelAddress
				}
        if (!parcelAddress || parcelAddress.length === 0 || !parcelHouseNumber) {
          console.log('no parcel address', parcel);
          // show error
          $noParcelAddressModal = $('#no-parcel-address-modal');
          $noParcelAddressModal.find('#parcel-id').text(parcelAddress || '<empty>');
          $noParcelAddressModal.foundation('open');
          return;
        }

        // if this is the result of a map click, query ais for the address
        if (app.state.map.clickedOnMap) {
          app.searchForAddress(parcelAddress);
          app.state.map.clickedOnMap = true; //andy changed this 11/29
					//localStorage.setItem('clickedOnMap', true);
        }

        // render parcel
        // disabling this so we only draw the parcel after we get an ais result
        // app.map.drawParcel();
      });
    }
    },

    drawParcel: function () {
			console.log('starting to run drawParcel');
      // if there's no parcel in state, clear the map and don't render
      // TODO zoom to AIS xy
      var parcelDOR, geomDOR, center;
      try {
        parcelDOR = app.state.dor.features[0];
        if (!parcelDOR) throw 'no parcel';
        geomDOR = parcelDOR.geometry;
				//center = geom.getBounds().getCenter();
				//app.state.center = center;
      }
      catch(err) {
        console.log('draw parcel, but could not get parcel from state', err);
        // clear parcel
        _parcelLayerGroup.clearLayers();
        return;
      }

			var parcelWater = app.state.waterGIS.features[0]
			var geomWater = parcelWater.geometry;//.rings;

      var coordsDOR = app.util.flipCoords(geomDOR.coordinates),
					coordsWater = app.util.flipCoords(geomWater.coordinates),
          parcelPolyDOR = L.polygon([coordsDOR], {
            color: 'blue',
            weight: 2,
						name: 'parcelPolyDOR',
		        type: 'parcel',
          }),
					parcelPolyWater = L.polygon([coordsWater], {
						color: 'blue',
            weight: 2,
						name: 'parcelPolyWater',
		        type: 'parcel',
					}),
          parcelCentroid = parcelPolyDOR.getBounds().getCenter(),
					parcelMarker = new L.Marker.SVGMarker([parcelCentroid.lat, parcelCentroid.lng], {
						"iconOptions": {
							className: 'svg-icon-noClick',
							circleRatio: 0,
							color: 'rgb(255,30,30)',//'rgb(255,200,50)',
							fillColor: 'rgb(255,60,30)',//'rgb(255,200,50)',
							fillOpacity: 0.8,
							iconSize: app.map.largeMarker,
						},
						title: 'current parcel',
						name: 'parcelMarker',
		        type: 'parcel',
					});

			app.state.parcelPolyDOR = parcelPolyDOR;
			app.state.parcelPolyWater = parcelPolyWater;
      app.state.theParcelCentroid = parcelCentroid;
			app.state.parcelMarker = parcelMarker;
      // clear existing parcel
      _parcelLayerGroup.clearLayers();

      // pan map
      // true if search button was clicked or if page is loaded w address parameter, false if a parcel was clicked
      if (app.state.map.shouldPan) {
        // zoom to bounds of parcel poly plus some buffer
        var boundsPadded = parcelPolyDOR.getBounds().pad(1.15);
        // _map.fitBounds(bounds, {padding: ['20%', '20%']});
        _map.fitBounds(boundsPadded);
        // or need to use parcel centroid instead of center of map
        // set new state and localStorage
      };
			// calling LSinit will alert Pictometry and Cyclomedia to change
			app.map.LSinit();

      // add to map
			if (app.state.activeTopic == 'deeds') {
	      _parcelLayerGroup.addLayer(parcelPolyDOR);
			} else if (app.state.activeTopic == 'water') {
				_parcelLayerGroup.addLayer(parcelPolyWater);
			} else {
				console.log('placing marker')
				_parcelLayerGroup.addLayer(parcelMarker);
			}
			app.map.domLayerList();

      // area method 2
      var areaRequestGeom = '[' + JSON.stringify(geomDOR).replace('"type":"Polygon","coordinates"', '"rings"') + ']';
      $.ajax({
        url: '//gis.phila.gov/arcgis/rest/services/Geometry/GeometryServer/areasAndLengths',
        data: {
          polygons: areaRequestGeom,
          sr: 4326,
          calculationType: 'geodesic',
          f: 'json',
          areaUnit: '{"areaUnit" : "esriSquareFeet"}',
          lengthUnit: 9002,
        },
        success: function (dataString) {
          // console.log('got polygon with area', dataString, this.url);
          var data = JSON.parse(dataString),
              area = Math.round(data.areas[0]),
              perimeter = Math.round(data.lengths[0]);
          $('#deeds-area').text(area + ' sq ft');
          $('#deeds-perimeter').text(perimeter + ' ft');
        },
        error: function (err) {
          console.log('polygon area error', err);
        },
      });
    }, // end of drawPolygon

    getGeomFromLatLon : function(latlon){
      //console.log('it did getGeom')
      queryParcel.contains(latlon)
      queryParcel.run(function (error, featureCollection, response) {
        app.state.map.curFeatGeo = featureCollection.features[0].geometry
        // app.gis.flipCoords(app.data.gis.curFeatGeo)
        // var coordsFlipped =
      });
    },

    // LocalStorage functions
    // on init, put center and zoom in LocalStorage, in case
    // Pictometry or Cyclomedia are used
/*    LSinit: function() {
			app.state.theCenter = _map.getCenter();
			app.state.leafletCenterX = app.state.theCenter.lng;
			app.state.leafletCenterY = app.state.theCenter.lat;
      if (app.state.map.clickedOnMap == true){
        app.state.leafletForCycloX = app.state.theParcelCentroid.lng;
        app.state.leafletForCycloY = app.state.theParcelCentroid.lat;
      } else {
				app.state.leafletForCycloX = app.state.theCenter.lng;
        app.state.leafletForCycloY = app.state.theCenter.lat;
      }
      app.state.theZoom = _map.getZoom();
      localStorage.setItem('theZoom', app.state.theZoom);
			localStorage.setItem('leafletCenterX', app.state.leafletCenterX);
      localStorage.setItem('leafletCenterY', app.state.leafletCenterY);
      localStorage.setItem('leafletForCycloX', app.state.leafletForCycloX);
      localStorage.setItem('leafletForCycloY', app.state.leafletForCycloY);
      localStorage.setItem('cycloCoords', [app.state.leafletForCycloX, app.state.leafletForCycloY]);
      localStorage.setItem('pictCoordsZoom', [app.state.leafletCenterX, app.state.leafletCenterY, app.state.theZoom]);
    },

    // while map is dragged, constantly reset center in localStorage
    // this will move Pictometry with it, but not Cyclomedia
    LSdrag: function() {
      app.state.theCenter = _map.getCenter();
      app.state.leafletCenterX = app.state.theCenter.lng;
      app.state.leafletCenterY = app.state.theCenter.lat;
      localStorage.setItem('leafletCenterX', app.state.leafletCenterX);
      localStorage.setItem('leafletCenterY', app.state.leafletCenterY);
      localStorage.setItem('pictCoordsZoom', [app.state.leafletCenterX, app.state.leafletCenterY, app.state.theZoom]);
    },

    // when map is finished being dragged, 1 more time reset
    // the center in localStorage
    // this will move Pictometry AND Cyclomedia
    LSdragend: function() {
      app.state.theCenter = _map.getCenter();
      app.state.leafletCenterX = app.state.theCenter.lng;
      app.state.leafletCenterY = app.state.theCenter.lat;
      localStorage.setItem('leafletCenterX', app.state.leafletCenterX);
      localStorage.setItem('leafletCenterY', app.state.leafletCenterY);
      localStorage.setItem('pictCoordsZoom', [app.state.leafletCenterX, app.state.leafletCenterY, app.state.theZoom]);
    },

    // when map is zoomed, reset zoom in localStorage
    // this will re-zoom Pictometry also
    LSzoomend: function() {
      app.state.theZoom = _map.getZoom();
      localStorage.setItem('theZoom', app.state.theZoom);
      localStorage.setItem('pictCoordsZoom', [app.state.leafletCenterX, app.state.leafletCenterY, app.state.theZoom]);
    },

    LSmoveend: function() {
      app.state.theCenter = _map.getCenter();
      app.state.leafletCenterX = app.state.theCenter.lng;
      app.state.leafletCenterY = app.state.theCenter.lat;
      localStorage.setItem('leafletCenterX', app.state.leafletCenterX);
      localStorage.setItem('leafletCenterY', app.state.leafletCenterY);
      localStorage.setItem('pictCoordsZoom', [app.state.leafletCenterX, app.state.leafletCenterY, app.state.theZoom]);
    },

    LSretrieve: function(){
      app.state.stViewX = localStorage.getItem('stViewX');
      app.state.stViewY = localStorage.getItem('stViewY');
      app.state.stViewYaw = localStorage.getItem('stViewYaw');
      app.state.stViewHfov = localStorage.getItem('stViewHfov');
      app.state.stViewConeCoords = app.map.calculateConeCoords();
    },

		LSclickedCircle: function(lat, lng){
			app.state.leafletForCycloX = lng;
			app.state.leafletForCycloY = lat;
			localStorage.setItem('leafletForCycloX', lng);
			localStorage.setItem('leafletForCycloY', lat);
			localStorage.setItem('cycloCoords', [lat, lng]);
		},

		LSdraggedMarker: function(lat, lng){
			app.state.leafletForCycloX = lng;
			app.state.leafletForCycloY = lat;
			localStorage.setItem('leafletForCycloX', lng);
			localStorage.setItem('leafletForCycloY', lat);
			localStorage.setItem('cycloCoords', [lat, lng]);
		},

    drawStViewMarkers: function(){
    },
*/
    didChangeTopic: function (prevTopic, nextTopic) {
      console.log('did change topic', prevTopic, '=>', nextTopic);

      if (prevTopic) {
        app.map.didDeactivateTopic(prevTopic);
      }

      if (nextTopic) {
        app.map.didActivateTopic(nextTopic);
      }

			localStorage.setItem('previousTopic', prevTopic);
			localStorage.setItem('activeTopic', nextTopic);
    },

    // called when the active topic in the topic panel changes
    didActivateTopic: function (topic) {
      //console.log('did activate topic', topic);
      // save to localstorage for pictometry viewer
      localStorage.setItem('activeTopic', topic);
			switch (topic) {
				case 'EducationandRecreation':
					console.log('clicked EducationandRecreation');
					break;
				case 'PublicSafety':
					console.log('clicked PublicSafety');

          /*require(
						[
				      "esri/views/MapView",
				      "esri/WebMap",
				      "dojo/domReady!"
				    ],
						function(MapView, WebMap) {
							_psmap = new WebMap({
				        portalItem: {
									id: "74a94db65a2f45e79a12e4f50bd72218"
				        }
				      });
				      _view = new MapView({
				        map: _psmap,
				        container: "map"
				      });
				    }
					);*/
					/*_view = new MapView({
		        map: _psmap,
		        container: "map"
		      });*/
					break;

				default:
			}
    },

    didDeactivateTopic: function (topic) {
      localStorage.setItem('activeTopic', null);
    },

		toggleParcelMarker: function() {
			if (app.state.map.nameParcelLayer == 'parcelMarker') {
				if (app.state.activeTopic == 'deeds') {
					_parcelLayerGroup.clearLayers();
					_parcelLayerGroup.addLayer(app.state.parcelPolyDOR);
				} else if (app.state.activeTopic == 'water') {
					_parcelLayerGroup.clearLayers();
					_parcelLayerGroup.addLayer(app.state.parcelPolyWater);
				}
			}
			if (app.state.map.nameParcelLayer == 'parcelPolyDOR') {
				//console.log(app.state.activeTopic);
				//console.log(app.state.map.nameParcelLayer);
				if (app.state.activeTopic == 'water') {
					_parcelLayerGroup.clearLayers();
					_parcelLayerGroup.addLayer(app.state.parcelPolyWater);
				} else if (app.state.activeTopic != 'deeds' || app.state.activeTopic === null) {
					_parcelLayerGroup.clearLayers();
					_parcelLayerGroup.addLayer(app.state.parcelMarker);
				}
			}
			if (app.state.map.nameParcelLayer == 'parcelPolyWater') {
				//console.log(app.state.activeTopic);
				//console.log(app.state.map.nameParcelLayer);
				if (app.state.activeTopic == 'deeds') {
					_parcelLayerGroup.clearLayers();
					_parcelLayerGroup.addLayer(app.state.parcelPolyDOR);
				} else if (app.state.activeTopic != 'water' || app.state.activeTopic === null) {
					_parcelLayerGroup.clearLayers();
					_parcelLayerGroup.addLayer(app.state.parcelMarker);
				}
			}
		},

		addOpacitySlider: function(topic, opacityLayer) {
		},

		removeOpacitySlider: function(topic) {
		},

		toggleBaseToolTip: function(topic) {
		}

  }; // end of return
})();

app.map.initMap();
