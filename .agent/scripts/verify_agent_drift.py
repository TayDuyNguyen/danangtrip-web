#!/usr/bin/env python3
"""
Basic drift checker between .agent docs and the real DanangTrip Web repo.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="replace")


def package_has(package_json: dict, dep_name: str) -> bool:
    deps = package_json.get("dependencies", {})
    dev_deps = package_json.get("devDependencies", {})
    return dep_name in deps or dep_name in dev_deps


def main() -> None:
    parser = argparse.ArgumentParser(description="Verify .agent docs against DanangTrip Web repo reality")
    parser.add_argument("project", help="Project path")
    args = parser.parse_args()

    project = Path(args.project).resolve()
    agent_root = project / ".agent"
    package_json_path = project / "package.json"

    if not package_json_path.exists():
        print(f"FAIL missing package.json: {package_json_path}")
        sys.exit(1)

    package_json = json.loads(read_text(package_json_path))
    stack_index = read_text(agent_root / "skills" / "STACK_SKILLS_INDEX.md")
    issues: list[str] = []

    if "| Forms | react-hook-form" in stack_index:
        if not package_has(package_json, "react-hook-form"):
            issues.append("Skill docs mention react-hook-form but package.json does not declare it.")

    if "zodResolver" in stack_index:
        if not package_has(package_json, "@hookform/resolvers"):
            issues.append("Skill docs mention zodResolver but package.json does not declare @hookform/resolvers.")

    required_paths = [
        project / "src" / "app",
        project / "src" / "middleware.ts",
        project / "src" / "i18n" / "routing.ts",
    ]
    for path in required_paths:
        if not path.exists():
            issues.append(f"Expected path missing: {path}")

    if issues:
        print("FAIL drift detected")
        for issue in issues:
            print(f"- {issue}")
        sys.exit(1)

    print("PASS no obvious .agent drift detected")


if __name__ == "__main__":
    main()
