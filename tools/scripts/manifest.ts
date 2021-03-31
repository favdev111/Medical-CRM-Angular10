import * as execa from 'execa';
import * as fs from 'fs';
import * as path from 'path';

const appName = process.argv[2];

(async () => {

  if(!appName) {
    console.log('\x1b[31m', 'ERROR: Specify application name as parameter!');
    return false;
  }

  const packageJsonPath = path.join(__dirname, '../../package.json');
  const { version } = JSON.parse(fs.readFileSync(packageJsonPath, { encoding: 'utf8' }));
  const { stdout: commitId } = await execa('git', ['rev-parse', '--short', 'HEAD']);

  const manifestPath = path.join(__dirname, `../../dist/guidelinesConfigTool/app-manifest.json`);
  const manifest = JSON.parse(fs.readFileSync(manifestPath, { encoding: 'utf8' }));

  manifest.version = `${version}-sha.${commitId}.`;
  manifest.buildId = process.env.BUILD_NUMBER;

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

})();
