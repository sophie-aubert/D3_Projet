(function() {
    !function() {
        var d3 = {
            version: "3.4.4"
        };
        var abs = Math.abs;
        d3.range = function(start, stop, step) {
            if (arguments.length < 3) {
                step = 1;
                if (arguments.length < 2) {
                    stop = start;
                    start = 0;
                }
            }
            if ((stop - start) / step === Infinity) throw new Error("infinite range");
            var range = [], k = d3_range_integerScale(abs(step)), i = -1, j;
            start *= k, stop *= k, step *= k;
            if (step < 0) while ((j = start + step * ++i) > stop) range.push(j / k); else while ((j = start + step * ++i) < stop) range.push(j / k);
            return range;
        };
        function d3_range_integerScale(x) {
            var k = 1;
            while (x * k % 1) k *= 10;
            return k;
        }
        var π = Math.PI, τ = 2 * π, halfπ = π / 2, ε = 1e-6, ε2 = ε * ε, d3_radians = π / 180, d3_degrees = 180 / π;
        function d3_sgn(x) {
            return x > 0 ? 1 : x < 0 ? -1 : 0;
        }
        function d3_cross2d(a, b, c) {
            return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
        }
        function d3_acos(x) {
            return x > 1 ? 0 : x < -1 ? π : Math.acos(x);
        }
        function d3_asin(x) {
            return x > 1 ? halfπ : x < -1 ? -halfπ : Math.asin(x);
        }
        function d3_sinh(x) {
            return ((x = Math.exp(x)) - 1 / x) / 2;
        }
        function d3_cosh(x) {
            return ((x = Math.exp(x)) + 1 / x) / 2;
        }
        function d3_tanh(x) {
            return ((x = Math.exp(2 * x)) - 1) / (x + 1);
        }
        function d3_haversin(x) {
            return (x = Math.sin(x / 2)) * x;
        }
        d3.geo = {};
        d3.geo.graticule = function() {
            var x1, x0, X1, X0, y1, y0, Y1, Y0, dx = 10, dy = dx, DX = 90, DY = 360, x, y, X, Y, precision = 2.5;
            function graticule() {
                return {
                    type: "MultiLineString",
                    coordinates: lines()
                };
            }
            function lines() {
                return d3.range(Math.ceil(X0 / DX) * DX, X1, DX).map(X).concat(d3.range(Math.ceil(Y0 / DY) * DY, Y1, DY).map(Y)).concat(d3.range(Math.ceil(x0 / dx) * dx, x1, dx).filter(function(x) {
                    return abs(x % DX) > ε;
                }).map(x)).concat(d3.range(Math.ceil(y0 / dy) * dy, y1, dy).filter(function(y) {
                    return abs(y % DY) > ε;
                }).map(y));
            }
            graticule.lines = function() {
                return lines().map(function(coordinates) {
                    return {
                        type: "LineString",
                        coordinates: coordinates
                    };
                });
            };
            graticule.outline = function() {
                return {
                    type: "Polygon",
                    coordinates: [ X(X0).concat(Y(Y1).slice(1), X(X1).reverse().slice(1), Y(Y0).reverse().slice(1)) ]
                };
            };
            graticule.extent = function(_) {
                if (!arguments.length) return graticule.minorExtent();
                return graticule.majorExtent(_).minorExtent(_);
            };
            graticule.majorExtent = function(_) {
                if (!arguments.length) return [ [ X0, Y0 ], [ X1, Y1 ] ];
                X0 = +_[0][0], X1 = +_[1][0];
                Y0 = +_[0][1], Y1 = +_[1][1];
                if (X0 > X1) _ = X0, X0 = X1, X1 = _;
                if (Y0 > Y1) _ = Y0, Y0 = Y1, Y1 = _;
                return graticule.precision(precision);
            };
            graticule.minorExtent = function(_) {
                if (!arguments.length) return [ [ x0, y0 ], [ x1, y1 ] ];
                x0 = +_[0][0], x1 = +_[1][0];
                y0 = +_[0][1], y1 = +_[1][1];
                if (x0 > x1) _ = x0, x0 = x1, x1 = _;
                if (y0 > y1) _ = y0, y0 = y1, y1 = _;
                return graticule.precision(precision);
            };
            graticule.step = function(_) {
                if (!arguments.length) return graticule.minorStep();
                return graticule.majorStep(_).minorStep(_);
            };
            graticule.majorStep = function(_) {
                if (!arguments.length) return [ DX, DY ];
                DX = +_[0], DY = +_[1];
                return graticule;
            };
            graticule.minorStep = function(_) {
                if (!arguments.length) return [ dx, dy ];
                dx = +_[0], dy = +_[1];
                return graticule;
            };
            graticule.precision = function(_) {
                if (!arguments.length) return precision;
                precision = +_;
                x = d3_geo_graticuleX(y0, y1, 90);
                y = d3_geo_graticuleY(x0, x1, precision);
                X = d3_geo_graticuleX(Y0, Y1, 90);
                Y = d3_geo_graticuleY(X0, X1, precision);
                return graticule;
            };
            return graticule.majorExtent([ [ -180, -90 + ε ], [ 180, 90 - ε ] ]).minorExtent([ [ -180, -80 - ε ], [ 180, 80 + ε ] ]);
        };
        function d3_geo_graticuleX(y0, y1, dy) {
            var y = d3.range(y0, y1 - ε, dy).concat(y1);
            return function(x) {
                return y.map(function(y) {
                    return [ x, y ];
                });
            };
        }
        function d3_geo_graticuleY(x0, x1, dx) {
            var x = d3.range(x0, x1 - ε, dx).concat(x1);
            return function(y) {
                return x.map(function(x) {
                    return [ x, y ];
                });
            };
        }
        if (typeof define === "function" && define.amd) {
            define(d3);
        } else if (typeof module === "object" && module.exports) {
            module.exports = d3;
        } else {
            this.d3 = d3;
        }
    }();
})();