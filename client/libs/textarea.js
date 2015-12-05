;(function() {
  var applyChange;

  applyChange = function(doc, oldval, newval) {
    var commonEnd, commonStart;

    if (oldval === newval) {
      return;
    }
    commonStart = 0;
    while (oldval.charAt(commonStart) === newval.charAt(commonStart)) {
      commonStart++;
    }
    commonEnd = 0;
    while (oldval.charAt(oldval.length - 1 - commonEnd) === newval.charAt(newval.length - 1 - commonEnd) && commonEnd + commonStart < oldval.length && commonEnd + commonStart < newval.length) {
      commonEnd++;
    }
    if (oldval.length !== commonStart + commonEnd) {
      doc.del(commonStart, oldval.length - commonStart - commonEnd);
    }
    if (newval.length !== commonStart + commonEnd) {
      return doc.insert(commonStart, newval.slice(commonStart, newval.length - commonEnd));
    }
  };

  window.sharejs.extendDoc('attach_textarea', function(elem) {
    var delete_listener, doc, event, genOp, insert_listener, prevvalue, replaceText, _i, _len, _ref,
      _this = this;

    doc = this;
    elem.value = this.getText();
    prevvalue = elem.value;
    replaceText = function(newText, transformCursor) {
      var newSelection, scrollTop;

      newSelection = [transformCursor(elem.selectionStart), transformCursor(elem.selectionEnd)];
      scrollTop = elem.scrollTop;
      elem.value = newText;
      if (elem.scrollTop !== scrollTop) {
        elem.scrollTop = scrollTop;
      }
      if (window.document.activeElement === elem) {
        return elem.selectionStart = newSelection[0], elem.selectionEnd = newSelection[1], newSelection;
      }
    };
    this.on('insert', insert_listener = function(pos, text) {
      var transformCursor;

      transformCursor = function(cursor) {
        if (pos < cursor) {
          return cursor + text.length;
        } else {
          return cursor;
        }
      };
      prevvalue = elem.value.replace(/\r\n/g, '\n');
      return replaceText(prevvalue.slice(0, pos) + text + prevvalue.slice(pos), transformCursor);
    });
    this.on('delete', delete_listener = function(pos, text) {
      var transformCursor;

      transformCursor = function(cursor) {
        if (pos < cursor) {
          return cursor - Math.min(text.length, cursor - pos);
        } else {
          return cursor;
        }
      };
      prevvalue = elem.value.replace(/\r\n/g, '\n');
      return replaceText(prevvalue.slice(0, pos) + prevvalue.slice(pos + text.length), transformCursor);
    });
    genOp = function(event) {
      var onNextTick;

      onNextTick = function(fn) {
        return setTimeout(fn, 0);
      };
      return onNextTick(function() {
        if (elem.value !== prevvalue) {
          prevvalue = elem.value;
          return applyChange(doc, doc.getText(), elem.value.replace(/\r\n/g, '\n'));
        }
      });
    };
    _ref = ['textInput', 'keydown', 'keyup', 'select', 'cut', 'paste'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      event = _ref[_i];
      if (elem.addEventListener) {
        elem.addEventListener(event, genOp, false);
      } else {
        elem.attachEvent('on' + event, genOp);
      }
    }
    return elem.detach_share = function() {
      var _j, _len1, _ref1, _results;

      _this.removeListener('insert', insert_listener);
      _this.removeListener('delete', delete_listener);
      _ref1 = ['textInput', 'keydown', 'keyup', 'select', 'cut', 'paste'];
      _results = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        event = _ref1[_j];
        if (elem.removeEventListener) {
          _results.push(elem.removeEventListener(event, genOp, false));
        } else {
          _results.push(elem.detachEvent('on' + event, genOp));
        }
      }
      return _results;
    };
  });

}).call(this);
