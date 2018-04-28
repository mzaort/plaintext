goog.require('goog.debug.DivConsole');
goog.require('goog.debug.LogManager');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.events');
goog.require('goog.log');
goog.require('goog.log.Level');
goog.require('goog.object');
goog.require('goog.ui.CheckBoxMenuItem');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.Menu');
goog.require('goog.ui.MenuItem');
goog.require('goog.ui.MenuSeparator');
goog.require('plaintext.View');

var menu1, menu2, menu3, menu4, menu5, menu6;

function startup1() {
  var timer = goog.now();

  var view = plaintext.View.getInstance();

  // Set up a logger.
  goog.debug.LogManager.getRoot().setLevel(goog.log.Level.ALL);
  var logger = goog.log.getLogger('demo');
  var logconsole = new goog.debug.DivConsole(goog.dom.getElement('log'));
  logconsole.setCapturing(true);

  var EVENTS = goog.object.getValues(goog.ui.Component.EventType);
  goog.log.fine(logger, 'Listening for: ' + EVENTS.join(', ') + '.');

  function logEvent(e) {
    var name = e.target.getCaption ? e.target.getCaption() : 'Menu';
    goog.log.info(logger, '"' + name + '" dispatched: ' + e.type);
  }

  var el = goog.dom.getElement('menu1');
  menu1 = new goog.ui.Menu();
  var m1, m2, m3, m4, m5, m6;
  menu1.addItem(m1 = new goog.ui.MenuItem('Inbox'));
  menu1.addItem(m2 = new goog.ui.MenuItem('Starred'));
  menu1.addItem(m3 = new goog.ui.MenuItem('Chats'));
  menu1.addItem(m4 = new goog.ui.MenuItem('Sent'));
  menu1.addItem(new goog.ui.MenuSeparator());
  menu1.addItem(m5 = new goog.ui.MenuItem('New Folder...'));

  menu1.addItemAt(m6 = new goog.ui.MenuItem('All Mail'), 1);
  menu1.render(el);
  goog.events.listen(menu1, EVENTS, logEvent);

  m1.setEnabled(false);
  m6.setEnabled(false);

  menu2 = view.getComponent('menu2');
  goog.events.listen(menu2, EVENTS, logEvent);

  goog.events.listen(menu2, 'action', function(e) {
    if (e.target.getId() == 'addNewItem') {
      var n = prompt('Enter a new item...');
      if (n) {
        menu2.addItemAt(new goog.ui.MenuItem(n), menu2.getItemCount() - 4);
      }
    } else if (e.target.getId() == 'enableNewItems') {
      menu2.getItemAt(menu2.getItemCount() - 1).setEnabled(e.target.isChecked());
    } else {
      alert(e.target.getCaption());
    }
  });

  var el3 = goog.dom.getElement('menu3');
  menu3 = new goog.ui.Menu();
  menu3.decorate(el3);
  goog.events.listen(menu3, EVENTS, logEvent);

  menu4 = new goog.ui.Menu();
  var foo, bar;
  menu4.addItem(foo = new goog.ui.CheckBoxMenuItem('Bold'));
  menu4.addItem(new goog.ui.CheckBoxMenuItem('Italic'));
  menu4.addItem(bar = new goog.ui.CheckBoxMenuItem('3D'));
  menu4.addItem(new goog.ui.CheckBoxMenuItem('Underline'));
  foo.setChecked(true);
  bar.setEnabled(false);
  menu4.render(goog.dom.getElement('menu4'));
  goog.events.listen(menu4, EVENTS, logEvent);

  goog.events.listen(menu4, 'action', function(e) {
    var items = [];
    menu4.forEachChild(function(child) {
      if (child.isChecked()) {
        items.push(child.getCaption());
      }
    });
    goog.dom.setTextContent(goog.dom.getElement('checkedItems'), items.length > 0 ? items.join(', ') : 'nothing');
  });

  function createCheckBoxItem(label, shortcut) {
    return new goog.ui.CheckBoxMenuItem([goog.dom.createDom(goog.dom.TagName.DIV, 'goog-menuitem-accel', shortcut),
      goog.dom.createTextNode(label)
    ]);
  }

  menu5 = new goog.ui.Menu();
  menu5.setRightToLeft(true);
  var fee, baz;
  menu5.addItem(fee = createCheckBoxItem('Bold', 'Ctrl+B'));
  menu5.addItem(createCheckBoxItem('Italic', 'Ctrl+I'));
  menu5.addItem(baz = createCheckBoxItem('3D', 'Ctrl+Shift+3'));
  menu5.addItem(createCheckBoxItem('Underline', 'Ctrl+U'));
  fee.setChecked(true);
  baz.setEnabled(false);
  menu5.render(goog.dom.getElement('menu5'));
  goog.events.listen(menu5, EVENTS, logEvent);

  menu6 = new goog.ui.Menu();
  menu6.decorate(goog.dom.getElement('menu6'));
  goog.events.listen(menu6, EVENTS, logEvent);

  goog.dom.setTextContent(goog.dom.getElement('perf'), (goog.now() - timer) + 'ms');
}
document.addEventListener('DOMContentLoaded', startup1);
