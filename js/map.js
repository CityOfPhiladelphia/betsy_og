
app.map = (function ()
{
  // the leaflet map object
  // var _blankmap,
	// 	_psmap,
	// 	_ermap,
	// 	_view,
  //   _baseLayerGroup = new L.LayerGroup(),
  //   _labelLayerGroup = new L.LayerGroup(),
  //   _overlayLayerGroup = new L.LayerGroup()

  return {

    initMap : function () {
      app.state.map = {};
      app.state.map.clickedOnMap = false;
			localStorage.setItem('clickedOnMap', false);
			app.state.map.shouldPan = true;

			app.state.map.layers = [];
      app.state.map.tiledLayers = {};

      //var CITY_HALL = [39.952388, -75.163596];

      // FULL: f60e4fa0c01f408882a07ee50e8910b9
      // LIMITED: 1731f25ea9a24fb181c1049f7e94ff9a
      var webmapId = 'f60e4fa0c01f408882a07ee50e8910b9'; // Default WebMap ID
      //getIdfromUrl();

      app.map.webmap = L.esri.webMap(webmapId, { map: L.map("map") });

      app.map.webmap.on('load', function() {
        app.map.overlayMaps = {};
        app.map.webmap.layers.map(function(l) {
            app.map.overlayMaps[l.title] = l.layer;
        });
        L.control.layers({}, app.map.overlayMaps, {
            position: 'bottomleft'
        }).addTo(app.map.webmap._map);
        // L.esri.Controls.legend([app.map.webmap.layers[0]], {position: 'bottomright'}).addTo(map);
        L.esri.legendControl([app.map.webmap.layers[2].layer], {position: 'bottomright'}).addTo(app.map.webmap._map);

        var form = $('<form action="#/">'),
        fieldset = $('<fieldset class="options">'),
        ul = $('<ul class="no-bullet">');

        app.map.IgnoreLayers = [
          'CityBasemap',
          'CityBasemap_Labels'
        ]

        app.map.topics = []
        _.forEach(app.map.webmap.layers, function(layer, i) {
          console.log(layer.title)
          if (!_.includes(app.map.IgnoreLayers, layer.title)) {
            if (layer.title.includes('_')) {
              var curTopic = layer.title.split('_');
              if (!_.includes(app.map.topics, curTopic[0])) {
                app.map.topics.push(curTopic[0]);
                var anchor = $('<a id="topic-link-' + curTopic[0].replace(/\s+/g, '') + '" class="topic-link" href="#">');
                var span = $('<span class="topic-link-icon flaticon-copy">');
                anchor.append(span);
                anchor.append(curTopic[0]);
                var accordian = $('<div id="topic-' + curTopic[0].replace(/\s+/g, '') + '" class="topic">');
                $('#topic-list').append(anchor);
                $('#topic-list').append(accordian);
              }
              var form2 = $('<form action="#/">'),
              fieldset2 = $('<fieldset class="options">'),
              ul2 = $('<ul class="no-bullet">');
              var accordian = $('#topic-' + curTopic[0].replace(/\s+/g, ''));
              var li = $('<li>'),
                label = $('<label for="checkbox-'+curTopic[1]+'">'),
                input = $('<input id="checkbox-'+curTopic[1]+'" name="checkbox" type="checkbox">');
              label.append(input);
              label.append(layer.title.split('_')[1]);
              li.append(label);
              ul2.append(li);
              fieldset2.append(ul2);
              form2.append(fieldset2);
              accordian.append(form2);
            } else {
              var li = $('<li>'),
                label = $('<label for="checkbox-'+layer.title+'">'),
                input = $('<input id="checkbox-'+layer.title+'" name="checkbox" type="checkbox">');
              label.append(input);
              label.append(layer.title);
              li.append(label);
              ul.append(li);
              fieldset.append(ul);
              form.append(fieldset);
              $('#topic-panel').append(form);
            } // end of else
          }
        }); // end of forEach

        $('.topic-link').click(function (e) {
          e.preventDefault();
          var $this = $(this),
          topicName = $this.attr('id').replace('topic-link-', '');
          app.toggleTopic(topicName);
        });
        $(':checkbox').on('click', function(input) {
          var curLayer
          _.forEach(app.map.webmap.layers, function(layer, i) {
            if('checkbox-'+layer.title === input.currentTarget.id){
              curLayer = layer.layer;
            } else if ('checkbox-'+layer.title.split('_')[1] === input.currentTarget.id) {
              curLayer = layer.layer
            }
          })
          if(input.currentTarget.checked === true){
            curLayer.addTo(app.map.webmap._map)
          } else {
            curLayer.remove()
          }
        });
      }); // end of webmap onload

      // function getIdfromUrl() {
      //   var urlParams = location.search.substring(1).split('&');
      //   for (var i=0; urlParams[i]; i++) {
      //     var param = urlParams[i].split('=');
      //     if(param[0] === 'id') {
      //         webmapId = param[1]
      //     }
      //   }
      // }

      // Non-Imagery Basemaps and all Labels
      /*_.forEach(app.config.esri.tiledLayers, function(layer, i) {
        app.state.map.tiledLayers[i] = L.esri.tiledMapLayer({
          url: layer.url,
          maxZoom: 22,
          name: i,
          type: layer.type,
          zIndex: layer.zIndex,
        });
      });

      // Imagery Basemapes
      _.forEach(app.config.esri.imageryLayers, function(layer, i) {
        app.state.map.tiledLayers[i] = L.esri.tiledMapLayer({
          url: layer.url,
          maxZoom: 22,
          name: i,
          type: layer.type,
          zIndex: layer.zIndex,
        });
      });

      // add initial map layers to _map
      _baseLayerGroup.addLayer(app.state.map.tiledLayers.baseMapLight);
      _baseLayerGroup.addTo(_map);
      _labelLayerGroup.addLayer(app.state.map.tiledLayers.overlayBaseLabels);
      _labelLayerGroup.addTo(_map);


      // Feature services
      _.forEach(app.config.esri.featureServices, function(options, layerName) {
        app.state.map.featureServices[layerName] = L.esri.featureLayer(options);
      });*/

      // Overlays
      /*_.forEach(app.config.esri.dynamicLayers, function(layer, i) {
        if (i != 'regmap'){
          app.state.map.mapServices[i] = L.esri.dynamicMapLayer({
            url: layer.url,
            maxZoom: 22,
            name: i,
            type: layer.type,
            zIndex: layer.zIndex,
          });
        }
      });*/

      /*app.state.theLayers = response.itemInfo.itemData.operationalLayers;
      app.state.theLayerInfo = [];
      dojo.forEach(app.state.theLayers,function(layer){
        if(!layer.featureCollection){
         app.state.theLayerInfo.push({"layer":layer.layerObject,"title":layer.title});
        }
      });*/


      // app.config.agoStuff = {}
      //
      // console.log('on FIRST FIRST forEach which is ', app.state.map.layers.length, ' long');
      // _.forEach(app.state.map.layers, function(layer, i){
      //   if (layer.id == 'Evacuation_Routes_2860' || layer.id == 'Police_Incidents_Part1_Part2_Last30_2574') {
      //     var title2 = layer.title.replace(/\s+/g, '');
      //   } else {
      //     var title1 = layer.title.replace(/\s+/g, '');
      //     var title2 = title1.replace(/,/g , '');
      //   }
      //   app.config.agoStuff[title2] = layer.layerObject.id;
      // });

      // console.log('on forEach which is ', app.config.categories.length, ' long');
      // _.forEach(app.config.categories, function(category) {
      //   var accordian = $('#topic-' + category.replace(/\s+/g, ''));
      //
      //   var form = $('<form action="#/">'),
      //     fieldset = $('<fieldset class="options">'),
      //     ul = $('<ul class="no-bullet">');
      //
      //   console.log(app.config.csv[category.replace(/\s+/g, '')])
      //   _.forEach(app.config.csv[category.replace(/\s+/g, '')], function(layer, i) {
      //     //console.log(i.replace(/\s+/g, ''));
      //     var agoInfo = app.config.agoStuff[i.replace(/\s+/g, '')]
      //     //console.log(agoInfo);
      //     var li = $('<li>'),
      //       label = $('<label for="checkbox-'+i+'">'),
      //       //input = $('<input id="checkbox-'+layer.Raw_name.substr(layer.Raw_name.indexOf('.')+1)+'" name="checkbox" type="checkbox">');
      //       input = $('<input id="checkbox-'+agoInfo+'" name="checkbox" type="checkbox">');
      //     label.append(input);
      //     label.append(layer.Display_name);
      //     li.append(label);
      //     ul.append(li);
      //   })
      //   fieldset.append(ul);
      //   form.append(fieldset);
      //   accordian.append(form);
      // });
      // $('.topic-link').click(function (e) {
      //   e.preventDefault();
      //   //console.log('clicked a topic');
      //   var $this = $(this),
      //       topicName = $this.attr('id').replace('topic-link-', '');
      //   app.toggleTopic(topicName);
      // });
      // $(':checkbox').on('click', function(input) {
      //   console.log(input.currentTarget.checked);
      //   if(input.currentTarget.checked === true){
      //     console.log(input.currentTarget.id + ' was turned on');
      //     app.map.layerOn(input.currentTarget.id.substr(input.currentTarget.id.indexOf("-") + 1));
      //   } else {
      //     console.log(input.currentTarget.id + ' was turned off');
      //     app.map.layerOff(input.currentTarget.id.substr(input.currentTarget.id.indexOf("-") + 1));
      //   }
      // });


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


		/*layerOn: function(layer) {
			console.log('layer passed was ' + layer);
      _.forEach(app.state.theLayers, function(theLayer, i){
        if(theLayer.id == layer){
          //console.log('found it!');
          //console.log(theLayer);
          theLayer.layerObject.setVisibility(true);
        }
      });

		},

		layerOff: function(layer) {
      console.log('running layerOff and layer passed was ' + layer);
      _.forEach(app.state.theLayers, function(theLayer, i){
        if(theLayer.id == layer){
          theLayer.layerObject.setVisibility(false);
        }
      });
		},*/

    renderAisResult: function (obj) {
			console.log('starting to run renderAisResult');
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
      });
    }
    },

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
      localStorage.setItem('activeTopic', topic);
			switch (topic) {
				case 'EducationandRecreation':
					console.log('clicked EducationandRecreation');
					break;
				case 'PublicSafety':
					console.log('clicked PublicSafety');
					break;

				default:
			}
    },

    didDeactivateTopic: function (topic) {
      localStorage.setItem('activeTopic', null);
    }
  }; // end of return
})();

app.map.initMap();
