export var requestFullScreen = function (element) {
    var methods = ['requestFullscreen', 'webkitRequestFullscreen', 'mozRequestFullScreen', 'msRequestFullscreen'];
    var methodName = methods.find(function (name) { return element[name]; });
    element[methodName]();
};
