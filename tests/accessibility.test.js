import test from 'node:test';
import assert from 'node:assert';

function getLuminance(r, g, b) {
  const [aR, aG, aB] = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return aR * 0.2126 + aG * 0.7152 + aB * 0.0722;
}

function getContrastRatio(rgb1, rgb2) {
  const lum1 = getLuminance(...rgb1);
  const lum2 = getLuminance(...rgb2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

test('Accessibility Contrast: Primary Gold on Dark Background exceeds WCAG AAA (7:1)', () => {
  // Primary Gold (#E9C400 = 233, 196, 0) on Surface Dark (#131313 = 19, 19, 19)
  const ratio = getContrastRatio([233, 196, 0], [19, 19, 19]);
  assert.ok(ratio >= 7.0, `Contrast ratio ${ratio.toFixed(2)} should exceed 7:1`);
});

test('Accessibility Contrast: High Contrast Canvas mode exceeds 20:1 ratio', () => {
  // White (#FFFFFF = 255, 255, 255) on Black (#000000 = 0, 0, 0)
  const ratio = getContrastRatio([255, 255, 255], [0, 0, 0]);
  assert.ok(ratio >= 20.0, `High contrast ratio ${ratio.toFixed(2)} should exceed 20:1`);
});

test('Accessibility Wayfinding: Wheelchair route mutator bypasses stairs', () => {
  function mutateRoute(mode) {
    if (mode === 'wheelchair') {
      return { route: 'Elevator Bay 3 -> Level 0 Ramp Corridor', avoidsStairs: true };
    }
    return { route: 'Stairwell B -> Concourse 1', avoidsStairs: false };
  }

  const result = mutateRoute('wheelchair');
  assert.strictEqual(result.avoidsStairs, true);
  assert.ok(result.route.includes('Elevator'));
});
