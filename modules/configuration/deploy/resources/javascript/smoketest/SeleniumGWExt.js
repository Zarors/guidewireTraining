/**
 * Adds additional commands to default Selenium API. This file needs to be included in the Selenium window.
 *
 * IMPORTANT - Because some default Selenium commands are asynchronous, the extended command implementation should
 *             not invoke the default commands to avoid ND problems.
 */

// override a style in selenium.css that causes rendering problems
/*
var iframes = document.body.getElementsByTagName("iframe");
for(var i = 0; i < iframes.length; i++) {
  iframes[i].style.overflow = "visible";
  iframes[i].style.overflowX = "visible";
  iframes[i].style.overflowY = "visible";
}
*/

Selenium.GW_DEFAULT_TIMEOUT = 120000; // 120 sec

/**
 * Replaces onBeforeUnload handler with Confirmation dialog, because Selenium does not yet handle onBeforeUnload.
 * This method is called after the app is loaded.
 */
Selenium.prototype.doFixTopLevelUnloadHandler = function() {
  var eventWin = this.browserbot.getCurrentWindow();
  var handler = eventWin.onbeforeunload || eventWin.document.body.onbeforeunload;
  if (handler) {
    function fixedConfirm(){var msg = handler(); if (msg) eventWin.confirm.call(eventWin, msg);}
    if (eventWin.onbeforeunload) {
      eventWin.onbeforeunload = fixedConfirm;
    } else {
      eventWin.document.body.onbeforeunload = fixedConfirm;
    }
  }
}

/**
 * Polls till alert presents or gw op done or time out
 */
Selenium.prototype.doWaitForAlertPresentOrGwOperationDone = function(bReturnPageName) {
  if (!SeleniumGW_isDialogOpen()) {
    LOG.debug('Start polling for GwOpDone');
    var func = bReturnPageName ? SeleniumGW_isGWOperationDoneExt : SeleniumGW_isGWOperationDone;
    return Selenium.decorateFunctionWithTimeout(fnBind(func, this), Selenium.GW_DEFAULT_TIMEOUT);
  }
};

Selenium.prototype.doRefreshGWPage = function() {
  this.browserbot.getCurrentWindow().gw.app.refresh();
  return this.doWaitForAlertPresentOrGwOperationDone();
}

/**
 * converts the "value" param into object, before calling #doSetValue()
 */
Selenium.prototype.doSetValues = function(locator, value) {
  return this.doSetValue(locator, eval(value));
}

/**
 * Sets value of an editable element (Input, Select, etc.).
 * This method fires real onChange event if value changes.
 */
Selenium.prototype.doSetValue = function(locator, value) {
  var eventWin = this.browserbot.getCurrentWindow();
  eventWin.Test.showMenuItem(locator) // an input inside a menu may not have been rendered yet
  var element = this.page().findElement(locator);
  var bChanged = eventWin.Test.setValue(element, value);
  if (typeof(bChanged) == typeof('')) {
    throw new SeleniumError(bChanged); // error occurred
  }

  // check disabled state at last, because DHTML.setValue may change the state of the widget
  if (element.disabled) {
    throw new SeleniumError('Can not set value of a disabled element: ' + element.id);
  } else if (element.readOnly) {
    throw new SeleniumError('Can not set value of a readonly element: ' + element.id);
  }

  if (bChanged) {
    // radio click is asynchronous in Ext
    if ( (element.tagName == 'INPUT' && element.type == 'radio')
      || element.className.indexOf("x-form-radio-group") != -1) {  // @SenchaUpgrade css dependency. Remove once TH is stable. No other x-form-radio-group references.
      SeleniumGW_waitForAsync(500) // wait for Ext DelayedTask
    }
    return this.doWaitForAlertPresentOrGwOperationDone();
  }
}

Selenium.prototype.doSelectLVRow = function(gridId, rowOffset) {
  var eventWin = this.browserbot.getCurrentWindow();
  eventWin.Test.selectLVRow(gridId, rowOffset);
  return this.doWaitForAlertPresentOrGwOperationDone()
}

Selenium.prototype.doSetCellValue = function(gridId, arg) {
  arg = eval(arg);

  var self = this;
  var rowOffset = arg[0];
  var dataIndex = arg[1];
  var value = arg[2];
  var eventWin = this.browserbot.getCurrentWindow();
  var editComplete = false;

  var callback = {
    getRadioButtonLocator: function() {
      var locator = null;
      if (String(eventWin.Test.getCellValue(gridId, rowOffset, dataIndex)) != value) {
        locator = 'dom=window.Test.getCellElem("' + gridId + '", "' + rowOffset + '", "' + dataIndex +
            '").dom.childNodes[0].childNodes[0].childNodes[0]';
      }
      return locator;
    },

    getCheckBoxLocator: function() {
      var locator = null;
      if (String(eventWin.Test.getCellValue(gridId, rowOffset, dataIndex)) != value) {
        locator = 'dom=window.Test.getCellElem("' + gridId + '", "' + rowOffset + '", "' + dataIndex +
            '").dom.childNodes[0].childNodes[0]';
      }
      return locator;
    },

    getRadioGroupLocator: function() {
      var locator = null;
      if (String(eventWin.Test.getCellValue(gridId, rowOffset, dataIndex)) != value) {
        locator = 'dom=window.Test.getCellElem("' + gridId + '", "' + rowOffset + '", "' + dataIndex +
            '").down("INPUT[inputValue=' + value + ']").dom';
      }
      return locator;
    },

    onCheckbox: function() {
      // Checkbox toggled
      if (String(eventWin.Test.getCellValue(gridId, rowOffset, dataIndex)) != value) {
        self.doMouseDownAt('dom=window.Test.getCellElem("' + gridId + '", "' + rowOffset + '", "' + dataIndex +
            '").dom.childNodes[0].childNodes[0]', '0,0');
        SeleniumGW_waitForAsync();
        self.doWaitForAlertPresentOrGwOperationDone();
      }
    },

    onRadioButton: function() {
      var locator = this.getRadioButtonLocator();
      if (locator) {
        self.doMouseDownAt(locator, '0,0');
        SeleniumGW_waitForAsync();
        self.doWaitForAlertPresentOrGwOperationDone();
      }
    },

    clickRadioButton: function() {
      var locator = this.getRadioButtonLocator();
      if (locator) {
        selenium.doClick(locator);
        SeleniumGW_waitForAsync();
        self.doWaitForAlertPresentOrGwOperationDone();
      }
    },

    clickRadioGroup: function() {
      var locator = this.getRadioGroupLocator();
      if (locator) {
        selenium.doClick(locator);
        SeleniumGW_waitForAsync();
        self.doWaitForAlertPresentOrGwOperationDone();
      }
    },

    clickCheckBox: function() {
      var locator = this.getCheckBoxLocator();
      if (locator) {
        selenium.doClick(locator);
        SeleniumGW_waitForAsync();
        self.doWaitForAlertPresentOrGwOperationDone();
      }
    }
  };

  var getCellEditStatus = eventWin.Test.setCellValue(gridId, rowOffset, dataIndex, value);
  if (typeof getCellEditStatus == typeof "") {
    throw new SeleniumError (getCellEditStatus); // an error occurred
  }

  var cellEditStatus = getCellEditStatus();
  if(eventWin.Ext.isBoolean(cellEditStatus) && cellEditStatus){
    editComplete = true;
  } else if(cellEditStatus in callback){
    callback[cellEditStatus]();
    editComplete = true;
  }

  // Test.setCellValue has an asynchronous editor instantiation. The sent back function checks for
  // when the editing is complete. Selenium checks by calling the function below until it sends true back at
  // which time the set cell value operation completes.
  return function() {
    var isDone = self.doWaitForAlertPresentOrGwOperationDone();
    if (!isDone) {
      isDone = function() {return true};
    }
    /**
     * TODO PL-18205 tpollinger: The currency test (gw.smoketest.px.webb.ClientReflectionTest#testCurrencyColumnReflection)
     * tests setting an invalid value into a currency field (letter a instead of a number). In the reflection case,
     * this results into an alert window showing after posting the invalid value to the server.
     * The error handling should be improved to give the a similar look and feel for the user when entering invalid
     * values also in the client reflection case. It should not feel radically different from other validation errors.
     */
    return selenium.isAlertPresent() || (editComplete || getCellEditStatus()) && isDone();
  };
}

/**
 * Set value for a LV column filter
 * @param gridId grid id
 * @param args a json array (contains dataIndex and filter value) encoded as String
 */
Selenium.prototype.doSetColumnFilterValue = function(gridId, args) {
  var eventWin = this.browserbot.getCurrentWindow();
  var args = eval(args)
  eventWin.Test.setColumnFilterValue(gridId, args[0], args[1])
  SeleniumGW_waitForAsync(500); // setting column filter is async in EXT
  return this.doWaitForAlertPresentOrGwOperationDone();
}

Selenium.prototype.doSelectOptionByLabel = function(locator, label) {
  var element = this.page().findElement(locator);
  var eventWin = this.browserbot.getCurrentWindow();

  var value = eventWin.Test.getOptionValueFromLabel(element, label)
  return this.doSetValue(locator, value); // TODO: multi select
}

Selenium.prototype.doRemoveOptionByLabel = function(locator, label) {
  var element = this.page().findElement(locator);
  var eventWin = this.browserbot.getCurrentWindow();

  var value = eventWin.Test.removeOptionValueFromLabel(element, label)
  return this.doSetValue(locator, value);
}

Selenium.prototype.doAddOptionByLabel = function(locator, label) {
  var element = this.page().findElement(locator);
  var eventWin = this.browserbot.getCurrentWindow();

  var value = eventWin.Test.addOptionValueFromLabel(element, label)
  return this.doSetValue(locator, value);
}

Selenium.prototype.doSelectGW = function(selectLocator, optionLocator) {
  this.doSelect(selectLocator, optionLocator);
  return this.doWaitForAlertPresentOrGwOperationDone();
}

Selenium.prototype.doClickGwAndGetPageName = function(locator) {
  return SeleniumGW_clickGw(locator, true);
}

Selenium.prototype.doClickGW = function(locator) {
  return SeleniumGW_clickGw(locator);
};

// register commands:
commandFactory.registerAll(selenium);


// -------------------------------------------------------------------------- private helpers:

function SeleniumGW_clickGw(locator, bReturnPageName) {
  var elem, bAnchor;
  var eventWin = selenium.browserbot.getCurrentWindow();

  var menuOpenerId = eventWin.Test.getMenuOpenerId(locator);
  if (menuOpenerId) {
    // TODO tpollinger: PL-21018: The first click repositions the viewport instead of clicking on the menu opener.
    // Clicking twice to open the menu
    selenium.doClick(menuOpenerId);
    selenium.doClick(menuOpenerId);
  }
  // TODO tpollinger We may want to remove this explicit showMenuItem call as the menu opener above should
  // take care of opening the menu. It seems that in the navigation panel, the below code may still be needed as
  // it does not have an explicit opener (though the tree opener for sub navigation items could be seen as such).
  eventWin.Test.showMenuItem(locator) // an item inside a menu may not have been rendered yet

  try {
    elem = selenium.browserbot.findElement(locator);
    bAnchor = elem.tagName == 'A' ||
              elem.tagName == 'INPUT' && elem.type == 'radio' ||
              elem.className.indexOf("x-form-radio-group") != -1; // radio click is asynchronous in Ext ///@SenchaUpgrade css dependency:  Remove once TH is stable. No other x-form-radio-group references.
  } catch (e) {}

  // generate error when smokeTest clicks on a disabled action
  if (elem && !eventWin.Test.isClickable(elem)) {
    if (bReturnPageName) {
      throw new SeleniumError('Clicking on ' + elem.tagName + ' with element id "' + elem.id + '" does nothing: ' +
        eventWin.gw.ext.Util.getOuterHTML(elem));
    }
  }

  if (elem && !eventWin.Ext.fly(elem).hasCls('g-accordion-item')) {
    var comp = eventWin.Ext.ComponentManager.get(elem.id);
    if (comp && comp.inputEl) {
      locator = comp.inputEl.dom.id;    // find the input element for a form field
    }
  }

  selenium.doClick(locator);

  if (bAnchor) { // wait for clicking on an anchor, which is asynchronous
    SeleniumGW_waitForAsync()
  }
  return selenium.doWaitForAlertPresentOrGwOperationDone(bReturnPageName);
}

function SeleniumGW_waitForAsync(timeout) {
  selenium.waitForAnchor = true;
  setTimeout("selenium.waitForAnchor = false", timeout || 15);
}

function SeleniumGW_isDialogOpen() {
  return selenium.isAlertPresent() || selenium.isConfirmationPresent();
}

function SeleniumGW_isGWOperationDoneExt() {
  return SeleniumGW_isGWOperationDone(true);
}

function SeleniumGW_isGWOperationDone(bReturnPageName) {
  var currWin = selenium.browserbot.getCurrentWindow();
  var result = !selenium.waitForAnchor && currWin.document.readyState == 'complete' && currWin.gw && currWin.gw.app.isReady() &&
      !currWin.Test.isWaitingForAsync() && !currWin.Ext.Ajax.isLoading() && !currWin.gw.app.isLocationReplacing();
  if (result) {
    currWin.gw.app.setTestActionComplete();
    var exceptionsOnPage = selenium.browserbot.getCurrentWindow().Test.getExceptionsOnPage();
    if (exceptionsOnPage != null) {
      throw new SeleniumError ("Unexpected exception on page:\n" + exceptionsOnPage.join('\n'));
    }
    LOG.debug('GwOpDone. current location:' + currWin.location);
    if (bReturnPageName) {
      // a hack way to return the result page at the end of the action command
      throw new SeleniumError ("RESULT PAGE: " + selenium.browserbot.getCurrentWindow().Test.getPageName());
    }
  }
  return result;
}
