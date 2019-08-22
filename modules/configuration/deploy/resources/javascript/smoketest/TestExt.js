// TODO: use gw namespace after removing old render mode
var Test = function() {
  var _waitingForAsync = false;

  // TODO: this method is not safe when an option label actually contains comma
  function collectValuesFromLabels(comp, labels, values) {
    Ext.each(labels.split(','), function(item){
      var index = comp.store.find(comp.displayField, item);
      if (index >= 0) {
        values.push(comp.store.getAt(index).get(comp.valueField));
      }
    });
  }

  // TODO: this method is not safe when an option label actually contains comma
  function removeValuesFromLabels(comp, labels, values) {
    var store = comp.store;
    labels = Ext.String.trim(labels);

    var optionValues  = comp.getValue();

    Ext.each(labels.split(','), function(item){
      var index = store.find(comp.displayField, item);
      var record = store.getAt(index);

      if (index >= 0) {
        Ext.Array.remove(optionValues, record.get(comp.valueField));
      }
    });

    for (var i = 0; i < optionValues.length; i++) {
      values.push(optionValues[i]);
    }
  }

  // TODO: this method is not safe when an option label actually contains comma
  function addValuesFromLabels(comp, labels, values) {
    var store = comp.store;
    labels = Ext.String.trim(labels);

    var optionValues  = comp.getValue();

    Ext.each(labels.split(','), function(item){
      var index = store.find(comp.displayField, item);
      var record = store.getAt(index);

      if (index >= 0) {
        optionValues[optionValues.length] = record.get(comp.valueField);
      }
    });

    for (var i = 0; i < optionValues.length; i++) {
      values.push(optionValues[i]);
    }
  }

  function getDisplayValuesForMultiSelect(comp, bIncludeNonSelected) {
    var text = [];
    if (bIncludeNonSelected) {
      var records = comp.view.all.elements;
      Ext.each(records, function(item) {
        text.push(item.get(comp.displayField));
      });
    } else {
      var selects = comp.getValue();
      Ext.Array.forEach(selects, function(val) {
        var item = comp.store.findRecord(comp.valueField, val, undefined, undefined, true, true);
        if (item) {
          text.push(item.get(comp.displayField));
        }
      });
    }
    return text;
  }

  function getInnerText (e) {
    var inner = e.innerText,
        content = e.textContent;
    return Ext.String.trim(!inner && content ? content : inner); // Favor the inner text unless it is falsey and content isn't
  }

  function getOptionLabel (e) {
    if (e instanceof Ext.form.field.Checkbox) {
      return getInnerText(e.boxLabelEl.dom);
    }

    if(e.tagName == "OPTION") {
      return e.text;
    } else if (e.type == 'radio' || e.type == 'checkbox') {
      return getInnerText(Ext.ComponentManager.get(e.id).getEl().dom.nextSibling);
    } else if (e.label) {
      return e.label;
    }
    return null;
  }

  function getOptionsInSelect(element) {
    var selectOptions = [];
    var elementId = Ext.isString(element) ? element : (element.name || element.id);
    var comp = Ext.ComponentManager.get(elementId);

    var store = comp ? comp.store : undefined;
    if(comp instanceof Ext.form.CheckboxGroup) {
      selectOptions = comp.items.getRange();
    } else if (store) { // single or multi select
      store.each(function (rec) {
        var option = [];
        option['label'] = rec.get(comp.displayField);
        option['value']= rec.get(comp.valueField);
        option['group'] = rec.get(comp.groupField) || ''; // Group field can now be undefined
        selectOptions.push(option);
      });
    }
    return selectOptions;
  }

  function getShuttleOptionLabel(element, dir) {
    var selectOptions = [];
    var elementId = Ext.isString(element) ? element : (element.name || element.id);
    var comp = Ext.ComponentManager.get(elementId);
    if (comp instanceof Ext.ux.form.ItemSelector) {
      comp = dir.toUpperCase() == 'TO' ? comp.toField : comp.fromField;
    }

    var store = comp ? comp.store : undefined;
    if (store) {
      store.each(function (rec) {
        var option = [];
        option['label'] = rec.get(comp.displayField);
        option['value']= rec.get(comp.valueField);
        selectOptions.push(option);
      });
    }
    return selectOptions;
  }

  //@SenchaUpgrade accessing non-public ExtJs property: msgButtons
  function getDialogBtn(btnId) {
    // TODO: Replace with below once TH has stabilized:
    //Ext.Msg.queryById(btnId);
    return Ext.Msg.msgButtons[btnId];
  }

  /**
   * Gets the row index for the given offset
   * @param grid grid component
   * @param rowOffset row offset from the grid
   */
  function getRowIndex(grid, rowOffset) {
    if(Ext.isNumber(rowOffset)){
      return Number(rowOffset);
    }

    return gw.GridUtil.getRowIdxForRowOffset(grid, rowOffset);
  }

  function getNumberOfInvisibleColumns(grid, upToThisIndex){
    var result = 0;

    Ext.Array.each(grid.view.headerCt.getGridColumns(), function(column, index) {
      if(index >= upToThisIndex){
        return false;
      }
      if(column.hidden){
        result++;
      }
    });

    return result;
  }

  function getColumnIndexForColumnId(grid, colId) {
    var colIdx = -1;

    Ext.Array.each(grid.view.headerCt.getGridColumns(), function(column, index) {
      if ((colId === column.dataIndex) || (colId === column.mapping)) {
        colIdx = index;
        return false;
      }
    });

    return colIdx;
  }

  function getColumnIndexByDataIndex(grid, dataIndex) {
    var columns = grid.view.headerCt.getGridColumns();
    for (var i = 0; i < columns.length; i++) {
      if (columns[i].dataIndex && columns[i].dataIndex == dataIndex) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Returns the row and column index of a grid cell
   * @param grid
   * @param rowOffset
   * @param dataIndex
   * @return an array: [rowIndex, colIndex, dvItem] (dvItem is returned if this is an input in dV in cell)
   */
  function getGridCoordinate(grid, rowOffset, dataIndex) {
    var colIndex = -1, rowIndex = -1, dvItem = null;
    var columnId = null;

    //Search for the column in the column definition first
    colIndex = getColumnIndexByDataIndex(grid, dataIndex);

    //rowOffset should really be called iteration since rowOffset can be "0"
    //but the actual row in the grid could be 0,1,2,3, etc. due to each RowIterator
    //can have arbitrary numbers of Row defined.
    //The server passes the rowOffset, which is really the iteration count of the RowIterator.
    //Thus, this code to search through all the records in the grid looking for the actual matching row.
    rowIndex = grid.store.findBy(function(r) {
      var offset = getRowOffsetFromRow(r);
      var noModeOffset = gw.GridUtil.getModeInsensitiveRowOffset(offset);
      if(noModeOffset === rowOffset){
        //Search the column match in gwCellId
        columnId = gw.GridUtil.getColumnIdForCellId(r, dataIndex);
        //_Checkbox has a special convert function to unbox it into a boolean so the gwCellID is lost
        if(columnId != null || dataIndex === '_Checkbox'){
          return true;
        }
      }
    });
    if(rowIndex < 0){
      //LinkCell?  Will this work if LinkCell is mixed with other cells in the same column?
      rowIndex = grid.store.findBy(function(r) {
        var offset = getRowOffsetFromRow(r);
        var noModeOffset = gw.GridUtil.getModeInsensitiveRowOffset(offset);
        if(noModeOffset === rowOffset){
          return true;
        }
      });
    }

    if(colIndex < 0 && columnId){
      colIndex = getColumnIndexForColumnId(grid, columnId);
    }

    if (colIndex < 0) {
      // Could be LinkCell.
      var record = grid.getStore().getAt(rowIndex);
      if (record) {
        Ext.iterate(record.data, function(key, value) {
          var dvColumn;
          if(value && (value.xtype==='templatevaluepanel' || gw.GridUtil.isFormatCell(value))) {
            dvColumn = value;
          }
          var elementsToSearch = null;
          if(dvColumn && dvColumn.items){
            elementsToSearch = dvColumn.items;
          }else if(Ext.isArray(value)){
            elementsToSearch = value;
          }
          Ext.each(elementsToSearch, function(input){
            if(input && input.id){
              var inputID = input.id;
              if(inputID.indexOf(dataIndex, inputID.length - dataIndex.length) !== -1){
                colIndex = getColumnIndexByDataIndex(grid, key);
                dvItem = input;
                // Append the text if this is a radiogroup.  huh?
                gw.GridUtil.processGridEditor(grid.getStore(), rowIndex, getColumnIndexByDataIndex(grid, key), function(editorByRow) {
                  if (editorByRow[0].xtype == 'radiogroup') {
                    dvItem.text = gw.GridUtil.getTextForRadioGroupCell(editorByRow[0], dvItem.value);
                  }
                });
                return false;
              }
            }
          });
          return !dvItem;
        });
      }
    }

    return [rowIndex, colIndex, dvItem];
  }

  /**
   * Sets value for an EXT field component.
   * This method triggers focus and blur event, which are required to fire onChange and complete-edit operations.
   */
  function setCompValue(comp, value) {
    if (comp.gChangeOnBlur) {
      comp.gChangeOnBlur = false; // Do not wait for BLUR before fire change event, since this change is triggered programmatically
    }
    if (comp instanceof Ext.form.field.ComboBox &&
      !(comp instanceof gw.ext.AutoComplete || comp instanceof Ext.form.field.Time)) {
      // @SenchaEnhancement the 2nd parameter is not documented. An ExtJs doc bug?
      // The second parameter is doSelect and forces a combobox selection for Ext.form.field.ComboBox. Documentation is missing
      comp.setValue(value, true); // fires 'change' event

    } else if (comp instanceof gw.ext.AutoComplete) {
      comp.setRawValue(value);
      comp.setValue(value, true); // fires 'change' event
      comp.checkChange();
    } else {
      // start editing a privacy field, if it's still in encrypted mode:
      if (comp.xtype == 'privacy' && comp.item && Ext.fly(comp.item.el.id) && comp.item.el.isVisible()) {
        comp.getPlugin('helper').showMenu.call(comp);
        var item = Ext.ComponentManager.get(comp.id + '_MENU:edit');
        item.handler.call(item, item);
      }

      gw.Util.setValue(comp, value); // fires 'change' event
    }
  }

  function getNumCellIteratorEntries(store, record, cellIterFullId) {
    var count = 0, i;

    for (i = 0; i < record.fields.length; i++) {
      var cellId = gw.GridUtil.getFullIdForCell(store, record, record.fields[i].name);
      if (cellId.indexOf(cellIterFullId + ':') == 0) {
        var num =  Number(cellId.substring(cellIterFullId.length + 1).match('^[0-9]+')) + 1;
        if (num > count) {
          count = num;
        }
      }
    }

    return count;
  }

  function isMatchingGrid(grid, lvId, rowOffset, dataIndex){
    var lvIdParts = lvId.split(':');
    var gridGwBaseIdParts = grid.gwBaseId.split(':');
    var i = 0;
    var rowIndex = -1;
    var isMatch = false;

    if(gridGwBaseIdParts.length > lvIdParts.length){
      return false;
    }

    for(i = 0; i < gridGwBaseIdParts.length; i++){
      if(gridGwBaseIdParts[i] !== lvIdParts[i]){
        return false;
      }
    }

    if (rowOffset) {
      rowIndex = gw.GridUtil.getRowIdxForRowOffset(grid, rowOffset);
      if(rowIndex === -1){
        return false;
      }
      isMatch = true;
    }

    if(dataIndex){
      var column = grid.getColumnById(dataIndex);
      if(!column){
        isMatch = false;
        if(rowIndex > -1){
          //try to look for dataIndex inside the cells' gwcellid
          var record = grid.store.getAt(rowIndex);
          isMatch = gw.GridUtil.getColumnIdForCellId(record, dataIndex) !== null;
        }
      }else {
        isMatch = true;
      }
    }

    return isMatch;
  }

  /**
   * @param lvId the full PCF Id, i.e., the nearest naming container (inclusive) id
   * @param rowOffset (optional) if specified, the Grid must have a matching row
   * @param dataIndex (optional) if specified, the Grid must have a matching column
   * @return the matching Grid component, or null
   */
  function getGrid(lvId, rowOffset, dataIndex) {
    var i, allGrids;
    var grid = gw.GridUtil.getGridById(lvId);

    if(grid){
      return grid;
    } else {
      //The ID coming from smoketest and selenium test is not always the same as the ExtJS's grid component ID.
      //This happens when the LV in the PCF does not specify an ID.
      //Can we have a unify ID for the LV no matter if it's smoketest or ExtJS?
      allGrids = Ext.ComponentManager.getAll().filter(function(item){
        return item.xtype ==='simplegrid';
      });

      for(i = 0; i < allGrids.length; i++){
        grid = allGrids[i]
        if(isMatchingGrid(grid, lvId, rowOffset, dataIndex)){
          return grid;
        }
      }

      return null;
    }
  }

  function getGridFromLVPagingId(lvPagingId) {
    var grid = null;

    var gridPager = Ext.ComponentManager.get(lvPagingId);
    if (gridPager) {
      var gridToolbar = gridPager.ownerCt;
      if (gridToolbar && gridToolbar.gridId) {
        grid = Ext.ComponentManager.get(gridToolbar.gridId);
      }
    }

    return grid;
  }

  function getGridTotalRecordCount(grid) {
    return grid.getGridTotalCount();
  }

  function getGridPageSize(grid) {
    var store = grid.getStore();
    var totalCount = grid.getGridTotalCount();

    return Math.ceil(totalCount / store.pageSize);
  }

  /**
   * Formats a nested array at any depth as a nested string formatted by the given string delimiters.
   * @param {Array} nestedStringArray the nested string array to format
   * @param {Array} nestedDelimiters the delimiters to apply for the matching level. The last delimiter will be applied to all
   * child levels if not enough delimiters are given for the number of levels. If there are no delimiters, then " "
   * is taken as default delimiter.
   * @param {Integer} level optional: current nest level, default is 0
   * @return {String} nested array as string representation
   */
    // TODO - JC: Talk to TP: Do we really need this function? Seems using JSON encoding would work for the use case here.
  function formatAsString(nestedStringArray, nestedDelimiters, level) {
    var nestedString = "";

    if (nestedStringArray) {
      if (!Ext.isArray(nestedStringArray)) {
        nestedString = nestedStringArray;

      } else {
        if (!nestedDelimiters) {
          nestedDelimiters = [];
        }
        if (level == undefined) {
          level = 0;
        }

        var del = (level < nestedDelimiters.length ? nestedDelimiters[level] : " ");
        if (level + 1 < nestedDelimiters.length) {
          level++;
        }

        for (var i = 0; i < nestedStringArray.length; i++) {
          var formattedPart = formatAsString(nestedStringArray[i], nestedDelimiters, level);
          nestedString += formattedPart;
          if (i + 1 < nestedStringArray.length) {
            nestedString += del;
          }
        }
      }
    }

    return nestedString;
  }

  /**
   * Check to see if any of the parent menus or the corresponding field is disabled
   * @param menuItem
   * @returns {boolean} if any of the parent menus for the associated field is disabled
   */
  function isMenuParentsDisabled(menuItem) {
    if (menuItem instanceof gw.MenuItem || menuItem instanceof Ext.menu.Menu) {
      if (menuItem.disabled) {
        return true;
      } else {
        // @UpgradedSencha 5.1, menuItem.ownerItem is now menuItem.ownerCmp
        var parent = (menuItem.parentMenu) ? menuItem.parentMenu : menuItem.ownerCmp;
        if (parent) {
          return isMenuParentsDisabled(parent);
        } else {
          if (menuItem.id) {
            var menuId = menuItem.id;
            var fieldId = menuId.substring(0, menuId.lastIndexOf(":"));
            var field = Ext.ComponentManager.get(fieldId);
            if (field && field.disabled) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  function getRowOffsetFromRow(row) {
    var fqRowOffsetRepr = gw.GridUtil.getFQRowOffsetReprFromRow(row);
    return gw.GridUtil.getFQRowOffset(fqRowOffsetRepr).offset;
  }

  return {
    // TODO: Does Selenium support equivalent functionality?
    fireEvent:function (elt, keycode, event, shift, alt) {
      var target = elt ? elt : document, eventObject;
      if (document.createEvent) {
        if (keycode) {
          eventObject = document.createEvent('KeyboardEvent');

          // AHK - 4/22/2013 - Simulating key events is apparently a cross-browser nightmare.  The workaround here
          // was taken from http://stackoverflow.com/questions/10455626/keydown-simulation-in-chrome-fires-normally-but-not-the-correct-key
          // Hack for Chrome/WebKit issues
          Object.defineProperty(eventObject, 'keyCode', {
            get : function() {
              return this.keyCodeVal;
            }
          });
          Object.defineProperty(eventObject, 'which', {
            get : function() {
              return this.keyCodeVal;
            }
          });

          if (eventObject.initKeyboardEvent) {
            // AHK - 4/22/2013 - The original SO post gives the first line; by Chrome 26, however, the argument order has changed
            // around to require the second line
//            eventObject.initKeyboardEvent(event.substring(2), true, true, null, false, alt, shift, false, keycode, 0);
            eventObject.initKeyboardEvent(event.substring(2), true, false, null, keycode, 0, false, alt, shift, false);
          } else {
            eventObject.initKeyEvent(event.substring(2), true, false, null, false, alt, shift, false, keycode, 0);
          }

          eventObject.keyCodeVal = keycode;

          if (eventObject.keyCode !== keycode) {
            alert("keyCode mismatch " + eventObject.keyCode + "(" + eventObject.which + ")");
          }

          target.dispatchEvent(eventObject);
        } else {
          eventObject = document.createEvent(event == 'onclick' ? 'MouseEvents' : 'HTMLEvents');
          eventObject.initEvent(event.substring(2), true, false);
          eventObject.shiftKey = shift;
          eventObject.altKey = alt;
          target.dispatchEvent(eventObject);
        }
      } else if (document.createEventObject) {
        eventObject = document.createEventObject();
        if (keycode) {
          eventObject.keyCode = keycode;
        }
        eventObject.shiftKey = shift;
        eventObject.altKey = alt;
        target.fireEvent(event, eventObject);
      }
    },

    fireChangeEvent:function (element) {
      var comp = Ext.ComponentManager.get(element.name || element.id);
      comp.fireEvent('change', comp);
    },

    /**
     * Returns the zero-based index of the element of the given value
     * is in the select, or -1 if no such element exists.
     */
    elementIndexInSelect:function (elem, value) {
      var options = getOptionsInSelect(elem);
      if (!options) {
        return -1;
      }
      for (var i = 0; i < options.length; i++) {
        if ((options[i].inputValue || options[i].value) == value) {
          return i;
        }
      }
      return -1;
    },

    /**
     * Returns the zero-based index of the element of the given label
     * is in the select, or -1 if no such element exists.
     */
    elementIndexInSelectByLabel:function (elem, label) {
      var options = getOptionsInSelect(elem);
      if (!options) {
        return -1;
      }
      for (var i = 0; i < options.length; i++) {
        if (getOptionLabel(options[i]) == label) {
          return i;
        }
      }
      return -1;
    },

    elementValueInSelectByLabel:function (elem, label) {
      var options = getOptionsInSelect(elem);
      if (!options) {
        return null;
      }
      for (var i = 0; i < options.length; i++) {
        if (getOptionLabel(options[i]) == label) {
          return options[i].value;
        }
      }
      return null;
    },

    /**
     * Counts number of cells under a CellIterator
     * @param lvId lv id or its parent container id
     * @param rowOffset row offset
     * @param cellIteratorOffset cell iterator offset
     * @return {Number}
     */
    getCellIteratorNumEntries : function(lvId, rowOffset, cellIteratorOffset) {
      var grid = Ext.isString(lvId) ? getGrid(lvId, rowOffset, null) : lvId;
      var count = 0;

      if (grid) {
        var idParts = [lvId];
        if (rowOffset) {
          idParts.push(rowOffset);
        }
        if (cellIteratorOffset) {
          idParts.push(cellIteratorOffset);
        }
        var cellIterId = idParts.join(':'); // full path for the cell iterator

        grid.getStore().each(function(record) {
          var numCells = getNumCellIteratorEntries(grid.getStore(), record, cellIterId);
          if (numCells > count) {
            count = numCells;
          }
        });
      }

      return count;
    },

    /**
     * For a nested RowIterator, this method only counts the top-level entries, but not nested ones.
     * @param lvId the named LV id or the parent container id
     * @param nestedIteratorOffset the path to the row iterator to take the row count from
     */
    getLVNumEntries : function(lvId, nestedIteratorOffset) {
      // The nestedIteratorOffset is the path to the row iterator. Row offsets have a row count as well.
      // Adding the first row count. If there are no rows, then the count will be 0
      var grid = Ext.isString(lvId) ?
        getGrid(lvId, nestedIteratorOffset ? nestedIteratorOffset + ":0" : "0", null) :
        lvId;
      var count = 0;

      if (grid && !grid.getStore().isDestroyed) {
        grid.getStore().each(function(record) {
          var rId = record.get(gw.SimpleGrid.ROW_OFFSET);

          if (nestedIteratorOffset) {
            rId = gw.GridUtil.getModeInsensitiveRowOffset(rId);
            if (rId.indexOf(nestedIteratorOffset + ':') == 0) {
              rId = rId.substring(nestedIteratorOffset.length + 1);
            } else {
              return true; // not a match, look for other matches
            }
          }

          var num = Number(rId.match('^[0-9]+')) + 1;
          if (num > count) {
            count = num;
          }

          // Found a match, look for other possible records matching
          return true;
        });
      }

      return count;
    },

    getLVTotalRecords: function(lvId, nestedIteratorOffset) {
      var grid = Ext.isString(lvId) ?
        getGrid(lvId, nestedIteratorOffset ? nestedIteratorOffset + ":0" : "0", null) :
        lvId;
      var count = 0;

      if (grid) {
        count = getGridTotalRecordCount(grid);
      }

      return count;
    },

    getLVTotalRecordsByLVPagingId: function(lvPagingId, lvId) {
      var count = 0;

      var grid = getGridFromLVPagingId(lvPagingId);
      if(!grid && lvId) {
        grid = getGrid(lvId);
      }
      if (grid) {
        count = getGridTotalRecordCount(grid);
      }

      return count;
    },

    getLVTotalPages: function(lvPagingId, lvId) {
      var count = 0;

      var grid = getGridFromLVPagingId(lvPagingId);
      if(!grid && lvId) {
        grid = getGrid(lvId);
      }
      if (grid) {
        count = getGridPageSize(grid);
      }

      return count;
    },

    isLVPagerVisible: function(lvPagingId) {
      var isVisible = false;
      var gridPager = Ext.ComponentManager.get(lvPagingId);
      if(gridPager) {
        isVisible = gridPager.isVisible();
      }
      return isVisible;
    },

    /**
     * Counts the number of entries on page for the given iterator
     * @param iteratorId id of the iterator
     */
    getNumEntries : function (iteratorId, nestedIteratorOffset) {
      // TODO tpollinger test whether this works in LV, can be ambiguous
      var grid = getGrid(iteratorId);
      if (grid != null) {
        return this.getLVNumEntries(grid, nestedIteratorOffset);
      }

      var comp = Ext.ComponentManager.get(iteratorId);
      if (comp && comp.xtype == 'rowtree') {
        return Test.getNumChildTreeNodes(iteratorId,  'root');
      }

      // make sure the component and its sub menu are rendered:
      Test.showMenuItem(iteratorId);
      Test.openMenu(iteratorId);

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
    },

    isCompVisible : function(id) {
      var comp = Ext.ComponentManager.get(id);
      if (comp) {
        if (comp instanceof Ext.menu.Item) {
          return true; // consider a menu item visible, even if the menu is not open
        }
        return comp.rendered && comp.getEl().isVisible(true) && comp.isVisible(true);
      }

      // element not corresponding to an ExtJs Component:
      var elem = Ext.fly(id);
      return elem && elem.isVisible() && elem.dom.type != 'hidden';
    },

    /**
     * Get the style classes of the given element and all its descendents in an nested string array:
     * <pre>[[style1, style2], [style3], [], [style4]]</pre>
     * where there are styles for 4 nested elements (including siblings). So style1, style2 are two style
     * classes of the given id, style3 is the style of its children (one or more), grand children don't have
     * any styles and the leaf elements have style4.
     * @param {String/Element/HTMLElement} id locator string of the root element, root element or root DOM node
     * @param {Boolean} asString true, formats the nested style classes array as a string as follows:
     *  style1 style2, style3, , style4
     * @return {Array/String} nested style classes of element and all its descendents or empty array if no styles
     */
    // TODO JC: Talk to TP - This method seems pretty complicated and only used for negative currency style.
    // Testing the actual runtime-style might be more straight-forward and provide more confidence.
    getNestedStyleClasses: function(id, asString) {
      var styleClasses = [];

      gw.Util.eachDescendent(id, function(descendent, depth) {
        var classNames = descendent.className ? descendent.className.split(" ") : [];
        if (depth < styleClasses.length) {
          styleClasses[depth] = styleClasses[depth].concat(classNames);
        } else {
          styleClasses.push(classNames);
        }
        return true;
      });

      if (asString) {
        styleClasses = formatAsString(styleClasses, [",", " "]);
      }

      return styleClasses;
    },

    getDialogBtnOk : function(){
      return getDialogBtn('ok');
    },

    getDialogBtnCancel : function(){
      return getDialogBtn('cancel');
    },

    getDialogBtnYes : function(){
      return getDialogBtn('yes');
    },

    getDialogBtnNo : function(){
      return getDialogBtn('no');
    },

    isRowSelected : function(lvId, rowOffset) {
      var grid = getGrid(lvId, rowOffset, null);
      var rowIndex = getRowIndex(grid, rowOffset);
      return grid.getSelectionModel().isSelected(rowIndex);
    },

    /**
     * True if the given row's selection can be edited (changed, toggled), false otherwise.
     * An editable row can be toggled from selected to non selected or from non selected to selected.
     * @param lvId the grid LV id
     * @param rowOffset the row offset (numeric offset into the row iterator's row instance)
     */
    isRowSelectionEditable: function(lvId, rowOffset) {
      if (!this.isRowSelectionEnabled(lvId, rowOffset)) {
        return false;
      }
      if (!this.isRowSelected(lvId, rowOffset)) {
        return true;
      }

      var grid = getGrid(lvId, rowOffset, null);
      return grid.getSelectionModel().getSelectionMode() != "SINGLE";
    },

    /**
     * True if this grid has row selection enabled, false otherwise
     * @param lvId the grid LV id
     * @param rowOffset optional row offset. The optional row offset helps to disambiguate LVs with no ids, however
     * it is not relevant for determining the row selection status
     * @return {Boolean}
     */
    isRowSelectionEnabled: function(lvId, rowOffset) {
      var grid = getGrid(lvId, rowOffset, null);
      return grid.getSelectionModel().isLocked() !== true;
    },

    /**
     * Gets the text inside a cell
     * @SenchaUpgrade referencing CSS class names
     * @param gridId grid id
     * @param rowOffset row offset, e.g., "0" or "0:SomeRowSet"
     * @param dataIndex cell offset from the row, e.g., "TextField1" or "2:CellUnderCellIterator"
     * @return text
     */
    getCellText : function(gridId, rowOffset, dataIndex) {
      var cell = this.getCellElem(gridId, rowOffset, dataIndex);

      if(cell.text !== undefined){
        return cell.text;
      }
      if(cell.value !== undefined){
        return cell.value;
      }
      var cellText = cell.down('DIV.x-grid3-radio-col-on') ? 'true' :
        cell.down('DIV.x-grid3-check-col-on') ? 'true' :
          cell.down('.x-grid-checkcolumn-checked') ? 'true' :
            cell.down('INPUT[checked]') ?  getInnerText(cell.down('INPUT[checked]').dom.parentNode) :
              getInnerText(cell.dom);

      return this.stripAltValueFromCellText(cell, cellText);
    },

    getColumnWidth: function(gridId, dataIndex){
      var grid = getGrid(gridId, 0, dataIndex);
      var column = grid.getColumnById(dataIndex);
      return column.width;
    },

    getLVColumn: function(gridId, dataIndex) {
      var grid = getGrid(gridId, 0, dataIndex);
      var colIndex = getColumnIndexByDataIndex(grid, dataIndex);
      return grid.headerCt.getGridColumns()[colIndex];
    },

    setColumnWidth: function(gridId, dataIndex, widthValue){
      var grid = getGrid(gridId, 0, dataIndex);
      var colIndex = getColumnIndexByDataIndex(grid, dataIndex);
      grid.columns[colIndex].setWidth(widthValue);
    },

    stripAltValueFromCellText : function(cellElem, cellText) {
      // do not include footer text:
      var footerElem = cellElem.down('.' + gw.Util.getAltValueClass(), true);
      if (footerElem) {
        var footerText = getInnerText(footerElem);
        if (cellText && cellText.indexOf(footerText) == cellText.length - footerText.length) {
          cellText = Ext.String.trim(cellText.substring(0, cellText.length - footerText.length));
        }
      }

      return cellText;
    },

    getCellAltElem : function (gridId, rowOffset, dataIndex) {
      var cell = this.getCellElem(gridId, rowOffset, dataIndex);
      var cellElem = Ext.fly(cell);
      return cellElem.down('.' + gw.Util.getAltValueClass(), true);
    },

    /**
     * Gets the footer alt text inside a cell
     * @param gridId grid id
     * @param rowOffset row offset, e.g., "0" or "0:SomeRowSet"
     * @param dataIndex cell offset from the row, e.g., "TextField1" or "2:CellUnderCellIterator"
     * @return text
     */
    getCellAltText : function(gridId, rowOffset, dataIndex) {
      var footerElem = this.getCellAltElem(gridId, rowOffset, dataIndex);
      if (footerElem) {
        return getInnerText(footerElem);
      }
      return null;
    },

    hasCellAltValue : function(gridId, rowOffset, dataIndex) {
      return this.getCellAltElem(gridId, rowOffset, dataIndex) != null;
    },

    /**
     * Gets the editable value without decorations
     */
    getCellValue : function(lvId, rowOffset, dataIndex, prop) {
      // Some cells like radio groups have nested elements in a cell. They are materialized first class
      // components. Checking first whether the cell has a registered value component.
      var id = lvId + ":" + rowOffset + ":" + dataIndex;
      var comp = Ext.ComponentManager.get(id);
      if (comp) {
        var e = window.document.getElementById(id);
        if (e) {
          return this.getValue(e);
        }
      }

      var grid = getGrid(lvId, rowOffset, dataIndex);
      var accord = getGridCoordinate(grid, rowOffset, dataIndex);
      var rowIndex = accord[0], colIndex = accord[1], dvItem = accord[2];

      if (dvItem) {
        return dvItem.editValue || dvItem.value;
      }

      var column = grid.headerCt.getGridColumns()[colIndex];
      if (column.editor && (column.editor.xtype == 'checkbox')) {
        return this.getCellText(lvId, rowOffset, dataIndex);
      }

      if (column.xtype == 'radiocolumn') {
        return (this.getCellElem(lvId, rowOffset, dataIndex).dom.childNodes[0].childNodes[0].className.indexOf('x-grid3-radio-col-on') > -1);
      }

      var checkBoxCell = false;
      gw.GridUtil.processGridEditor(grid.store, rowOffset, column, function(editorByRow) {
        var editorCfg = editorByRow[0];
        if (editorCfg.xtype == 'checkbox'){
          checkBoxCell = true;
        }
      }, false);
      if (checkBoxCell) {
        return this.getCellText(lvId, rowOffset, dataIndex);
      }

      var fieldValue;
      if (column.dataIndex) {
        fieldValue = grid.getStore().getAt(rowIndex).get(column.dataIndex);
        // If value is null/undefined then the cell is present (because we were able to find the column
        // and column.dataIndex is set up) but has no value. Server smoke tests return the empty string
        // when this happens, so we match that behavior here.
        // See com.guidewire.commons.smoketest.ExtServerSmokeTestHelper.ExtServerValueHelper.getValue
        if (fieldValue === undefined || fieldValue === null) {
          fieldValue = '';
        }
      } else {
        Ext.each(grid.plugins, function(p) {
          if (p.id == column.id) {
            if (p instanceof Ext.ux.gw.RadioColumn) { // radio column
              fieldValue = (grid.store.extraValues[p.group] == grid.id + ':' + rowIndex + ':' + p.id);
            }
            return false;
          }
        });
      }

      // Get the dvcolumn value if this cell is configured as a dvcolumn cell
      // TODO Refactor to simplify data structure, is used for radio group cells
      if (Ext.isArray(fieldValue)) {
        return gw.GridUtil.getFirstInputInTemplateCell(fieldValue).value;
      }

      if (prop) {
        return fieldValue[prop];
      }
      return fieldValue.value != null ? fieldValue.value : fieldValue.text === undefined ?
        fieldValue : fieldValue.text;
    },

    isCellVisible : function(gridId, rowOffset, dataIndex) {
      var elem = this.getCellElem(gridId, rowOffset, dataIndex);
      if (elem) {
        if (dataIndex == '_Checkbox') { // EntryCheckColumn
          // TODO: Refactor: Card 372: Get the edit control for the matching check row. CSS dependency should be removed.
          return elem.down('.x-grid-checkcolumn') != null;
        }
        return true;
      } else {
        return false;
      }
    },

    /**
     * The active cell editor or null if there is none active
     * @param gridId the LV grid id
     */
    getActiveCellEditor: function(gridId) {
      var grid = getGrid(gridId);
      //TODO: define constant or util method to get grid cell editing plugin:
      var activeEditor = (grid == null) ? null : grid.getPlugin('gridCellEditing').getActiveEditor();
      return activeEditor ? activeEditor.field : null;
    },

    /**
     * True if the cell given by the grid, row offset and data index is in edit mode; false otherwise
     * @param gridId the grid LV id
     * @param rowOffset the row offset (numeric offset into row iterator's row instance)
     * @param dataIndex data index (row iterator's column name)
     */
    isActiveCellEditor: function(gridId, rowOffset, dataIndex) {
      var isActive = false;
      var grid = getGrid(gridId, rowOffset, dataIndex);

      if (grid) {
        var gridCoord = getGridCoordinate(grid, rowOffset, dataIndex);
        var rowIndex = gridCoord[0], colIndex = gridCoord[1];
        var row = grid.getStore().getAt(rowIndex);
        var column = grid.headerCt.getGridColumns()[colIndex];  //@SenchaEnhancement headerCt is not public

        var cellEditing = grid.getPlugin('gridCellEditing');
        var activeRecord = cellEditing.getActiveRecord(); ///@SenchaEnhancement non-public method
        var activeColumn = cellEditing.getActiveColumn(); // @SenchaEnhancement non-public method

        isActive = activeRecord && activeColumn && (activeRecord == row) && (activeColumn == column);
      }

      return isActive;
    },

    getGridRowClass : function(lvId, rowOffset) {
      var grid = getGrid(lvId, rowOffset);
      if (!grid) {
        return null;
      }
      var rowIndex = grid.store.findBy(function(r) {
        var offset = getRowOffsetFromRow(r);
        var noModeOffset = gw.GridUtil.getModeInsensitiveRowOffset(offset);
        if(noModeOffset === rowOffset){
          return true;
        }
      });
      var store = grid.getStore();
      var record = store.getAt(rowIndex);
      return grid.getView().getRowClass(record, rowIndex, undefined, store )
    },

    getTreeRowClass : function(treeId, rowIndex) {
      var treeTable = Ext.ComponentManager.get(treeId);
      if (treeTable.xtype === "rowtree") {
        var record = treeTable.getStore().getAt(rowIndex);
        if (record) {
          return treeTable.getView().getRowClass(record);
        }
      }
      return null;
    },

    getCellElem : function(lvId, rowOffset, dataIndex) {
      var grid = getGrid(lvId, rowOffset, dataIndex);
      if (!grid) {
        return null;
      }
      var accord = getGridCoordinate(grid, rowOffset, dataIndex);
      var rowIndex = accord[0], colIndex = accord[1], dvItem = accord[2];
      try {
        if (dvItem) {
          return dvItem;
        }
        var col = grid.headerCt.getGridColumns()[colIndex]; // @SenchaEnhancement headerCt
        var row = grid.getStore().getAt(rowIndex);
        return grid.getView().getCell(row, col);
      } catch (e) {
        return null; // out of index
      }
    },

    //TODO JC: Talk to TP - The nested style class methods seem a bit ND and complicate.
    // How about checking for actual runtime style or style at a particular DOM level?
    getCellNestedStyleClasses: function(lvId, rowOffset, dataIndex, asString) {
      var cellElement = this.getCellElem(lvId, rowOffset, dataIndex);
      return this.getNestedStyleClasses(cellElement, asString);
    },

    getCellAltNestedStyleClasses: function(lvId, rowOffset, dataIndex, asString) {
      // The alt value shares the same style as the overall cell
      var cellAltElement = this.getCellElem(lvId, rowOffset, dataIndex);
      return this.getNestedStyleClasses(cellAltElement, asString);
    },

    getColumnFooterNestedStyleClasses: function(lvId, rowOffset, dataIndex, asString) {
      var columnFooterElement = this.getColumnFooterElem(lvId, rowOffset, dataIndex);
      return this.getNestedStyleClasses(columnFooterElement, asString);
    },

    getColumnFooterAltNestedStyleClasses: function(lvId, rowOffset, dataIndex, asString) {
      // The alt value shares the same style as the overall cell
      var columnFooterElement = this.getColumnFooterElem(lvId, rowOffset, dataIndex);
      return this.getNestedStyleClasses(columnFooterElement, asString);
    },

    /**
     * Sets cell value
     * @param lvId
     * @param rowOffset
     * @param dataIndex
     * @param value new value
     * @return true to indicate the value has changed; 'radio' to indicate this is a special radio column
     */
    // TODO: Refactor: Card 372: the setCellValue logic seems complicated and fragile. Let's discuss if there are
    // more robust alternatives, e.g.:
    // 1) set value at lower level without invoking editor during test
    // 2) simulate end user scenario, e.g., driven mouse click, to reduce dependency on Sencha implementation details
    setCellValue : function(lvId, rowOffset, dataIndex, value) {
      var grid = getGrid(lvId, rowOffset, dataIndex);
      var accord = getGridCoordinate(grid, rowOffset, dataIndex);
      var rowIndex = accord[0], colIndex = accord[1];
      var column = grid.headerCt.getGridColumns()[colIndex];  //@SenchaEnhancement headerCt

      if (column.xtype == 'radiocolumn') {
        return function() {return 'onRadioButton';};
      }

      if (column.dataIndex == '_Checkbox') {
        return function() {return 'onCheckbox';};
      }

      if (!Test.isCellEditable(lvId, rowOffset, dataIndex)) {
        return 'Trying to set value of a read-only cell: ' + lvId + ':' + rowOffset + ':' + dataIndex;
      }

      // Radio cells don't have an editor. Delegate the click to the underlying radio element
      // The radio column has been handled before this.
      var editorCfg = null;
      var radioCell = false;
      var checkBoxCell = false;
      var radioGroupCell = false;
      gw.GridUtil.processGridEditor(grid.store, rowIndex, column, function(editorByRow) {
        editorCfg = editorByRow[0];
        if (editorCfg.xtype == 'radio') {
          radioCell = true;
        } else if (editorCfg.xtype == 'checkbox') {
          checkBoxCell = true;
        } else if (editorCfg.xtype == 'radiogroup') {
          radioGroupCell = true;
        }
      }, false);

      // TODO tpolliger: Check server configuration: A DV input in a cell has a radio group. The editor map
      // is missing an editor configuration for the matching row/cell. See totalOverride Yes/No on
      // DetailViews > Sample Targeted LV
      var fieldValue = grid.getStore().getAt(rowIndex).get(column.dataIndex);
      var dvInput = gw.GridUtil.getFirstInputInTemplateCell(fieldValue);
      if (dvInput) {
        editorCfg = dvInput;
        if (dvInput.xtype == 'radio') {
          radioCell = true;
        } else if (dvInput.xtype == 'checkbox') {
          checkBoxCell = true;
        } else if (dvInput.xtype == 'radiogroup') {
          radioGroupCell = true;
        }
      }

      if (radioCell) {
        return function() {return 'clickRadioButton';};
      }
      if (checkBoxCell) {
        return function() {return 'clickCheckBox';};
      }
      if (radioGroupCell) {
        return function() {return 'clickRadioGroup';};
      }

      // Set the column editor if it has not been set yet. Typically the row sensitive editor is set during
      // a beginEdit event. Editors that are rendered through dvInput cell configurations do not have their
      // editor configuration in the editors section.
      // TODO: Card 372: Refactor dvInput to grid editor declaration.
      if (!column.getEditor()) {
        grid.setEditorCfg(editorCfg, rowIndex, dataIndex);
      }

      /**
       * Note tpollinger: Ext JS 4 decouples the CellEditing's startEdit from the CellEditor's startEdit
       * through an asynchronous call. Adding event listeners to initiate the right place to set the edit
       * value and to complete the cell edit.
       */
      var cellEditor = grid.getPlugin("gridCellEditing");
      var cellEditing = true;

      var row = grid.store.getAt(rowIndex);
      var editStarted = cellEditor.startEdit(row, column);

      // editor should be ready by now:
      if (cellEditor.activeEditor) {
        var activeEditor = cellEditor.activeEditor;
        var field = activeEditor.field;
        try {
          // Set value AND trigger confirmation and complete-edit:
          setCompValue(field, value);
          if (field instanceof gw.ext.AutoComplete) {
            field.doQuery(this.getRawValue());
            field.collapse();
          }
        } catch (exc) {
          console.log('Exception during setValue: ' + exc);
          // TODO There might be a lower level exception. Catching and ignoring in order to ensure
          // that the overall edit completes. Need to refactor this.
        }
        try {
          cellEditor.completeEdit();
        } catch (exc) {
          console.log('Exception during completeEdit: ' + exc)
        }

        /**
         * Note: Ext JS asynchronously schedules an editor change event delayed by the timeout configured by
         * checkChangeBuffer.
         * The cell edit is not completed until the checkChange call has been performed that may fire
         * a change event. A change event may trigger a client reflection or an ajaxRequestInfo call to the server
         * which would result in triggered changes on the user interface that need to settle before completing the
         * cell edit.
         * As there is no easy hook into the method Ext.form.field.Base#initEvents where the checkChange method
         * delay is initialized, we need to wait long enough to have this call completed before signaling the end
         * of this cell edit action.
         */
        var delay = activeEditor.checkChangeBuffer ? activeEditor.checkChangeBuffer : 50;
        setTimeout(function() {
          // Cell editing is now complete.
          cellEditing = false;
        }, delay + 50);
      }

      // Limit the cell editing wait
      var cellEditingTimedOut = null;
      if (!editStarted) {
        // AHK - 2/14/2013 - If cell editing wasn't started, it probably means that ExtGrid.js.beforediting returned
        // false, which happens if the cell isn't actually editable client-side.  In that case, rather than waiting
        // 20 seconds to time out, we just set the timeout error immediately
        cellEditingTimedOut = "Unable to start editing " + lvId + ":" + rowOffset + ":" + dataIndex + " (the cell is probably read-only or disabled)";
      } else {
        setTimeout(function() {
          cellEditingTimedOut = "Timeout setting value: '" + value + "' in grid cell with id: '" + lvId + ":" +
            rowOffset + ":" + dataIndex + "'";
        }, 20000);
      }

      return function() {
        if (cellEditingTimedOut) {
          return cellEditingTimedOut;
        }
        return !cellEditing;
      };
    },

    isCellEditable : function(lvId, rowOffset, dataIndex) {
      var grid = getGrid(lvId, rowOffset, dataIndex);
      var accord = getGridCoordinate(grid, rowOffset, dataIndex);
      var rowIndex = accord[0], colIndex = accord[1];
      var column = grid.headerCt.getGridColumns()[colIndex];  //@SenchaEnhancement headerCt

      //TODO: a better way to check radio column?
      if (column.xtype == 'rowcheckcolumn' ||column.xtype  == 'radiocolumn' || column.xtype  == 'checkcolumn' ) {
        return true;
      }

      var fieldValue = grid.getStore().getAt(rowIndex).get(column.dataIndex);
      var dvInput = gw.GridUtil.getFirstInputInTemplateCell(fieldValue);
      if (dvInput) {
        return dvInput.editable;
      }

      var editable = false;
      gw.GridUtil.processGridEditor(grid.store, rowIndex, column, function(editorByRow) {
        if (editorByRow[0]) {
          editable = true;
        }
      }, true);

      return editable;
    },

    isCellDisabled : function(lvId, rowOffset, dataIndex) {
      var grid = getGrid(lvId, rowOffset, dataIndex);
      var accord = getGridCoordinate(grid, rowOffset, dataIndex);
      var rowIndex = accord[0], colIndex = accord[1];
      var column = grid.headerCt.getGridColumns()[colIndex]; //@SenchaEnhancement headerCt
      var disabled = null;
      var bPrivacy = false;

      gw.GridUtil.processGridEditor(grid.getStore(), rowIndex, column, function(editorByRow) {
        if (editorByRow[0]) {
          disabled = editorByRow[0].disabled || false;
          bPrivacy = (editorByRow[0].xtype == 'privacy');
        }
      }, true);

      var fieldValue;
      if (disabled != null) {
        if (!disabled && bPrivacy) {
          // Disable editor if non-empty privacy value from server
          fieldValue = grid.getStore().getAt(rowIndex).get(column.dataIndex);
          if (fieldValue) {
            disabled = true;
          }
        }
      } else {
        // No cell grid editor was found (disabled is null). The cell is in read-only mode and usually
        // enabled (not grayed out)
        fieldValue = grid.getStore().getAt(rowIndex).get(column.dataIndex);
        var dvInput = gw.GridUtil.getFirstInputInTemplateCell(fieldValue);
        if (dvInput && dvInput.disabled !== undefined) {
          disabled = dvInput.disabled;
        } else if (fieldValue && fieldValue.disabled !== undefined) {
          disabled = fieldValue.disabled;
        } else {
          disabled = false;
        }
      }

      return disabled;
    },

    getCellOptionLabels : function(gridId, rowOffset, dataIndex) {
      var options = Test.getCellOptionStore(gridId, rowOffset, dataIndex);
      var labels = [];
      Ext.each(options, function(op) {
        labels.push(op[1]);
      });
      return labels;
    },

    getCellOptionValues : function(gridId, rowOffset, dataIndex) {
      var options = Test.getCellOptionStore(gridId, rowOffset, dataIndex);
      var values = [];
      Ext.each(options, function(op) {
        values.push(op[0]);
      });
      return values;
    },

    getCellOptionStore : function(lvId, rowOffset, dataIndex) {
      var grid = getGrid(lvId, rowOffset, dataIndex);
      var accord = getGridCoordinate(grid, rowOffset, dataIndex);
      var rowIndex = accord[0];
      var col = grid.columns[accord[1]];

      var bEditor = false;
      var store = [];
      gw.GridUtil.processGridEditor(grid.store, rowIndex, col, function(editorByRow) {
        bEditor = true;
        // todo: look into removing this code since this should only work for combo box
        if (editorByRow[0] instanceof Ext.form.Field) {
          editorByRow[0].store.each(function (rec) {
            var option = [];
            option[0]= rec.get(editorByRow[0].valueField);
            option[1] = rec.get(editorByRow[0].displayField);
            store.push(option);
          });
        } else {
          store = editorByRow[0].store;
        }
      });

      if (!store && col.editor) {
        store = col.editor.initialConfig.store;
      } else if (!bEditor) {
        var fieldValue = grid.getStore().getAt(accord[0]).get(col.dataIndex);
        var dvInput = gw.GridUtil.getFirstInputInTemplateCell(fieldValue);
        if (dvInput && dvInput.store) {
          store = dvInput.store;
        }
      }

      return store;
    },

    /**
     * Selects a row in a grid
     * @param lvId grid id
     * @param rowOffset row offset from the grid
     */
    selectLVRow : function(lvId, rowOffset) {
      var grid = getGrid(lvId, rowOffset, null);
      var rowIndex = getRowIndex(grid, rowOffset);
      var cm = grid.getSelectionModel();
      cm.selectRange(rowIndex, rowIndex);
    },

    isLVRowChecked : function(lvId, rowOffset) {
      var grid = getGrid(lvId, rowOffset, null);
      var rowIndex = getRowIndex(grid, rowOffset);
      var cm = grid.getSelectionModel();
      return cm.isSelected(rowIndex);
    },

    /**
     * Unlock the header container
     * @param lvId gride id
     * @param dataIndex field id (e.g. textField1)
     * @return
     */
    unlockHeader : function(lvId, dataIndex) {
      var grid = getGrid(lvId, null, dataIndex);
      grid.headerCt.ddLock = false;   //@SenchaEnhancement headerCt
    },

    /**
     * Returns the header cell element
     * @param lvId grid id
     * @param dataIndex field id (e.g. textField1)
     * @return html element
     */
    getHeaderCell : function(lvId, dataIndex) {
      var grid = getGrid(lvId, null, dataIndex);
      var colIndex = getColumnIndexByDataIndex(grid, dataIndex);
      var headerCellDiv = grid.view.headerCt.getGridColumns()[colIndex].titleEl;  //@SenchaEnhancement titleEl
      if (headerCellDiv) {
        // Get the div next to the column header trigger div that may pull down the header menu
        var headerCellTextDiv = headerCellDiv.down(".x-column-header-text"); //TODO: Refactor: Card 370: CSS dependency
        if (headerCellTextDiv) {
          headerCellDiv = headerCellTextDiv;
        }
        headerCellDiv = headerCellDiv.dom;
      }
      return headerCellDiv;
    },


    /**
     * Returns the header that has a group Checkbox
     * @param lvId grid id
     * @param dataIndex field id (e.g. textField1)
     * @return html element
     */
    getHeaderChkboxCell : function(lvId, dataIndex) {
      var grid = getGrid(lvId, null, dataIndex);
      var colIndex = getColumnIndexByDataIndex(grid, dataIndex);
      var headerChkboxDiv = this.getHeaderCell(lvId, dataIndex).children[0];
      if (headerChkboxDiv.className === 'x-grid-checkcolumn') {
        return headerChkboxDiv;
      }
      return null;
    },

    isHeaderCellVisible : function(lvId, dataIndex) {
      // AHK - 5/22/2013 - getGrid seems to fail for row trees, but just Ext.ComponentManager.get() seems to work fine
      var grid = Ext.ComponentManager.get(lvId);
      if (!grid || !grid.view) {
        return false;
      }
      var colIndex = getColumnIndexByDataIndex(grid, dataIndex);
      var headerCellDiv = grid.view.headerCt.getGridColumns()[colIndex].titleEl;  //@SenchaEnhancement titleEl
      return headerCellDiv && !headerCellDiv.hidden
    },

    /**
     * @param lvId grid component id
     * @param dataIndex column id
     * @return the dom element for the check-all checkox in the column header, or null
     */
    getHeaderCheckbox: function(lvId, dataIndex) {
      var headerDom = this.getHeaderCell(lvId, dataIndex);
      if (headerDom != null) {
        return Ext.fly(headerDom).down('.x-grid-checkcolumn', /*returnDom*/true);
      }
      return null;
    },

    getColumnGroupMenuItemElem : function(lvId, dataIndex) {
      var menu = this.showColumnFilterMenu(lvId, dataIndex);
      return menu.down('#groupMenuItem').getEl().dom;
    },

    getClearGroupingMenuItemElem : function(lvId, dataIndex) {
      var menu = this.showColumnFilterMenu(lvId, dataIndex);
      return menu.down('#groupToggleMenuItem').getEl().dom;
    },

    isGroupingAvailable : function(lvId, dataIndex){
      var menu = this.showColumnFilterMenu(lvId, dataIndex),
        groupMenu = menu.down('#groupMenuItem'),
        groupToggleMenu = menu.down('#groupToggleMenuItem');

      if(groupMenu === null && groupToggleMenu === null){
        return false;
      }

      if(groupMenu && groupMenu.disabled){
        return false;
      }
      return true;
    },

    setColumnFilterValue : function(lvId, dataIndex, value) {
      var grid = getGrid(lvId, null, dataIndex);
      var filter = this.getColumnFilter(grid, dataIndex);

      if (filter) {
        if (value) { // set filter value
          var filterForValue = filter.menu.items.findBy(function(item) {return item.value == value;});
          if (filterForValue) {
            filterForValue.setChecked(true, false);
            filter.setValue(value);
          }

        } else { // clear filter
          filter.setActive(false);
        }
      }
    },

    getColumnFilter: function(grid, dataIndex) {
      // Instantiating the menu first in order to get all menu options.
      // Filter menu options are added dynamically
      this.showColumnFilterMenuByGrid(grid, dataIndex);

      var filter = grid.getColumnById(dataIndex).filter;

      this.hideAllMenus();
      return filter;
    },

    getColumnFilterValue : function(lvId, dataIndex) {
      var grid = getGrid(lvId, null, dataIndex);
      var filter = this.getColumnFilter(grid, dataIndex);

      var checkedItem = null;
      if (filter && filter.active) {
        checkedItem = filter.menu.items.findBy(function(item) {return item.checked;});
      }
      return checkedItem == null ? '' : checkedItem.value;
    },

    getColumnFilterOptionValues : function(lvId, dataIndex) {
      var grid = getGrid(lvId, null, dataIndex);
      var filter = this.getColumnFilter(grid, dataIndex);

      var values = ['']; // First is a fake blank option
      if (filter) {
        filter.menu.items.each(function(item) {
          values.push(item.value);
        });
      }
      return Ext.JSON.encode(values);
    },

    getColumnFilterOptionLabels : function(lvId, dataIndex) {
      var grid = getGrid(lvId, null, dataIndex);
      var filter = this.getColumnFilter(grid, dataIndex);

      var values = ['']; // First is a fake blank option
      if (filter) {
        filter.menu.items.each(function(item) {
          values.push(item.text);
        });
      }
      return Ext.JSON.encode(values);
    },

    showColumnFilterMenu : function(lvId, dataIndex) {
      var grid = getGrid(lvId, null, dataIndex);
      return this.showColumnFilterMenuByGrid(grid, dataIndex);
    },

    showColumnFilterMenuByGrid : function(grid, dataIndex) {
      // TODO @SenchaEnhancement: tpollinger: This is a bit tricky: This simulates a trigger menu click event by getting the div
      // DOM element that represents the header trigger drop down. This should be replaced by having Ext JS add
      // a programmatic method to show the menu. Calling showMenu or show on the menu did not work as it shows the
      // header's common menu.
      var colIdx = getColumnIndexByDataIndex(grid, dataIndex);
      var column = grid.view.headerCt.getHeaderAtIndex(colIdx); //@SenchaEnhancement headerCt
      var columnHeaderTriggerDiv = Ext.fly(column.getEl().id).down('.x-column-header-trigger'); //@SenchaEnhancement: remove css dependency, see above.
      var headerCt = grid.getView().getHeaderCt(); //@SenchaEnhancement getHeaderCt()
      headerCt.showMenuBy({pointerType: 'mouse'}, columnHeaderTriggerDiv, column);  //@SenchaEnhancement headercontainer.showMenuBy
      return headerCt.getMenu(); //@SenchaUpgrde getMenu
    },

    hideAllMenus: function() {
      Ext.menu.Manager.hideAll();
    },

    isColumnFilterEnabled : function(lvId, dataIndex) {
      var grid = getGrid(lvId, null, dataIndex);
      var filter = this.getColumnFilter(grid, dataIndex);
      return filter ? !filter.menu.disabled : false;
    },

    getColumnSortDir : function(lvId, dataIndex) {
      var grid = getGrid(lvId, null, dataIndex);
      var sorter = grid.getStore().sorters.findBy(function(item) {return item.getProperty()==dataIndex;});
      return sorter ? sorter.getDirection() : null;
    },

      isColumnGrouped : function(lvId, dataIndex) {
          var grid = getGrid(lvId, null, dataIndex);
          if (grid.getStore().getGrouper()) {
              return grid.getStore().getGrouper().getProperty() === dataIndex;
          }
          return false;
      },

    getColumnFooterElem : function (lvId, rowOffset, dataIndex) {
      // The footer rows group rows together that have the same row configuration
      // The row offset in these configurations identifies the parent row iterator
      // For standard (non column map grids), the row offset is ignored.
      var fqRowOffset = gw.GridUtil.getFQRowOffset(rowOffset);
      var footerDiv = null;
      var footerColumnId, rowOffSetGroup, grid, summaryFeature
        ,summaryData;

      fqRowOffset.offset = (fqRowOffset.offset ? fqRowOffset.offset + ":0" : "0");
      rowOffSetGroup = fqRowOffset.offset;
      if(fqRowOffset.index){
        rowOffSetGroup = fqRowOffset.offset + "#" + fqRowOffset.index;
      }

      grid = getGrid(lvId, rowOffSetGroup, null);
      summaryFeature = grid.getSummaryFeature();
      if (summaryFeature && summaryFeature.showSummaryRow) {
        summaryData = grid.store.getProxy().getReader().rawData.origSummaryData;
        if(summaryData) {
          Ext.Object.each(summaryData, function(groupingId, group) {
            Ext.Object.each(group, function(columnId, column) {
              if (column.gwCellId && column.gwCellId === dataIndex) {
                footerColumnId = columnId;
                return false; // stop the iteration
              }
            });

            if (footerColumnId) {
              return false; // stop the iteration
            }
          });
        }

        if(footerColumnId){
          // A grid can have more than one footer row. If this is a grouped grid,
          // get the cell element of the first data row in the row group. Find the
          // next footer row
          getFooterDiv = function(enclosingTable) {
            var footerDiv = null,
                columnIndex = getColumnIndexForColumnId(grid, footerColumnId);
            columnIndex -= getNumberOfInvisibleColumns(grid, columnIndex);
            // @UpgradedSencha 5.1 - rows that are wrappers aren't designated differently like they were in ExtJs4.x,
            // so now we have to look for a footer by looping through the next items until we find one.  This hopefully
            // will have the same effect as the code it replaced that worked with 4.x but could cause more dom searching
            while (enclosingTable) {
              footerDiv = enclosingTable.down('.x-grid-row-summary .x-grid-cell-first'); //TODO: Card 371: CSS dependency
              if (footerDiv) {
                break;
              }
              enclosingTable = enclosingTable.next('.x-grid-item'); //TODO: Card 371: CSS dependency
            }
            while (footerDiv && columnIndex > 0) {
              footerDiv = footerDiv.next();
              columnIndex--;
            }
            return footerDiv ? footerDiv.down('.x-grid-cell-inner') : null;
          };

          if (grid.getSummaryFeature().id === gw.SimpleGrid.SUMMARY_FEATURE_ID) {
            // This is a simple grid with only one footer
            footerDiv = getFooterDiv(Ext.get(grid.id));
          } else {
            // This is a grouping grid with several footers. Get the enclosing grouping grid.
            var dataIndexWithOutAutoSuffix = dataIndex.replace(/Footer$/,'');
            var cellEl = Test.getCellElem(lvId, rowOffSetGroup, dataIndexWithOutAutoSuffix);
            if (cellEl) {
              // @UpgradedSencha 5.1 - all rows are now tables (grid-items), so first we need to go up to
              // the containing table
              var gridGroup = cellEl.up('.x-grid-item'); // the row's table
              footerDiv = getFooterDiv(gridGroup);
            }
          }
        }
      }

      return footerDiv;
    },

    getColumnFooterAltElem : function(gridId, rowOffset, dataIndex) {
      var footerElem = this.getColumnFooterElem(gridId, rowOffset, dataIndex);
      return footerElem.down('.' + gw.Util.getAltValueClass(), true);
    },

    hasColumnFooterAltElem : function(gridId, rowOffset, dataIndex) {
      return this.getColumnFooterAltElem(gridId, rowOffset, dataIndex) != null;
    },

    /**
     * gets the footer cell value
     * @param gridId grid id
     * @param rowOffset offset of the nested rowIterator; null, if the footer is for the entire grid
     * @param dataIndex column id
     */
    getColumnFooterAltValue : function(gridId, rowOffset, dataIndex) {
      var altDiv = this.getColumnFooterAltElem(gridId, rowOffset, dataIndex);
      return altDiv ? getInnerText(altDiv) : '';
    },

    getColumnFooterAlignment : function(gridId, rowOffset, dataIndex){
      var footerElem = this.getColumnFooterElem(gridId, rowOffset, dataIndex);
      return footerElem.dom.style.textAlign;
    },

    /**
     * Check to see if the leafElement is embedded in the element
     *
     * @param element the HTMLElement
     * @param leafElement the leaf HTMLElement
     * @return true if it is a leaf element
     */
    isElementLeafOf: function(element, leafElement) {
      if (element == leafElement) {
        return true;
      }
      var tag = leafElement.localName;
      if (tag) {
        var children = element.getElementsByTagName(tag);
        for (var i = 0; i < children.length; i++) {
          if (children[i] == leafElement) {
            return true;
          }
        }
      }
      return false;
    },

    /**
     * True if this grid has a column footer for the given row offset row configuration and data index (column name)
     * @param gridId the data grid
     * @param rowOffset the row offset to get the row configuration or null if the whole grid has the same
     *        row configuration
     * @param dataIndex the column name/identifier
     */
    hasColumnFooter: function(gridId, rowOffset, dataIndex) {
      var footerElem = this.getColumnFooterElem(gridId, rowOffset, dataIndex);
      return footerElem != null;
    },

    /**
     * Get the footer cell value
     * @param gridId grid id
     * @param rowOffset offset of the nested rowIterator; null, if the footer is for the entire grid
     * @param dataIndex column id
     */
    getColumnFooter : function(gridId, rowOffset, dataIndex) {
      var footerElem = this.getColumnFooterElem(gridId, rowOffset, dataIndex);
      var footerText = getInnerText(footerElem.dom);
      return this.stripAltValueFromCellText(footerElem, footerText);
    },

    /**
     * Returns an array of messages encoded as a string
     * TODO: change to JSON encoding
     */
    getAllMessages : function() {
      var result = [];
      Ext.each(Ext.DomQuery.select('.message'), function(item) {
        result.push(getInnerText(item));
      });
      return result.length == 0 ? null : result.join('|');
    },

    /**
     * Gets messages for the given element
     */
    getMessages : function(e) {
      var result = [];
      Ext.ComponentManager.get(e.id/* + "_msgs"*/).getEl().select('*').each(function(elem){
        if (elem.hasCls('message') || elem.hasCls('messageSubheader')) {
          result.push(getInnerText(elem.dom));
        }
      });
      return result.length == 0 ? null : Ext.JSON.encode(result);
    },

    /**
     * @param e HTML element
     * @param compId ExtJs component id
     */
    isClickable:function (e, compId) {

      if (compId) {
        this.showMenuItem(compId); // make sure the targeted menu item is rendered
      }

      var comp = compId ? Ext.ComponentManager.get(compId) : Ext.ComponentManager.get(e.name || e.id);

      function isStyleColorBlue(styleColor) {
        return styleColor == 'rgb(0, 103, 172)' || styleColor == '#0067ac';
      }

      if (comp) { // check the ExtJs component, if any
        if (comp instanceof Ext.form.DisplayField) {
          return comp.getEl().hasCls(gw.app.getEventSourceCls());
        }

        if (comp instanceof gw.ext.Link && comp.getEl().dom.tagName == 'SPAN') {
          return false; // a disabled link renders as SPAN
        }

        if (comp instanceof Ext.tab.Tab && comp.active) {
          return false; // active tab has no action on click
        }

        if (comp instanceof gw.MenuItem) {
          return !isMenuParentsDisabled(comp);
        }

        return !comp.disabled;

      } else {
        if (e) { // check the HTML element
          // left nav:
          if (Ext.fly(e).hasCls('g-accordion-item') && !Ext.fly(e).hasCls('g-disabled')) {
            return true;
          }

          //TODO: Card 372: Refactor CSS dependency
          return !e.disabled &&
            (e.tagName == 'INPUT' || e.tagName == 'TEXTAREA' || e.tagName == 'SELECT' || e.href != null || e.onclick != null ||
              Ext.fly(e).hasCls('x-btn') ||
              Ext.fly(e).hasCls('x-menu-item') ||
              Ext.fly(e).hasCls('x-form-trigger') ||
              isStyleColorBlue(Ext.fly(e).getStyle('color')) || //clickable links are in blue
              Ext.fly(e).up('.g-helper-cell-icon', 1) != null || //link or button in cell
              Ext.fly(e).hasCls('x-grid-checkcolumn') || Ext.fly(e).hasCls('x-grid-checkcolumn-checked') || // cell-level checkbox
              //TODO: ExtJs upgrade4: check if a tree node is disabled
              Ext.fly(e).hasCls('x-grid-item') && Ext.fly(e).up('.x-tree-panel', 6) != null /*&& !Ext.fly(e).hasCls('x-tree-node-disabled')*/ || // tree node
              Ext.fly(e).hasCls('x-tree-col') || // tree column
              Ext.fly(e).hasCls('x-grid-cell-inner') && Ext.fly(e).first() != null && isStyleColorBlue(Ext.fly(e).first().getStyle('color')) // tree grid column
              );
        } else {
          // TODO Code review: E:PLReady:Web: We should throw an exception that this is a non recognized component.
          // Run the test and see how many tests will fail, thus we can complete the list if something is missing.
          // throw exception?
        }

        return false;
      }
    },

    isEditable: function(e) {
      if (Ext.isString(e)) {
        e = document.getElementById(e);
      }

      var comp = Ext.ComponentManager.get(e.name || e.id);
      if (comp instanceof Ext.form.DisplayField) {
        return false;
      } else if (comp instanceof Ext.form.TextArea) {
        return !comp.disabled && !comp.readOnly;
      } else if (comp instanceof Ext.form.Field ||
        comp instanceof Ext.form.CheckboxGroup ||
        comp instanceof Ext.ux.form.MultiSelect ||
        comp instanceof gw.ext.JapaneseImperialDate) {
        return true;
      }

      // TODO tpollinger: isEditable should be true whether the control is disabled/read-only or not
      return !e.disabled && !e.readOnly &&
        (e.tagName == 'INPUT' || e.tagName == 'TEXTAREA' || e.tagName == 'SELECT');
    },

    getLabel : function(id) {
      var comp = Ext.ComponentManager.get(id);
      if (comp) {
        if (comp.label) {
          if (Ext.isString(comp.label)) {
            return comp.label;
          } else {
            return comp.label.dom.innerHTML;  //@SenchaUpgrade when does this happen?
          }
        }
        if (comp.fieldLabel) {
          return comp.fieldLabel;
        }
      }
      return null;
    },

    getCellLabel : function(lvId, rowOffset, dataIndex) {
      var grid = getGrid(lvId, rowOffset, dataIndex);
      var accord = getGridCoordinate(grid, rowOffset, dataIndex);
      var rowIndex = accord[0], colIndex = accord[1];//, dvItem = accord[2];
      var column = grid.headerCt.getGridColumns()[colIndex];  //@SenchaEnhancement headerCt
      return column.text;
    },

    getOptionCountInSelect : function(id) {
      var comp = Ext.ComponentManager.get(id);
      var count = 0;
      if (comp.store) { // single or multi select
        // TODO Checked that this is working in Ext JS 4.1.1. Replace below by following once TH is stable:
        //count = comp.getStore().getCount();
        count = comp.store.getCount(); //@SenchaUpgrade change to getStore(), if the bug with ComboBox.getStore() is fixed
      }
      return count;
    },

    getCellOptionCountInSelect : function(lvId, rowOffset, dataIndex) {
      var store = Test.getCellOptionStore(lvId, rowOffset, dataIndex);
      var count = 0;
      if (store) {
        if (store.getCount) {
          count = store.getCount();
        } else {
          count = store.length;
        }
      }
      return count;
    },

    /** Gets all option values in the specified range widget (select, checkbox group or radio group)
     *
     * @param element the range widget
     * @return string[] an array of all option values in the specified select drop-down
     */
    getOptionValuesInSelect:function (element) {
      var selectOptions = getOptionsInSelect(element);
      var values = [];
      for (var i = 0; i < selectOptions.length; i++) {
        values.push((selectOptions[i].inputValue || selectOptions[i].value).replace(/,/g, "\\,"));
      }
      return Ext.JSON.encode(values);
    },

    /** Gets all option labels in the specified range widget (select, checkbox group or radio group)
     *
     * @param element the range widget
     * @return string[] an array of all option labels in the specified select drop-down
     */
    getOptionLabelsInSelect:function (element) {
      var selectOptions = getOptionsInSelect(element);
      var values = [];
      for (var i = 0; i < selectOptions.length; i++) {
        values.push(getOptionLabel(selectOptions[i]).replace(/,/g, "\\,").replace(/\n/g, ''));
      }
      return values.join(",");
    },

    /**
     * Get all option innerHTML in the specified range widget (Only applicable to select drop-down)
     * @param element the select widget
     * @return {String} an array of all option innerHTML in the specified select drop-down
     */
    getOptionHTMLTextInSelect:function (element) {
      var options = [];
      var elementId = Ext.isString(element) ? element : (element.name || element.id);
      var comp = Ext.ComponentManager.get(elementId);
      var optionListTagName = (comp.xtype == "autocomplete") ? 'div' : 'ul';
      if (comp) {
        if (!comp.getPicker().rendered) {
          // calling expand to render the picker
          comp.expand();
          comp.collapse();
        }
        var pickerId = comp.getPicker().id;
        if (pickerId) {
          var e = window.document.getElementById(pickerId);
          if (e) {
            var selectOptions = e.getElementsByTagName(optionListTagName)[0].childNodes;
            for (var i = 0; i < selectOptions.length; i++) {
              options.push(selectOptions[i].innerHTML.replace(/,/g, "\\,").replace(/\n/g, ''));
            }
            return Ext.JSON.encode(options);
          }
        }
      }
      return null;
    },

    /**
     * Gets all option groups in the specified range widget (select drop-down)
     * @param element the range widget
     * @return {String} an array of all option groups in the specified select drop-down
     */
    getOptionGroupsInSelect:function (element) {
      var selectOptions = getOptionsInSelect(element);
      var groups = [];
      for (var i = 0; i < selectOptions.length; i++) {
        groups.push((selectOptions[i].group).replace(/,/g, "\\,"));
      }
      return Ext.JSON.encode(groups);
    },

    /** Gets all option labels in the Shuttle widget
     *
     * @param element the range widget
     * @param dir the location of the select (from or to)
     * @return string[] an array of all option labels in the specified select drop-down
     */
    getOptionLabelsInShuttle:function (element, dir) {
      var selectOptions = getShuttleOptionLabel(element, dir);
      var values = [];
      for (var i = 0; i < selectOptions.length; i++) {
        values.push((selectOptions[i].label).replace(/,/g, "\\,").replace(/\n/g, ''));
      }
      return Ext.JSON.encode(values);
    },

    addShuttleSelection:function (element, value, dir) {
      var comp = Ext.ComponentManager.get(element);
      var list;

      if (dir.toUpperCase() == 'FROM') {
        list = comp.fromField.boundList; //@SenchaEnhancement no-public ux property
        comp = comp.fromField; //@SenchaEnhancement no-public ux property
      } else {
        list = comp.toField.boundList; //@SenchaEnhancement no-public ux property
        comp = comp.toField;  //@SenchaEnhancement no-public ux property
      }

      var index = -1;
      index = list.getStore().find(comp.displayField, value);
      list.getSelectionModel().select(index, true, true);
    },

    clickShuttleButton:function (element, action) {
      var comp = Ext.ComponentManager.get(element);
      action = action.toLowerCase();
      if (comp instanceof Ext.ux.form.ItemSelector) {
        switch (action) {
          case 'add':
            comp.onAddBtnClick();  //@SenchaEnhancement no-public ux property
            break;
          case 'remove':
            comp.onRemoveBtnClick(); //@SenchaEnhancement no-public ux property
            break;
          case 'top':
            comp.onTopBtnClick(); //@SenchaEnhancement no-public ux property
            break;
          case 'bottom':
            comp.onBottomBtnClick(); //@SenchaEnhancement no-public ux property
            break;
          case 'up':
            comp.onUpBtnClick(); //@SenchaEnhancement no-public ux property
            break;
          case 'down':
            comp.onDownBtnClick(); //@SenchaEnhancement no-public ux property
            break;
          default:
            break;
        }
      }
    },

    /**
     * @return an array of unexpected exceptions on page, or null
     */
    getExceptionsOnPage : function() {
      if (window.errors && window.errors.length > 0) {
        return window.errors;
      }

      var errorNodes = Ext.DomQuery.select('.error_details');
      if (errorNodes != null && errorNodes.length > 0) {
        return Ext.Array.map(errorNodes, function(div) {return div.innerHTML;});
      }

      return null;
    },

    /**
     * Returns the current page name
     */
    getPageName:function () {
      return Ext.ComponentManager.get('centerPanel').items.get(0).id;
    },

    /**
     * Returns the current worksheet name
     * @return empty string, if there's no worksheet
     */
    getWsName:function () {
      var ws = Ext.ComponentManager.get('southPanel');
      var activeTab = ws.items.getCount() > 0 ? ws.getActiveTab() : null;
      return activeTab ? activeTab.items.get(0).id : '';
    },

    isTreeNodeExist : function(treeId, nodeId) {
      var tree = Ext.ComponentManager.get(treeId);
      if (tree == null) {
        return false;
      }
      return tree.getStore().getNodeById(nodeId) != null;
    },

    isTreeNodeVisible : function(treeId, nodeId) {
      if (this.isTreeNodeExist(treeId, nodeId)) {
        var tree = Ext.ComponentManager.get(treeId);
        return tree.getStore().getNodeById(nodeId).isVisible();
      }
      return false;
    },

    isTreeNodeEnabled : function(treeId, nodeId) {
      var tree = Ext.ComponentManager.get(treeId);
      var node = tree.getStore().getNodeById(nodeId);
      return !node.get('disabled');
    },

    getTreeNodeText : function(treeId, nodeId) {
      var tree = Ext.ComponentManager.get(treeId);
      var node = tree.getStore().getNodeById(nodeId);
      return node.get(tree.displayField);
    },

    /**
     * Returns attribute value of a tree node
     * @param treeId tree id
     * @param nodeId tree node id
     * @param attr attribute
     */
    getTreeNodeAttribute : function(treeId, nodeId, attr) {
      var tree = Ext.ComponentManager.get(treeId);
      var node = tree.getStore().getNodeById(nodeId);
      var value = node.get(attr);
      return value ? value : '';
    },

    getTreeNodeFieldValue : function(treeId, nodeId, field, property) {
      var value = this.getTreeNodeAttribute(treeId, nodeId, field);
      if (Ext.isObject(value)) {
        return value[property];
      }
      return null;
    },

    isTreeNodeFolder : function(treeId, nodeId) {
      var tree = Ext.ComponentManager.get(treeId);
      var node = tree.getStore().getNodeById(nodeId);
      return !node.isLeaf();
    },

    getNumChildTreeNodes : function(treeId, nodeId) {
      var tree = Ext.ComponentManager.get(treeId);
      var node = tree.getStore().getNodeById(nodeId);
      return node.isExpanded() ? node.childNodes.length : 0;
    },

    isTreeFolderOpen : function(treeId, nodeId) {
      var tree = Ext.ComponentManager.get(treeId);
      var node = tree.getStore().getNodeById(nodeId);
      return node.isExpanded();
    },

    isTreeLeaf : function(treeId, nodeId) {
      var tree = Ext.ComponentManager.get(treeId);
      var node = tree.getStore().getNodeById(nodeId);
      return node.isLeaf();
    },

    toggleTreeNode : function(treeId, nodeId) {
      var tree = Ext.ComponentManager.get(treeId);
      var node = tree.getStore().getNodeById(nodeId);
      if (node.isExpanded()) {
        node.collapse(/*recursive*/false);
      } else {
        _waitingForAsync = true; // set a flag to wait for the completion of an async operation
        tree.addListener('afteritemexpand', function() {
          _waitingForAsync = false; // clear the flag
        }, this, {single:true});
        node.expand(/*recursive*/false);
      }
    },

    isWaitingForAsync : function() {
      return _waitingForAsync;
    },

    /**
     * Returns the html element that can be clicked to select the tree node
     * @param treeId tree id
     * @param nodeId node id
     */
    getTreeNodeElem : function(treeId, nodeId) {
      var tree = Ext.ComponentManager.get(treeId);
      var node = tree.getStore().getNodeById(nodeId);
      return tree.getView().getNode(node);
    },

    getTreeColumnText : function (treeId, nodeId, columnId) {
      var elem = Test.getTreeColumnElem(treeId, nodeId, columnId);
      return getInnerText(elem);
    },

    isTreeColumnVisible : function(treeId, nodeId, columnId) {
      var elem = Test.getTreeColumnElem(treeId, nodeId, columnId);
      return elem != null && Ext.fly(elem).isVisible(/*deep*/true);
    },

    getTreeColumnElem : function(treeId, nodeId, columnId) {
      var tree = Ext.ComponentManager.get(treeId);
      var colIndex = -1;
      if (columnId == 'containerLabel' || // special container label column
        columnId == '_Checkbox') { // row checkbox
        colIndex = 0;
      } else {
        for (var i = 0; i < tree.columns.length; i++) {
          if (tree.columns[i].dataIndex == columnId) {
            colIndex = i;
            break;
          }
        }
      }
      var node = tree.getStore().getNodeById(nodeId);
      var nodeElem = tree.getView().getNode(node);
      var colElem = null;
      if (nodeElem) {
        colElem = Ext.fly(nodeElem).query('.x-grid-cell-inner')[colIndex]; //@SenchaUpgrade CSS dependency
        if (columnId == '_Checkbox') {
          return Ext.fly(colElem).down('.x-tree-checkbox', true); //@SenchaUpgrade CSS dependency
        }
      }
      return colElem;
    },

    isTreeNodeSelected : function(treeId, nodeId) {
      var tree = Ext.ComponentManager.get(treeId);
      var node = tree.getStore().getNodeById(nodeId);
      return tree.getSelectionModel().isSelected(node);
    },

    selectTreeNode : function(treeId, nodeId) {
      var tree = Ext.ComponentManager.get(treeId);
      var node = tree.getStore().getNodeById(nodeId);
      tree.getSelectionModel().select(node, /*keepExisting*/true);
    },

    /**
     * Given a menu item or menu id, get the opener id that opens the floating menu
     * @param id the menu item id or menu id for the owning floating menu
     * @return the menu opener id or null if none
     */
    getMenuOpenerId: function(id) {
      var openerId = null;
      var menu = Ext.ComponentManager.get(id);
      if (menu && menu.ownerCt && menu.ownerCt instanceof Ext.menu.Menu && menu.ownerCt.openerId) {
        openerId = menu.ownerCt.openerId;
      }
      return openerId;
    },

    /**
     * If the menu item with the given id has not been rendered,
     * open the menu so that the it becomes available on the UI.
     * @param id widget id
     */
    showMenuItem : function(id) {
      var comp = Ext.ComponentManager.get(id);
      if (comp && !comp.rendered && comp.ownerCt instanceof Ext.menu.Menu) {
        if (comp.ownerCt.openerId) {
          comp.ownerCt.show(Ext.fly(comp.ownerCt.openerId)); // just show it
          return;
        }
        var nodes = id.split(':');
        var ancestors = [];
        while (nodes.length > 0) {
          nodes.pop();
          var parent = Ext.ComponentManager.get(nodes.join(':'));
          if (parent) {
            ancestors.push(parent);
            if (parent.rendered) {
              break;
            }
          }
        }
        for (var i = ancestors.length - 1; i >= 0; i--) {
          Test.openMenu(ancestors[i]);
        }
      }
    },

    /**
     * Opens menu of the given component
     * @param comp component or component id
     */
    openMenu : function(comp) {
      if (Ext.isString(comp)) {
        comp = Ext.ComponentManager.get(comp);
      }
      if (comp) {
        if (comp.showMenu) {
          if (!comp.hasVisibleMenu || !comp.hasVisibleMenu()) {
            comp.showMenu(); // button menu
          }
        } else if (comp.menu) { // for MenuItemTree, a leaf item doesn't have sub-menu
          if (comp.expandMenu) {
            comp.onFocus(); // @SenchaUpgrade non-public
            comp.expandMenu({pointerType: 'mouse'}, 0); // @SenchaUpgrade non-public
          }
        } else if (comp.plugins && comp.getPlugin('helper')) {
          comp.getPlugin('helper').showMenu.call(comp);
        }
      }
    },

    getValue : function(e) {
      var id = Ext.isString(e) ? e : e.name || e.id;
      var comp = Ext.ComponentManager.get(id);
      var value = '';

      if (comp) {
        if (comp.editValue != null) { // TODO: rename to gEditValue
          value = comp.editValue;
        } else if (comp.getValue && comp.xtype !== 'gmenuitem') { // an EXT component with value
          value = gw.Util.getFieldValue(comp);
        } else {
          // An Ext JS component without value.
          if (comp.getEl() && comp.getEl().dom) {
            // Get the Ext JS component's rendered dom. Get its inner text
            value = getInnerText(comp.getEl().dom);
          } else {
            // This could be already a DOM component. Get its inner text
            value = getInnerText(e);
          }
        }
      } else { // the element does not have a corresponding component
        if (Ext.fly(e).hasCls('x-form-checkbox')) { //@SenchaUpgrade a safe way to check bor checkbox type?
          var parent = Ext.ComponentManager.get(id.replace(/:[^:]+$/, ''));
          if (parent instanceof Ext.form.FieldSet) { // input group
            if (parent.checkboxCmp.checked) {
              value = true;
            }
          }
        } else {
          value = Ext.util.Format.trim(getInnerText(e));
        }
      }
      return value;
    },

    getText : function(e, eId) {
      if (eId) {
        Test.showMenuItem(eId);
      } else if (Ext.isString(e)) {
        // e ist the locator string id
        eId = e;
        e = null;
      }

      var comp;
      if (eId){
        comp = Ext.ComponentManager.get(eId);
      }
      // AHK - 4-25-2013 - If lookup on eId failed and e is a real element, we want to try again using the element's id
      if (!comp && e) {
        comp = Ext.ComponentManager.get(e.name || e.id);
      }
      if (comp) {
        if (comp.inputEl) {
          e = comp.inputEl.dom;// ExtJs4: get the contained input element, if any
        } else if (!e && comp.getEl()) {
          e = comp.getEl().dom;
        }
        if (comp instanceof Ext.ux.form.MultiSelect) {
          return getDisplayValuesForMultiSelect(comp);
        } else if (comp.toMultiselect) { // @SenchaEnhancement non-public property - shuttle
          return getDisplayValuesForMultiSelect(comp.toMultiselect, /*bIncludeNonSelected*/true);
        } else if (comp instanceof Ext.form.ComboBox || comp instanceof gw.ext.ReadonlySelect) {
          return comp.getRawValue();
        } else if (comp instanceof Ext.form.RadioGroup) {
          var radio = comp.getChecked();
          return (radio && radio.length == 1) ? getInnerText(radio[0].boxLabelEl.dom) : '';
        } else if (comp instanceof Ext.form.CheckboxGroup) {
          var arr = [];
          Ext.each(comp.getChecked(), function(cb) {
            arr.push(getInnerText(cb.boxLabelEl.dom));
          });
          return arr;
        } else if (comp instanceof Ext.form.DisplayField) {
          if (e) {
            return getInnerText(e);
          } else {
            // AHK - 2/1/2003 - If there's no element, treat it as the empty string.  Note that we don't
            // want to return null, since that ends up returned as the String 'null' by Selenium
            return '';
          }
        } else if (comp.getText) {
          return Ext.util.Format.stripTags(comp.getText());
        }
      }

      return Test.getValue(e);
    },

    // TODO: fix badly named method:
    getAltText: function(element){
      return getInnerText(element);
    },

    getCellIcon : function(gridId, rowOffset, dataIndex) {
      var cellElem = Test.getCellElem(gridId, rowOffset, dataIndex);
      return Test.getIcon(cellElem.dom);
    },

    /**
     * Gets the icon for an HTML element
     * Returns null if not found
     * @param e html element
     */
    getIcon : function (e) {
      if (e.tagName != "IMG") {
        var children = e.childNodes;
        for (var i = 0; i < children.length; i++) {
          var icon = Test.getIcon(children[i]);
          if (icon != null) {
            return icon;
          }
        }
        return null;
      } else {
        var src = e.src;
        var visible = (e.style.visibility !== "hidden");
        var lastSlash = src.lastIndexOf("/");
        if (lastSlash > -1 && visible) {
          src = src.substring(lastSlash + 1);
        }else{
          src = null;
        }
        return src;
      }
    },

    /**
     * Get value(s) that can be used to set field value, from option label(s)
     * @param e element
     * @param label option label(s)
     */
    getOptionValueFromLabel : function(e, label) {
      var comp = Ext.ComponentManager.get(e.name || e.id);
      var value = null;
      if (comp.findRecord) {// combo
        value = comp.findRecord(comp.displayField, label).get(comp.valueField);
      } else if (comp.toField) { //  @SenchaEnhancement non-public - shuttle
        value = [];
        collectValuesFromLabels(comp.fromField, label, value); // @SenchaEnhancement non-public
        collectValuesFromLabels(comp.toField, label, value); //  @SenchaEnhancement non-public
      } else if (comp.store) {// multi-select
        value = [];
        collectValuesFromLabels(comp, label, value);
      } else if (comp instanceof Ext.form.RadioGroup) {
        comp.items.each(function(item){
          if (getInnerText(item.boxLabelEl.dom) == label) {
            value = item.inputValue;
            return false; // break the loop
          }
        });
      }
      return value;
    },

    /**
     * Remove value(s) that can be used to set field value, from option label(s)
     * @param e element
     * @param label option label(s)
     */
    removeOptionValueFromLabel : function(e, label) {
      var comp = Ext.ComponentManager.get(e.name || e.id);
      var value = null;
      if (comp.toMultiselect) { // shuttle
        value = [];
        removeValuesFromLabels(comp.fromMultiselect, label, value); // @SenchaEnhancement non-public
        removeValuesFromLabels(comp.toMultiselect, label, value); // @SenchaEnhancement non-public
      } else if (comp.store) { // multi-select
        value = [];
        removeValuesFromLabels(comp, label, value);
      }
      return value;
    },


    /**
     * Add value(s) that can be used to set field value, from option label(s)
     * @param e element
     * @param label option label(s)
     * @param dir location of the list box to add
     */
    addOptionValueFromLabel : function(e, label, dir) {
      var comp = Ext.ComponentManager.get(e.name || e.id);
      var value = null;
      if (comp.toField) { // shuttle
        value = [];
        comp = dir.toUpperCase() == 'TO' ? comp.toField : comp.fromField; // @SenchaEnhancement non-public
        addValuesFromLabels(comp, label, value);
      } else if (comp.store) {// multi-select
        value = [];
        addValuesFromLabels(comp, label, value);
      }
      return value;
    },
    /**
     * Sets field value and fire change event if value changed
     * @param e dom element
     * @return true, if value changed; error msg if exception occurred
     */
    setValue : function(e, value) {
      //FF20 work around with value being sometimes passed in as Proxy; this should turn it back into the target object
      //value could be a string or an array or proxy for an array
      value = value.slice(0);

      var id = Ext.isString(e) ? e : e.name || e.id;
      var comp = Ext.ComponentManager.get(id);

      if (!Test.isEditable(e)) {
        return 'Attempted to change value of readonly element: ' + id;
      }

      var oldValue = this.getValue(e);

      if (comp) {
        setCompValue(comp, value);
        // the element does not have a corresponding component
      } else if (e.type == 'checkbox' || Ext.fly(e).hasCls('x-form-checkbox')) { //@SenchaUpgrade a safe way to check bor checkbox type?
        var parent = Ext.ComponentManager.get(id.replace(/:[^:]+$/, ''));
        if (parent instanceof Ext.form.FieldSet) { // input-group
          var checked = (value == parent.checkboxCmp.inputValue);
          if (checked != parent.checkboxCmp.checked) {
            parent.toggle();
            return true;
          }
          return false;
        }
      }

      return oldValue != this.getValue(e);
    },

    getPagingElem : function(pagingId, value) {
      return Ext.DomQuery.select('a[@eventid="' + pagingId + '"][@eventparam="' + value + '"]')[0];
    },

    isUseJapaneseImperial : function(compId) {
      var comp = Ext.ComponentManager.get(compId);
      if (comp instanceof Ext.form.DisplayField) { // read mode
        return comp.isJpImperial;
      } else { // edit mode
        return comp != null && !(comp instanceof Ext.form.DateField);
      }
    },

    getAutoCompleteDelay: function(compId) {
      var comp = Ext.ComponentManager.get(compId);
      return comp.queryDelay + (comp.typeAhead ? comp.typeAheadDelay : 0);
    },

    getSelectionRange:function (e) {
      var caret = new Object();
      if (document.selection) {  //IE
        var sel = document.selection.createRange();
        var dup = sel.duplicate();
        dup.expand('textedit');
        dup.setEndPoint('EndToEnd', sel);
        caret.start = dup.text.length - sel.text.length;
        caret.end = caret.start + sel.text.length;
      } else if (e.selectionStart || e.selectionStart == '0') {  //Firefox
        caret.start = e.selectionStart;
        caret.end = e.selectionEnd;
      }
      return caret;
    },

    /**
     * Returns the cell tooltip
     * @param lvId grid id
     * @param dataIndex field id (e.g. textField1)
     * @return html element
     */
    getCellTooltip : function(lvId, dataIndex) {
      var grid = getGrid(lvId, null, dataIndex);
      var colIndex = getColumnIndexByDataIndex(grid, dataIndex);
      return grid.view.headerCt.getGridColumns()[colIndex].tooltip;
    }
  };
}();

// @UpgradedSencha 5.1 - A recent bug fix added a 250ms delay on the buttons, but this delay breaks the tests, so
// we want to disable it in the test suite.
Ext.define('Test.override.button.Button', {
  override: 'Ext.button.Button',
  defaultMenuClickBuffer: 0
});

// @UpgradedSencha 5.1 - There is some weird race condition that is causing simple combobox to be completing its edit
// while it is being destroyed, so skip this step if it is since the underlying store seems to be in a bad state.  We
// do, however, want to cancel the query task in case it is has a delayed start.
Ext.define('Test.override.ext.SimpleCombo', {
  override: 'gw.ext.SimpleCombo',
  completeEdit: function(e) {
    var me = this;
    if (!me.destroying && !me.isDestroyed) {
      me.callParent(arguments);
    } else {
      me.doQueryTask.cancel();
    }
  }
});

// @UpgradedSencha 5.1 - for some reason the test framework causes the closing of menus when the focus
// is being sent to a child within the menu, so if a menu item is given focus, make sure that it and all of its
// parent menus are actually visible.
Ext.define('TestExt.override.menu.Item', {
  override: 'Ext.menu.Item',
  onFocus: function(e) {
    var me = this,
        menu = me.parentMenu;
    if (!me.isVisible()) {
      me.show();
    }
    while (menu) {
      if (!menu.isVisible()){
        menu.show();
      }
      menu = menu.parentMenu;
    }
    this.callParent(arguments);
  }
});

Ext.define('TestExt.override.ComponentManager', {
  override: 'Ext.ComponentManager',
  onGlobalFocus: function(e) {
    var me = this,
      toElement = e.toElement,
      fromElement = e.fromElement,
      toComponent = me.byElement(toElement),
      fromComponent = me.byElement(fromElement),
      commonAncestor = me.getCommonAncestor(fromComponent, toComponent),
      event,
      targetComponent;


// @UpgradedSencha 5.1 - for some reason the test framework can get into a state where the fromComponent is NOT
// destroyed but the body elements are gone; hence adding an extra check for getFocusEl
//      if (fromComponent && !fromComponent.isDestroyed) {
    if (fromComponent && !fromComponent.isDestroyed && fromComponent.getFocusEl()) {
      // Call the Blurred Component's blur event handler directly with a synthesized blur event.
      if (fromComponent.focusable && fromElement === fromComponent.getFocusEl().dom) {
        event = new Ext.event.Event(e.event);
        event.type = 'blur';
        event.target = fromElement;
        event.relatedTarget = toElement;
        fromComponent.onBlur(event);
      }

      // Call onFocusLeave on the component axis from which focus is exiting
      for (targetComponent = fromComponent; targetComponent && targetComponent !== commonAncestor; targetComponent = targetComponent.getRefOwner()) {
        targetComponent.onFocusLeave({
          event: e.event,
          type: 'focusleave',
          target: fromElement,
          relatedTarget: toElement,
          fromComponent: fromComponent,
          toComponent: toComponent
        });
      }
    }
    if (toComponent && !toComponent.isDestroyed) {
      // Call the Focused Component's focus event handler directly with a synthesized focus event.
      if (toComponent.focusable && toElement === toComponent.getFocusEl().dom) {
        event = new Ext.event.Event(e.event);
        event.type = 'focus';
        event.relatedTarget = fromElement;
        event.target = toElement;
        toComponent.onFocus(event);
      }

      // Call onFocusEnter on the component axis to which focus is entering
      for (targetComponent = toComponent; targetComponent && targetComponent !== commonAncestor; targetComponent = targetComponent.getRefOwner()) {
        targetComponent.onFocusEnter({
          event: e.event,
          type: 'focusenter',
          relatedTarget: fromElement,
          target: toElement,
          fromComponent: fromComponent,
          toComponent: toComponent
        });
      }
    }
  }});
