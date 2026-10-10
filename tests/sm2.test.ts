import { test } from "node:test";
import assert from "node:assert/strict";
import {
  calculateNextReview,
  calculateRetentionRate,
  getDueCards,
  getDifficultyLevel,
  initializeCard,
  type SM2Card,
} from "../src/lib/spaced-repetition";

const freshCard = (): SM2Card => ({
  easeFactor: 2.5,
  interval: 1,
  repetitions: 0,
  nextReviewDate: new Date(),
});

test("initializeCard returns default SM-2 values", () => {
  const card = initializeCard();
  assert.equal(card.easeFactor, 2.5);
  assert.equal(card.interval, 1);
  assert.equal(card.repetitions, 0);
});

test("quality < 3 resets repetitions and interval to 1", () => {
  const result = calculateNextReview(2, {
    ...freshCard(),
    repetitions: 4,
    interval: 15,
  });
  assert.equal(result.repetitions, 0);
  assert.equal(result.interval, 1);
});

test("first successful review sets interval to 1 day", () => {
  const result = calculateNextReview(5, freshCard());
  assert.equal(result.repetitions, 1);
  assert.equal(result.interval, 1);
});

test("second successful review sets interval to 6 days", () => {
  const first = calculateNextReview(5, freshCard());
  const second = calculateNextReview(5, first);
  assert.equal(second.repetitions, 2);
  assert.equal(second.interval, 6);
});

test("later reviews multiply interval by ease factor", () => {
  let card = calculateNextReview(4, freshCard());
  card = calculateNextReview(4, card);
  const expected = Math.round(card.interval * card.easeFactor);
  const result = calculateNextReview(4, card);
  assert.equal(result.interval, expected);
});

test("ease factor never drops below 1.3", () => {
  let card = freshCard();
  for (let i = 0; i < 10; i++) {
    card = calculateNextReview(0, {
      ...card,
      repetitions: 5,
      interval: 10,
    });
  }
  assert.ok(card.easeFactor >= 1.3, `easeFactor was ${card.easeFactor}`);
});

test("perfect reviews do not decrease ease factor", () => {
  const before = freshCard().easeFactor;
  const result = calculateNextReview(5, freshCard());
  assert.ok(result.easeFactor >= before);
});

test("nextReviewDate is pushed into the future", () => {
  const result = calculateNextReview(5, freshCard());
  assert.ok(result.nextReviewDate.getTime() > Date.now());
});

test("calculateRetentionRate returns 0 for no reviews", () => {
  assert.equal(calculateRetentionRate([]), 0);
});

test("calculateRetentionRate maps quality 5 to 100%", () => {
  const rate = calculateRetentionRate([
    { quality: 5, date: new Date() },
    { quality: 5, date: new Date() },
  ]);
  assert.equal(rate, 100);
});

test("calculateRetentionRate weights recent reviews more", () => {
  const goodRecent = calculateRetentionRate([
    { quality: 0, date: new Date() },
    { quality: 5, date: new Date() },
  ]);
  const badRecent = calculateRetentionRate([
    { quality: 5, date: new Date() },
    { quality: 0, date: new Date() },
  ]);
  assert.ok(goodRecent > badRecent, `${goodRecent} should beat ${badRecent}`);
});

test("getDueCards returns only overdue cards", () => {
  const past = new Date(Date.now() - 1000);
  const future = new Date(Date.now() + 1000 * 60 * 60);
  const due = getDueCards([{ nextReviewDate: past }, { nextReviewDate: future }]);
  assert.equal(due.length, 1);
  assert.equal(due[0].nextReviewDate.getTime(), past.getTime());
});

test("getDifficultyLevel buckets by ease factor", () => {
  assert.equal(getDifficultyLevel(2.5), "easy");
  assert.equal(getDifficultyLevel(2.0), "medium");
  assert.equal(getDifficultyLevel(1.3), "hard");
});
