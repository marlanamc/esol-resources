import { describe, expect, it } from "vitest";
import {
    getPointerSegmentIndex,
    getRotationForSegmentCenter,
} from "@/components/games/emotionSpinWheelGeometry";

const EMOTION_COUNT = 18;

describe("emotion spin wheel geometry", () => {
    it("rotates each selected segment center to the fixed top pointer", () => {
        for (let index = 0; index < EMOTION_COUNT; index += 1) {
            const rotation = getRotationForSegmentCenter(index, EMOTION_COUNT);

            expect(getPointerSegmentIndex(rotation, EMOTION_COUNT)).toBe(index);
        }
    });

    it("does not visually map proud to scared", () => {
        const proudIndex = 2;
        const scaredIndex = 15;
        const proudRotation = getRotationForSegmentCenter(proudIndex, EMOTION_COUNT);

        expect(getPointerSegmentIndex(proudRotation, EMOTION_COUNT)).toBe(proudIndex);
        expect(getPointerSegmentIndex(proudRotation, EMOTION_COUNT)).not.toBe(scaredIndex);
    });
});
