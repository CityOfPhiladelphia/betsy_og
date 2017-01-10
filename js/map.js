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
		_view

  return {

    initMap : function () {
      app.state.map = {};
      app.state.map.clickedOnMap = false;
			localStorage.setItem('clickedOnMap', false);
      // the next 2 variables hold names for checking what is on the map
      /*app.state.map.nameBaseLayer;
      app.state.map.nameLabelsLayer;
			app.state.map.nameParcelLayer;
      app.state.map.namesOverLayers = [];
      // the next 2 objects hold the actual layers
      app.state.map.tileLayers = {};
      app.state.map.mapServices = {};*/
			app.state.map.shouldPan = true;

			app.state.map.layers = [];

      var CITY_HALL = [39.952388, -75.163596];

      require([
        "dojo/parser",
        "dojo/ready",
        "dijit/layout/BorderContainer",
        "dijit/layout/ContentPane",
        "dojo/dom",
        "esri/map",
        "esri/urlUtils",
        "esri/arcgis/utils",
        "esri/dijit/Legend",
        //"esri/dijit/Scalebar",
        "dojo/domReady!"
      ], function (
        parser,
        ready,
        BorderContainer,
        ContentPane,
        dom,
        Map,
        urlUtils,
        arcgisUtils,
        Legend
        //Scalebar
      ) { ready(function() {

        parser.parse();
        arcgisUtils.createMap(
          //"1731f25ea9a24fb181c1049f7e94ff9a"
          "0878acc58e384f45be23e3f1a5120aab"
          ,"map"
        ).then(function(response){
          //update the app
          //dom.byId("title").innerHTML = response.itemInfo.item.title;
          //dom.byId("subtitle").innerHTML = response.itemInfo.item.snippet;
          var map = response.map;

          //add the scalebar
          /*var scalebar = new Scalebar({
            map: map,
            scalebarUnit: "english"
          });*/
          //add the legend. Note that we use the utility method getLegendLayers to get
          //the layers to display in the legend from the createMap response.

          var legendLayers = arcgisUtils.getLegendLayers(response);
          //console.log('legendLayers is ', legendLayers);
          var legendDijit = new Legend({
            map: map,
            layerInfos: legendLayers
          },"legend");
          //console.log('legendDijit is ', legendDijit);
          //legendDijit.startup();
          //console.log('legendDijit started up');


          //app.state.response = response;
          //app.state.theMap = _testmap;
          app.state.theLayers = response.itemInfo.itemData.operationalLayers;
          app.state.theLayerInfo = [];
          dojo.forEach(app.state.theLayers,function(layer){
            if(!layer.featureCollection){
             app.state.theLayerInfo.push({"layer":layer.layerObject,"title":layer.title});
            }
          });


          app.config.agoStuff = {}

          console.log('on FIRST FIRST forEach which is ', app.state.theLayers.length, ' long');
          _.forEach(app.state.theLayers, function(layer, i){
            if (layer.id == 'Evacuation_Routes_2860' || layer.id == 'Police_Incidents_Part1_Part2_Last30_2574') {
              //console.log(i+1, ' ', layer.id);
              var title2 = layer.title.replace(/\s+/g, '');
              //console.log(i+1, ' ', title2);
            } else {
              //console.log(i+1, ' ', layer.layerObject.name.substr(layer.layerObject.name.indexOf('.')+1));
              //if (_testmap._layers[item].arcgisProps){
              var title1 = layer.title.replace(/\s+/g, '');
              var title2 = title1.replace(/,/g , '');
              //console.log(i+1, ' ', title2);
              //title = layer.layerObject.name.substr(layer.layerObject.name.indexOf('.')+1);
              //console.log(i+1, ' ', title);
            }
            app.config.agoStuff[title2] = layer.layerObject.id;
            //}
          });


          /*var layers = _testmap._layers;
          console.log('on first forEach which is ', _testmap.graphicsLayerIds.length, ' long');
          _.forEach(_testmap.graphicsLayerIds, function(item, i){
            console.log(i+1, ' ', item);
            if (_testmap._layers[item].arcgisProps){
              var title1 = _testmap._layers[item].arcgisProps.title.replace(/\s+/g, '');
              var title2 = title1.replace(/,/g , '');
              console.log(title2);
              app.config.agoStuff[title2] = item;
            }
          });
          console.log('finished first loop');
          console.log('on second forEach which is ', _testmap.layerIds.length, ' long');
          _.forEach(_testmap.layerIds, function(item, i){
            console.log(i+1, ' ', item);
            if (_testmap._layers[item].arcgisProps){
              console.log(_testmap._layers[item].arcgisProps);
              var title1 = _testmap._layers[item].arcgisProps.title.replace(/\s+/g, '');
              var title2 = title1.replace(/,/g , '');
              console.log(title2);
              app.config.agoStuff[title2] = item;
            }
          });*/

          _.forEach(app.config.categories, function(category) {
            var accordian = $('#topic-' + category.replace(/\s+/g, ''));

            var form = $('<form action="#/">'),
              fieldset = $('<fieldset class="options">'),
              ul = $('<ul class="no-bullet">');

            _.forEach(app.config.csv[category.replace(/\s+/g, '')], function(layer, i) {
              //console.log(i.replace(/\s+/g, ''));
              var agoInfo = app.config.agoStuff[i.replace(/\s+/g, '')]
              //console.log(agoInfo);
              var li = $('<li>'),
                label = $('<label for="checkbox-'+i+'">'),
                //input = $('<input id="checkbox-'+layer.Raw_name.substr(layer.Raw_name.indexOf('.')+1)+'" name="checkbox" type="checkbox">');
                input = $('<input id="checkbox-'+agoInfo+'" name="checkbox" type="checkbox">');
              label.append(input);
              label.append(layer.Display_name);
              li.append(label);
              ul.append(li);
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
      });
    });

/*			require(
				[
		      "esri/views/MapView",
		      "esri/WebMap",
          "esri/widgets/Legend",
		      "dojo/domReady!"
		    ],
				function(MapView, WebMap, Legend) {
		      _testmap = new WebMap({
		        portalItem: {
							id: "1731f25ea9a24fb181c1049f7e94ff9a"
              //id: "0878acc58e384f45be23e3f1a5120aab"
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
              console.log(item.title);
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
                console.log(i);
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
*/

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


		layerOn: function(layer) {
			console.log('layer passed was ' + layer);
      _.forEach(app.state.theLayers, function(theLayer, i){
        if(theLayer.id == layer){
          //console.log('found it!');
          //console.log(theLayer);
          theLayer.layerObject.setVisibility(true);
        }
      });

      /*_legend = new Legend({
        view: _view,
        //layerInfos: [{
        //  layer: featureLayer,
        //  title: "NY Educational Attainment"
        //}]
      });*/

      // Add widget to the bottom right corner of the view
      //_view.ui.add(_legend, "bottom-right");
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
      console.log('running layerOff and layer passed was ' + layer);
      _.forEach(app.state.theLayers, function(theLayer, i){
        if(theLayer.id == layer){
          theLayer.layerObject.setVisibility(false);
        }
      });
		},

    // add names of layers on the map to the DOM
/*    domLayerList: function() {
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
*/
    renderAisResult: function (obj) {
			console.log('starting to run renderAisResult');
      //if (app.state.dor) this.drawParcel();
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

    /*drawParcel: function () {
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
    },*/

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

		/*toggleParcelMarker: function() {
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
		}*/

  }; // end of return
})();

app.map.initMap();
