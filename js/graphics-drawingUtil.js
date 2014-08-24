var drawingUtil = {
  clear: function() {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.fill();
    if (this.showGrid) drawGrid.call(this);
  },
  drawGrid: function() {
    this.ctx.strokeStyle = this.gridColor;
    this.ctx.lineWidth = 1;
    for (var y = this.y - this.height; y < this.y + this.height; y += this.unit) {
      this.ctx.strokeRect(this.x - this.width, y, 2 * this.width, this.unit)
    }
    for (var x = this.x - this.width; x < this.x + this.width; x += this.unit) {
      this.ctx.strokeRect(x, this.y - this.height, this.unit, 2 * this.height);
    }
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(this.x - this.width, this.height - this.y * this.unit, 2 * this.width, 2);
    this.ctx.strokeRect(this.x * this.unit, this.y - this.height, 2, 2 * this.height);
  },
  drawBox2d: function(b, options) {
    //--------------------------------------------------------------------------------------------------------------------
    //console.log(arguments)
  },
  drawRectangle: function(o) {
    //--------------------------------------------------------------------------------------------------------------------
    if (o.angle) this.ctx.rotate(o.angle * Math.PI / 180);
    if (!o.hideStroke) this.ctx.strokeRect(0 - o.w * this.unit / 2, 0 - o.h * this.unit / 2, o.w * this.unit, o.h * this.unit);
    if (o.showFill) this.ctx.fillRect(0 - o.w * this.unit / 2, 0 - o.h * this.unit / 2, o.w * this.unit, o.h * this.unit);
    return this;
  },
  drawCircle: function(o) {
    //--------------------------------------------------------------------------------------------------------------------
    this.ctx.beginPath();
    this.ctx.arc(0, 0, o.r * this.unit, 0, Math.PI * 2, true);
    if (!o.hideStroke) this.ctx.stroke();
    if (o.showFill) this.ctx.fill();
    this.ctx.closePath();
    return this;
  },
  drawLine: function(o) {
    //--------------------------------------------------------------------------------------------------------------------
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo((o.x2 - o.x) * this.unit, (-o.y2 + o.y) * this.unit);
    this.ctx.closePath();
    this.ctx.stroke();
    return this;
  },
  drawSphere: function(o) {
    //--------------------------------------------------------------------------------------------------------------------
    if (o.angle) this.ctx.rotate(o.angle * Math.PI / 180);
    var r2 = o.r / 10; //inner radius		
    var x2 = (o.r - r2) / 2;
    var radgrad = this.ctx.createRadialGradient(x2 * this.unit, 0, r2 * this.unit, 0, 0, o.r * this.unit);
    radgrad.addColorStop(0, '#FFF');
    radgrad.addColorStop(0.3, o.color);
    radgrad.addColorStop(0.95, '#111');
    radgrad.addColorStop(1, 'rgba(0,0,0,0)');
    this.ctx.fillStyle = radgrad;
    this.ctx.fillRect(-o.r * this.unit, -o.r * this.unit, 2 * o.r * this.unit, 2 * o.r * this.unit);
    this.ctx.fill();
    return this;
  },
  drawText: function(o) {
    //--------------------------------------------------------------------------------------------------------------------
    if (o.angle) this.ctx.rotate(o.angle * Math.PI / 180);
    //strokeText('Hello world!', 40, 50); 
    if (!o.hideStroke) this.ctx.strokeText(o.text, 0 - o.w * this.unit / 2, 0 - o.h * this.unit / 2);
    if (o.showFill) this.ctx.fillText(o.text, 0 - o.w * this.unit / 2, 0 - o.h * this.unit / 2);
    return this;
  },
  drawImg: function(o) {
    //--------------------------------------------------------------------------------------------------------------------
    this.ctx.scale(o.scaleX, o.scaleY);
    this.ctx.transform(o.m11, o.m12, o.m21, o.m22, o.dx, o.dy);
    if (o.angle) this.ctx.rotate(o.angle * Math.PI / 180);
    if (o.isReady) this.ctx.drawImage(o.img, 0 - o.w * this.unit / 2, 0 - o.h * this.unit / 2, o.w * this.unit, o.h * this.unit);
    return this;
  },
  drawPath: function(o) {
    //--------------------------------------------------------------------------------------------------------------------
    if (o.angle) this.ctx.rotate(o.angle * Math.PI / 180);
    var that = this;
    this.ctx.beginPath();
    $.each(o.points, function(i, p) {
      if (i === 0) {
        that.ctx.moveTo(p.x * that.unit, -p.y * that.unit);
      }
      that.ctx.lineTo(p.x * that.unit, -p.y * that.unit);
    });
    if (o.close) {
      this.ctx.closePath();
      this.ctx.stroke();
      if (o.showFill) this.ctx.fill();
    } else {
      this.ctx.stroke();
      this.ctx.closePath();
    }
    return this;
  },
  drawTracer: function(o) {
    //--------------------------------------------------------------------------------------------------------------------
    //  this.ctx.translate(-o.x*this.unit, -o.y*this.unit);
    this.ctx.translate(-(this.x + o.x) * this.unit, -this.height + (this.y + o.y) * this.unit);
    var that = this;
    if (o.body) {
      $.each(o.path.points, function(i, p) {
        that.draw(o.body, p);
      });
    } else {
      var settings = $.extend(o, {
        x: 0,
        y: 0,
        dType: 'Path'
      });
      this.draw(o.path, settings);
    }
    if (o.tail) {
      this.draw(o.tail, o.path.getTail());
    }
    if (o.head) {
      this.draw(o.head, o.path.getHead());
    }
    return this;
  },
  drawLayer: function(o) {
    //--------------------------------------------------------------------------------------------------------------------
    this.ctx.scale(o.scaleX, o.scaleY);
    if (o.angle) this.ctx.rotate(o.angle * Math.PI / 180);
    this.ctx.translate(-(this.x + o.x) * this.unit, -this.height + (this.y + o.y) * this.unit);
    var that = this;
    var options = $.extend({}, o);
    options.angle = 0;
    this.draw('Rectangle', options);
    this.ctx.translate(o.x * this.unit, -o.y * this.unit)
    $.each(o.items, function(i, item) {
      that.draw(item)
    })
  }
}
