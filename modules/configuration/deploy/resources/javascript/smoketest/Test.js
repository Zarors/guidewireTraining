
//-------------------------------------------------------------------------- interface
var Test = {
  getElementCount : TestImpl_getElementCount,
  getNumEntries : TestImpl_getNumEntries,
  fireEvent : TestImpl_fireEvent,
  fireChangeEvent : TestImpl_fireChangeEvent,
  elementIndexInSelect : TestImpl_elementIndexInSelect,
  elementIndexInSelectByLabel : TestImpl_elementIndexInSelectByLabel,
  elementValueInSelectByLabel : TestImpl_elementValueInSelectByLabel,
  getAllMessages : TestImpl_getAllMessages,
  getMessages : TestImpl_getMessages,
  isElementDisplayed : TestImpl_isElementDisplayed,
  isClickable: TestImpl_isClickable,
  isEditable: TestImpl_isEditable,
  getOptionValuesInSelect : TestImpl_getOptionValuesInSelect,
  getOptionLabelsInSelect : TestImpl_getOptionLabelsInSelect,
  hasExceptionOnPage : TestImpl_hasExceptionOnPage,
  getPageName : TestImpl_getPageName,
  getWsName : TestImpl_getWsName,
  getNumChildTreeNodes : TestImpl_getNumChildTreeNodes,
  isTreeFolderOpen : TestImpl_isTreeFolderOpen,
  getValue : function(e) {return DHTML.getValue(e)},
  getText : function(e) {return DHTML.getText(e)}
}

//-------------------------------------------------------------------------- implementation


/**
 * Counts the number of elements of the given name.  Doesn't matter if you specify by label or ID.
 */
function TestImpl_getElementCount(elem) {
  var allElems = document.body.all;
  if (!allElems) {
    allElems = document.getElementsByTagName("*");
  }
  var result = new Array();
  for (var i = 0; i < allElems.length; i++) {
    var element = allElems[i];
    if (TestImpl_elementMatches(element, elem)) {
      result[result.length] = element;
    }
  }
  return result.length;
}

/**
 * Counts # of entries on page for the given iterator
 * @param iteratorId id of the iterator
 */
function TestImpl_getNumEntries(iteratorId) {
  var allElems = document.body.all;
  if (!allElems) {
    allElems = document.getElementsByTagName("*");
  }
  var count = 0;
  for (var i = 0; i < allElems.length; i++) {
    var element = allElems[i];
    var result = element.id.match('^'+iteratorId+':([0-9]+):.+');
    if (result != null ) {
      var num = Number(result[1]) + 1;
      if (num > count) {
        count = num;
      }
    }
  }
  return count;
}

function TestImpl_fireChangeEvent(element) {
  var eventType = (element.tagName=='INPUT' && (element.type=='radio' || element.type=='checkbox')) ? 'click' : 'change';
  try {
    if( document.createEvent ) {
      var evObj = document.createEvent(eventType == 'click' ? 'MouseEvents' : 'HTMLEvents');
      evObj.initEvent(eventType, true, false);
      element.dispatchEvent(evObj);
    } else if( document.createEventObject ) {
      element.fireEvent('on' + eventType); // fire real event as if this is triggered directly by user action
    }
  } catch (e) {
    return 'Failed to change value of element type ' + element.tagName
  }
}

function TestImpl_fireEvent(elt, keycode, event, shift, alt) {
  var target = elt ? elt : document;
  if (document.createEvent) {
    var eventObject;
    if (keycode) {
      eventObject = document.createEvent('KeyEvents');
      eventObject.initKeyEvent(event.substring(2), true, false, null, false, alt, shift, false, keycode, 0);
      target.dispatchEvent(eventObject);
    } else {
      eventObject = document.createEvent(event == 'onclick' ? 'MouseEvents' : 'HTMLEvents');
      eventObject.initEvent(event, true, false);
      eventObject.shiftKey = shift;
      eventObject.altKey = alt;
      target.dispatchEvent(eventObject);
    }
  } else if (document.createEventObject) {
    var eventObject = document.createEventObject();
    if (keycode) {
      eventObject.keyCode = keycode;
    }
    eventObject.shiftKey = shift;
    eventObject.altKey = alt;
    target.fireEvent(event, eventObject);
  }
}

/**
 * Returns the zero-based index of the element of the given value
 * is in the select, or -1 if no such element exists.
 */
function TestImpl_elementIndexInSelect(elem, value) {
  var element = DHTML.getElementById(elem);
  if (element == null) return null;
  var options = TestImpl_getOptionsInSelect(element);
  if (!options) {
    return -1;
  }
  for (var i = 0; i < options.length; i++) {
    if (options[i].value == value) {
      return i;
    }
  }
  return -1;
}

/**
 * Returns the zero-based index of the element of the given label
 * is in the select, or -1 if no such element exists.
 */
function TestImpl_elementIndexInSelectByLabel(elem, label) {
  var element = DHTML.getElementById(elem);
  if (element == null) return null;
  var options = TestImpl_getOptionsInSelect(element);
  if (!options) {
    return -1;
  }
  for (var i = 0; i < options.length; i++) {
    if (DHTML.getOptionLabel(options[i]) == label) {
      return i;
    }
  }
  return -1;
}

function TestImpl_elementValueInSelectByLabel(elem, label) {
  var element = DHTML.getElementById(elem);
  if (element == null) return null;
  var options = TestImpl_getOptionsInSelect(element);
  if (!options) {
    return null;
  }
  for (var i = 0; i < options.length; i++) {
    if (DHTML.getOptionLabel(options[i]) == label) {
      return options[i].value;
    }
  }
  return null;
}

/** Gets all option values in the specified range widget (select, checkbox group or radio group)
 *
 * @param element the range widget
 * @return string[] an array of all option values in the specified select drop-down
 */
function TestImpl_getOptionValuesInSelect(element) {
  var selectOptions = TestImpl_getOptionsInSelect(element);
  var values = [];
  for(var i = 0; i < selectOptions.length; i++) {
    values.push(selectOptions[i].value.replace(/,/g, "\\,"));
  }
  return values.join(",");
}

/** Gets all option labels in the specified range widget (select, checkbox group or radio group)
 *
 * @param element the range widget
 * @return string[] an array of all option labels in the specified select drop-down
 */
function TestImpl_getOptionLabelsInSelect(element) {
  var selectOptions = TestImpl_getOptionsInSelect(element);
  var values = [];
  for(var i = 0; i < selectOptions.length; i++) {
    values.push(DHTML.getOptionLabel(selectOptions[i]).replace(/,/g, "\\,"));
  }
  return values.join(",");
}

function TestImpl_getOptionsInSelect(element) {
  var selectOptions = [];

  if(element.type == "radio" || element.type=='checkbox') {
    var radioButtons = document.getElementsByName(element.name)
    for (var i = 0; i < radioButtons.length; i++) {
      selectOptions.push(radioButtons[i])
    }
  } else if (element.tagName == 'SELECT') {
    for (var i = 0; i < element.options.length; i++) {
      var option = element.options[i];
      selectOptions.push(option);
    }
  }
  return selectOptions;
}

/**
 * Returns an array of messages encoded as a string
 */
//TODO: needs a better encoding
function TestImpl_getAllMessages() {
  var result = [];
  var msgElems = document.getElementsByTagName('div');
  for (var i = 0; i < msgElems.length; i++) {
    var e = msgElems[i];
    if (e.className == 'message') {
      ArrayUtil.appendElement(result, DHTML.getInnerText(msgElems[i]));
    }
  }
  return result.length == 0 ? null : result.join('|');
}

/**
 * Gets messages for the given element
 */
function TestImpl_getMessages(e) {
  var result = [];
  var msgElems = document.getElementById(e.id + "_msgs").childNodes;
  for (var i = 0; i < msgElems.length; i++) {
    var msg = msgElems[i];
    if (msg.className == 'message' || msg.className == 'messageSubheader') {
      ArrayUtil.appendElement(result, DHTML.getInnerText(msg));
    }
  }
  return result.length == 0 ? null : result.toJSONString();
}

function TestImpl_isElementDisplayed(e) {
  return e.style.display != 'none' && e.style.visibility != 'hidden';
}

function TestImpl_isClickable(e) {
  return !DHTML.isDisabled(e) &&
         (e.tagName == 'INPUT' || e.tagName == 'TEXTAREA' || e.tagName == 'SELECT' || e.href != null || e.onclick != null);
}

function TestImpl_isEditable(e) {
  return !DHTML.isDisabled(e) && !e.readOnly &&
         (e.tagName == 'INPUT' || e.tagName == 'TEXTAREA' || e.tagName == 'SELECT');
}

/**
* Returns true if the given HTML element matches the String name passed in for it.
*  Does regular old string matching unless a regular expression is included
*
*  This method MUST be kept logically equivalent to
*
*    WebElementDescription.matchesName(String name)
*/
function TestImpl_elementMatches(element, elemDesc) {
  if(elemDesc == element.id){
    return true;
  }
  if(element.id != null && elemDesc.indexOf("regexp:") == 0){
    var regExpChunk = elemDesc.substring(elemDesc.indexOf(":") + 1);
    var regExp = new RegExp(regExpChunk);
    if(element.id.match(regExp)){
      return true;
    }
  }
  return false;
}

/**
 * Returns true, if there's any unexcepted exception on page
 */
function TestImpl_hasExceptionOnPage() {
  return document.getElementById('error_details') != null;
}

/**
 * Returns the current page name
 */
function TestImpl_getPageName() {
  return document.getElementById("mainContent").childNodes[0].id;
}

/**
 * Returns the current worksheet name
 * @return empty string, if there's no worksheet
 */
function TestImpl_getWsName() {
  var e = document.getElementById("workspaceContent");
  return e ? e.childNodes[0].id : '';
}

/**
 * @param id id of the tree node
 * @return returns the number of visible child nodes
 */
function TestImpl_getNumChildTreeNodes(id) {
  return TestImpl_isTreeFolderOpen('tv_folder_'+id) ?
         Test.getElementCount('regexp:^' + id + ':[0-9]+$') : 0;
}
/**
 * @param id id of the tree node
 * @return returns ture if this node is a folder and is currently open
 */
function TestImpl_isTreeFolderOpen(id) {
  var fullId = document.getElementById(id).node;
  return TreeView.treeElemsByFullId[fullId].open;
}
