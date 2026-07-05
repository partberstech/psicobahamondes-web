const ts = require('typescript');
const fs = require('fs');
const code = fs.readFileSync('components/TestRapido.tsx', 'utf8');
const sf = ts.createSourceFile('TestRapido.tsx', code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
if (sf.parseDiagnostics.length === 0) {
  console.log('PARSE OK - no syntax errors');
  process.exit(0);
} else {
  sf.parseDiagnostics.forEach(d => {
    const pos = ts.getLineAndCharacterOfPosition(sf, d.start);
    console.log(`LINE ${pos.line + 1}: ${ts.flattenDiagnosticMessageText(d.messageText, '\n')}`);
  });
  process.exit(1);
}
