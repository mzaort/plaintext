var timer = goog.now();

// Set up a logger.
goog.debug.LogManager.getRoot().setLevel(goog.log.Level.ALL);
var logger = goog.log.getLogger('demo');
var logconsole = new goog.debug.DivConsole(goog.dom.getElement('log'));
logconsole.setCapturing(true);

var EVENTS = goog.object.getValues(goog.ui.Component.EventType);
goog.log.fine(logger, 'Listening for: ' + EVENTS.join(', ') + '.');

function logEvent(e) {
    goog.log.info(logger, '"' + e.target.getCaption() + '" dispatched: ' + e.type);
}

// Create the first button programmatically.
var b1 = new goog.ui.Button('Hello!');
b1.render(goog.dom.getElement('b1'));
b1.setTooltip('I changed the tooltip using setTooltip() ' +
    'after the button was rendered.');
goog.events.listen(b1, EVENTS, logEvent);

goog.events.listen(goog.dom.getElement('b1_enable'),
    goog.events.EventType.CLICK,
    function(e) {
        b1.setEnabled(e.target.checked);
    });

goog.events.listen(b1, goog.ui.Component.EventType.ACTION,
    function(e) {
        var newCaption = window.prompt('Enter new caption for button:');
        b1.setCaption(newCaption || 'Empty');
    });

// Create the second button by decorating an element.
var b2 = new goog.ui.Button();
b2.decorate(goog.dom.getElement('b2'));
goog.events.listen(b2, EVENTS, logEvent);

goog.events.listen(goog.dom.getElement('b2_enable'),
    goog.events.EventType.CLICK,
    function(e) {
        b2.setEnabled(e.target.checked);
    });

goog.events.listen(b2, goog.ui.Component.EventType.ACTION,
    function(e) {
        alert('The value of the button is: ' + b2.getValue());
    });


// Create flat buttons that use divs instead of button or input elements.
// Render 1st flat button.
var fb1 = new goog.ui.Button('Hello!',
    goog.ui.FlatButtonRenderer.getInstance());
fb1.render(goog.dom.getElement('fb1'));
fb1.setTooltip('I changed the tooltip using setTooltip() ' +
    'after the button was rendered.');
goog.events.listen(fb1, EVENTS, logEvent);

goog.events.listen(goog.dom.getElement('fb1_enable'),
    goog.events.EventType.CLICK,
    function(e) {
        fb1.setEnabled(e.target.checked);
    });

goog.events.listen(fb1, goog.ui.Component.EventType.ACTION,
    function(e) {
        var newCaption = window.prompt('Enter new caption for button:');
        fb1.setCaption(newCaption || 'Empty');
    });

// Decorate 2nd flat button.
var fb2 = goog.ui.decorate(goog.dom.getElement('fb2'));
goog.events.listen(fb2, EVENTS, logEvent);

goog.events.listen(goog.dom.getElement('fb2_enable'),
    goog.events.EventType.CLICK,
    function(e) {
        fb2.setEnabled(e.target.checked);
    });

goog.events.listen(fb2, goog.ui.Component.EventType.ACTION,
    function(e) {
        alert('The caption of the button is: ' + fb2.getCaption());
    });

// Decorate 3rd and 4th flat buttons.
goog.ui.decorate(goog.dom.getElement('fb3'));
goog.ui.decorate(goog.dom.getElement('fb4'));

// Create buttons that look like links.
var lb = new goog.ui.Button('Hello!',
    goog.ui.LinkButtonRenderer.getInstance());
lb.render(goog.dom.getElement('lb'));
lb.setTooltip('I changed the tooltip using setTooltip() ' +
    'after the button was rendered.');
goog.events.listen(lb, EVENTS, logEvent);

goog.events.listen(goog.dom.getElement('lb_enable'),
    goog.events.EventType.CLICK,
    function(e) {
        lb.setEnabled(e.target.checked);
    });

goog.events.listen(lb, goog.ui.Component.EventType.ACTION,
    function(e) {
        var newCaption = window.prompt('Enter new caption for button:');
        lb.setCaption(newCaption || 'Empty');
    });

// Create some custom buttons.
var disabledButton, leftButton, centerButton, rightButton;
var customButtons = [
    new goog.ui.CustomButton('Button'),
    new goog.ui.CustomButton('Another Button'),
    disabledButton = new goog.ui.CustomButton('Disabled Button'),
    new goog.ui.CustomButton('Yet Another Button'),
    leftButton = new goog.ui.CustomButton('Left'),
    centerButton = new goog.ui.CustomButton('Center'),
    rightButton = new goog.ui.CustomButton('Right'),
];
disabledButton.setEnabled(false);
leftButton.setCollapsed(goog.ui.ButtonSide.END);
centerButton.setCollapsed(goog.ui.ButtonSide.BOTH);
rightButton.setCollapsed(goog.ui.ButtonSide.START);
goog.array.forEach(customButtons, function(b) {
    b.render(goog.dom.getElement('cb1'));
    goog.events.listen(b, goog.ui.Component.EventType.ACTION,
        function(e) {
        var newCaption = window.prompt('Enter new caption for button:');
        b.setCaption(newCaption || 'Empty');
        });
    goog.events.listen(b, EVENTS, logEvent);
});

// Decorate some custom buttons.
var cb2 = [];
var decoratedButtons = goog.array.map(
    ['foo', 'bar', 'fee', 'btn1', 'btn2', 'btn3'],
    goog.dom.getElement);
goog.array.forEach(decoratedButtons, function(element) {
    // Since the elements to be decorated each have the correct "marker" CSS
    // class ("goog-custom-button"), we can use the renderer registry to get
    // the appropriate control instance to decorate them.
    var button = goog.ui.decorate(element);
    button.setDispatchTransitionEvents(goog.ui.Component.State.ALL, true);
    cb2.push(button);
    goog.events.listen(button, EVENTS, logEvent);
});

// Decorate toggle buttons.
var toggleEnableElem = goog.dom.getElement('toggleEnable');
var toggleEnable = goog.ui.decorate(toggleEnableElem);
toggleEnable.setDispatchTransitionEvents(goog.ui.Component.State.ALL, true);
goog.events.listen(toggleEnable, EVENTS, logEvent);

goog.events.listen(toggleEnable, goog.ui.Component.EventType.ACTION,
    function(e) {
        cb2[1].setEnabled(e.target.isChecked());
    });

var hideShowElem = goog.dom.getElement('hideShow');
var hideShow = new goog.ui.decorate(hideShowElem);
hideShow.setDispatchTransitionEvents(goog.ui.Component.State.ALL, true);
goog.events.listen(hideShow, EVENTS, logEvent);

goog.events.listen(hideShow, goog.ui.Component.EventType.ACTION,
    function(e) {
        cb2[1].setVisible(e.target.isChecked());
    });

// Decorate combined toggle buttons.
var cb3 = [];
var combinedButtons = goog.array.map(['btn4', 'btn5', 'btn6'],
    goog.dom.getElement);
goog.array.forEach(combinedButtons, function(element) {
    var button = goog.ui.decorate(element);
    button.setDispatchTransitionEvents(goog.ui.Component.State.ALL, true);
    cb3.push(button);
    goog.events.listen(button, EVENTS, logEvent);
});


// Use a DIV with a background image as the icon, and a SPAN as the caption.
var iconbutton1 = new goog.ui.ToggleButton([
    goog.dom.createDom(goog.dom.TagName.DIV, 'icon insert-image-icon goog-inline-block'),
    goog.dom.createDom(goog.dom.TagName.SPAN, {'style': 'vertical-align:middle'},
        'Insert Image')
]);
iconbutton1.render(goog.dom.getElement('iconbuttons'));
goog.events.listen(iconbutton1, EVENTS, logEvent);

// Add a custom style, too.
var iconbutton2 = new goog.ui.ToggleButton([
    goog.dom.createDom(goog.dom.TagName.DIV, 'icon highlight-icon goog-inline-block'),
    goog.dom.createDom(goog.dom.TagName.SPAN, {'style': 'vertical-align:middle'},
        'Highlight Text')
]);
iconbutton2.addClassName('default-button');
iconbutton2.render(goog.dom.getElement('iconbuttons'));
goog.events.listen(iconbutton2, EVENTS, logEvent);

goog.dom.setTextContent(goog.dom.getElement('perf'),
    (goog.now() - timer) + 'ms');