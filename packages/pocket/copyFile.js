const glob = require('glob');
const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const babel = require('@babel/core');

glob.sync('**/*.less', { cwd: './src' }).forEach((filePath) => {
  fs.mkdirSync(path.join('./lib', path.dirname(filePath)), { recursive: true });
  fs.mkdirSync(path.join('./esm', path.dirname(filePath)), { recursive: true });
  fs.copyFileSync(path.join('./src', filePath), path.join('./lib', filePath));
  fs.copyFileSync(path.join('./src', filePath), path.join('./esm', filePath));
});

// glob.sync('*/style', { cwd: './src' }).map((filePath) => {
//   let input = path.join('./src', filePath, 'index.ts');
//   if (fs.existsSync(input)) {
//     const output = path.join('./lib', filePath, 'index.js');
//     const outputEs = path.join('./esm', filePath, 'index.js');
//     const code = fs.readFileSync(input).toString();
//     babel.transform(
//       code,
//       {
//         presets: ['@babel/preset-env'],
//       },
//       (err, res) => {
//         if (err) {
//           console.error(err);
//           return;
//         }
//         fs.mkdirSync(path.dirname(output), { recursive: true });
//         fs.writeFileSync(output, res.code);
//       },
//     );
//
//     fs.mkdirSync(path.dirname(outputEs), { recursive: true });
//     fs.writeFileSync(outputEs, code);
//   }
// });
