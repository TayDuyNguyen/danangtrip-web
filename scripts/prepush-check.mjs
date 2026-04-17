/**
 * prepush-check.mjs
 * ─────────────────────────────────────────────────────────────────
 * DaNangTrip Web — Pre-push Quality Gate
 * Bắt lỗi toàn hệ thống trước khi đẩy code lên Git.
 *
 * Usage:  npm run prepush:check
 * ─────────────────────────────────────────────────────────────────
 */

import { spawn } from 'child_process';

// ─── Colors ─────────────────────────────────────────────────────
const c = {
  reset:  '\x1b[0m',
  bold:   '\x1b[1m',
  red:    '\x1b[31m',
  green:  '\x1b[32m',
  yellow: '\x1b[33m',
  cyan:   '\x1b[36m',
  gray:   '\x1b[90m',
};

// ─── Check Steps ─────────────────────────────────────────────────
const steps = [
  {
    name:    '🔍 ESLint — Lint',
    command: 'npm',
    args:    ['run', 'lint'],
    fix:     'Run: npm run lint:fix',
  },
  {
    name:    '🔷 TypeScript — Type Check',
    command: 'npm',
    args:    ['run', 'typecheck'],
    fix:     'Open IDE and fix TypeScript errors shown in the Problems panel',
  },
  {
    name:    '🏗️  Next.js — Production Build',
    command: 'npx',
    args:    ['cross-env', "NODE_OPTIONS='--max-old-space-size=4096'", 'npm', 'run', 'build'],
    fix:     'Fix build errors shown above (missing env vars, bad imports, etc.)',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────
function printDivider() {
  console.log(`${c.gray}${'─'.repeat(60)}${c.reset}`);
}

function runStep(step) {
  return new Promise((resolve) => {
    console.log(`\n${printDivider() ?? ''}${c.cyan}${c.bold}▶ ${step.name}${c.reset}`);

    const child = spawn(`${step.command} ${step.args.join(' ')}`, {
      stdio: 'inherit',
      shell: true,
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log(`${c.green}✔ Passed!${c.reset}`);
        resolve(true);
      } else {
        console.log(`\n${c.red}✘ Failed!${c.reset}`);
        console.log(`${c.yellow}💡 Fix: ${step.fix}${c.reset}`);
        resolve(false);
      }
    });
  });
}

// ─── Main ─────────────────────────────────────────────────────────
async function main() {
  console.log(`\n${c.bold}${'═'.repeat(60)}${c.reset}`);
  console.log(`${c.bold}  🚀 DaNangTrip Web — Pre-push Quality Gate${c.reset}`);
  console.log(`${c.bold}${'═'.repeat(60)}${c.reset}\n`);

  const results = [];

  for (const step of steps) {
    const passed = await runStep(step);
    results.push({ name: step.name, passed });

    // Fail fast — don't run build if lint/typecheck fails
    if (!passed) {
      break;
    }
  }

  // ─── Summary ──────────────────────────────────────────────────
  console.log(`\n${c.bold}${'═'.repeat(60)}${c.reset}`);
  console.log(`${c.bold}  📋 Summary${c.reset}`);
  console.log(`${c.bold}${'═'.repeat(60)}${c.reset}`);

  for (const r of results) {
    const icon   = r.passed ? `${c.green}✔` : `${c.red}✘`;
    const status = r.passed ? `${c.green}PASSED` : `${c.red}FAILED`;
    console.log(`  ${icon} ${r.name.padEnd(40)} ${status}${c.reset}`);
  }

  // Fill in skipped steps
  const ranCount = results.length;
  for (let i = ranCount; i < steps.length; i++) {
    console.log(`  ${c.gray}⏭  ${steps[i].name.padEnd(40)} SKIPPED${c.reset}`);
  }

  console.log('');

  const allPassed = results.every((r) => r.passed) && results.length === steps.length;

  if (allPassed) {
    console.log(`${c.green}${c.bold}✨ All checks passed! Safe to push.${c.reset}`);
    console.log('');
    process.exit(0);
  } else {
    console.log(`${c.red}${c.bold}⛔ Quality Gate FAILED. Fix the issues above before pushing.${c.reset}`);
    console.log('');
    process.exit(1);
  }
}

main();
