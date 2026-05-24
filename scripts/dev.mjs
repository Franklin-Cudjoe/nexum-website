import { spawn, spawnSync } from 'node:child_process';

const tasks = [
  {
    label: 'frontend',
    args: ['--workspace', 'nexum-website', 'run', 'dev'],
  },
  {
    label: 'backend',
    args: ['--workspace', 'nexum-backend', 'run', 'dev'],
  },
];

const children = new Set();
let stopping = false;

function pipeWithLabel(stream, label, output) {
  let buffer = '';

  stream.on('data', (chunk) => {
    buffer += chunk.toString();
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (line.trim().length > 0) {
        output.write(`[${label}] ${line}\n`);
      }
    }
  });

  stream.on('end', () => {
    if (buffer.trim().length > 0) {
      output.write(`[${label}] ${buffer}\n`);
    }
  });
}

function stopAll(exitCode = 0) {
  if (stopping) return;
  stopping = true;
  process.exitCode = exitCode;

  for (const child of children) {
    if (!child.killed) {
      if (process.platform === 'win32' && child.pid) {
        spawnSync('taskkill', ['/pid', String(child.pid), '/t', '/f'], {
          stdio: 'ignore',
          windowsHide: true,
        });
      } else {
        child.kill();
      }
    }
  }
}

function startTask({ label, args }) {
  const command = process.platform === 'win32' ? (process.env.ComSpec ?? 'cmd.exe') : 'npm';
  const commandArgs =
    process.platform === 'win32'
      ? ['/d', '/s', '/c', ['npm', ...args].join(' ')]
      : args;

  const child = spawn(command, commandArgs, {
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
  });

  children.add(child);
  pipeWithLabel(child.stdout, label, process.stdout);
  pipeWithLabel(child.stderr, label, process.stderr);

  child.on('exit', (code, signal) => {
    children.delete(child);

    if (stopping) return;

    const exitCode = code ?? 1;
    const reason = signal ? `signal ${signal}` : `exit code ${exitCode}`;
    console.error(`[dev] ${label} stopped with ${reason}`);
    stopAll(exitCode);
  });

  child.on('error', (error) => {
    console.error(`[dev] failed to start ${label}: ${error.message}`);
    stopAll(1);
  });
}

process.on('SIGINT', () => stopAll(0));
process.on('SIGTERM', () => stopAll(0));
process.on('exit', () => stopAll(process.exitCode ?? 0));

for (const task of tasks) {
  startTask(task);
}
