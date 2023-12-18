function drawVerticalGradient(p, x, y, w, h, colorOne, colorTwo) {
    let left = x;
    let right = x + w;
    let top = y;
    let bottom = y + h;

    for(let i = top; i < bottom; i++) {
        let t = p.map(i, top, bottom, 0, 1);
        let col = p.lerpColor(colorOne, colorTwo, t);
        p.stroke(col);
        p.line(left, i, -1, right, i, -1);
    }
}