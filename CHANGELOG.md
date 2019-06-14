# leaflet.reachability Changelog

## 2.0.0 (2019-06-14)
This is a new major version release and so contains breaking changes compared to previous versions.

- Changed over to the new openrouteservice [V2 POST API](https://openrouteservice.org/dev/#/api-docs/v2/isochrones/{profile}/post) from the GET service. This means that *simple_ajax_request.js* is now redundant and has been removed as the API call code is handled within the plugin.<br />
**Removed the following parameters**: `ajaxRequestFn`.
- Changed the way in which the distance and time select lists are populated and the method for passing the values to the API. You can now specify custom ranges of values or equidistant intervals for the distance and time select lists.<br />
**Removed the following parameters**:<br />
`rangeControlDistanceMin`, `rangeControlTimeMin`.<br />
**Added the following parameters**:<br />
`rangeControlDistance`, `rangeControlTime`.
- Changed the way in which the mode of travel buttons work. Previous versions had a dedicated button for driving, cycling and walking modes and a reserved space for implementing wheelchair travel in a future release. You can now choose to have 1-4 modes of travel and assign any valid API travel profile to each. This change means that reachability travelling via wheelchair is now implemented, however results are largely dependant on how well tagged Open Street Map is for wheelchair accessibility in your area.<br />
**Removed the following parameters**:<br />
`drivingButtonContent`, `drivingButtonStyleClass`, `drivingButtonTooltip`, `travelModeDrivingProfile`, `cyclingButtonContent`, `cyclingButtonStyleClass`, `cyclingButtonTooltip`, `travelModeCyclingProfile`, `walkingButtonContent`, `walkingButtonStyleClass`, `walkingButtonTooltip`, `travelModeWalkingProfile`, `accessibilityButtonContent`, `accessibilityButtonStyleClass`, `accessibilityButtonTooltip`, `travelModeAccessibilityProfile`.<br />
**Added the following parameters**:<br />
`travelModeButton1Content`, `travelModeButton1StyleClass`, `travelModeButton1Tooltip`, `travelModeProfile1`, `travelModeButton2Content`, `travelModeButton2StyleClass`, `travelModeButton2Tooltip`, `travelModeProfile2`, `travelModeButton3Content`, `travelModeButton3StyleClass`, `travelModeButton3Tooltip`, `travelModeProfile3`, `travelModeButton4Content`, `travelModeButton4StyleClass`, `travelModeButton4Tooltip`, `travelModeProfile4`.
- Added `smoothing` parameter to implement the API smoothing feature as suggested in [issue #1](https://github.com/traffordDataLab/leaflet.reachability/issues/1).
- Added `attributes` parameter to allow access to the API reachfactor output as suggested in [issue #1](https://github.com/traffordDataLab/leaflet.reachability/issues/1).

## 1.0.1 (2019-05-30)
- Bug fix for [issue #4](https://github.com/traffordDataLab/leaflet.reachability/issues/4).
- Bug fix for [issue #6](https://github.com/traffordDataLab/leaflet.reachability/issues/6).

## 1.0.0 (2018-11-06)
This is the first versioned release since the soft-launch on 2018-09-21.
