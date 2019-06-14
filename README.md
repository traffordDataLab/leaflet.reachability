# leaflet.reachability
[Trafford Data Lab](https://www.trafforddatalab.io) plugin for the [Leaflet](https://leafletjs.com) JavaScript library to show areas of reachability based on time or distance for different modes of travel using the [openrouteservice isochrones API](https://openrouteservice.org/dev/#/api-docs/v2/isochrones/{profile}/post).

You can [view the demo](https://www.trafforddatalab.io/leaflet.reachability/leaflet.reachability_example.html) to get an idea of what it can do, or view a more customised implementation (which uses more of the available styling options) in our [Explore mapping application](https://www.trafforddatalab.io/explore/).

We have published an [article](https://medium.com/@traffordDataLab/out-of-reach-introducing-our-distance-and-travel-time-plugin-859932cb12e5) explaining the benefits of using network buffers rather than euclidean distance when determining reachability as well as creating the following short videos demonstrating example uses for the plugin:
- [How many facilities are within a 15 minute walk?](https://vimeo.com/291529944)
- [Finding a common location within reach](https://vimeo.com/292728150)

## Documentation (v2.0.0)
You will need to obtain a free API key from <a href="https://openrouteservice.org/dev/#/signup">openrouteservice</a> before using this plugin. Please do not use the key from the demo in your own applications. Consult the [changelog](CHANGELOG.md) to find out what has changed from previous versions.

After including the CSS and JS in your page (NOTE - you can also use minified versions e.g. .min.js/.min.css if you prefer):...
```HTML
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/trafforddatalab/leaflet.reachability@v2.0.0/leaflet.reachability.css"/>
<script src="https://cdn.jsdelivr.net/gh/trafforddatalab/leaflet.reachability@v2.0.0/leaflet.reachability.js"></script>
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
            apiKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
        }).addTo(map);
    </script>
</body>
```

This is the minimum code required and will use all the default settings. If you have a style or theme for your application you'll most likely want the plugins to follow it. To customise the plugin for your requirements you will need to change the default options.

### Options

The plugin has many options, e.g. for controlling the appearance of the user-interface, (allowing icons from popular services such as [Font Awesome](https://fontawesome.com/) to be used), styling the reachability polygons and markers as well as incorporating many of the [openrouteservice API options](https://openrouteservice.org/dev/#/api-docs/v2/isochrones/{profile}/post). Therefore the list of options in the tables below are presented in sections based on their use. The options within each section are listed in alphabetical order except when grouping related options or introducing certain options first makes more sense.

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

The options below control the styling and content of the user interface as well as for choosing which reachability options should be selected by default.

***NOTE: The maximum number of isochrones which can be requested at one time from the API is 10. Care should be taken choosing the interval values (or the custom range values) for the distance and time options. If the user selects the intervals checkbox it is possible that the maximum isochrone request number could be exceeded. Take the following distance (km) example: `rangeControlDistanceMax` = 1.1, `rangeControlDistanceInterval` = 0.1. The range select list would contain 11 items (0.1km - 1.1km). If the user selected 1.1km with intervals they would be requesting 11 isochrones which would result in an error.***

| Option                          | Type   | Default                                     | Description |
| ------------------------------- | ------ | ------------------------------------------- | ----------- |
| `settingsContainerStyleClass`   | String | `"reachability-control-settings-container"` | The HTML container holding the user interface controls which is displayed if `collapsed` is `false`, or when the user expands the control using the expand button. |
| `settingsButtonStyleClass`      | String | `"reachability-control-settings-button"`    | Generic class to style the setting buttons uniformly - further customisation per button is available with specific options below. |
| `activeStyleClass`              | String | `"reachability-control-active"`             | Indicates to the user which button is active in the settings panel and to show that the control is active if the draw or delete options are selected and the control is in its collapsed state. |
| `errorStyleClass`               | String | `"reachability-control-error"`              | Gives feedback to the user via the buttons in the user interface that something went wrong, e.g. selecting delete when there are no reachability polgons on the map etc. |
| `drawButtonContent`             | String | `"drw"`                                     | HTML content of the button which activates and deactivates the control's draw mode. You can use an icon from various icon services instead by passing `""` for this value and adding the required classes to the the `drawButtonStyleClass` option. |
| `drawButtonStyleClass`          | String | `""`                                        | CSS class(es) to control the styling/content of the draw button. |
| `drawButtonTooltip`             | String | `"Draw reachability"`                       | Tooltip to appear on-hover over the draw button. |
| `deleteButtonContent`           | String | `"del"`                                     | HTML content of the button which activates and deactivates the control's delete mode. You can use an icon from various icon services instead by passing `""` for this value and adding the required classes to the the `deleteButtonStyleClass` option. |
| `deleteButtonStyleClass`        | String | `""`                                        | CSS class(es) to control the styling/content of the delete button. |
| `deleteButtonTooltip`           | String | `"Delete reachability"`                     | Tooltip to appear on-hover over the delete button. |
| `distanceButtonContent`         | String | `"dst"`                                     | HTML content of the button to select distance as the reachability measure. You can use an icon from various icon services instead by passing `""` for this value and adding the required classes to the `distanceButtonStyleClass` option. |
| `distanceButtonStyleClass`      | String | `""`                                        | CSS class(es) to control the styling/content of the distance button. |
| `distanceButtonTooltip`         | String | `"Reachability based on distance"`          | Tooltip to appear on-hover over the distance button. |
| `timeButtonContent`             | String | `"tme"`                                     | HTML content of the button to select time as the reachability measure. You can use an icon from various icon services instead by passing `""` for this value and adding the required classes to the `timeButtonStyleClass` option. |
| `timeButtonStyleClass`          | String | `""`                                        | CSS class(es) to control the styling/content of the time button. |
| `timeButtonTooltip`             | String | `"Reachability based on time"`              | Tooltip to appear on-hover over the time button. |
| `rangeTypeDefault`              | String | `"time"`                                    | Selects whether distance or time is selected by default as the reachability measure. Any value other than `"distance"` passed to the API is assumed to be `"time"`. Corresponds to `range_type` in the API documentation. |
| `travelModeButton1Content`      | String | `"car"`                                     | HTML content of the first travel mode button. You can use an icon from various icon services instead by passing `""` for this value and adding the required classes to the `travelModeButton1StyleClass` option. |
| `travelModeButton1StyleClass`   | String | `""`                                        | CSS class(es) to control the styling/content of the first travel mode button. |
| `travelModeButton1Tooltip`      | String | `"Travel mode: car"`                        | Tooltip to appear on-hover over the first travel mode button. |
| `travelModeButton2Content`      | String | `"cyc"`                                     | HTML content of the second travel mode button. You can use an icon from various icon services instead by passing `""` for this value and adding the required classes to the `travelModeButton2StyleClass` option. |
| `travelModeButton2StyleClass`   | String | `""`                                        | CSS class(es) to control the styling/content of the second travel mode button. |
| `travelModeButton2Tooltip`      | String | `"Travel mode: cycling"`                    | Tooltip to appear on-hover over the second travel mode button. |
| `travelModeButton3Content`      | String | `"wlk"`                                     | HTML content of the third travel mode button. You can use an icon from various icon services instead by passing `""` for this value and adding the required classes to the `travelModeButton3StyleClass` option. |
| `travelModeButton3StyleClass`   | String | `""`                                        | CSS class(es) to control the styling/content of the third travel mode button. |
| `travelModeButton3Tooltip`      | String | `"Travel mode: walking"`                    | Tooltip to appear on-hover over the third travel mode button. |
| `travelModeButton4Content`      | String | `"wch"`                                     | HTML content of the fourth travel mode button. You can use an icon from various icon services instead by passing `""` for this value and adding the required classes to the `travelModeButton4StyleClass` option. |
| `travelModeButton4StyleClass`   | String | `""`                                        | CSS class(es) to control the styling/content of the fourth travel mode button. |
| `travelModeButton4Tooltip`      | String | `"Travel mode: wheelchair"`                 | Tooltip to appear on-hover over the fourth travel mode button. |
| `travelModeDefault`             | String | `null`                                      | Sets the default travel profile. If this is not equal to one of the travel profile options (see openrouteservice API options below) it will use the value of `travelMode1Profile` |
| `rangeControlDistanceTitle`     | String | `"Dist."`                                   | Title displayed above the range select list when distance is selected as the reachability measure. |
| `rangeControlDistanceUnits`     | String | `"km"`                                      | Units for the distance measure. Can be `"m"` (metres), `"km"` (kilometres) or `"mi"` (miles). Corresponds to `units` in the API documentation. |
| `rangeControlDistance`          | Array  | `null`                                      | Custom range of distance values measured in `rangeControlDistanceUnits` specified as an array which supersedes `rangeControlDistanceMax` and `rangeControlDistanceInterval` if not null. See ***NOTE:*** above, maximum number of values is 10. |
| `rangeControlDistanceMax`       | Number | `3`                                         | Maximum distance value to display in the range selection list, measured in `rangeControlDistanceUnits`. |
| `rangeControlDistanceInterval`  | Number | `0.5`                                       | Distance intervals between 0 and the `rangeControlDistanceMax` value, measured in `rangeControlDistanceUnits`. Corresponds to `interval` in the API documentation. See ***NOTE:*** above regarding choosing appropriate values. |
| `rangeControlTimeTitle`         | String | `"Time"`                                    | Title displayed above the range select list when time is selected as the reachability measure. |
| `rangeControlTime`              | Array | `null`                                       | Custom range of time values measured in minutes but multipled by 60 to convert to seconds when passed to the API as this is the only unit of time allowed. specified as an array which supersedes `rangeControlTimeMax` and `rangeControlTimeInterval` if not null. See ***NOTE:*** above, maximum number of values is 10. |
| `rangeControlTimeMax`           | Number | `30`                                        | Maximum time value to display in the range selection list, measured in minutes but multipled by 60 to convert to seconds when passed to the API as this is the only unit of time allowed. |
| `rangeControlTimeInterval`      | Number | `5`                                         | Time intervals between 0 and `rangeControlTimeMax` value, measured in minutes but multipled by 60 to convert to seconds when passed to the API as this is the only unit of time allowed. Corresponds to `interval` in the API documentation. See ***NOTE:*** above regarding choosing appropriate values. |
| `rangeIntervalsLabel`           | String | `"intervals"`                               | Text displayed next to the checkbox which controls whether reachability areas should be drawn for all intervals up to the value chosen by the user or just the chosen value. |

**Reachability polygon options**

The options below give you control over the styling and interactive behaviour of the reachability polygons which are created when a call is made to the openrouteservice API.

| Option        | Type     | Default  | Description |
| ------------- | -------- | -------- | ----------- |
| `clickFn`     | Function | `null`   | External function called when a click/touch event occurs on a reachability polygon. |
| `mouseOutFn`  | Function | `null`   | External function called when a mouseout event occurs on a reachability polygon. |
| `mouseOverFn` | Function | `null`   | External function called when a mouseover event occurs on a reachability polygon. |
| `styleFn`     | Function | `null`   | External function to style the reachability polygon(s) returned from the API. See **example 2** below for reference. |

**Reachability origin marker options**

The following options allow you to decide whether markers denoting the origin of the reachability polygons (i.e. the point chosen by the user on the map) should be displayed, and if so, give you control over their styling and interactive behaviour.

| Option            | Type     | Default  | Description |
| ----------------- | -------- | -------- | ----------- |
| `showOriginMarker`| Boolean  | `true`   | Whether a marker at the origin of a reachability polygon is displayed or not. |
| `markerFn`        | Function | `null`   | External function to create a custom marker at the origin of a reachability polygon if `showOriginMarker` is `true`. A value of `null` creates a default circleMarker. |
| `markerClickFn`   | Function | `null`   | External function called when a click/touch event occurs on a reachability origin marker. |
| `markerOutFn`     | Function | `null`   | External function called when a mouseout event occurs on an origin marker. |
| `markerOverFn`    | Function | `null`   | External function called when a mouseover event occurs on an origin marker. |

**Openrouteservice API interaction options**

Options presented below are for controlling the communication between the plugin and the openrouteservice API. Some correspond to the options found in the [API documentation](https://openrouteservice.org/dev/#/api-docs/v2/isochrones/{profile}/post).

| Option                           | Type             | Default             | Description |
| -------------------------------- | ---------------- | ------------------- | ----------- |
| `apiKey`                         | String           | `""`                | **REQUIRED!** Your openrouteservice API key. [Register for one here](https://openrouteservice.org/dev/#/signup). Corresponds to `api_key` in the API documentation. |
| `attributes`                     | String (CSV)     | `'"area", "reachfactor", "total_pop"'` | Optional data returned from the API, you can choose all, none or a combination of the following. `area` gives the approximate area of the reachability polygon(s) measured in the square of the units chosen in the plugin option `rangeControlDistanceUnits`, e.g. "m^2", "km^2" or "mi^2". `reachfactor` is the ratio of a reachability polygon's area to the theoretically possible area reachable if there were no roads (i.e. as the crow flies). `total_pop` is an estimate of the number of people living in the area covered by the reachability polygon(s). This value is supplied in the openrouteservice API via [Global Human Settlement (GHS)](https://ghsl.jrc.ec.europa.eu/about.php) data. Corresponds to `attributes` in the API documentation. |
| `smoothing`                      | number           | `0`                 | Applies a level of generalisation to the reachability polygons generated as a **smoothing_factor** between 0 and 100. The algorithm is **(maximum_radius_of_isochrone / 100) * smoothing_factor** with values closer to 100 resulting in more generalised shapes. Corresponds to `smoothing` in the API documentation. |
| `travelModeProfile1`             | String           | `"driving-car"`     | Travel profile used when the first travel mode button is selected. Possible values are `"driving-car"`, `"driving-hgv"`, `"cycling-regular"`, `"cycling-road"`, `"cycling-mountain"`, `"cycling-electric"`, `"foot-walking"`, `"foot-hiking"` and `"wheelchair"`. Corresponds to `profile` in the API documentation. |
| `travelModeProfile2`             | String           | `"cycling-regular"` | Travel profile used when the second travel mode button is selected. Possible values are `"driving-car"`, `"driving-hgv"`, `"cycling-regular"`, `"cycling-road"`, `"cycling-mountain"`, `"cycling-electric"`, `"foot-walking"`, `"foot-hiking"`, `"wheelchair"` and `null`. If the value is `null` the second travel mode button won't be displayed. Corresponds to `profile` in the API documentation. |
| `travelModeProfile3`             | String           | `"foot-walking"`     | Travel profile used when the third travel mode button is selected. Possible values are `"driving-car"`, `"driving-hgv"`, `"cycling-regular"`, `"cycling-road"`, `"cycling-mountain"`, `"cycling-electric"`, `"foot-walking"`, `"foot-hiking"`, `"wheelchair"` and `null`. If the value is `null` the third travel mode button won't be displayed. Corresponds to `profile` in the API documentation. |
| `travelModeProfile4`             | String           | `"wheelchair"`       | Travel profile used when the fourth travel mode button is selected. Possible values are `"driving-car"`, `"driving-hgv"`, `"cycling-regular"`, `"cycling-road"`, `"cycling-mountain"`, `"cycling-electric"`, `"foot-walking"`, `"foot-hiking"`, `"wheelchair"` and `null`. If the value is `null` the fourth travel mode button won't be displayed. Corresponds to `profile` in the API documentation. |

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
| `"reachability:displayed"`          | [Event](http://leafletjs.com/reference.html#event) | Fired when reachability polygon(s) are displayed on the map following an openrouteservice API call. See **example 3** for reference. |
| `"reachability:no_data"`            | [Event](http://leafletjs.com/reference.html#event) | Fired when the openrouteservice API returns no reachability areas following a call. |
| `"reachability:error"`              | [Event](http://leafletjs.com/reference.html#event) | Fired when a call to the openrouteservice API cannot be made for some reason. |

### API/plugin output

Upon completion of a successful call to the openrouteservice API, two objects belonging to the plugin instance will contain data, `isolinesGroup` and `latestIsolines`. If the plugin was initialised like this...

```JavaScript
var reachabilityControl = L.control.reachability({
    // add settings/options here
    apiKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
}).addTo(map);
```

...the objects can be read like this...

```JavaScript
reachabilityControl.isolinesGroup;
reachabilityControl.latestIsolines;
```

Both objects are types of the Leaflet [L.geoJSON layer](http://leafletjs.com/reference.html#geojson) object. The object `isolinesGroup` contains all the sets of reachability area polygons (and origin markers if `showOriginMarker` is `true`) that are currently drawn on the map. As the name suggests, `latestIsolines` contains the latest reachability areas returned from the most recent call to the API. If the user chooses to show the intervals between 0 and the value they have selected in the distance or time range select list, `latestIsolines` will contain a group of polygons, whereas if the intervals box is not checked it will only contain a single polygon. Important to also bear in mind, unless the `showOriginMarker` option is set to `false`, the `latestIsolines` group will also contain an additional feature for the origin marker.

Within the `properties` object of each reachability polygon are various key/value pairs of data about the polygon, as shown in the example output below for a single reachability area created with an origin marker. *(Please note that the order of the key/value pairs cannot be guaranteed and may be different from those shown below. The presence of `"Area"`, `"Area units"`, `"Population"` and `"Reach factor"` are dependent on the value of the `attributes` parameter - see above.)*:

```JavaScript
{
    "type":"FeatureCollection",
    "features":[
        {
            "type":"Feature",
            "geometry":{
                "type":"Polygon",
                "coordinates":[
                    [[-2.370967,53.431257],[-2.36845,53.430113],[-2.36371,53.422503],[-2.364027,53.41888],[-2.363917,53.416437],[-2.364106,53.409888],[-2.364085,53.409858],[-2.355248,53.405067],[-2.351026,53.401611],[-2.350658,53.401514],[-2.349777,53.401307],[-2.342775,53.401318],[-2.339174,53.401537],[-2.327938,53.404358],[-2.321353,53.404366],[-2.31331,53.401548],[-2.306582,53.406475],[-2.300036,53.416301],[-2.298577,53.420985],[-2.297909,53.423529],[-2.298552,53.42516],[-2.299297,53.426989],[-2.300775,53.429392],[-2.300912,53.429455],[-2.308067,53.434208],[-2.311778,53.438383],[-2.313744,53.440942],[-2.313902,53.440948],[-2.315041,53.440358],[-2.324808,53.436981],[-2.334137,53.434914],[-2.344139,53.438308],[-2.346769,53.438204],[-2.349127,53.437997],[-2.349301,53.43793],[-2.355581,53.435077],[-2.367244,53.433695],[-2.369887,53.434701],[-2.370145,53.434762],[-2.370967,53.431257]]
                ]
            },
            "properties":{
                "Area":15.41,
                "Area units":"km^2",
                "Latitude":53.423855,
                "Longitude":-2.332535,
                "Measure":"time",
                "Population":62534,
                "Range":10,
                "Range units":"min",
                "Reach factor":0.1978,
                "Travel mode":"cycling-regular"
            }
        },
        {
            "type":"Feature",
            "geometry":{
                "type":"Point",
                "coordinates":[-2.332535,53.423855]
            },
            "properties":{}
        }
    ]
}
```

The table below describes the contents of the polygon properties object. NOTE: keys marked with an * are dependant on the values chosen in the `attributes` parameter (see above):

| Key                   | Type   | Description |
|-----------------------|--------|-------------|
| *`"Area"`         | Number | Approximate area covered by the polygon, measured in `"Area units"`. For this key to be present, the `attributes` parameter must contain the string `"area"`. |
| *`"Area units"`   | String | Units for the `"Area"` value. This will be set to the square of the units of the plugin option `rangeControlDistanceUnits`, e.g. `"m^2"`, `"km^2"` or `"mi^2"`. For this key to be present, the `attributes` parameter must contain the string `"area"`. |
| `"Latitude"`          | Number | Latitude of the point of origin for the reachability polygon. |
| `"Longitude"`         | Number | Longitude of the point of origin for the reachability polygon. |
| `"Measure"`           | String | Either `"time"` or `"distance"`. |
| *`"Population"`   | Number | Estimate of the number of people living in the area covered by the polygon. This value is supplied in the openrouteservice API via [Global Human Settlement (GHS)](https://ghsl.jrc.ec.europa.eu/about.php) data. |
| `"Range"`             | Number | Range value of the reachability polygon measured in `"Range units"`. |
| `"Range units"`       | String | If `"Measure"` is `"time"` this value will be `"min"` (minutes), otherwise it will be set to the units of the plugin option `rangeControlDistanceUnits`, e.g. `"m"`, `"km"` or `"mi"`.       |
| *`"Reach factor"` | Number | The ratio of a reachability polygon's area to the theoretically possible area reachable if there were no roads (i.e. as the crow flies). |
| `"Travel mode"`       | String | The openrouteservice API mode of travel `profile` of the reachability polygon e.g. `"foot-walking"`, `"wheelchair"`, `"cycling-regular"`, `"driving-car"` etc. |

These properties can be bound to a popup or displayed within a custom container when the user selects a reachability area etc.

**Version**

If the plugin was initialised with an object called `reachabilityControl`, you can obtain the version number using `reachabilityControl.version`. This will return a string in the [Semantic Versioning](https://semver.org/spec/v2.0.0.html) format `"MAJOR.MINOR.PATCH"` e.g. `"2.0.0"`.

### Examples

The following code examples, in addition to the [demo page](https://rawgit.com/trafforddatalab/leaflet.reachability/master/leaflet.reachability_example.html), demonstrate the types of customisation possible using the options and events in the tables above. The plugin has been designed to follow the same coding style and methodology as shown in the [Leaflet tutorials](https://leafletjs.com/examples.html) and so should provide a familiar method of integrating and interacting with the plugin in your applications.

**Example 1: Changing the HTML content of the expand button to an icon**

This example is applicable to all the buttons associated with the plugin. For this example we will be using [Font Awesome 4.7.0 icons](https://fontawesome.com/v4.7.0/icons/) but you can apply the same principle to other versions or icon libraries.

First include the icon library file:

```HTML
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"/>
```

Then specify the options within the code to initialise the plugin. Here we are using `expandButtonContent` and `expandButtonStyleClass` to show a map marker icon instead of the default &#x2609; character:

```javascript
// Create the Leaflet map object
var map = L.map('map', { center: [53.4189, -2.33] });

// Initialise the reachability plugin
L.control.reachability({
    // add settings/options here
    apiKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    expandButtonContent: '',
    expandButtonStyleClass: 'reachability-control-expand-button fa fa-map-marker'
}).addTo(map);
```

**Example 2: Styling the reachability polygons**

The easiest way to style the reachability polygons is by creating a function and passing it via the `styleFn` option. This is demonstrated in the example below which colours all the polygons red with transparency:

```javascript
// Create the Leaflet map object
var map = L.map('map', { center: [53.4189, -2.33] });

// Function to style the reachability polygons
function styleIsolines(feature) {
    return {
        color: '#ff0000',
        opacity: 0.5,
        fillOpacity: 0.2
    };
}

// Initialise the reachability plugin
L.control.reachability({
    // add settings/options here
    apiKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    styleFn: styleIsolines
}).addTo(map);
```

Notice the `feature` parameter in the `styleIsolines` function. This can be used to conditionally style the reachability polygons based on their property values. The following example demonstrates how to style each polygon based on its range. **NOTE: the example assumes the default range values for distance and time:**

```javascript
// Create the Leaflet map object
var map = L.map('map', { center: [53.4189, -2.33] });

// Function to return a colour based on the 'Range' value of the reachability polygons
function getColourByRange(value) {
    switch (value) {
        case 5:
            return '#ff0000';
        case 10:
            return '#00ff00';
        case 15:
            return '#0000ff';
        case 20:
            return '#ffff00';
        case 25:
            return '#ff00ff';
        default:
            return '#00ffff'
    }
}

// Function to style the reachability polygons
function styleIsolines(feature) {
    // Get the value of the range property of the feature
    var rangeVal = feature.properties['Range'];
    // If the range is based on distance, multiply the value by 10 to match the time range values
    if (feature.properties['Measure'] == 'distance') rangeVal = rangeVal * 10;

    return {
        color: getColourByRange(rangeVal),
        opacity: 0.5,
        fillOpacity: 0.2
    };
}

// Initialise the reachability plugin
L.control.reachability({
    // add settings/options here
    apiKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    styleFn: styleIsolines
}).addTo(map);
```

This is similar to the method introduced in the [Leaflet Interactive Choropleth Map](https://leafletjs.com/examples/choropleth/) tutorial.

**Example 3: Responding to events**

The following example demonstrates responding to the `reachability:displayed` event to create popups containing information about the reachability areas created:

```javascript
// Create the Leaflet map object
var map = L.map('map', { center: [53.4189, -2.33] });

// Listen for the event fired when reachability areas are created on the map
map.on('reachability:displayed', function (e) {
    var properties,
        content;

    // Iterate through the reachability polygons just created, binding a popup to each one
    reachabilityControl.latestIsolines.eachLayer(function (layer) {
        // Ensure we only bind popups to the polygons and not the origin marker.
        // Marker layers don't have the 'feature' property
        if (layer.hasOwnProperty('feature')) {
            properties = layer.feature.properties;
            content = 'Reachability 0 - ' + properties['Range'] + ' ' + properties['Range units'] + '<br />based on ' + properties['Travel mode'] + ' profile';
            layer.bindPopup(content);
        }
    });
});

// Initialise the reachability plugin
L.control.reachability({
    // add settings/options here
    apiKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
}).addTo(map);
```

**Example 4: Customising the travel mode buttons**

The following example demonstrates how to customise the travel mode buttons for your usage requirements, in this instance to compare the difference in reachability between cycling on a road bike compared to a mountain bike.

This example again uses [Font Awesome 4.7.0 icons](https://fontawesome.com/v4.7.0/icons/) but you can apply the same principle to other versions or icon libraries.

First include the icon library file:

```HTML
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"/>
```

Then specify the options within the code to initialise the plugin.

```javascript
// Create the Leaflet map object
var map = L.map('map', { center: [53.4189, -2.33] });

// Initialise the reachability plugin
L.control.reachability({
    // add settings/options here
    apiKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    travelModeButton1Content: '',
    travelModeButton1StyleClass: 'fa fa-bicycle',
    travelModeButton1Tooltip: 'Road bike',
    travelModeProfile1: 'cycling-road',
    travelModeButton2Content: '',
    travelModeButton2StyleClass: 'fa fa-bicycle',
    travelModeButton2Tooltip: 'Mountain bike',
    travelModeProfile2: 'cycling-mountain',
    travelModeProfile3: null,   // we don't want the third...
    travelModeProfile4: null    // ...or fourth travel mode buttons
}).addTo(map);
```

## Licence
This software is provided under the terms of the [MIT License](https://github.com/traffordDataLab/leaflet.reachability/blob/master/LICENSE).
