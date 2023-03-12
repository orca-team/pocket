/**
 * square distance between 2 points
 * @param {[number, number]} p1
 * @param {[number, number]} p2
 * @returns {number}
 */
function getSqDist(p1, p2) {
  const dx = p1[0] - p2[0];
  const dy = p1[1] - p2[1];

  return dx * dx + dy * dy;
}

/**
 * square distance from a point to a segment
 *
 * @param {[number, number]} p
 * @param {[number, number]} p1
 * @param {[number, number]} p2
 * @returns {number}
 */
function getSqSegDist(p, p1, p2) {
  let x = p1[0];
  let y = p1[1];
  let dx = p2[0] - x;
  let dy = p2[1] - y;
  let t;

  if (dx !== 0 || dy !== 0) {
    t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);

    if (t > 1) {
      x = p2[0];
      y = p2[1];
    } else if (t > 0) {
      x += dx * t;
      y += dy * t;
    }
  }

  dx = p[0] - x;
  dy = p[1] - y;

  return dx * dx + dy * dy;
}

/**
 * basic distance-based simplification
 *
 * @param points
 * @param sqTolerance
 * @returns {*[]}
 */
function simplifyRadialDist(points, sqTolerance) {
  let prevPoint = [points[0], points[1]];
  const newPoints = prevPoint;
  let i = 2;
  const n = points.length;
  let point;

  for (i; i < n; i += 2) {
    point = [points[i], points[i + 1]];

    if (getSqDist(point, prevPoint) > sqTolerance) {
      newPoints.push(point[0], point[1]);
      prevPoint = point;
    }
  }

  if (prevPoint !== point) {
    newPoints.push(point[0], point[1]);
  }

  return newPoints;
}

/**
 *
 * @param points
 * @param first
 * @param last
 * @param sqTolerance
 * @param simplified
 */
function simplifyDPStep(points, first, last, sqTolerance, simplified) {
  let maxSqDist = sqTolerance;
  let i = first + 2;
  let sqDist;
  let index;

  for (i; i < last; i += 2) {
    sqDist = getSqSegDist(
      [points[i], points[i + 1]],
      [points[first], points[first + 1]],
      [points[last], points[last + 1]],
    );

    if (sqDist > maxSqDist) {
      index = i;
      maxSqDist = sqDist;
    }
  }

  if (maxSqDist > sqTolerance) {
    if (index - first > 1)
      simplifyDPStep(points, first, index, sqTolerance, simplified);
    simplified.push(points[index], points[index + 1]);
    if (last - index > 1)
      simplifyDPStep(points, index, last, sqTolerance, simplified);
  }
}

/**
 * simplification using Ramer-Douglas-Peucker algorithm
 *
 * @param points
 * @param sqTolerance
 * @returns {*[]}
 */
function simplifyDouglasPeucker(points, sqTolerance) {
  const last = points.length - 2;
  const simplified = [points[0], points[1]];

  simplifyDPStep(points, 0, last, sqTolerance, simplified);
  simplified.push(points[last], points[last + 1]);

  return simplified;
}

/**
 * both algorithms combined for awesome performance
 *
 * @param points
 * @param tolerance
 * @param highestQuality
 * @returns {number[]}
 */
export function simplify(
  points: number[],
  tolerance?: number,
  highestQuality?: boolean,
) {
  if (points.length <= 4) return points;

  const sqTolerance = tolerance !== undefined ? tolerance * tolerance : 1;

  let newPoints = highestQuality
    ? points
    : simplifyRadialDist(points, sqTolerance);
  newPoints = simplifyDouglasPeucker(newPoints, sqTolerance);

  return newPoints;
}
