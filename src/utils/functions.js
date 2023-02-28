export function interpolateTrig(a, b, t) {
    let tsin = (1 - Math.cos(Math.PI * t)) / 2;
    return a + tsin * (b - a);
}

export function interpolate(a, b, fraction) {
    return a + fraction * (b - a);
}

export function randint(a, b) {
    return (a + Math.floor(Math.random() * (b - a)));
}

// Flip a coin weighted p for True
export function coinFlip(p) {
    return (Math.random() < p);
}

export function stoc(n) {
    var fn = Math.floor(n);
    var d = coinFlip(n - fn);
    if (d == true) {
        return fn + 1;
    } else {
        return fn;
    }
}