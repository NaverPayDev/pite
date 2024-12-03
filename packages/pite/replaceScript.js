/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs')
const path = require('path')

/**
 * dist 내부에 copy된 package.json의 export경로를 변경하기위한 스크립트
 * 내부 모노레포 test 패키지에서 바로 pite를 테스트하기위해서는 package.json에 dist가 필요
 * 외부에 배포될 dist 내부의 복사된 package.json의 dist를 제거
 */

// dist에 copy된 package.json 파일 경로
const packageJsonPath = path.join(process.cwd(), 'dist/package.json')
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
const packageJsonString = JSON.stringify(packageJson, null, 4)
// /dist/esm, /dist/cjs -. /esm, /cjs 변경
const replacedPackageJsonString = packageJsonString.replace(/\/dist\/esm/g, '/esm').replace(/\/dist\/cjs/g, '/cjs')

// 수정된 package.json 파일 저장
fs.writeFileSync(packageJsonPath, replacedPackageJsonString)
