# leaflet.reachability
[Trafford Data Lab](https://www.trafforddatalab.io) plugin for the [Leaflet](https://leafletjs.com) JavaScript library to show areas of reachability based on time or distance for different modes of travel using the [openrouteservice isochrones API](https://openrouteservice.org/documentation/#/reference/isochrones).

You can [view the demo](https://rawgit.com/trafforddatalab/leaflet.reachability/master/leaflet.reachability_example.html) to get an idea of what it can do with the basic options, or view a more customised implementation (which uses more of the available styling options) in our [Explore mapping application](https://www.trafforddatalab.io/maps/explore/).

We have published an [article](https://medium.com/@traffordDataLab/out-of-reach-introducing-our-distance-and-travel-time-plugin-859932cb12e5) explaining the benefits of using network buffers rather than euclidean distance when determining reachability as well as creating the following short videos demonstrating example uses for the plugin:
- [How many facilities are within a 15 minute walk?](https://vimeo.com/291529944)
- [Finding a common location within reach](https://vimeo.com/292728150)

## Documentation
You will need to obtain a free API key from <a href="https://openrouteservice.org/dev/#/signup">openrouteservice</a> before using this plugin. Please do not use the key from the demo in your own applications.

After including the CSS and JS in your page:...
```HTML
<link rel="stylesheet" href="leaflet.reachability.css"/>
<script src="leaflet.reachability.js"></script>
<!-- Include below if you don't have your own preferred AJAX function/method (see options below) -->
<script src="simple_ajax_request.js"></script>
```

...you can then initialise the plugin in the standard Leaflet way adding it to a map instance:

```javascript
<body>
    <div id="map"></div>

    <script>
        // Create the Leaflet map object
        var map = L.map('map', { center: [53.4189, -2.33] });

        // Create a Leaflet tile layer object
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        // Initialise the reachability plugin
        L.control.reachability({
            // add settings/options here
            apiKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        }).addTo(map);
    </script>
</body>
```

This is the minimum code required and will use all the default settings. If you have a style or theme for your application you'll most likely want the plugins to follow it. To customise the plugin for your requirements you will need to change the default options.

### Options

The plugin has many options, e.g. for controlling the appearance of the user-interface, (allowing icons from popular services such as [Fontawesome](https://fontawesome.com/) to be used), styling the reachability polygons and markers as well as incorporating many of the [openrouteservice API options](https://openrouteservice.org/documentation/#/reference/isochrones/isochrones/isochrones-service). Therefore the list of options in the tables below are presented in sections based on their use. The options within each section are listed in alphabetical order except when grouping related options or introducing certain options first makes more sense.

**PLEASE NOTE:** *the options below contain entries for accessible travel mode. This feature is currently unavailable from openrouteservice, however it is due to be activated very soon. Once activated this feature will be enabled in the plugin.*

**Main options**

These are the general setup options for the plugin control e.g. where it appears on the map, whether it is permanently expanded or if it can be toggled between collapsed and expanded states etc.

| Option                       | Type    | Default                                  | Description |
| ---------------------------- | ------- | ---------------------------------------- | ----------- |
| `collapsed`                  | Boolean | `true`                                   | Whether the control can be toggled between collapsed and expanded states `true` or is permanently expanded `false`. |
| `collapseButtonContent`      | String  | `"^"`                                    | HTML content to display within the button to collapse the control if it is expanded. You can use an icon from various icon services instead by passing `""` for this value and adding the required classes to the the `collapseButtonStyleClass` option. |
| `collapseButtonStyleClass`   | String  | `"reachability-control-collapse-button"` | CSS class(es) to control the styling/content of the button to collapse the control to its minimised state. |
| `collapseButtonTooltip`      | String  | `"Hide reachability options"`            | Tooltip to appear on-hover over the button to collapse the control. |
| `controlContainerStyleClass` | String  | `""`                                     | CSS class(es) to control the styling of the container for the plugin control. The control container will inherit the standard Leaflet control styling, however this option allows for customisation. |
| `drawActiveMouseClass`       | String  | `"leaflet-crosshair"`                    | CSS class(es) applied to the mouse pointer when the plugin is in draw mode. |
| `expandButtonContent`        | String  | `"&#x2609;"` e.g. &#x2609;               | HTML content to display within the control if it is collapsed. You can use an icon from various icon services instead by passing `""` for this value and adding the required classes to the the `expandButtonStyleClass` option. |
| `expandButtonStyleClass`     | String  | `"reachability-control-expand-button"`   | CSS class(es) to control the styling/content of the button to expand the control revealing the user interface. |
| `expandButtonTooltip`        | String  | `"Show reachability options"`            | Tooltip to appear on-hover over the button to expand the control |
| `pane`                       | String  | `"overlayPane"`                          | Map [pane](http://leafletjs.com/reference.html#map-pane) to draw the reachability polygons within. |
| `position`                   | String  | `"topleft"`                              | Control [position](http://leafletjs.com/reference.html#control-positions) on the map. |
| `zIndexMouseMarker`          | Number  | `9000`                                   | CSS z-index of an invisible marker which follows and captures mouse/touch events when the control is in draw mode to prevent triggering other map events. Must be greater than any other layer on the map. |

**User interface options**

The options below control the styling of the user interface as well as for choosing which reachability options should be selected by default.

| Option                          | Type   | Default                                     | Description |
| ------------------------------- | ------ | ------------------------------------------- | ----------- |
| `settingsContainerStyleClass`   | String | `"reachability-control-settings-container"` | The HTML container holding the user interface controls which is displayed if `collapsed` is `false`, or when the user expands the control using the expand button. |
| `settingsButtonStyleClass`      | String | `"reachability-control-settings-button"`    | Generic class to style the setting buttons uniformly - further customisation per button is available with specific options below. |
| `activeStyleClass`              | String | `"reachability-control-active"`             | Indicates to the user which button is active in the settings panel and to show that the control is active if the draw or delete options are selected and the control is in its collapsed state. |
| `errorStyleClass`               | String | `"reachability-control-error"`              | Gives feedback to the user via the buttons in the user interface that something went wrong, e.g. selecting delete when there are no reachability polgons on the map etc. |
| `drawButtonContent`             | String | `"Drw"`                                     | HTML content of the button which activates and deactivates the control's draw mode. You can use an icon from various icon services instead by passing `""` for this value and adding the required classes to the the `drawButtonStyleClass` option. |
| `drawButtonStyleClass`          | String | `""`                                        | CSS class(es) to control the styling/content of the draw button. |
| `drawButtonTooltip`             | String | `"Draw reachability"`                       | Tooltip to appear on-hover over the draw button. |
| `deleteButtonContent`           | String | `"Del"`                                     | HTML content of the button which activates and deactivates the control's delete mode. You can use an icon from various icon services instead by passing `""` for this value and adding the required classes to the the `deleteButtonStyleClass` option. |
| `deleteButtonStyleClass`        | String | `""`                                        | CSS class(es) to control the styling/content of the delete button. |
| `deleteButtonTooltip`           | String | `"Delete reachability"`                     | Tooltip to appear on-hover over the delete button. |
| `distanceButtonContent`         | String | `"Dst"`                                     | HTML content of the button to select distance as the reachability measure. You can use an icon from various icon services instead by passing `""` for this value and adding the required classes to the `distanceButtonStyleClass` option. |
| `distanceButtonStyleClass`      | String | `""`                                        | CSS class(es) to control the styling/content of the distance button. |
| `distanceButtonTooltip`         | String | `"Reachability based on distance"`          | Tooltip to appear on-hover over the distance button. |
| `timeButtonContent`             | String | `"Tme"`                                     | HTML content of the button to select time as the reachability measure. You can use an icon from various icon services instead by passing `""` for this value and adding the required classes to the `timeButtonStyleClass` option. |
| `timeButtonStyleClass`          | String | `""`                                        | CSS class(es) to control the styling/content of the time button. |
| `timeButtonTooltip`             | String | `"Reachability based on time"`              | Tooltip to appear on-hover over the time button. |
| `rangeTypeDefault`              | String | `"time"`                                    | Selects whether distance or time is selected by default as the reachability measure. Any value other than `"distance"` passed to the API is assumed to be `"time"`. Corresponds to `range_type` in the API documentation. |
| `drivingButtonContent`          | String | `"Drv"`                                     | HTML content of the driving travel mode button. You can use an icon from various icon services instead by passing `""` for this value and adding the required classes to the `drivingButtonStyleClass` option. |
| `drivingButtonStyleClass`       | String | `""`                                        | CSS class(es) to control the styling/content of the driving travel mode button. |
| `drivingButtonTooltip`          | String | `"Travel mode: driving"`                    | Tooltip to appear on-hover over the driving travel mode button. |
| `cyclingButtonContent`          | String | `"Cyc"`                                     | HTML content of the cycling travel mode button. You can use an icon from various icon services instead by passing `""` for this value and adding the required classes to the `cyclingButtonStyleClass` option. |
| `cyclingButtonStyleClass`       | String | `""`                                        | CSS class(es) to control the styling/content of the cycling travel mode button. |
| `cyclingButtonTooltip`          | String | `"Travel mode: cycling"`                    | Tooltip to appear on-hover over the cycling travel mode button. |
| `walkingButtonContent`          | String | `"Wlk"`                                     | HTML content of the walking travel mode button. You can use an icon from various icon services instead by passing `""` for this value and adding the required classes to the `walkingButtonStyleClass` option. |
| `walkingButtonStyleClass`       | String | `""`                                        | CSS class(es) to control the styling/content of the walking travel mode button. |
| `walkingButtonTooltip`          | String | `"Travel mode: walking"`                    | Tooltip to appear on-hover over the walking travel mode button. |
| `accessibilityButtonContent`    | String | `"Acc"`                                     | HTML content of the accessibility travel mode button. You can use an icon from various icon services instead by passing `""` for this value and adding the required classes to the `accessibilityButtonStyleClass` option. |
| `accessibilityButtonStyleClass` | String | `""`                                        | CSS class(es) to control the styling/content of the accessibility travel mode button. |
| `accessibilityButtonTooltip`    | String | `"Travel mode: wheelchair"`                 | Tooltip to appear on-hover over the accessibility travel mode button. |
| `travelModeDefault`             | String | `null`                                      | Sets the default travel profile. If this is not equal to one of the travel profile options (see openrouteservice API options below) it will use the value of `travelModeDrivingProfile` |
| `rangeControlDistanceTitle`     | String | `"Dist."`                                   | Title displayed above the range drop-down list when distance is selected as the reachability measure. |
| `rangeControlDistanceUnits`     | String | `"km"`                                      | Units for the distance measure. Can be `"m"` (metres), `"km"` (kilometres) or `"mi"` (miles). Corresponds to `units` in the API documentation. |
| `rangeControlDistanceMin`       | Number | `0.5`                                       | Minimum distance value to calculate reachability, measured in `rangeControlDistanceUnits`. |
| `rangeControlDistanceMax`       | Number | `3`                                         | Maximum distance value to calculate reachability, measured in `rangeControlDistanceUnits`. |
| `rangeControlDistanceInterval`  | Number | `0.5`                                       | Distance intervals between the `rangeControlDistanceMin` and `rangeControlDistanceMax` values, measured in `rangeControlDistanceUnits`. Corresponds to `interval` in the API documentation. |
| `rangeControlTimeTitle`         | String | `"Time"`                                    | Title displayed above the range drop-down list when time is selected as the reachability measure. |
| `rangeControlTimeMin`           | Number | `5`                                         | Minimum time value to calculate reachability, measured in minutes but multipled by 60 to convert to seconds when passed to the API as this is the only unit of time allowed. |
| `rangeControlTimeMax`           | Number | `30`                                        | Maximum time value to calculate reachability, measured in minutes but multipled by 60 to convert to seconds when passed to the API as this is the only unit of time allowed. |
| `rangeControlTimeInterval`      | Number | `5`                                         | Time intervals between the `rangeControlTimeMin` and `rangeControlTimeMax` values, measured in minutes but multipled by 60 to convert to seconds when passed to the API as this is the only unit of time allowed. Corresponds to `interval` in the API documentation. |
| `rangeIntervalsLabel`           | String | `"intervals"`                               | Text displayed next to the checkbox which controls whether reachability areas should be drawn for all intervals between the minumum and the value chosen by the user or just the chosen value. |

**Reachability polygon options**

The options below control the styling of the polygons which are created when a call is made to the openrouteservice API, and allow actions to occur when the user interacts with them.

| Option        | Type     | Default  | Description |
| ------------- | -------- | -------- | ----------- |
| `clickFn`     | Function | `null`   | External function called when a click/touch event occurs on a reachability polygon. |
| `mouseOutFn`  | Function | `null`   | External function called when a mouseout event occurs on a reachability polygon. |
| `mouseOverFn` | Function | `null`   | External function called when a mouseover event occurs on a reachability polygon. |
| `styleFn`     | Function | `null`   | External function to style the reachability polygon(s) returned from the API. |

**Reachability origin marker options**

The following options control whether markers are created at the origin of the reachability polygons (i.e. the point chosen by the user on the map), and if so, what they look like and how they should respond to user interaction.

| Option            | Type     | Default  | Description |
| ----------------- | -------- | -------- | ----------- |
| `showOriginMarker`| Boolean  | `true`   | Whether a marker is displayed at the origin of a reachability area or not. |
| `markerFn`        | Function | `null`   | External function to create a custom marker at the origin of a reachability area if `showOriginMarker` is `true`. A value of `null` creates a default circleMarker. |
| `markerClickFn`   | Function | `null`   | External function called when a click/touch event occurs on a reachability origin marker. |
| `markerOutFn`     | Function | `null`   | External function called when a mouseout event occurs on a origin marker. |
| `markerOverFn`    | Function | `null`   | External function called when a mouseover event occurs on a origin marker. |

**Openrouteservice API options**

Options presented below are for controlling the communication between the plugin and the openrouteservice API. Some correspond to the options found in the [API documentation](https://openrouteservice.org/documentation/#/reference/isochrones/isochrones/isochrones-service).

| Option                           | Type             | Default             | Description |
| -------------------------------- | ---------------- | ------------------- | ----------- |
| `apiKey`                         | String           | `""`                | **REQUIRED!** Your openrouteservice API key. [Register for one here](https://openrouteservice.org/dev/#/signup). Corresponds to `api_key` in the API documentation. |
| `ajaxRequestFn`                  | Function         | `null`              | External function to make the actual call to the openrouteservice API. Can be any function capable of making AJAX requests, e.g. your own custom JavaScript/JQuery function etc. A value of `null` will attempt to use the basic function found in `simple_ajax_request.js` bundled with the plugin, so be sure to include this script along with the plugin in your application if you do not change this option. |
| `travelModeAccessibilityProfile` | String           | `"wheelchair"`      | Accessibility travel profile. Used when the accessibility mode of travel button is selected. Possible values are `"wheelchair"`. Corresponds to `profile` in the API documentation |
| `travelModeCyclingProfile`       | String           | `"cycling-regular"` | Cycling travel profile. Used when the cycling mode of travel button is selected. Possible values are `"cycling-regular"`, `"cycling-road"`, `"cycling-safe"`, `"cycling-mountain"` and `"cycling-tour"`. Corresponds to `profile` in the API documentation. |
| `travelModeDrivingProfile`       | String           | `"driving-car"`     | Driving travel profile. Used when the driving mode of travel button is selected. Possible values are `"driving-car"` and `"driving-hgv"`. Corresponds to `profile` in the API documentation. |
| `travelModeWalkingProfile`       | String           | `"foot-walking"`    | Walking travel profile. Used when the walking mode of travel button is selected. Possible values are `"foot-walking"` and `"foot-hiking"`. Corresponds to `profile` in the API documentation. |

### Events

The following table lists all the events fired by the plugin via the map object. You can listen for these events within your application to perform additional actions etc. Instances of `"reachability:no_data"` and `"reachability:error"` being fired will result in further details being recorded in the console log where possible.

| Event                               | Data                                               | Description |
| ----------------------------------- | ---------------------------------------------------| ----------- |
| `"reachability:control_added"`      | [Event](http://leafletjs.com/reference.html#event) | Fired when the control is added to the map. |
| `"reachability:control_removed"`    | [Event](http://leafletjs.com/reference.html#event) | Fired when the control is removed from the map. |
| `"reachability:control_expanded"`   | [Event](http://leafletjs.com/reference.html#event) | Fired when the control is expanded from its collapsed state. |
| `"reachability:control_collapsed"`  | [Event](http://leafletjs.com/reference.html#event) | Fired when the control is collapsed from its expanded state. |
| `"reachability:draw_activated"`     | [Event](http://leafletjs.com/reference.html#event) | Fired when the draw button is activated. |
| `"reachability:draw_deactivated"`   | [Event](http://leafletjs.com/reference.html#event) | Fired when the draw button is deactivated. |
| `"reachability:delete_activated"`   | [Event](http://leafletjs.com/reference.html#event) | Fired when the delete button is activated. Delete can only be activated if there is more than one reachability area currently on the map. If there is only one then it will be automatically deleted and the `"reachability:delete"` event will fired instead. If no reachability areas are on the map the button will highlight an error to the user. |
| `"reachability:delete_deactivated"` | [Event](http://leafletjs.com/reference.html#event) | Fired when the delete button is deactivated. |
| `"reachability:delete"`             | [Event](http://leafletjs.com/reference.html#event) | Fired when a reachability area is deleted from the map. |
| `"reachability:api_call_start"`     | [Event](http://leafletjs.com/reference.html#event) | Fired when a call to the openrouteservice API is started.  |
| `"reachability:api_call_end"`       | [Event](http://leafletjs.com/reference.html#event) | Fired when a call to the openrouteservice API is ended. |
| `"reachability:displayed"`          | [Event](http://leafletjs.com/reference.html#event) | Fired when reachability polygon(s) are displayed on the map following an openrouteservice API call. |
| `"reachability:no_data"`            | [Event](http://leafletjs.com/reference.html#event) | Fired when the openrouteservice API returns no reachability areas following a call. |
| `"reachability:error"`              | [Event](http://leafletjs.com/reference.html#event) | Fired when a call to the openrouteservice API cannot be made for some reason. |

### Examples

The following code examples demonstrate the types of customisation possible using the options and events in the tables above. The plugin has been designed to follow the same coding style and methodology as shown in the [Leaflet tutorials](https://leafletjs.com/examples.html) and so should provide a familiar method of integrating and interacting with the plugin in your applications.

**information to follow...**

## Licence
This software is provided under the terms of the [MIT License](https://github.com/traffordDataLab/leaflet.reachability/blob/master/LICENSE).
