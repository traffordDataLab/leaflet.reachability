# leaflet.reachability Changelog

## 3.0.0 (TBC)
This is a new major version release and so contains breaking changes compared to previous versions. Changes all relate to improving accessibility, no new features have been added.

- Made the anchor 'button' to expand the reachability interface (if collapsed === true) into a toggle button to expand/collapse and removed the former collapse button. This allows the focus to remain on the button when activated and makes the control more understandable. Also added features allowing it to be activated using space and enter like an actual `<button>` element. Changes affected are as follows:<br />
**Removed the following parameters**:<br />
`expandButtonContent`, `expandButtonStyleClass`, `expandButtonTooltip`, `collapseButtonContent`, `collapseButtonStyleClass`, `collapseButtonTooltip`<br />
**Added the following parameters**:<br />
`toggleButtonContent`, `toggleButtonStyleClass`, `toggleButtonTooltip`<br />
**Removed the following CSS classes**:<br />
`.reachability-control-expand-button`, `.reachability-control-collapse-button`<br />
**Added the following CSS classes**:<br />
`.reachability-control-toggle-button`
- Changed all buttons in the user interface to `<button>` elements rather than using `<span>`. All user interface buttons can now be interacted with via the keyboard using space and enter keys. Additionally the distance, time and travel mode buttons have all been given `'radio'` aria roles as they function like radio buttons. This required changes to the following CSS classes which could cause issues with previous implementations:<br />
`.reachability-control-settings-button`, `.reachability-control-active`
- Changed the titles for the distance and time range select lists from `<span>` elements into `<label>` elements associated to the select lists. Updated naming of the following parameters accordingly:<br />
`rangeControlDistanceTitle` is now `rangeControlDistanceLabel`
`rangeControlTimeTitle` is now `rangeControlTimeLabel`
- Delete button has `disabled` attribute set when there are no reachability areas on the map
- Added `title` (tooltips) and `aria-label` attributes to the distance, time and intervals `<label>`s to give further information on their function:<br />
**Added the following parameters**:<br />
`rangeControlDistanceLabelTooltip`, `rangeControlTimeLabelTooltip`, `rangeIntervalsLabelTooltip`<br />

## 2.0.1 (2020-11-27)
Minor update to the attribution in accordance with the [OpenRouteService updated terms of service](https://openrouteservice.org/terms-of-service/).

- Attribution added to Leaflet map when a reachability area is created now reads: &copy; [openrouteservice.org](https://openrouteservice.org) by HeiGIT | Map data &copy; [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors

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
