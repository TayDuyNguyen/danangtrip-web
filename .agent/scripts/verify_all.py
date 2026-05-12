#!/usr/bin/env python3
"""
DanangTrip Web full verification runner.
"""

import sys
import subprocess
import argparse
from pathlib import Path
from datetime import datetime
from typing import List, Tuple


CHECKS: List[Tuple[str, List[str], bool]] = [
    ("Lint", ["npm", "run", "lint"], True),
    ("Typecheck", ["npm", "run", "typecheck"], True),
    ("Route Check", ["npm", "run", "check:routes"], True),
    ("Build", ["npm", "run", "build"], True),
    ("Prepush Check", ["npm", "run", "prepush:check"], True),
    ("Vitest", ["npx", "vitest", "run"], False),
]


def run(name: str, command: List[str], cwd: Path) -> bool:
    started = datetime.now()
    print(f"Running {name}: {' '.join(command)}")
    result = subprocess.run(command, cwd=str(cwd), capture_output=True, text=True)
    duration = (datetime.now() - started).total_seconds()
    if result.returncode == 0:
        print(f"PASS {name} ({duration:.1f}s)")
        return True
    print(f"FAIL {name} ({duration:.1f}s)")
    if result.stderr:
        print(result.stderr[:500])
    return False


def main() -> None:
    parser = argparse.ArgumentParser(description="Run DanangTrip Web full verification")
    parser.add_argument("project", help="Project path")
    parser.add_argument("--with-vitest", action="store_true", help="Include npx vitest run")
    args = parser.parse_args()

    project = Path(args.project).resolve()
    if not project.exists():
        print(f"Project path does not exist: {project}")
        sys.exit(1)

    checks = CHECKS if args.with_vitest else CHECKS[:-1]
    ok = True
    for name, command, required in checks:
        passed = run(name, command, project)
        if not passed:
            ok = False
            if required:
                break

    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
