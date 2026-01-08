const fs = require("fs");
const path = require("path");
const ts = require("typescript");

const grammarDir = "src/content/grammar";
const files = fs.readdirSync(grammarDir).filter((f) => f.endsWith(".ts"));

function getPropertyNameText(nameNode) {
  if (!nameNode) return null;
  if (ts.isIdentifier(nameNode)) return nameNode.text;
  if (ts.isStringLiteral(nameNode)) return nameNode.text;
  return null;
}

function getStringLiteralText(node) {
  if (!node) return null;
  if (ts.isStringLiteral(node)) return node.text;
  if (ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  return null;
}

function findSectionsArrayLiteral(sourceFile) {
  let found = null;

  function visit(node) {
    if (found) return;

    if (
      ts.isPropertyAssignment(node) &&
      getPropertyNameText(node.name) === "sections" &&
      ts.isArrayLiteralExpression(node.initializer)
    ) {
      found = node.initializer;
      return;
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return found;
}

let totalSections = 0;
let sectionsWithExercises = 0;
let sectionsWithoutExercises = 0;
const missingExercises = [];

files.forEach((file) => {
  const filePath = path.join(grammarDir, file);
  const content = fs.readFileSync(filePath, "utf8");
  const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

  const sectionsArray = findSectionsArrayLiteral(sourceFile);
  if (!sectionsArray) return;

  const elements = sectionsArray.elements.filter(ts.isObjectLiteralExpression);

  elements.forEach((sectionNode, idx) => {
    totalSections++;

    let title = `Section ${idx + 1}`;
    let hasExercises = false;

    for (const prop of sectionNode.properties) {
      if (!ts.isPropertyAssignment(prop)) continue;
      const propName = getPropertyNameText(prop.name);

      if (propName === "title") {
        const titleText = getStringLiteralText(prop.initializer);
        if (titleText) title = titleText;
      }

      if (propName === "exercises" && ts.isArrayLiteralExpression(prop.initializer)) {
        hasExercises = true;
      }
    }

    if (hasExercises) {
      sectionsWithExercises++;
    } else {
      sectionsWithoutExercises++;
      missingExercises.push({ file, title });
    }
  });
});

console.log('=== GRAMMAR ACTIVITIES EXERCISE AUDIT ===\n');
console.log(`Total sections: ${totalSections}`);
console.log(`Sections WITH exercises: ${sectionsWithExercises}`);
console.log(`Sections WITHOUT exercises: ${sectionsWithoutExercises}`);
console.log(`\nPercentage with exercises: ${((sectionsWithExercises / totalSections) * 100).toFixed(1)}%`);
console.log(`\nFiles with missing exercises:`);

// Group by file
const byFile = {};
missingExercises.forEach(m => {
  if (!byFile[m.file]) byFile[m.file] = [];
  byFile[m.file].push(m.title);
});

Object.keys(byFile).sort().forEach(file => {
  console.log(`\n  ${file}: ${byFile[file].length} sections missing exercises`);
  byFile[file].slice(0, 5).forEach(title => {
    console.log(`    - "${title}"`);
  });
  if (byFile[file].length > 5) {
    console.log(`    ... and ${byFile[file].length - 5} more`);
  }
});








