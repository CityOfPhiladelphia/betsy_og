/* global L, _, $, history */
// https://www.youtube.com/watch?v=JFAcOnhcpGA
/*
NOTE: this is just a demo - lots of jQuery soup ahead :)
*/

/*$(window).bind('storage', function (e) {
     console.log(e.originalEvent.key, e.originalEvent.newValue);
});*/

var app = _.extend(app || {},
{
  /*var DEBUG_HOSTS = [
        '10.8.101.67',
        'localhost',
      ],
      // actually this doesn't work. commenting out for now.
      // DEBUG_ADDRESSES = {
      //   '10.8.101.251': '1849 blair st',
      // },
      HOST = window.location.hostname,
      DEBUG = (function () {
        return _.some(_.map(DEBUG_HOSTS, function (debugHost) {
          return HOST.indexOf(debugHost) >= 0;
        }));
      })(),
      // DEBUG_ADDRESS = DEBUG_ADDRESSES[HOST] || '1234 market st',
      DEBUG_ADDRESS = '1234 market st',
    // dynamically form a url based on the current hostname
    // this can't go in app.util because it hasn't been defined yet
      constructLocalUrl = function (host, path) {
        return '//' + host + path;
      };*/



    // global app state
    state: {
      // prevent topics from opening until we've completed a search
      // shouldOpenTopics: false,
      // nearby: {
      //   activeType: undefined,
      // }
    },

    // turn the config csv into complex DOM object
    configToDOM: function(csv) {
      //console.log('starting configToDOM');
      result = {}
      app.config.categories = []
      var lines=csv.split("\n");
      var rawData = [];
      var headers=lines[0].split(",");
      for(var i=1;i<lines.length-1;i++){
    	  var obj = {};
    	  var currentline=lines[i].split(",");
    	  for(var j=0;j<headers.length;j++){
    		  obj[headers[j]] = currentline[j];
    	  }
    	  rawData.push(obj);
      }
      // loop through rawData to fill out categories list and csv object
      _.forEach(rawData, function (row) {
        if ($.inArray(row.Category, app.config.categories) == '-1') {
          app.config.categories.push(row.Category);
          result[row.Category.replace(/\s+/g, '')] = {};
        };
        switch (row.Dir) {
          case 'A':
            result[row.Category.replace(/\s+/g, '')][row.Display_name.substr(row.Display_name.indexOf('.')+1)] = row;
            //app.config.overlays[row.Display_name.substr(row.Display_name.indexOf('.')+1)+'Url'] = app.config.esri.AGOUrl + (row.Display_name.substr(row.Display_name.indexOf('.')+1) + '/FeatureServer/0');
            break;
          case 'G':
            result[row.Category.replace(/\s+/g, '')][row.Display_name.substr(row.Display_name.indexOf('.')+1)] = row;
            //app.config.overlays[row.Display_name.substr(row.Display_name.indexOf('.')+1)+'Url'] = row.gisphilagov;
            break;
          case 'AQ':
            //result[row.Category.replace(/\s+/g, '')][row.Display_name.substr(row.Display_name.indexOf('.')+1)] = row;
            result[row.Category.replace(/\s+/g, '')][row.Display_name.replace(/\s+/g, '')] = row;
            //app.config.overlays[row.Display_name.replace(/\s+/g, '')+'Url'] = app.config.esri.AGOUrl + (row.Display_name.substr(row.Display_name.indexOf('.')+1) + '/FeatureServer/0');
            break;
          case 'N':
            //console.log('got to an N');
            break;
          default:

        }
        //result[row.Category.replace(/\s+/g, '')][row.Display_name.replace(/\s+/g, '')] = row;
        //app.config.overlays[row.Display_name.replace(/\s+/g, '')+'Url'] = app.config.esri.AGOUrl + (row.Display_name.substr(row.Display_name.indexOf('.')+1) + '/FeatureServer/0');
      });
      return result;
    },

    // start app
    init: function ()
    {
      // configure underscore templating to use mustache style strings
      _.templateSettings = {
        interpolate: /\{\{(.+?)\}\}/g
      };
      // debug stuff
      // var DEBUG = false,
      var DEBUG_HOSTS = app.config.debugHosts,
          HOST = window.location.hostname,
          DEBUG = _.some(_.map(DEBUG_HOSTS, function (debugHost) {
            return HOST.indexOf(debugHost) >= 0;
          })),
          DEBUG_ADDRESS = '943 sigel st',
          // DEBUG_ADDRESS = '1849 blair st',
          // DEBUG_ADDRESS = 'n 3rd st & market st',
        // dynamically form a url based on the current hostname
          constructLocalUrl = function (host, path) {
            return '//' + host + path;
          };

      // disable // console if not debugging
      if (!DEBUG) {
        _.forEach(['log', 'debug', 'info', 'warn', 'error'], function (method) {
          // console[method] = function () {};
        });
      }

      DEBUG && // console.log('debug mode on');
      DEBUG && $('#search-input').val(DEBUG_ADDRESS);

      // set pictometry and cyclomedia urls based on host
      app.config.pictometry.url = constructLocalUrl(HOST, '/pictometry');
      app.config.cyclo.url = constructLocalUrl(HOST, '/cyclomedia');

      $('#topic-list').show();
      // read the csv to a JS object in DOM
      // $.ajax({
      //   url: 'config/explorer_config.csv',
      //   dataType: 'text',
      // }).done(function(data) {
      //   app.config.csv = app.configToDOM(data);
      //   _.forEach(app.config.categories, function(category) {
      //     var anchor = $('<a id="topic-link-' + category.replace(/\s+/g, '') + '" class="topic-link" href="#">');
      //     var span = $('<span class="topic-link-icon flaticon-copy">');
      //     anchor.append(span);
      //     anchor.append(category);
      //     var accordian = $('<div id="topic-' + category.replace(/\s+/g, '') + '" class="topic">');
      //     $('#topic-list').append(anchor);
      //     $('#topic-list').append(accordian);
      //   });

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
        //     //var agoInfo = app.config.agoStuff[i.replace(/\s+/g, '')]
        //     //console.log(agoInfo);
        //     var li = $('<li>'),
        //       label = $('<label for="checkbox-'+i+'">'),
        //       //input = $('<input id="checkbox-'+layer.Raw_name.substr(layer.Raw_name.indexOf('.')+1)+'" name="checkbox" type="checkbox">');
        //       input = $('<input id="checkbox-'+i+'" name="checkbox" type="checkbox">');
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
      // });

      DEBUG && console.log('debug mode on');
      DEBUG && $('#search-input').val(DEBUG_ADDRESS);

      // set up accounting
      accounting.settings.currency.precision = 0;

      // Make ext links open in new window
      $('a').each(function() {
         var a = new RegExp('/' + window.location.host + '/');
         if (!a.test(this.href)) {
           $(this).click(function (event) {
             event.preventDefault();
             event.stopPropagation();
             window.open(this.href, '_blank');
           });
         }
      });

      // listen for search
      $('#search-button').click(app.didClickSearch);
      $('#search-input').keypress(function (e) {
        if (e.which === 13) app.didClickSearch();
      });

      // make "Obilque Imagery" button open Pictometry window
      $('#pict-button').on('click', function (e) {
        e.preventDefault();
        window.open(app.config.pictometry.url, app.config.pictometry.url);
        return false
      });

      // make "Street View" button open Cyclomedia window
      $('#cyclo-button').on('click', function (e) {
        e.preventDefault();
        window.open(app.config.cyclomedia.url, app.config.cyclomedia.url);
        return false
      });

      // clear active topic in localStorage
      localStorage.removeItem('activeTopic');

      /*
      ROUTING
      */

      // listen for back button
      window.onpopstate = function () {
        // console.log('popped state', location.href);
        app.route();
      };

      // route one time on load
      app.route();
    }, // end of init

    route: function () {
      console.log('route is starting to run');
      var hash = location.hash,
          params = app.util.getQueryParams(),
          comps = hash.split('/');

      console.log('params is ' + params);
      console.log('comps is ' + comps);
      // if there are query params
      var searchParam = params.search;
      if (searchParam) {
        console.log('searchParam is ' +  searchParam);
        app.searchForAddress(searchParam);
        // TODO fix url
        return;
      }

      // check for enough comps (just 2, since topic is optional)
      if (comps.length < 2) {
        // console.log('route, but not enough comps', comps);
        return;
      }

      var address = decodeURIComponent(comps[1]),
          topic = comps.length > 2 ? decodeURIComponent(comps[2]) : null,
          state = history.state;

      // activate topic
      // topic && app.activateTopic(topic);
      app.state.activeTopic = topic;

      // if there's no ais in state, go get it
      if (!(state && state.ais)) {
        console.log('going to run searchForAddress');
        app.searchForAddress(address);
        return;
      }

      // rehydrate state
      var ais = state.ais;
      app.state.ais = ais;
      app.didGetAisResult();
    },

    didClickSearch: function () {
      app.state.map.clickedOnMap = false;
      localStorage.setItem('clickedOnMap', false);
      app.state.map.shouldPan = true;

      var val = $('#search-input').val();

      // display loading
      $('#topic-panel-title').text('Loading...');

      // clean up UI from last search
      // TODO make this a function
      $('.li-see-more-link').remove();

      // clear out relevant state objects
      _.forEach(['ais', 'opa', 'li'], function (stateProp) {
        app.state[stateProp] = undefined;
      });

      // fire off ais
      app.searchForAddress(val);
    },

    // fires ais search
    searchForAddress: function (address) {
      console.log('searchForAddress started');
      var url = app.config.ais.url + encodeURIComponent(address);
      if (HOST == 'atlas.phila.gov'){
        var params = {
          gatekeeperKey: app.config.ais.gatekeeperKey,
          // include_units: '',
        };
      } else {
        var params = {
          gatekeeperKey: app.config.ais.betsyKey,
          // include_units: '',
        };
      }
      $.ajax({
        url: url,
        data: params,
        success: function (data) {
          // console.log('got ais', data);
          //app.state.shouldOpenTopics = true;
          app.state.ais = data;

          // if more than one address result, show a modal
          if (data.features.length > 1) app.showMultipleAisResultModal();
          else {
            app.state.selectedAddress = data.features[0].properties.street_address;
            app.didGetAisResult();
          }
        },
        error: function (err) {
          console.log('ais error', err);
          $('#no-results-modal').foundation('open');
        },
      });
    },

    // takes a topic (formerly "data row") name and activates the corresponding
    // section in the data panel
    activateTopic: function (targetTopicName) {
      console.log('running activateTopic with ' + targetTopicName);

      app.state.activeTopic = targetTopicName;

      var $targetTopic = $('#topic-' + targetTopicName);

      // get the currently active topic
      var $activeTopic = $('.topic:visible');

      // only activate if it's not already active
      if ($targetTopic.is($activeTopic)) {
        //console.log('activate topic, but its already active');
        return;
      }

      $activeTopic.slideUp(350);
      $targetTopic.slideDown(350);

      // tell map about it
      var prevTopic;
      if ($activeTopic.length > 0) {
        prevTopic = $activeTopic.attr('id').replace('topic-', '');
      } else {
        prevTopic = null;
      }
      app.map.didChangeTopic(prevTopic, targetTopicName);
    },

    toggleTopic: function (targetTopicName) {
      console.log('toggleTopic is starting to run with', targetTopicName);
      var $targetTopic = $('#topic-' + targetTopicName);

      // if it's already visible, hide it
      if ($targetTopic.is(':visible')){
        app.state.activeTopic = null
        $targetTopic.slideUp(350);
        app.map.didChangeTopic(targetTopicName, null);
        // app.map.didDeactivateTopic(targetTopicName);

        // remove topic from url
        var hashNoTopic = location.hash.split('/').slice(0, 2).join('/');
        history.pushState(history.state, '', hashNoTopic);

        //app.state.activeTopic = null;
      }

      // otherwise, activate
      else {
        console.log('toggleTopic is calling activateTopic with ' + targetTopicName);
        app.activateTopic(targetTopicName);
      }
    },

    didGetAisResult: function () {
      // console.log('did get ais result');

      // set app state
      // app.state.ais = data;
      var data = app.state.ais;

      // get values
      var selectedAddress = app.state.selectedAddress,
          obj;
      if (selectedAddress) {
        obj = _.filter(data.features, {properties: {street_address: selectedAddress}})[0];
      }
      else obj = data.features[0]
      var props = obj.properties,
          streetAddress = props.street_address;

      // make mailing address
      // var mailingAddress = streetAddress + '<br>PHILADELPHIA, PA ' + props.zip_code;
      // if (props.zip_4) mailingAddress += '-' + props.zip_4;
      var line2 = 'PHILADELPHIA, PA ' + props.zip_code;
      if (props.zip_4) line2 += '-' + props.zip_4;

      // the full mailing address is useful for other things (like elections),
      // so keep it in state
      app.state.ais.mailingAddress = streetAddress + ', ' + line2;

      // hide greeting if it's there
      var $topicPanelHeaderGreeting = $('#topic-panel-header-greeting');
      if ($topicPanelHeaderGreeting.is(':visible')) {
        $topicPanelHeaderGreeting.fadeOut(175, function () {
          $('#topic-panel-header-address').fadeIn(175);
        });
      }

      // render ais data
      $('#topic-panel-title').text(streetAddress);
      // $('#address-info-mailing-address').html(mailingAddress);
      $('#topic-panel-header-address-line-1').html(streetAddress);
      $('#topic-panel-header-address-line-2').html(line2);

      $('#address-info-street-code').text(data.features[0].properties.street_code);
      // $('#zoning-code').text(props.zoning);

      // render map for this address
      if (selectedAddress) app.map.renderAisResult(obj);

      // get topics
      // app.getTopics(props);
      app.getTopics();

      // push state
      var nextState = {ais: app.state.ais},
          nextTopic = app.state.activeTopic || 'property',
          nextHash = app.util.constructHash(streetAddress, nextTopic);
      history.pushState(nextState, null, nextHash);

      // if no topic is active, activate property
      // if (!app.state.nextTopic) {}
      console.log('didGetAisResult is running activateTopic with ' + nextTopic);
      app.activateTopic(nextTopic);
    },

    showContentForTopic: function (topic) {
      // show "no content"
      var topicDivId = '#topic-' + topic,
          $topicContent = $(topicDivId + ' > .topic-content'),
          $topicNoContent = $(topicDivId + ' > .topic-content-not-found');
      $topicContent.show();
      $topicNoContent.hide();
    },

    hideContentForTopic: function (topic) {
      // show "no content"
      var topicDivId = '#topic-' + topic,
          $topicContent = $(topicDivId + ' > .topic-content'),
          $topicContentNotFound = $(topicDivId + ' > .topic-content-not-found');
      $topicContent.hide();
      $topicContentNotFound.show();
    },
//  }
});

$(function () {
  app.init();
});
