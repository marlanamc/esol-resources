import test from "node:test";
import assert from "node:assert/strict";
import {
  getAssignmentDueDisplay,
  getCurrentMakeUpDeadline,
  getMakeUpDeadlineForDueDate,
  isWithinMakeUpWindow,
} from "@/lib/catch-up-deadlines";

test("getMakeUpDeadlineForDueDate returns the Monday after a Thursday due date", () => {
  const thursday = new Date("2026-05-21T12:00:00");
  const deadline = getMakeUpDeadlineForDueDate(thursday);

  assert.equal(deadline.getDay(), 1);
  assert.equal(deadline.getHours(), 18);
  assert.equal(deadline.getDate(), 25);
});

test("getCurrentMakeUpDeadline returns this Monday before 6pm on Monday morning", () => {
  const mondayMorning = new Date("2026-05-25T10:00:00");
  const deadline = getCurrentMakeUpDeadline(mondayMorning);

  assert.equal(deadline.getDay(), 1);
  assert.equal(deadline.getHours(), 18);
  assert.equal(deadline.getDate(), 25);
});

test("getCurrentMakeUpDeadline rolls forward after Monday 6pm", () => {
  const mondayEvening = new Date("2026-05-25T19:00:00");
  const deadline = getCurrentMakeUpDeadline(mondayEvening);

  assert.equal(deadline.getDay(), 1);
  assert.equal(deadline.getDate(), 1);
});

test("isWithinMakeUpWindow stays open after the original due date until Monday 6pm", () => {
  const thursdayDue = new Date("2026-05-21T12:00:00");
  const saturday = new Date("2026-05-23T12:00:00");

  assert.equal(isWithinMakeUpWindow(thursdayDue, saturday), true);
});

test("getAssignmentDueDisplay shows make-up label for overdue items still in the window", () => {
  const thursdayDue = new Date("2026-05-21T12:00:00");
  const saturday = new Date("2026-05-23T12:00:00");
  const display = getAssignmentDueDisplay(thursdayDue, saturday);

  assert.ok(display);
  assert.equal(display.tone, "makeup");
  assert.match(display.label, /Make-up due/i);
});

test("getAssignmentDueDisplay shows overdue after the make-up window closes", () => {
  const thursdayDue = new Date("2026-05-21T12:00:00");
  const tuesdayAfter = new Date("2026-05-26T12:00:00");
  const display = getAssignmentDueDisplay(thursdayDue, tuesdayAfter);

  assert.ok(display);
  assert.equal(display.tone, "overdue");
});
