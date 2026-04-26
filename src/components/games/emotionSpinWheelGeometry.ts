export function normalizeDegrees(degrees: number): number {
    return ((degrees % 360) + 360) % 360;
}

export function getSegmentCenterDegrees(index: number, segmentCount: number): number {
    const segmentDegrees = 360 / segmentCount;
    return index * segmentDegrees + segmentDegrees / 2;
}

export function getRotationForSegmentCenter(index: number, segmentCount: number): number {
    return normalizeDegrees(-getSegmentCenterDegrees(index, segmentCount));
}

export function getPointerSegmentIndex(rotationDegrees: number, segmentCount: number): number {
    const segmentDegrees = 360 / segmentCount;
    const wheelDegreesAtPointer = normalizeDegrees(-rotationDegrees);
    return Math.floor(wheelDegreesAtPointer / segmentDegrees);
}
