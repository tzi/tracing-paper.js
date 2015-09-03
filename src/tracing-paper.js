function TracingPaper(_element, _width, _height) {
    'use strict';

    var _path = [];
    addPoint(1, 8);
    addPoint(8, 1);
    addPoint(14, 8);

    size(_width, _height);
    initEvent();

    return {
        resize: resize,
        addPoint: addPoint,
        removeLastPoint: removeLastPoint
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

    function update() {
        clean();
        draw();
    }

    function clean() {
        var context = getContext();
        context.clearRect(0, 0, _width, _height);
    }

    function draw() {
        for (var i = 0; i < _path.length; i++) {
            drawPoint(_path[i])
        }
        drawLine(_path);
    }

    function drawPoint(point) {
        var context = getContext();
        var width = 6;
        context.beginPath();
        context.rect(point.x - width / 2, point.y - width / 2, width, width);
        context.fillStyle = '#AAAAAA';
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