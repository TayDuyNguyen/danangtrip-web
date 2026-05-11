#!/usr/bin/env python3
"""
DanangTrip Web checklist runner.

Runs native repository checks in a practical order.
"""

import sys
import subprocess
import argparse
from pathlib import Path
from typing import List


CHECKS = [
    ("Lint", ["npm", "run", "lint"]),
    ("Typecheck", ["npm", "run", "typecheck"]),
    ("Route Check", ["npm", "run", "check:routes"]),
    ("Build", ["npm", "run", "build"]),
    ("Prepush Check", ["npm", "run", "prepush:check"]),
]

OPTIONAL_CHECKS = [
    ("Vitest", ["npx", "vitest", "run"]),
]


def run(name: str, command: List[str], cwd: Path) -> bool:
    print(f"Running {name}: {' '.join(command)}")
    result = subprocess.run(command, cwd=str(cwd), capture_output=True, text=True)
    if result.returncode == 0:
        print(f"PASS {name}")
        return True
    print(f"FAIL {name}")
    if result.stderr:
        print(result.stderr[:500])
    return False


def main() -> None:
    parser = argparse.ArgumentParser(description="Run DanangTrip Web native checks")
    parser.add_argument("project", help="Project path")
    parser.add_argument("--with-vitest", action="store_true", help="Also run npx vitest run")
    args = parser.parse_args()

    project = Path(args.project).resolve()
    if not project.exists():
        print(f"Project path does not exist: {project}")
        sys.exit(1)

    ok = True
    for name, command in CHECKS:
        if not run(name, command, project):
            ok = False
            break

    if ok and args.with_vitest:
        for name, command in OPTIONAL_CHECKS:
            ok = run(name, command, project) and ok

    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
