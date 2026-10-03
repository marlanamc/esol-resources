# Unit checklist builder

Builds the PDF student handout from the current Unit vocabulary sources.

## Running it

This script needs `reportlab` (and `fonttools`/`pypdf` if you're converting fonts or
checking page counts), which live in the project's local virtualenv at `.venv/`, not
your regular `python3`. Plain `python3` will fail with
`ModuleNotFoundError: No module named 'reportlab'`.

Either activate the venv once per terminal session:

```sh
source .venv/bin/activate
python3 FY27/worksheets/unit-checklists/build-unit1-checklist.py
```

or call the venv's Python directly every time:

```sh
.venv/bin/python FY27/worksheets/unit-checklists/build-unit1-checklist.py
```

(`.venv/` is gitignored and local to this machine — if it's missing, recreate it with
`python3 -m venv .venv && .venv/bin/pip install reportlab`.)
