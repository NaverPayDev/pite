# `@naverpay/pite`

`@naverpay/pite`는 **라이브러리 개발을 위한 Vite 번들러 설정 패키지**입니다.  
`Vite`와 `Rollup`을 기반으로 하여 효율적인 번들링을 제공하며,  
**ESM(`.mjs`) 및 CJS(`.js`) 모듈 포맷을 지원**하고,  
**외부 의존성 자동 감지 및 폴리필 관리 기능**을 제공합니다.

## 🚀 주요 기능

- 📦 **다중 모듈 포맷 지원**: `ESM`(`.mjs`), `CJS`(`.js`) 출력 지원
- ⚡ **라이브러리 개발 최적화**: `Vite`와 `Rollup`을 활용한 번들링
- 🎯 **타겟 브라우저 설정 가능**: `browserslist`를 사용한 ES 빌드 타겟 지정
- 🔄 **자동 폴리필 주입**: `core-js` 기반의 폴리필을 자동으로 삽입
- 🔧 **유연한 설정 지원**: 빌드 옵션 및 외부 의존성을 쉽게 설정 가능
- 🏗 **모듈 구조 유지**: `preserveModules` 기능을 유지하여 트리 셰이킹(Tree Shaking) 최적화

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

| 옵션명                | 타입                           | 설명 |
|----------------------|----------------------------|-------------|
| `cwd`               | `string`                    | 현재 작업 디렉토리 (기본값: `'.'`) |
| `entry`             | `string[]`                  | 엔트리 파일 경로 |
| `outputs`           | `{format: 'es' \| 'cjs'; dist: string}[]` | 출력할 모듈 포맷 및 디렉토리 지정 |
| `cssFileName`       | `string`                    | 출력될 CSS 파일 이름 |
| `allowedPolyfills`  | `string[]`                  | 허용할 폴리필 목록 |
| `ignoredPolyfills`  | `string[]`                  | 제외할 폴리필 목록 |
| `options`           | `BuildOptions`              | 추가적인 Vite 빌드 옵션 |

---

## 📦 외부 의존성 처리

`createViteConfig`는 자동으로 `package.json`의 의존성을 감지하여 번들에서 제외합니다.  
필요할 경우, 특정 의존성을 수동으로 추가할 수도 있습니다.

---

## 🔄 폴리필 관리

`@naverpay/pite`는 `babel-plugin-polyfill-corejs3`을 사용하여  
**필요한 폴리필만 포함하도록 최적화**합니다.  
이를 통해 불필요한 코드 증가를 방지하고, 최적의 브라우저 호환성을 유지할 수 있습니다.

---

## 📜 라이선스

MIT License © 2025 NaverPay
