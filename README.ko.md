# `@naverpay/pite`

`@naverpay/pite`는 **라이브러리 개발을 위한 Vite 번들러 설정 패키지**입니다.  
`Vite`와 `Rollup`을 기반으로 하여 효율적인 번들링을 제공하며,  
**ESM(`.mjs`) 및 CJS(`.js`) 모듈 포맷을 지원**하고,  
**외부 의존성 자동 감지 및 폴리필 관리 기능**을 제공합니다.

## 🚀 주요 기능

- 📦 **다중 모듈 포맷 지원**: `ESM`(`.mjs`), `CJS`(`.js`) 출력 지원
- ⚡ **라이브러리 개발 최적화**: `Vite`와 `Rollup`을 활용한 번들링
- 🎯 **타겟 브라우저 설정 가능**: `browserslist`를 사용한 ES 빌드 타겟 지정
- 🔄 **자동 폴리필 주입**: `core-js-pure` 기반의 폴리필을 자동으로 삽입
- 🔧 **유연한 설정 지원**: 빌드 옵션 및 외부 의존성을 쉽게 설정 가능
- 🏗 **모듈 구조 유지**: `preserveModules` 기능을 유지하여 트리 셰이킹(Tree Shaking) 최적화
- 🔍 **빌드 검증**: 빌드 전/후 `publint` 통해 설정 및 결과물 검사

## 📥 설치

아래 명령어를 실행하여 개발 의존성으로 설치하세요.

```sh
npm install --save-dev @naverpay/pite
```

또는 `pnpm`을 사용할 경우:

```sh
pnpm add -D @naverpay/pite
```

## 📌 사용법

### 1️⃣ Vite 설정 파일 생성

`vite.config.ts` 파일에서 `createViteConfig`를 불러와 설정합니다.

```ts
import { createViteConfig } from '@naverpay/pite'

export default createViteConfig({
    cwd: process.cwd(), // 현재 작업 디렉토리
    entry: ['src/index.ts'], // 엔트리 파일
    outputs: [
        { format: 'es', dist: 'dist/es' }, // ES 모듈 출력 경로
        { format: 'cjs', dist: 'dist/cjs' }, // CJS 모듈 출력 경로
    ],
    cssFileName: 'style.css', // CSS 파일 출력 이름
    allowedPolyfills: ['fetch', 'Promise'], // 허용할 폴리필 목록
    ignoredPolyfills: ['Symbol'], // 제외할 폴리필 목록
    options: {
        minify: true, // 코드 압축 여부
        sourcemap: true, // 소스맵 생성 여부
    },
})
```

### 2️⃣ 라이브러리 빌드 실행

아래 명령어를 실행하여 라이브러리를 번들링할 수 있습니다.

```sh
vite build
```

빌드가 완료되면, `dist/es`, `dist/cjs` 디렉토리에 번들된 파일이 생성됩니다.

---

## ⚙️ 설정 옵션

| 옵션명             | 타입                                      | 설명                                                                                                            |
| ------------------ | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `cwd`              | `string`                                  | 현재 작업 디렉토리 (기본값: `'.'`)                                                                              |
| `entry`            | `string[]`                                | 엔트리 파일 경로 (glob 패턴 허용)                                                                               |
| `outputs`          | `{format: 'es' \| 'cjs'; dist: string}[]` | 출력할 모듈 포맷 및 디렉토리 지정                                                                               |
| `cssFileName`      | `string`                                  | 출력될 CSS 파일 이름                                                                                            |
| `allowedPolyfills` | `string[]`                                | 허용할 폴리필 목록<br/>(폴리필을 runtime으로 포함하여 빌드)                                                     |
| `ignoredPolyfills` | `string[]`                                | 제외할 폴리필 목록<br/>(오류를 무시하고 폴리필 없이 빌드, 일반적으로 사용하지 않는 최신 스펙을 무시하는데 사용) |
| `options`          | `BuildOptions`                            | 추가적인 Vite 빌드 옵션                                                                                         |

---

## 🎉 Why use pite?

### vite/tsup의 한계

- vite로 라이브러리를 번들링한 경험이 없다면 설정이 어려움
- 여러 라이브러리를 운영할 경우 동일한 번들링 설정이 반복됨
- `browserslist` 기반으로 폴리필이 필요한지 판단하는 기능이 기본적으로 제공되지 않아서, 폴리필 처리가 까다롭고 사전 지식 필요
- vite와 [tsup](https://github.com/egoist/tsup)을 함께 사용할 경우 별도의 설정 필요
- tsup 단독으로 빌드할 경우, tsup이 esbuild 기반이기 때문에 풍부한 생태계를 가진 rollup-plugin 사용 불가능

> pite를 통해 정형화된 vite config preset 제공

### Dual package build 지원

- ESM 및 CJS 형식을 모두 지원
- glob 패턴을 사용해 subpath 지정 가능
- 모듈 시스템별 output path 지정 가능

### `browserslist` 기반 트랜스파일링

- 사용처에 `.browserslistrc`가 있다면 이를 기반으로 트랜스파일
- 별도 설정이 없다면 [네이버페이에서 사용중인 쿼리 (@naverpay/browserslist-config)](https://github.com/NaverPayDev/browserslist-config#readme)를 기준으로 트랜스파일

### 폴리필 자동 판단 및 최적화

- `browserslist`를 기반으로 폴리필이 필요한 코드가 포함된 경우 이를 감지하여 안내
- 폴리필이 필요한 경우, [runtime](https://github.com/rollup/plugins/tree/master/packages/babel#babelhelpers) 방식으로 적용하여 패키지 최적화
- 전역 오염으로부터 안전한 core-js-pure 지원

### 라이브러리 빌드 Best Practice 제시

- entry path 검사 기능을 제공하여 최적의 디렉토리 구조 제시
- preserveModules, preserveDirectives 지원
- `package.json`에서 자동으로 외부 의존성을 감지하여 번들에서 제외
  - `dependencies`, `peerDependencies` 등 기본으로 제외 처리

### `publint`를 이용한 빌드 검증

- 빌드 전 `package.json` 구조 검증
- 빌드 후 결과물의 정합성 검사

### 자체 `vite-tsup-plugin`

- 사용처에서 별도의 tsup 설정 없이 즉시 사용 가능
- 선언 파일(`.d.ts`)을 모듈 시스템별(ESM, CJS)로 빌드
- [`vite-plugin-dts` module resolution 이슈 해소](https://github.com/NaverPayDev/pite/issues/27)
- tsup만 사용했을 때와 달리 번들링을 rollup으로 하기 때문에 rollup-plugin 사용 가능

## 🤖 How pite works

### 트랜스파일/폴리필 처리

- [browserslist-to-esbuild](https://github.com/marcofugaro/browserslist-to-esbuild#readme)를 사용하여 browserslist 읽은 후 esbuild가 이해할 수 있도록 targets으로 변환
- browserslist 기준으로 트랜스파일링 / 폴리필 검사
- 폴리필이 필요한 경우 [core-js-pure (3.39.0)](https://github.com/babel/babel-polyfills/tree/main/packages/babel-plugin-polyfill-corejs3)를 runtime으로 [@rollup/plugin-babel](https://github.com/rollup/plugins), [@babel/plugin-transform-runtime](https://babeljs.io/docs/babel-plugin-transform-runtime) 사용하여 주입

### TypeScript 파일 처리

자체 `vite-tsup-plugin`를 통해 tsup 실행코드를 플러그인화하여 선언 파일 생성

### 빌드 결과물 검사

자체 `rollup-plugin-publint`를 통해 빌드 전 `package.json` 구조 검사, 빌드 후 빌드 결과물 검사

## 📜 라이선스

MIT License © 2025 NaverPay
