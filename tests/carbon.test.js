import test from 'node:test';
import assert from 'node:assert';

function calculateCarbon(flightDist, flightClass, railDist, hotelNights) {
  const flight = parseFloat(flightDist) || 0;
  const rail = parseFloat(railDist) || 0;
  const hotel = parseFloat(hotelNights) || 0;

  const flightEF = flightClass === 'business' ? 0.28 : 0.15;
  const railEF = 0.04;
  const hotelEF = 15;

  const fTotal = flight * flightEF;
  const rTotal = rail * railEF;
  const hTotal = hotel * hotelEF;
  return Math.round(fTotal + rTotal + hTotal);
}

test('Carbon Formula: Zero inputs returns 0 kg CO2e', () => {
  assert.strictEqual(calculateCarbon(0, 'economy', 0, 0), 0);
});

test('Carbon Formula: Standard inputs calculation precision', () => {
  // 1000 * 0.15 = 150; 500 * 0.04 = 20; 2 * 15 = 30 => Total = 200
  assert.strictEqual(calculateCarbon(1000, 'economy', 500, 2), 200);
});

test('Carbon Formula: Business class emission factor multiplier', () => {
  // 1000 * 0.28 = 280; 0; 0 => Total = 280
  assert.strictEqual(calculateCarbon(1000, 'business', 0, 0), 280);
});

test('Carbon Formula: Sanitizes non-numeric strings and negative numbers', () => {
  const val = calculateCarbon('invalid', 'economy', -10, 'NaN');
  assert.strictEqual(typeof val, 'number');
  assert.ok(!isNaN(val));
});

test('Carbon Formula: Handles extreme float precision without overflowing', () => {
  const val = calculateCarbon(1e6, 'business', 5000, 100);
  assert.strictEqual(val, 281700);
});
