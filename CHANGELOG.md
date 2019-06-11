# leaflet.reachability Changelog

## 2.0.0 (2019-06-XX)
This is a new major release and so contains breaking changes compared to previous versions.

- Changed over to the new openrouteservice [V2 POST API](https://openrouteservice.org/dev/#/api-docs/v2/isochrones/{profile}/post) from the GET service. This means that simple_ajax_request.js is now redundant so it has been removed as the API call code is handled within the plugin. `ajaxRequestFn` parameter removed.
- Changed the way in which the distance and time select lists are populated and the method for passing the values to the API. Removed `rangeControlDistanceMin` and `rangeControlTimeMin` parameters and added `rangeControlDistance` and `rangeControlTime` parameters. You can now specify custom ranges of values or equidistant intervals for the distance and time select lists.
- Added `smoothing` parameter to implement the smoothing feature as suggested in [issue #1](https://github.com/traffordDataLab/leaflet.reachability/issues/1).
- Added `attributes` parameter to allow access to the reachfactor output as suggested in [issue #1](https://github.com/traffordDataLab/leaflet.reachability/issues/1).

## 1.0.1 (2019-05-30)
- Bug fix for [issue #4](https://github.com/traffordDataLab/leaflet.reachability/issues/4).
- Bug fix for [issue #6](https://github.com/traffordDataLab/leaflet.reachability/issues/6).

## 1.0.0 (2018-11-06)
This is the first versioned release since the soft-launch on 2018-09-21.
