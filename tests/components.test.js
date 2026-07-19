import test from 'node:test';
import assert from 'node:assert';

test('Component System: Role-based navigation active state calculator', () => {
  function getActiveTabClass(currentRole, targetRole) {
    return currentRole === targetRole
      ? 'text-primary-fixed-dim border-b-2 border-primary-fixed-dim bg-surface-container-high shadow-sm'
      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high';
  }

  assert.ok(getActiveTabClass('fan', 'fan').includes('border-primary-fixed-dim'));
  assert.ok(getActiveTabClass('ops', 'fan').includes('text-on-surface-variant'));
});

test('Component System: Anomaly MSE alert threshold trigger', () => {
  function evaluateMSE(mse) {
    if (mse > 0.7) {
      return { isAlarm: true, status: `CRITICAL ANOMALY: MSE ${mse.toFixed(3)}` };
    }
    return { isAlarm: false, status: 'No Active Alerts' };
  }

  const normal = evaluateMSE(0.2);
  assert.strictEqual(normal.isAlarm, false);

  const critical = evaluateMSE(0.85);
  assert.strictEqual(critical.isAlarm, true);
  assert.ok(critical.status.includes('CRITICAL ANOMALY'));
});

test('Component System: Radio Voice Input Logger formatter', () => {
  function formatRadioLog(text, isVoice) {
    return {
      text: isVoice ? `🎙️ VOICE RADIO REPORT: "${text}"` : text,
      timestamp: '19:40'
    };
  }

  const formatted = formatRadioLog('Clear Sector North', true);
  assert.ok(formatted.text.includes('VOICE RADIO REPORT'));
});
