goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.Slider');
goog.require('goog.ui.Slider.Orientation');

var s, s2;

function startup1() {
  var el = document.getElementById('s1');
  s = new goog.ui.Slider;
  s.decorate(el);
  s.addEventListener(goog.ui.Component.EventType.CHANGE, function() {
    document.getElementById('out1').value = s.getValue();
  });

  s2 = new goog.ui.Slider;
  s2.setOrientation(goog.ui.Slider.Orientation.VERTICAL);
  s2.createDom();
  var el = s2.getElement();
  el.style.width = '20px';
  el.style.height = '200px';
  s2.render(document.body);
  s2.setStep(null);
  s2.addEventListener(goog.ui.Component.EventType.CHANGE, function() {
    document.getElementById('out2').value = s2.getValue();
  });

  var label = document.getElementById('s2-label');
  label.parentNode.insertBefore(el, label);

  function toggleSliderEnable(button, slider) {
    var buttonValue = slider.isEnabled() ? 'Enable Slider' : 'Disable Slider';
    button.value = buttonValue;
    slider.setEnabled(!slider.isEnabled());
  }

  function setSliderValue(slider, textId) {
    if (document.getElementById(textId)) {
      var value = document.getElementById(textId).value;
      window.console.log(value);
      slider.setValue(new Number(value));
    }
  }
}
document.addEventListener('DOMContentLoaded', startup1);
