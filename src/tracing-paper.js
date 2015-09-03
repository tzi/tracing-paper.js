function TracingPaper(_element, _width, _height) {
    'use strict';

    var _path = [];
    var _updateCallback = [];

    size(_width, _height);
    initEvent();

    return {
        resize: resize,
        addPoint: addPoint,
        removeLastPoint: removeLastPoint,
        reset: reset,
        fromSVGPath: fromSVGPath,
        toSVGPath: toSVGPath,
        onUpdate: onUpdate
    };

    function initEvent() {
        _element.addEventListener('click', clickHandler);
        document.addEventListener('keypress', keyPressHandler);
    }

    function clickHandler(event) {
        addPoint(event.layerX, event.layerY);
    }

    function keyPressHandler(event) {
        if (event.keyCode == 27) {
            removeLastPoint();
        }
    }

    function resize(width, height) {
        for (var i = 0; i < _path.length; i++) {
            _path[i].x += (width - _width) / 2;
            _path[i].y += (height - _height) / 2;
        }
        size(width, height);
        update();
    }

    function size(width, height) {
        _width = width || 100;
        _height = height || 100;
        _element.setAttribute('style', 'width: ' + _width + 'px; height: ' + _height + 'px;');
        _element.setAttribute('width', _width);
        _element.setAttribute('height', _height);
    }

    function addPoint(x, y) {
        _path.push({x: x, y: y});
        update();
    }

    function removeLastPoint() {
        _path.pop();
        update();
    }

    function reset() {
        _path = [];
        clean();
    }

    function fromSVGPath(SVGPath) {
        reset();
        SVGPath = SVGPath.trim();
        var points = SVGPath.substring(1, SVGPath.length - 2).split(' L');
        for (var i = 0; i < points.length; i++) {
            var point = points[i].split(' ');
            addPoint(point[0], point[1]);
        }
        update();
    }

    function toSVGPath() {
        var SVGPath = '';
        for (var i = 0; i < _path.length; i++) {
            var prefix = (i == 0) ? 'M' : 'L';
            SVGPath += prefix + _path[i].x + ' ' + _path[i].y + ' ';
        }
        return SVGPath + 'Z';
    }

    function update() {
        clean();
        draw();
        for (var i = 0; i < _updateCallback.length; i++) {
            _updateCallback[i]();
        }
    }

    function onUpdate(callback) {
        _updateCallback.push(callback);
    }

    function clean() {
        var context = getContext();
        context.clearRect(0, 0, _width, _height);
    }

    function draw() {
        for (var i = 0; i < _path.length; i++) {
            drawPoint(_path[i], i == _path.length - 1);
        }
        drawLine(_path);
    }

    function drawPoint(point, highlight) {
        var context = getContext();
        var width = 8;
        var color = 'rgba(60, 30, 255, 0.4)';
        if (highlight) {
            color = 'rgba(255, 30, 60, 0.6)';
        }
        context.beginPath();
        context.rect(point.x - width / 2, point.y - width / 2, width, width);
        context.fillStyle = color;
        context.fill();
    }

    function drawLine(path) {
        var point, method;
        var context = getContext();
        context.beginPath();
        for (var i = 0; i < path.length; i++) {
            point = _path[i];
            method = (i == 0) ? 'moveTo' : 'lineTo';
            context[method](point.x, point.y);
        }
        context.lineWidth = 2;
        context.stroke();
    }

    function getContext() {
        return canvas.getContext('2d');
    }
}