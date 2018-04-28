goog.require('goog.date.Date');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.i18n.DateTimeSymbols_ar_YE');
goog.require('goog.i18n.DateTimeSymbols_de');
goog.require('goog.i18n.DateTimeSymbols_en_ISO');
goog.require('goog.i18n.DateTimeSymbols_ja');
goog.require('goog.i18n.DateTimeSymbols_ml');
goog.require('goog.i18n.DateTimeSymbols_th');
goog.require('goog.ui.DatePicker');
goog.require('goog.ui.DatePicker.Events');
goog.require('plaintext.View');

function startup1() {
  // Standard: ISO 8601
  var dp_iso_8601 = new goog.ui.DatePicker(undefined, goog.i18n.DateTimeSymbols_en_ISO);
  dp_iso_8601.render(document.getElementById('widget_iso_8601'));

  goog.events.listen(dp_iso_8601, goog.ui.DatePicker.Events.CHANGE, function(event) {
    goog.dom.setTextContent(document.getElementById('label_iso_8601'), event.date ? event.date.toIsoString(true) :
      'none');
  });

  goog.dom.setTextContent(document.getElementById('label_iso_8601'), dp_iso_8601.getDate().toIsoString(true));

  // Custom
  var dp_custom = new goog.ui.DatePicker(new goog.date.Date(2006, 0, 1));
  dp_custom.render(document.getElementById('widget_custom'));

  goog.events.listen(dp_custom, goog.ui.DatePicker.Events.CHANGE, function(event) {
    goog.dom
      .setTextContent(document.getElementById('label_custom'), event.date ? event.date.toIsoString(true) : 'none');
  });

  goog.dom.setTextContent(document.getElementById('label_custom'), dp_custom.getDate().toIsoString(true));

  var view = plaintext.View.getInstance();
  // English (US)
  var dp_en_US = view.getComponent(goog.dom.getElementByClass('goog-date-picker', goog.dom.getElement('widget_en_US')));

  goog.events.listen(dp_en_US, goog.ui.DatePicker.Events.CHANGE,
    function(event) {
      goog.dom.setTextContent(document.getElementById('label_en_US'), event.date ? event.date.toIsoString(true) :
        'none');
    });

  goog.dom.setTextContent(document.getElementById('label_en_US'), dp_en_US.getDate().toIsoString(true));

  // German

  dp_de = new goog.ui.DatePicker(undefined, goog.i18n.DateTimeSymbols_de);
  dp_de.render(document.getElementById('widget_de'));

  goog.events.listen(dp_de, goog.ui.DatePicker.Events.CHANGE, function(event) {
    goog.dom.setTextContent(document.getElementById('label_de'), event.date ? event.date.toIsoString(true) : 'none');
  });

  goog.dom.setTextContent(document.getElementById('label_de'), dp_de.getDate().toIsoString(true));

  // Malayalam

  var dp_ml = new goog.ui.DatePicker(undefined, goog.i18n.DateTimeSymbols_ml);
  dp_ml.render(document.getElementById('widget_ml'));

  goog.events.listen(dp_ml, goog.ui.DatePicker.Events.CHANGE, function(event) {
    goog.dom.setTextContent(document.getElementById('label_ml'), event.date ? event.date.toIsoString(true) : 'none');
  });

  goog.dom.setTextContent(document.getElementById('label_ml'), dp_ml.getDate().toIsoString(true));

  // Arabic (Yemen)
  var dp_ar_YE = new goog.ui.DatePicker(null, goog.i18n.DateTimeSymbols_ar_YE);

  dp_ar_YE.render(document.getElementById('widget_ar_YE'));

  goog.events.listen(dp_ar_YE, goog.ui.DatePicker.Events.CHANGE,
    function(event) {
      goog.dom.setTextContent(document.getElementById('label_ar_YE'), event.date ? event.date.toIsoString(true) :
        'none');
    });

  goog.dom.setTextContent(document.getElementById('label_ar_YE'), dp_ar_YE.getDate().toIsoString(true));

  // Thai

  var dp_th = new goog.ui.DatePicker(undefined, goog.i18n.DateTimeSymbols_th);
  dp_th.render(document.getElementById('widget_th'));

  goog.events.listen(dp_th, goog.ui.DatePicker.Events.CHANGE, function(event) {
    goog.dom.setTextContent(document.getElementById('label_th'), event.date ? event.date.toIsoString(true) : 'none');
  });

  goog.dom.setTextContent(document.getElementById('label_th'), dp_th.getDate().toIsoString(true));

  // Japanese

  var dp_ja = new goog.ui.DatePicker(undefined, goog.i18n.DateTimeSymbols_ja);
  dp_ja.render(document.getElementById('widget_ja'));

  goog.events.listen(dp_ja, goog.ui.DatePicker.Events.CHANGE, function(event) {
    goog.dom.setTextContent(document.getElementById('label_ja'), event.date ? event.date.toIsoString(true) : 'none');
  });

  goog.dom.setTextContent(document.getElementById('label_ja'), dp_ja.getDate().toIsoString(true));

  // We update all pickers, for all languages
  var allPickers = [dp_iso_8601, dp_custom, dp_en_US, dp_de, dp_ml, dp_ar_YE, dp_th, dp_ja];

  function allShowFixedNumWeeks(enabled) {
    for (var i = 0; i < allPickers.length; ++i) {
      allPickers[i].setShowFixedNumWeeks(enabled);
    }
  }

  function allShowOtherMonths(enabled) {
    for (var i = 0; i < allPickers.length; ++i) {
      allPickers[i].setShowOtherMonths(enabled);
    }
  }

  function allExtraWeekAtEnd(enabled) {
    for (var i = 0; i < allPickers.length; ++i) {
      allPickers[i].setExtraWeekAtEnd(enabled);
    }
  }

  function allShowWeekNum(enabled) {
    for (var i = 0; i < allPickers.length; ++i) {
      allPickers[i].setShowWeekNum(enabled);
    }
  }

  function allShowWeekdays(enabled) {
    for (var i = 0; i < allPickers.length; ++i) {
      allPickers[i].setShowWeekdayNames(enabled);
    }
  }

  function allAllowNone(enabled) {
    for (var i = 0; i < allPickers.length; ++i) {
      allPickers[i].setAllowNone(enabled);
    }
  }

  function allShowToday(enabled) {
    for (var i = 0; i < allPickers.length; ++i) {
      allPickers[i].setShowToday(enabled);
    }
  }

  function allUseNarrowWeekdayNames(enabled) {
    for (var i = 0; i < allPickers.length; ++i) {
      allPickers[i].setUseNarrowWeekdayNames(enabled);
    }
  }

  function allUseSimpleNavigationMenu(enabled) {
    for (var i = 0; i < allPickers.length; ++i) {
      allPickers[i].setUseSimpleNavigationMenu(enabled);
    }
  }

  function allLongDateFormat(enabled) {
    for (var i = 0; i < allPickers.length; ++i) {
      allPickers[i].setLongDateFormat(enabled);
    }
  }

}
document.addEventListener('DOMContentLoaded', startup1);
