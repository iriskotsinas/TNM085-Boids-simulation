class Vec2D {
    constructor(x, y) {
        this.x = x; //!= null ? x : 0;
        this.y = y; // != null ? y : 0;

        this.set = this.set.bind(this);
        this.setVec2 = this.setVec2.bind(this);
        this.setDirection = this.setDirection.bind(this);
        this.equals = this.equals.bind(this);
        this.sub = this.sub.bind(this);
        this.scale = this.scale.bind(this);
        this.distance = this.distance.bind(this);
        this.squareDistance = this.squareDistance.bind(this);
        this.simpleDistance = this.simpleDistance.bind(this);
        this.copy = this.copy.bind(this);
        this.clone = this.clone.bind(this);
        this.dup = this.dup.bind(this);
        this.dot = this.dot.bind(this);
        this.asAdd = this.asAdd.bind(this);
        this.asSub = this.asSub.bind(this);
        this.addScaled = this.addScaled.bind(this);
        this.angleVtoV = this.angleVtoV.bind(this);
        this.direction = this.direction.bind(this);
        this.length = this.length.bind(this);
        this.lengthSquared = this.lengthSquared.bind(this);
        this.normalize = this.normalize.bind(this);
        this.limit = this.limit.bind(this);
        this.lerp = this.lerp.bind(this);
        this.toString = this.toString.bind(this);
        this.hash = this.hash.bind(this);

        /*this.create = this.create.bind(this);
        this.fromArray = this.fromArray.bind(this);
        this.fromDirection = this.fromDirection.bind(this);*/
    }
    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    setVec2(v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    }
    setDirection(angle, dist) {
        dist = dist || 1;
        this.x = dist * Math.cos(angle / 360 * Math.PI * 2);
        this.y = dist * Math.sin(angle / 360 * Math.PI * 2);
        return this;
    }
    equals(v, tolerance) {
        if (tolerance == null) {
            tolerance = 0.0000001;
        }
        return (Math.abs(v.x - this.x) <= tolerance) && (Math.abs(v.y - this.y) <= tolerance);
    }
    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }
    scale(f) {
        this.x *= f;
        this.y *= f;
        return this;
    }
    distance(v) {
        var dx = v.x - this.x;
        var dy = v.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    squareDistance(v) {
        var dx = v.x - this.x;
        var dy = v.y - this.y;
        return dx * dx + dy * dy;
    }
    simpleDistance(v) {
        var dx = Math.abs(v.x - this.x);
        var dy = Math.abs(v.y - this.y);
        return Math.min(dx, dy);
    }
    copy(v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    }
    clone() {
        return new Vec2D(this.x, this.y);
    }
    dup() {
        return this.clone();
    }
    dot(b) {
        return this.x * b.x + this.y * b.y;
    }
    asAdd(a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        return this;
    }
    asSub(a, b) {

        console.log("a: ",a);
        console.log("b: ",b);

        this.x = a.x - b.x;
        this.y = a.y - b.y;
        return this;
    }
    addScaled(a, f) {
        this.x += a.x * f;
        this.y += a.y * f;
        return this;
    }

    angleVtoV(v) {

        let dot = this.dot(v); // dot product
        let det = this.x * v.y - this.y * v.x; // determinant
    
        return Math.atan2(det, dot);
    }

    direction() {
        var rad = Math.atan2(this.y, this.x);
        var deg = rad * 180 / Math.PI;
        if (deg < 0)
            deg = 360 + deg;
        return deg;
    }
    length() {  // ABSOLUTBELOPP
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    lengthSquared() {
        return this.x * this.x + this.y * this.y;
    }
    normalize() {
        var len = this.length();
        if (len > 0) {
            this.scale(1 / len);
        }
        return this;
    }
    limit(s) {
        var len = this.length();
        if (len > s && len > 0) {
            this.scale(s / len);
        }
        return this;
    }
    lerp(v, t) {
        this.x = this.x + (v.x - this.x) * t;
        this.y = this.y + (v.y - this.y) * t;
        return this;
    }
    toString() {
        return "{" + Math.floor(this.x * 1000) / 1000 + ", " + Math.floor(this.y * 1000) / 1000 + "}";
    }
    hash() {
        return 1 * this.x + 12 * this.y;
    }
    static create(x, y) {
        return new Vec2D(x, y);
    }
    static fromArray(a) {
        return new Vec2D(a[0], a[1]);
    }
    static fromDirection(angle, dist) {
        return new Vec2D().setDirection(angle, dist);
    }
}