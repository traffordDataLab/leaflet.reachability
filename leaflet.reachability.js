/*
    Created:        2018/06/12 by James Austin - Trafford Data Lab
    Purpose:        Uses openrouteservice API to create isolines showing areas within reach of certain travel times based on different modes of travel or distance. See https://wiki.openstreetmap.org/wiki/Isochrone for more information
    Dependencies:   Leaflet.js (external library), openrouteservice.org API (requires a key - free service available via registration), some AJAX function (either custom or simple_ajax_request.js)
    Licence:        https://github.com/traffordDataLab/leaflet.reachability/blob/master/LICENSE
    Notes:          Can be displayed in a collapsed or expanded state. Content for all GUI elements can be html or an icon etc.
                    © Powered by openrouteservice https://openrouteservice.org/
*/
L.Control.Reachability = L.Control.extend({
    options: {
        // Leaflet positioning options
        position: 'topleft',                                                        // Leaflet control pane position
        pane: 'overlayPane',                                                        // Leaflet pane to add the isolines GeoJSON to
        zIndexMouseMarker: 9000,                                                    // Needs to be greater than any other layer in the map - this is an invisible marker tied to the mouse pointer when the control is activated to prevent clicks interacting with other map objects

        // Main control settings and styling
        collapsed: true,                                                            // Operates in a similar way to the Leaflet layer control - can be collapsed into a standard single control which expands on-click (true) or is displayed fully expanded (false)
        controlContainerStyleClass: '',                                             // The container for the plugin control will usually be styled with the standard Leaflet control styling, however this option allows for customisation
        drawActiveMouseClass: 'leaflet-crosshair',                                  // CSS class applied to the mouse pointer when the plugin is in draw mode

        // The containing div to hold the actual user interface controls
        settingsContainerStyleClass: 'reachability-control-settings-container',     // The container holding the user interface controls which is displayed if collapsed is false, or when the user expands the control by clicking on the expand button
        settingsButtonStyleClass: 'reachability-control-settings-button',           // Generic class to style the setting buttons uniformly - further customisation per button is available with specific options below
        activeStyleClass: 'reachability-control-active',                            // Indicate to the user which button is active in the settings and the collapsed state of the control if settings are active
        errorStyleClass: 'reachability-control-error',                              // Gives feedback to the user via the buttons in the user interface that something went wrong

        // If collapsed == true a button is displayed to expand the control onclick/touch
        expandButtonContent: '&#x2609;',                                            // HTML to display within the control if it is collapsed. If you want an icon from services like Fontawesome pass '' for this value and set the StyleClass option
        expandButtonStyleClass: 'reachability-control-expand-button',               // Allow options for styling - if you want to use an icon from services like fontawesome pass the declarations here, e.g. 'fa fa-home' etc.
        expandButtonTooltip: 'Show reachability options',                           // Tooltip to appear on-hover

        // Collapse button displayed within the settings container if collapsed == true
        collapseButtonContent: '^',
        collapseButtonStyleClass: 'reachability-control-collapse-button',
        collapseButtonTooltip: 'Hide reachability options',

        // Draw isochrones button
        drawButtonContent: 'Drw',
        drawButtonStyleClass: '',
        drawButtonTooltip: 'Draw reachability',

        // Delete button to remove any current isoline groups drawn on the map
        deleteButtonContent: 'Del',
        deleteButtonStyleClass: '',
        deleteButtonTooltip: 'Delete reachability',

        // Isoline calculation mode - either distance or time
        distanceButtonContent: 'Dst',
        distanceButtonStyleClass: '',
        distanceButtonTooltip: 'Reachability based on distance',

        timeButtonContent: 'Tme',
        timeButtonStyleClass: '',
        timeButtonTooltip: 'Reachability based on time',

        // Travel modes
        drivingButtonContent: 'Drv',
        drivingButtonStyleClass: '',
        drivingButtonTooltip: 'Travel mode: driving',

        cyclingButtonContent: 'Cyc',
        cyclingButtonStyleClass: '',
        cyclingButtonTooltip: 'Travel mode: cycling',

        walkingButtonContent: 'Wlk',
        walkingButtonStyleClass: '',
        walkingButtonTooltip: 'Travel mode: walking',

        accessibilityButtonContent: 'Acc',
        accessibilityButtonStyleClass: '',
        accessibilityButtonTooltip: 'Travel mode: wheelchair',

        // Control for the range parameter
        rangeControlDistanceTitle: 'Dist.',
        rangeControlDistanceMin: 0.5,
        rangeControlDistanceMax: 3,
        rangeControlDistanceInterval: 0.5,
        rangeControlDistanceUnits: 'km',                // Can be either 'm', 'km' or 'mi'

        rangeControlTimeTitle: 'Time',
        rangeControlTimeMin: 5,                         // \
        rangeControlTimeMax: 30,                        //  > All these values will be multiplied by 60 to convert to seconds - no other unit of time is allowed
        rangeControlTimeInterval: 5,                    // /

        rangeTypeDefault: 'time',                       // Range can be either distance or time - any value other than 'distance' passed to the API is assumed to be 'time'
        rangeIntervalsLabel: 'intervals',               // The 'show intervals?' checkbox label

        // API settings
        apiKey: '',                                     // openrouteservice API key - the service which returns the isoline polygons based on the various options/parameters
        ajaxRequestFn: null,                            // External function to make the actual call to the API via AJAX - default is to use the simple function simple_ajax_request.js bundled with the plugin
        travelModeDrivingProfile: 'driving-car',        // API choices are 'driving-car' and 'driving-hgv'
        travelModeCyclingProfile: 'cycling-regular',    // API choices are 'cycling-regular', 'cycling-road', 'cycling-safe', 'cycling-mountain' and 'cycling-tour'
        travelModeWalkingProfile: 'foot-walking',       // API choices are 'foot-walking' and 'foot-hiking'
        travelModeAccessibilityProfile: 'wheelchair',   // API choices are 'wheelchair'
        travelModeDefault: null,                        // Set travel mode default - if this is not equal to one of the 4 profiles above it is set to the value of travelModeDrivingProfile in the onAdd function

        // Isoline styling and interaction
        styleFn: null,                                  // External function to call which styles the isolines returned from API call
        mouseOverFn: null,                              // External function to call when a mouseover event occurs on an isoline
        mouseOutFn: null,                               // External function to call when a mouseout event occurs on an isoline
        clickFn: null,                                  // External function to call when a click event occurs on an isoline

        // Isoline origin marker styling and interaction
        showOriginMarker: true,                         // If we want a marker to indicate the origin of the isoline
        markerFn: null,                                 // External function to call to create a custom marker at the origin of the isoline if showOriginMarker is true - null creates a default circleMarker
        markerOverFn: null,                             // External function to call when a mouseover event occurs on an origin marker
        markerOutFn: null,                              // External function to call when a mouseout event occurs on an origin marker
        markerClickFn: null                             // External function to call when a click event occurs on an origin marker
    },

    onAdd: function (map) {
        // Initial settings
        this._map = map;
        this._collapsed = this.options.collapsed;
        this._drawMode = false;
        this._deleteMode = false;
        this._rangeIsDistance = (this.options.rangeTypeDefault == 'distance') ? true : false;

        this._travelMode = this.options.travelModeDefault;
        if (this._travelMode != this.options.travelModeDrivingProfile && this._travelMode != this.options.travelModeCyclingProfile && this._travelMode != this.options.travelModeWalkingProfile && this._travelMode != this.options.travelModeAccessibilityProfile) this._travelMode = this.options.travelModeDrivingProfile;

        // invisible Leaflet marker to follow the mouse pointer when control is activated, preventing interactions with map elements which we don't want whilst in draw or delete mode
        this._mouseMarker = null;

        // Holds the latest GeoJSON data returned from the API
        this.latestIsolines = null;

        // Group object to hold each GeoJSON 'set' of isolines return from the API via this.latestIsolines
        this.isolinesGroup = L.geoJSON(null, { style: this.options.styleFn, pane: this.options.pane, attribution: '&copy; Powered by <a href="https://openrouteservice.org/" target="_blank">openrouteservice</a>' })

        // Main container for the control - this is added to the map in the Leaflet control pane
        this._container = L.DomUtil.create('div', 'leaflet-bar ' + this.options.controlContainerStyleClass);
        L.DomEvent.disableClickPropagation(this._container);

        // Create the components for the user interface
        this._createUI();

        // Fire event to inform that the control has been added to the map
        this._map.fire('reachability:control_added');

        // Leaflet draws the control on the map
        return this._container;
    },

    onRemove: function (map) {
        // clean up - remove any styles, event listeners, layers etc.
        this._deactivateDraw();
        this.isolinesGroup.removeFrom(this._map);
        this.isolinesGroup.clearLayers();

        // Fire event to inform that the control has been removed from the map
        this._map.fire('reachability:control_removed');
    },

    _createUI: function () {
        // Container for the user interface controls - these will be displayed permanently if the collapsed option is false, otherwise when the user clicks on the collapsed control toggle button
        this._uiContainer = L.DomUtil.create('div', this.options.settingsContainerStyleClass);
        this._container.appendChild(this._uiContainer);

        // Container for the action and mode buttons
        this._actionsAndModesContainer = L.DomUtil.create('div', 'reachability-control-settings-block-container', this._uiContainer);

        // Draw button - to create isolines
        this._drawControl = this._createButton('span', this.options.drawButtonContent, this.options.drawButtonTooltip, this.options.settingsButtonStyleClass + ' ' + this.options.drawButtonStyleClass, this._actionsAndModesContainer, this._toggleDraw);

        // Delete button - to remove isolines
        this._deleteControl = this._createButton('span', this.options.deleteButtonContent, this.options.deleteButtonTooltip, this.options.settingsButtonStyleClass + ' ' + this.options.deleteButtonStyleClass, this._actionsAndModesContainer, this._toggleDelete);

        // Distance setting button - to calculate isolines based on distance (isodistance)
        this._distanceControl = this._createButton('span', this.options.distanceButtonContent, this.options.distanceButtonTooltip, this.options.settingsButtonStyleClass + ' ' + this.options.distanceButtonStyleClass, this._actionsAndModesContainer, this._setRangeByDistance);

        // Time setting button - to calculate isolines based on time (isochrones)
        this._timeControl = this._createButton('span', this.options.timeButtonContent, this.options.timeButtonTooltip, this.options.settingsButtonStyleClass + ' ' + this.options.timeButtonStyleClass, this._actionsAndModesContainer, this._setRangeByTime);


        // Container for the travel mode buttons
        this._modesContainer = L.DomUtil.create('div', 'reachability-control-settings-block-container', this._uiContainer);

        // Driving profile button
        this._drivingControl = this._createButton('span', this.options.drivingButtonContent, this.options.drivingButtonTooltip, this.options.settingsButtonStyleClass + ' ' + this.options.drivingButtonStyleClass, this._modesContainer, this._setTravelDriving);

        // Cycling profile button
        this._cyclingControl = this._createButton('span', this.options.cyclingButtonContent, this.options.cyclingButtonTooltip, this.options.settingsButtonStyleClass + ' ' + this.options.cyclingButtonStyleClass, this._modesContainer, this._setTravelCycling);

        // Walking profile button
        this._walkingControl = this._createButton('span', this.options.walkingButtonContent, this.options.walkingButtonTooltip, this.options.settingsButtonStyleClass + ' ' + this.options.walkingButtonStyleClass, this._modesContainer, this._setTravelWalking);

        // Accessible profile button
        this._accessibilityControl = this._createButton('span', this.options.accessibilityButtonContent, this.options.accessibilityButtonTooltip, this.options.settingsButtonStyleClass + ' ' + this.options.accessibilityButtonStyleClass, this._modesContainer, this._setTravelAccessibility);
        // *** NOTE: TEMPORARY LINE BELOW WHILST ACCESSIBILITY ROUTING IS UNAVAILABLE FROM THE API
        L.DomUtil.addClass(this._accessibilityControl, 'reachability-control-hide-content');
        // ***************************************************************************************


        // Distance range title
        this._rangeDistanceTitle = L.DomUtil.create('span', 'reachability-control-range-title reachability-control-hide-content', this._uiContainer);
        this._rangeDistanceTitle.innerHTML = this.options.rangeControlDistanceTitle;

        // Distance range control
        this._rangeDistanceList = L.DomUtil.create('select', 'reachability-control-range-list reachability-control-hide-content', this._uiContainer);
        for (var i = this.options.rangeControlDistanceMin; i <= this.options.rangeControlDistanceMax; i += this.options.rangeControlDistanceInterval) {
            var opt = L.DomUtil.create('option', '', this._rangeDistanceList);
            opt.setAttribute('value', i);
            opt.innerHTML = i + ' ' + this.options.rangeControlDistanceUnits;
        }


        // Time range title
        this._rangeTimeTitle = L.DomUtil.create('span', 'reachability-control-range-title reachability-control-hide-content', this._uiContainer);
        this._rangeTimeTitle.innerHTML = this.options.rangeControlTimeTitle;

        // Time range control
        this._rangeTimeList = L.DomUtil.create('select', 'reachability-control-range-list reachability-control-hide-content', this._uiContainer);
        for (var i = this.options.rangeControlTimeMin; i <= this.options.rangeControlTimeMax; i += this.options.rangeControlTimeInterval) {
            var opt = L.DomUtil.create('option', '', this._rangeTimeList);
            opt.setAttribute('value', i);
            opt.innerHTML = i + ' min';
        }


        /*
            Show intervals checkbox
                - selected means that we want to show a range of isolines, from the minimum value up to the chosen values
                - not selected means that we want to only show one isoline for the selected value
        */
        this._showIntervalContainer = L.DomUtil.create('span', 'reachability-control-show-range-interval', this._uiContainer);
        this._showInterval = L.DomUtil.create('input', '', this._showIntervalContainer);
        this._showInterval.setAttribute('id', 'rangeInterval');
        this._showInterval.setAttribute('type', 'checkbox');
        this._showIntervalLabel = L.DomUtil.create('label', '', this._showIntervalContainer);
        this._showIntervalLabel.setAttribute('for', 'rangeInterval');
        this._showIntervalLabel.innerHTML = this.options.rangeIntervalsLabel;


        // Select the correct range type button and show the correct range list
        if (this._rangeIsDistance) {
            L.DomUtil.addClass(this._distanceControl, this.options.activeStyleClass);
            L.DomUtil.removeClass(this._rangeDistanceTitle, 'reachability-control-hide-content');
            L.DomUtil.removeClass(this._rangeDistanceList, 'reachability-control-hide-content');
        }
        else {
            L.DomUtil.addClass(this._timeControl, this.options.activeStyleClass);
            L.DomUtil.removeClass(this._rangeTimeTitle, 'reachability-control-hide-content');
            L.DomUtil.removeClass(this._rangeTimeList, 'reachability-control-hide-content');
        }

        // Select the correct travel mode button
        this._toggleTravelMode(null);   // Null causes the function to operate in a different way, setting up the initial state


        // If the control is in its collapsed state we need to create buttons to toggle between collapsed and expanded states and initially hide the main UI
        if (this._collapsed) {
            // Hide the UI initially as the control is in the collapsed state
            L.DomUtil.addClass(this._uiContainer, 'reachability-control-hide-content');

            // Create a container for the expand button - because we cannot easily hide a link tag created via the _createButton function adding the .reachability-control-hide-content CSS class
            this._expandButtonContainer = L.DomUtil.create('span', '');
            this._container.appendChild(this._expandButtonContainer);

            // Create a button to expand the control to reveal the full user interface
            this._createButton('a', this.options.expandButtonContent, this.options.expandButtonTooltip, this.options.expandButtonStyleClass, this._expandButtonContainer, this._expand);

            // Create a button to collapse the user interface - this is displayed underneath the user interface
            this._createButton('span', this.options.collapseButtonContent, this.options.collapseButtonTooltip, this.options.collapseButtonStyleClass, this._uiContainer, this._collapse);
        }
    },

    // An amended version of the Leaflet.js function of the same name, (c) 2010-2018 Vladimir Agafonkin, (c) 2010-2011 CloudMade
    // Allows interface elements to be created using different tags, not just anchors
    _createButton: function (tag, html, title, className, container, fn) {
        // Create a control button
        var button = L.DomUtil.create(tag, className, container);
        button.innerHTML = html;
        button.title = title;
        if (tag === 'a') button.href = '#';

        // For assistive technologies e.g. screen readers
        button.setAttribute('role', 'button');
		button.setAttribute('aria-label', title);

        // Set events
        L.DomEvent
            .on(button, 'mousedown touchstart dblclick', L.DomEvent.stopPropagation)
            .on(button, 'click', L.DomEvent.stop)
            .on(button, 'click', fn, this);

		return button;
	},

    _expand: function () {
        // Show the user interface container
        L.DomUtil.removeClass(this._uiContainer, 'reachability-control-hide-content');

        // Hide the toggle container
        L.DomUtil.addClass(this._expandButtonContainer, 'reachability-control-hide-content');

        // Remove the active class from the control container if either the draw or delete modes are active
        if (L.DomUtil.hasClass(this._container, this.options.activeStyleClass)) L.DomUtil.removeClass(this._container, this.options.activeStyleClass);

        // Fire event to inform that the control has been expanded
        this._map.fire('reachability:control_expanded');
    },

    _collapse: function () {
        // Hide the user interface container
        L.DomUtil.addClass(this._uiContainer, 'reachability-control-hide-content');

        // Show the toggle container
        L.DomUtil.removeClass(this._expandButtonContainer, 'reachability-control-hide-content');

        // Add the active class to the control container if either the draw or delete modes are active
        if ((this._drawMode || this._deleteMode) && !L.DomUtil.hasClass(this._container, this.options.activeStyleClass)) L.DomUtil.addClass(this._container, this.options.activeStyleClass);

        // Fire event to inform that the control has been collapsed
        this._map.fire('reachability:control_collapsed');
    },

    // Toggle the draw control between active and inactive states
    _toggleDraw: function () {
        if (this._deleteMode) this._deactivateDelete();    // deactivate the delete control

        (this._drawMode) ? this._deactivateDraw() : this._activateDraw();
    },

    // Toggle the delete control between active and inactive states
    _toggleDelete: function () {
        if (this._drawMode) this._deactivateDraw();    // deactivate the draw control

        (this._deleteMode) ? this._deactivateDelete() : this._activateDelete();
    },

    _activateDraw: function () {
        // Set the flag to true and add active class to the draw button to show it's currently selected
        this._drawMode = true;
        L.DomUtil.addClass(this._drawControl, this.options.activeStyleClass);

        // Deactivate delete mode if currently active
        if (this._deleteMode) this._deactivateDelete();

        this._drawRequestRegistered = false;     // flag to indicate if a 'click-like' event has been registered

        /*
            Using a technique deployed in Jacob Toye's Leaflet.Draw plugin:
            We create an invisible mouse marker to capture the click event to give us a lat/lng to calculate the isolines.
            This allows us to style the mouse pointer easily and also not interact with other map elements whilst in draw mode.
        */
        if (!this._mouseMarker) {
            this._mouseMarker = L.marker(this._map.getCenter(), {
                icon: L.divIcon({
                    className: this.options.drawActiveMouseClass,
                    iconAnchor: [400, 400],
                    iconSize: [800, 800]
                }),
                opacity: 0,
                zIndexOffset: this.options.zIndexMouseMarker
            });
        }

        // Add events to the marker and then add the marker to the map
        this._mouseMarker
            .on('mousemove', this._updatePointerMarkerPosition, this)
            .on('click', this._registerDrawRequest, this)
            .addTo(this._map);

        /*
            Add a duplicate events to the map for mousemove and click in case the mouse pointer goes outside of the mouseMarker.
            The mousedown is for touch interactions to update the marker position so that the click event is registered in the correct place (Safari and Firefox seem to be the ones with issues here).
            NOTE: not using touchdown as it isn't always supported.
        */
        this._map
            .on('mousemove', this._updatePointerMarkerPosition, this)
            .on('mousedown', this._updatePointerMarkerPosition, this)
            .on('click', this._registerDrawRequest, this);

        // Fire an event to indicate that the control draw mode has been activated
        this._map.fire('reachability:draw_activated');
    },

    _deactivateDraw: function () {
        this._drawMode = false;     // ensure we explicitly set the mode - we may not have come here from a click on the main control
        L.DomUtil.removeClass(this._drawControl, this.options.activeStyleClass);    // remove the selected style

        // Remove the mouse marker and its events from the map and destroy the marker
        if (this._mouseMarker !== null) {
            this._mouseMarker
                .off('mousemove', this._updatePointerMarkerPosition, this)
                .off('click', this._registerDrawRequest, this)
                .removeFrom(this._map);
            this._mouseMarker = null;
        }

        // Remove map events
        this._map
            .off('mousemove', this._updatePointerMarkerPosition, this)
            .off('mousedown', this._updatePointerMarkerPosition, this)
            .off('click', this._registerDrawRequest, this);

        // Fire an event to indicate that the control draw mode has been deactivated
        this._map.fire('reachability:draw_deactivated');
    },

    _activateDelete: function () {
        // We want to delete some isoline groups
        var isolinesGroupNum = this.isolinesGroup.getLayers().length;

        if (isolinesGroupNum > 0) {
            // We have some isoline groups to delete - how many?
            if (isolinesGroupNum == 1) {
                // Only one, so delete it automatically - no need to change the state of this._deleteMode
                this.isolinesGroup.clearLayers();
                this.isolinesGroup.removeFrom(this._map);

                // Inform that an isoline FeatureGroup has been deleted
                this._map.fire('reachability:delete');
            }
            else {
                // We have more than one so the user will need to choose which to delete. Therefore set the control in delete mode and wait for the user event
                this._deleteMode = true;
                L.DomUtil.addClass(this._deleteControl, this.options.activeStyleClass);   // add the selected class to the delete button

                // Fire event to inform that the control delete mode has been activated
                this._map.fire('reachability:delete_activated');
            }
        }
        else {
            // There are no isoline groups to delete so warn the user by flashing the button
            this._showError(this._deleteControl);
        }
    },

    _deactivateDelete: function () {
        this._deleteMode = false;
        L.DomUtil.removeClass(this._deleteControl, this.options.activeStyleClass); // remove the selected class from the delete button

        // If collapsed == true, remove the active class from the collapsed control
        if (L.DomUtil.hasClass(this._container, this.options.activeStyleClass)) L.DomUtil.removeClass(this._container, this.options.activeStyleClass);

        // Fire event to inform that the control delete mode has been deactivated
        this._map.fire('reachability:delete_deactivated');
    },

    // Removes a particular 'set' or group of isolines (i.e. either a single isoline or an interval group of isolines) from the isolinesGroup object.
    // Called when an isoline group is clicked on whilst the plugin is in delete mode.
    _delete: function (e) {
        var parent = e.sourceTarget._eventParents;

        for (var key in parent) {
            if (parent.hasOwnProperty(key) && key != '<prototype>') parent[key].removeFrom(this.isolinesGroup);
        }

        // Deactivate the delete control and remove the isolines group from the map if there are no more isoline groups left
        if (this.isolinesGroup.getLayers().length == 0) {
            this._deactivateDelete();
            this.isolinesGroup.removeFrom(this._map);
        }

        // Inform that an isoline FeatureGroup has been deleted
        this._map.fire('reachability:delete');
    },

    // Show a visible error to the user if something has gone wrong
    _showError: function (control) {
        var css = this.options.errorStyleClass;

        // Add the error class to the control
        L.DomUtil.addClass(control, css);

        // Remove the error class from the control after 0.5 seconds
        setTimeout(function () {
            L.DomUtil.removeClass(control, css);
        }, 500);
    },

    // Toggle the UI buttons for distance and time like radio buttons
    _setRangeByDistance: function () {
        if (this._rangeIsDistance == false) {
            // The mode buttons
            L.DomUtil.addClass(this._distanceControl, this.options.activeStyleClass);
            L.DomUtil.removeClass(this._timeControl, this.options.activeStyleClass);

            // The range titles
            L.DomUtil.removeClass(this._rangeDistanceTitle, 'reachability-control-hide-content');
            L.DomUtil.addClass(this._rangeTimeTitle, 'reachability-control-hide-content');

            // The range lists
            L.DomUtil.removeClass(this._rangeDistanceList, 'reachability-control-hide-content');
            L.DomUtil.addClass(this._rangeTimeList, 'reachability-control-hide-content');

            this._rangeIsDistance = true;
        }
    },

    _setRangeByTime: function () {
        if (this._rangeIsDistance) {
            // The mode buttons
            L.DomUtil.addClass(this._timeControl, this.options.activeStyleClass);
            L.DomUtil.removeClass(this._distanceControl, this.options.activeStyleClass);

            // The range titles
            L.DomUtil.removeClass(this._rangeTimeTitle, 'reachability-control-hide-content');
            L.DomUtil.addClass(this._rangeDistanceTitle, 'reachability-control-hide-content');

            // The range lists
            L.DomUtil.removeClass(this._rangeTimeList, 'reachability-control-hide-content');
            L.DomUtil.addClass(this._rangeDistanceList, 'reachability-control-hide-content');

            this._rangeIsDistance = false;
        }
    },

    // Toggle the UI buttons for the modes of travel
    _setTravelDriving: function () {
        this._toggleTravelMode(this.options.travelModeDrivingProfile);
    },

    _setTravelCycling: function () {
        this._toggleTravelMode(this.options.travelModeCyclingProfile);
    },

    _setTravelWalking: function () {
        this._toggleTravelMode(this.options.travelModeWalkingProfile);
    },

    _setTravelAccessibility: function () {
        this._toggleTravelMode(this.options.travelModeAccessibilityProfile);
    },

    _toggleTravelMode: function (mode) {
        // This function is called first to set the default active travel mode and then from then on when the user selects the different modes
        var def_mode = (mode == null) ? this._travelMode : mode;

        if (this._travelMode != mode) {
            switch (def_mode) {
                case this.options.travelModeCyclingProfile:
                    L.DomUtil.removeClass(this._drivingControl, this.options.activeStyleClass);
                    L.DomUtil.addClass(this._cyclingControl, this.options.activeStyleClass);
                    L.DomUtil.removeClass(this._walkingControl, this.options.activeStyleClass);
                    L.DomUtil.removeClass(this._accessibilityControl, this.options.activeStyleClass);
                    break;
                case this.options.travelModeWalkingProfile:
                    L.DomUtil.removeClass(this._drivingControl, this.options.activeStyleClass);
                    L.DomUtil.removeClass(this._cyclingControl, this.options.activeStyleClass);
                    L.DomUtil.addClass(this._walkingControl, this.options.activeStyleClass);
                    L.DomUtil.removeClass(this._accessibilityControl, this.options.activeStyleClass);
                    break;
                case this.options.travelModeAccessibilityProfile:
                    L.DomUtil.removeClass(this._drivingControl, this.options.activeStyleClass);
                    L.DomUtil.removeClass(this._cyclingControl, this.options.activeStyleClass);
                    L.DomUtil.removeClass(this._walkingControl, this.options.activeStyleClass);
                    L.DomUtil.addClass(this._accessibilityControl, this.options.activeStyleClass);
                    break;
                default:
                    L.DomUtil.addClass(this._drivingControl, this.options.activeStyleClass);
                    L.DomUtil.removeClass(this._cyclingControl, this.options.activeStyleClass);
                    L.DomUtil.removeClass(this._walkingControl, this.options.activeStyleClass);
                    L.DomUtil.removeClass(this._accessibilityControl, this.options.activeStyleClass);
            }

            this._travelMode = def_mode;
        }
    },

    // Deals with updating the position of the invisible Leaflet marker that chases the mouse pointer or is set to the location of a touch.
    // This is used to determine the coordinates on the map when the user clicks/touches to create an isoline group
    _updatePointerMarkerPosition: function (e) {
		var newPos = this._map.mouseEventToLayerPoint(e.originalEvent);
		var latlng = this._map.layerPointToLatLng(newPos);

        // Update the mouse marker position
		this._mouseMarker.setLatLng(latlng);

        // In case the mousedown event is being listened to on other objects
        L.DomEvent.stop(e.originalEvent);
	},

    // Prevents multiple events, e.g. click on the mouse marker and map all calling the API and creating duplicate isoline groups.
    _registerDrawRequest: function (e) {
        L.DomEvent.stop(e.originalEvent);     // stop any default actions and propagation from the event

        // Only take action if this is the first event to register - the reset is in _callApi
        if (!this._drawRequestRegistered) {
            this._drawRequestRegistered = true;

            this._callApi(e.latlng);
        }
    },

    // Main function to make the actual call to the API and display the resultant isoline group on the map
    _callApi: function (latLng) {
        // Create the URL to pass to the API
        var apiUrl = 'https://api.openrouteservice.org/isochrones?api_key=' + this.options.apiKey;

        apiUrl += '&locations=' + latLng.lng + '%2C' + latLng.lat;

        if (this._rangeIsDistance) {
            apiUrl += '&range_type=distance&units=' + this.options.rangeControlDistanceUnits + '&range=' + this._rangeDistanceList.value;
            if (this._showInterval.checked) apiUrl += '&interval=' + this.options.rangeControlDistanceInterval;
        }
        else {
            apiUrl += '&range_type=time&range=' + this._rangeTimeList.value * 60;
            if (this._showInterval.checked) apiUrl += '&interval=' + this.options.rangeControlTimeInterval * 60;
        }

        apiUrl += '&profile=' + this._travelMode + '&location_type=start&attributes=area|total_pop';

        // Inform that we are calling the API - could be useful for starting a spinner etc. to indicate to the user that something is happening if there is a delay
        this._map.fire('reachability:api_call_start');

        // Store the context for use within the API callback below
        var context = this;

        // Call the API
        try {
            var ajaxFn = (this.options.ajaxRequestFn == null) ? simpleAjaxRequest : this.options.ajaxRequestFn; // This is the external function to use which makes the actual AJAX request to the API

            ajaxFn(apiUrl, function (data) {
                if (data == null) {
                    // Fire event to inform that no data was returned
                    context._map.fire('reachability:no_data');

                    // Log more specific details in the javascript console
                    if (window.console && window.console.log) window.console.log('Leaflet.reachability.js error calling API, no data returned. Likely cause is API unavailable or bad parameters.');

                    // Inform the user that something went wrong and deactivate the draw control
                    context._showError(context._drawControl);
                    context._deactivateDraw();
                }
                else {
                    /*
                        NOTE: The GeoJSON features returned from the API are in the order smallest to largest in terms of the area of the polygons.
                        This causes us a problem as when they are displayed on the map, the largest polygon covers all the others, preventing us interacting with the other polygons.
                        The solution is to reverse the order of the features, however this is not as simple as sorting due to how Leaflet deals with layers.
                        Each layer is given an id. When you add layers to layergroup objects, it doesn't matter the order you add them, what matters is the id sequence.
                        Therefore we need to generate new a new id for each layer, with the larger polygon layers given lower ids than the smaller.
                    */

                    // Create a Leaflet GeoJSON FeatureGroup object from the GeoJSON returned from the API - This is intended to be accessible externally if required
                    context.latestIsolines = L.geoJSON(data, { style: context.options.styleFn, pane: context.options.pane });

                    // Load the layers from the GeoJSON object into an array so that we can sort them in decending id order if there are more than 1
                    var arrLayers = context.latestIsolines.getLayers();

                    if (arrLayers.length > 0) {
                        // Now remove all the layers from the GeoJSON object - we will be adding them back once we've reorded them
                        context.latestIsolines.clearLayers();

                        // Sort the array in decending order of the internal Leaflet id
                        arrLayers.sort(function (a, b) { return b['_leaflet_id'] - a['_leaflet_id'] });

                        for (var i = 0; i < arrLayers.length; i++) {
                            // Wipe the internal Leaflet layer id and...
                            arrLayers[i]['_leaflet_id'] = null;

                            // ...force Leaflet to assign a new one
                            L.Util.stamp(arrLayers[i]);

                            // Add events to the layer - do here whilst we're looping through the array rather than after using the Leaflet eachLayer() method
                            arrLayers[i].on({
                                mouseover: (function (e) { if (context.options.mouseOverFn != null) context.options.mouseOverFn(e) }),
                                mouseout: (function (e) { if (context.options.mouseOutFn != null) context.options.mouseOutFn(e) }),
                                click: (function(e) {
                                    if (context._deleteMode) {
                                        // If we're in delete mode, call the delete function
                                        L.DomEvent.stopPropagation(e);
                                        context._delete(e);
                                    }
                                    else {
                                        // Otherwise, if there is a user-defined click function, call that instead
                                        if (context.options.clickFn != null) context.options.clickFn(e);
                                    }
                                })
                            });

                            /*
                                Reformat the data in the properties object to be more readable and informative

                                Returned values from API:
                                    value:  either metres or seconds depending on distance or time. Ignores the input in km or mi!
                                    total_pop:  integer value of people living in the area as given by Global Human Settlement (GHS) framework
                            */
                            var props = arrLayers[i].feature.properties;    // get the current properties for the layer
                            var range,
                                rangeType,
                                rangeUnits,
                                area,
                                rangeControlDistanceUnits = context.options.rangeControlDistanceUnits;

                            /*
                                Assume for now that the range type is distance to calculate everything with the correct units.
                                If the range type is actually time we'll overwrite the range values later.
                                This method reduces the number of if conditions.
                            */
                            if (rangeControlDistanceUnits == 'mi') {
                                rangeControlDistanceUnits = 'miles';
                                range = L.Util.formatNum(props.value/1609.34, 2);           // convert metres to miles for the range
                                area = L.Util.formatNum(props.total_area_km/2.58998811, 2); // convert area to square miles;
                            }
                            else if (context.options.rangeControlDistanceUnits == 'm') {
                                range = L.Util.formatNum(props.value, 2);                   // no conversion necessary for the range
                                area = L.Util.formatNum(props.total_area_km*1000000, 2);    // convert area to square metres
                            }
                            else {
                                range = L.Util.formatNum(props.value/1000, 2);              // convert metres to kilometres for the range
                                area = L.Util.formatNum(props.total_area_km, 2);            // no conversion necessary for the area
                            }

                            // Now perform the check on the range type to set the remaining values
                            if (context._rangeIsDistance) {
                                rangeType = 'distance';
                                rangeUnits = rangeControlDistanceUnits;
                            }
                            else {
                                rangeType = 'time';
                                rangeUnits = 'min';
                                range = L.Util.formatNum(props.value/60, 2);
                            }

                            var newProps = {
                                'Travel mode': context._travelMode,
                                'Measure': rangeType,
                                'Range units': rangeUnits,
                                'Range': range,
                                'Area': area,
                                'Area units': rangeControlDistanceUnits + '^2',
                                'Latitude': props.center[1],
                                'Longitude': props.center[0],
                                'Population': props.total_pop
                            }

                            // Replace the old properties object with the new one
                            arrLayers[i].feature.properties = newProps;

                            // Now add the layer with its new id to the Leaflet GeoJSON object
                            context.latestIsolines.addLayer(arrLayers[i]);
                        }

                        // Create a marker at the latlng if desired. Can be used to indicate the mode of travel etc.
                        if (context.options.showOriginMarker) {
                            var originMarker;

                            if (context.options.markerFn != null) {
                                // Expecting a custom Leaflet marker to be returned for the origin of the isolines group.
                                // Passing the relevant factors to the function so that styling can be based on mode of travel, distance or time etc.
                                originMarker = context.options.markerFn(latLng, context._travelMode, rangeType);
                            }
                            else {
                                // Create a default marker for the origin of the isolines group
                                originMarker = L.circleMarker(latLng, { radius: 3, weight: 0, fillColor: '#0073d4', fillOpacity: 1 });
                            }

                            // Attach events if required
                            originMarker.on({
                                mouseover: (function (e) { if (context.options.markerOverFn != null) context.options.markerOverFn(e) }),
                                mouseout: (function (e) { if (context.options.markerOutFn != null) context.options.markerOutFn(e) }),
                                click: (function(e) {
                                    if (context._deleteMode) {
                                        // If we're in delete mode, call the delete function
                                        L.DomEvent.stopPropagation(e);
                                        context._delete(e);
                                    }
                                    else {
                                        // Otherwise, if there is a user-defined click function, call that instead
                                        if (context.options.markerClickFn != null) context.options.markerClickFn(e);
                                    }
                                })
                            });

                            // Add the marker to the isolines GeoJSON
                            originMarker.addTo(context.latestIsolines);
                        }

                        // Add the newly created isolines GeoJSON to the overall GeoJSON FeatureGroup
                        context.latestIsolines.addTo(context.isolinesGroup);

                        // Add the isolines GeoJSON FeatureGroup to the map if it isn't already
                        if (!context._map.hasLayer(context.isolinesGroup)) context.isolinesGroup.addTo(context._map);

                        // Fire event to inform that isolines have been drawn successfully
                        context._map.fire('reachability:displayed');
                    }
                    else {
                        // Fire event to inform that no data was returned
                        context._map.fire('reachability:no_data');

                        // Log more specific details in the javascript console
                        if (window.console && window.console.log) window.console.log('Leaflet.reachability.js: API returned data but no GeoJSON layers.');

                        // Inform the user that something went wrong and deactivate the draw control
                        context._showError(context._drawControl);
                        context._deactivateDraw();
                    }
                }

                // Inform that we have completed calling the API - could be useful for stopping a spinner etc. to indicate to the user that something was happening. Doesn't indicate success
                context._map.fire('reachability:api_call_end');

                // Get ready to register another draw request
                context._drawRequestRegistered = false;
            });
        }
        catch (e) {
            // Fire event to inform that an error occurred calling the API
            context._map.fire('reachability:error');

            // Fire event to inform that no data was returned
            context._map.fire('reachability:no_data');

            // Inform that we have completed calling the API - could be useful for stopping a spinner etc. to indicate to the user that something was happening.
            context._map.fire('reachability:api_call_end');

            // Log the error in the console
            if (window.console && window.console.log) window.console.log('Leaflet.reachability.js error attempting to call API.\nLikely cause is function simpleAjaxRequest has not been included and no alternative has been specified.\nSee docs for more details, actual error below.\n' + e);

            // Inform the user that something went wrong and deactivate the draw control
            context._showError(context._drawControl);
            context._deactivateDraw();
        }
    }
});

L.control.reachability = function (options) {
    return new L.Control.Reachability(options);
};
