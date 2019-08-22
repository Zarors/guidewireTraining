package gw.plugin.geocode.impl

uses entity.Address
uses gw.api.contact.DrivingDirections
uses gw.api.contact.MapImageUrl
uses gw.api.database.spatial.SpatialPoint
uses gw.api.geocode.AbstractGeocodePlugin
uses gw.api.system.PLLoggerCategory
uses gw.plugin.InitializablePlugin
uses gw.plugin.PluginParameter
uses org.apache.commons.lang.StringUtils

uses java.util.regex.Pattern

@Export
@PluginParameter(:name="applicationKey", :type=String, :required=true)
@PluginParameter(:name="geocodeDirectionsCulture", :type=String)
@PluginParameter(:name="imageryCulture", :type=String)
@PluginParameter(:name="mapUrlWidth", :type=Integer)
@PluginParameter(:name="mapUrlHeight", :type=Integer)
@PluginParameter(:name="hostName", :type=String, :required=true)
@PluginParameter(:name="version", :type=String)
class BingMapsPluginRest extends AbstractGeocodePlugin implements InitializablePlugin {
  
  // application key
  private static final var APPLICATION_KEY = "applicationKey"
  private static var _applicationKey : String

  // hostname and version
  private static final var HOST_NAME = "hostName"
  private static var _hostName : String
  private static final var VERSION = "version"
  private static var _version : String

  // culture
  private static final var GEOCODE_DIRECTIONS_CULTURE = "geocodeDirectionsCulture"
  private static var _mapping = new CultureCodes()
  private static var javaLocale = Locale.getDefault()
  private static final var IMAGERY_CULTURE = "imageryCulture"
  private static var _geocodeDirectionsCulture : String = _mapping.LocCodes.get(javaLocale)
  private static var _imageryCulture : String = _mapping.ImageCodes.get(javaLocale)
  
  // map url
  private static final var MAP_URL_WIDTH = "mapUrlWidth"
  private static var _mapUrlWidth : String = "500"
  private static final var MAP_URL_HEIGHT = "mapUrlHeight"
  private static var _mapUrlHeight : String = "500"
  
  // regex for markup tags
  private static final var REGEX_MARKUP_TAG = Pattern.compile( "<[^>]*>" )

  override property set Parameters( parameters : Map<Object,Object> ) {
    _applicationKey = initParameter( parameters, APPLICATION_KEY, _applicationKey, true )
    
    _geocodeDirectionsCulture = initParameter( parameters, GEOCODE_DIRECTIONS_CULTURE, 
      _geocodeDirectionsCulture == null ? "en-US" : _geocodeDirectionsCulture, false )
    _imageryCulture = initParameter( parameters, IMAGERY_CULTURE, 
      _imageryCulture == null ? "en-US" : _imageryCulture, false )
    
    _mapUrlWidth = initParameter( parameters, MAP_URL_WIDTH, _mapUrlWidth, false )
    _mapUrlHeight = initParameter( parameters, MAP_URL_HEIGHT, _mapUrlHeight, false )

    _hostName = initParameter( parameters, HOST_NAME, _hostName, false )
    _version = initParameter( parameters, VERSION, _version, false )
  }

  override protected function _geocodeAddressBestMatch( address : Address ) : Address {
    // create request
    var context = createContextWithUserLocale()
    var geocodeRequest = GeocodingUtil.geocodeAddress(context, address)
    updateRequestConfig(geocodeRequest)

    // make request
    var geocodeResult = geocodeRequest.execute()

    // convert response into address
    var returnAddress = new Address()
    if ( !geocodeResult.successful() || geocodeResult.Result == null || geocodeResult.Result?.Empty) {
      logXmlForDebug("Geocoding Response", "There were no results returned from Bing Maps")
      returnAddress.GeocodeStatus = GeocodeStatus.TC_FAILURE;
    } else {
      returnAddress = extractAddressFromBingMapsGeocodingResult( geocodeResult.Result.get(0) )
    }
    
    return returnAddress
  }

  private function updateRequestConfig(request: PendingResultBase) {
    if (StringUtils.isNotBlank(_hostName)) {
      request.Config.HostName = _hostName
    }

    if (StringUtils.isNotBlank(_version)) {
      request.Config.Version = _version
    }
  }

  override public function geocodeAddressWithCorrections(address : Address, maxResults : int) : List<Address> {
    // create request
    var context = createContextWithUserLocale()
    var geocodeRequest = GeocodingUtil.geocodeAddress(context, address).setMaxResults(maxResults)
    updateRequestConfig(geocodeRequest)

    // make request
    var geocodeResult = geocodeRequest.execute()

    // convert response into address list
    var addressList = new ArrayList<Address>( );

    if ( !geocodeResult.successful() || geocodeResult.Result == null || geocodeResult.Result?.Empty) {
      var returnAddress = new Address()
      logXmlForDebug("Geocoding Response", "There were no results returned from Bing Maps")
      returnAddress.GeocodeStatus = GeocodeStatus.TC_FAILURE;
      addressList.add(returnAddress)
    } else {
      addressList.addAll(geocodeResult.Result.map(\result -> extractAddressFromBingMapsGeocodingResult(result)))
    }
    return addressList
  }
  
  override protected function _getDrivingDirections( startAddress : Address, finishAddress : Address, unit : UnitOfDistance ) : DrivingDirections {
    var startLatLong = getLatLongFromAddress( startAddress )
    var finishLatLong = getLatLongFromAddress( finishAddress )
    
    // create request
    var context = createContextWithUserLocale()
    var routeRequest = RoutingUtil.calculateSimpleDrivingRoute(context, startLatLong, finishLatLong, unit.toString())
    updateRequestConfig(routeRequest)

    // make request
    var routeResult = routeRequest.execute()

    // convert response into driving directions to return
    var drivingDirections = extractDrivingDirectionsFromBingMapsCalculateRouteResponse( routeResult, startAddress, finishAddress, unit )
    
    // set driving directions map overview url
    setMapOverviewUrlForDrivingDirections( drivingDirections, startLatLong, finishLatLong )
    
    return drivingDirections
  }
  
  override public function getMapForAddress( address : Address, unit : UnitOfDistance ) : MapImageUrl {
    address = tryGetValidAddress( address )
    if ( !isValidLatLong( address ) ) {
      return null
    }
    
    var centerPoint = getPoint( getLatLongFromAddress( address ) )
    // zoom level is required: 1 - 22 
    var zoomLevel = "15"
    var mapUrl = getBingMapsImageryRESTUrl( centerPoint + "/" + zoomLevel )
    
    // pushpin
    // syntax: pp=latitude,longitude;iconStyle;label
    var iconStyle = "15"
    mapUrl += "&pp=" + centerPoint + ";" + iconStyle
    
    var mapImageUrl = new MapImageUrl()
    mapImageUrl.MapImageUrl = mapUrl
     
    return mapImageUrl
  }

  private function createContextWithUserLocale() : Context {
    var context = new Context()
    context.BingMapsApiKey = _applicationKey
    var localLocale = User.util.CurrentLanguage.JavaLocale
    var localCulture = _mapping.LocCodes.get(localLocale)
    context.Culture = localCulture ?: _geocodeDirectionsCulture
    return context
  }
  
  private function initParameter( parameters : Map<Object,Object>, parameterKey : String, initialParameterValue : String, requiredParameter : boolean ) : String {
    var parameterValue = parameters.get( parameterKey ) as String

    if ( parameterValue == null || parameterValue.trim().Empty ) {
      if ( requiredParameter ) {
        throw new Exception( "You must supply a value for the \"" + parameterKey + "\" parameter in GeocodePlugin.xml" )
      } else {
        parameterValue = initialParameterValue
      }
    }

    return parameterValue    
  }
  
  private function logXmlForDebug( label : String, xml : String ) {
    PLLoggerCategory.GEODATA.debug( "\n" + label + ":\n" + xml )
  }
  
  private function extractAddressFromBingMapsGeocodingResult( geocodeResult : GeocodingResult) : Address {
    var address = new Address()

    // confidence can be "High", "Medium". or "Low"
    var confidence = geocodeResult.Confidence
    if ( confidence == "High" ) {
      address.GeocodeStatus = GeocodeStatus.TC_EXACT
    } else if ( confidence == "Medium" ) {
      address.GeocodeStatus = GeocodeStatus.TC_POSTALCODE
    } else if (confidence == "Low") {
      address.GeocodeStatus = GeocodeStatus.TC_CITY
    } else {
      // in case there are empty location resources
      address.GeocodeStatus = GeocodeStatus.TC_FAILURE
    }

    var bingMapsAddress = geocodeResult.Address
    address.AddressLine1 = bingMapsAddress.AddressLine
    address.City = bingMapsAddress.Locality
    address.State = getStateByNameOrCode( bingMapsAddress.AdminDistrict )
    address.PostalCode = bingMapsAddress.PostalCode
    address.Country = getCountryTypeCodeByName( bingMapsAddress.CountryRegion )
    
    // get the first location from the list
    var latLong = geocodeResult.Point.Coordinates
    
    address.SpatialPoint = new SpatialPoint(latLong.get(1), latLong.get(0))
    
    return address
  }

  private function extractDrivingDirectionsFromBingMapsCalculateRouteResponse(calculateRouteResponse : RoutingResponse, startAddress : Address, finishAddress : Address, unit : UnitOfDistance ) : DrivingDirections {
    var drivingDirections = DrivingDirections.createPreparedDrivingDirections( startAddress, finishAddress, unit )
    var result = calculateRouteResponse.Result?.first()
    var calcTotalTime : java.math.BigDecimal = 0
    var calcTotalDistance : java.math.BigDecimal = 0
    if (result == null) {
      logXmlForDebug("Routing Response", "There were no routes returned from Bing Maps")
      drivingDirections.TotalDistance = calcTotalDistance
      drivingDirections.TotalTime = calcTotalTime as Integer
      return drivingDirections
    }

    var routeLegs = result.RouteLegs
    for ( var routeLeg in routeLegs ) {
      var itineraryItems = routeLeg.ItineraryItems
      for ( var itineraryItem in itineraryItems ) {
        var itineraryItemInstruction = itineraryItem.Instruction
        calcTotalTime += itineraryItem.TravelDuration
        calcTotalDistance += itineraryItem.TravelDistance
        var instruction = removeVirtualEarthMarkupTags( itineraryItemInstruction.FormattedText ?: itineraryItemInstruction.Text )
        var childItineraryItems = itineraryItem.ChildItineraryItems
        for (var child in childItineraryItems) {
          var childInstruction = removeVirtualEarthMarkupTags( child.Instruction.FormattedText ?: child.Instruction.Text )
          drivingDirections.addNewElement( formatDrivingInstruction( instruction + "\n" + childInstruction), itineraryItem.TravelDistance, itineraryItem.TravelDuration as Integer )
        }
        if (childItineraryItems == null || childItineraryItems.Empty) {
          drivingDirections.addNewElement(formatDrivingInstruction(instruction), itineraryItem.TravelDistance, itineraryItem.TravelDuration as Integer)
        }
      }
    }
    drivingDirections.TotalDistance = calcTotalDistance
    drivingDirections.TotalTime = calcTotalTime as Integer
    return drivingDirections
  }

  private function removeVirtualEarthMarkupTags( itineraryItemText : String ) : String {
    final var matcher = REGEX_MARKUP_TAG.matcher( itineraryItemText )
    return matcher.replaceAll("")
  }

  private function setMapOverviewUrlForDrivingDirections( drivingDirections : DrivingDirections, startLatLong : LatLong, finishLatLong : LatLong ) : void {
    var mapOverviewUrl = getBingMapsImageryRESTUrl( "Routes" )

    // set waypoint params
    mapOverviewUrl += "&wp.0=" + getPoint( startLatLong )
    mapOverviewUrl += "&wp.1=" + getPoint( finishLatLong )

    drivingDirections.setMapOverviewUrl( mapOverviewUrl )
  }

  private function getBingMapsImageryRESTUrl( RESTEntryPoint : String ) : String {
    var bingMapsImageryRESTUrl = "http://dev.virtualearth.net/REST/v1/Imagery/Map/Road/" + RESTEntryPoint

    // set application key
    bingMapsImageryRESTUrl += "?key=" + _applicationKey
    // set culture
    var localLocale = User.util.CurrentLanguage.JavaLocale
    var localCulture = _mapping.ImageCodes.get(localLocale)
    bingMapsImageryRESTUrl += "&c=" + (localCulture == null ? _imageryCulture : localCulture)
    // set map size in pixels
     bingMapsImageryRESTUrl += "&mapSize=" + _mapUrlWidth + "," + _mapUrlHeight

    return bingMapsImageryRESTUrl
  }

  private function getPoint( latLong : LatLong ) : String {
    return latLong._latitude + "," + latLong._longitude
  }
  
  override public function pluginSupportsDrivingDirections() : boolean {
    return true
  }

  override public function pluginReturnsOverviewMapWithDrivingDirections() : boolean {
    return true
  }

}
