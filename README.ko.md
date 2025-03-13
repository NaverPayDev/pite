# `@naverpay/pite`

복잡한 설정 없이 라이브러리 빌드를 지원하는 vite 번들러 configuration 패키지입니다.

## Why pite?

[`vite`](https://github.com/vitejs/vite)는 Vue.js를 넘어 React 등 다양한 프레임워크를 지원하고, 라이브러리 모드(Library Mode)를 통해 라이브러리 번들링까지 포괄하는 범용적인 빌드 도구로 자리 잡았습니다. Rollup을 대체할 수 있는 패키지 번들러로 주목받고 있으며, 빠른 빌드 속도와 최적화된 번들링 환경을 제공합니다.  
하지만 라이브러리 빌드를 위한 **핵심 개념과 설정 방식에 대한 사전 지식이 없다면, 효율적인 설정 파일을 구성하는 것이 쉽지 않습니다.** vite의 라이브러리 모드를 효과적으로 활용하려면 다양한 요소를 고려해야 합니다.

[`tsup`](https://github.com/egoist/tsup)은 esbuild 기반의 번들러로, TypeScript 라이브러리를 손쉽게 번들링할 수 있어 기본적인 번들링 작업을 수행하는 데 유용합니다.  
**browserslist을 기반으로 폴리필 필요 여부를 판단하여 자동으로 삽입하거나, 트랜스파일링을 수행하는 기능은 없기 때문에 특정 환경에 최적화된 빌드가 필요하다면 이를 위한 추가적인 도구나 설정이 필요할 수 있습니다.**  
추가로, esbuild 기반이라는 특성상 Rollup과의 플러그인 호환성이 없기 때문에, Rollup의 풍부한 플러그인 생태계를 활용할 수 없다는 점도 고려해야 합니다.

이를 보완하기 위해, **pite는 보다 직관적이고 유연한 라이브러리 빌드 환경을 제공합니다.**  
`vite`와 `tsup`의 장점은 유지하면서도, 다양한 환경에 맞춘 빌드 설정을 손쉽게 구성할 수 있도록 Preset을 지원하여 복잡한 설정에 대한 부담없이 안정적인 라이브러리를 빌드할 수 있도록 합니다.

## Features

### Dual package build 지원

- ESM 및 CJS 형식을 모두 지원하며, ESM 전용 빌드도 가능합니다.
- glob 패턴을 사용해 subpath를 지정할 수 있습니다.
- 모듈 시스템별로 개별적인 output 경로를 설정할 수 있습니다.

### `browserslist` 기반 트랜스파일링

- [browserslist-to-esbuild](https://github.com/marcofugaro/browserslist-to-esbuild#readme)를 활용하여 `.browserslistrc`를 읽고, 이를 esbuild가 이해할 수 있는 `target` 형식으로 변환합니다. 이를 통해 별도로 빌드 target을 설정할 필요 없이, 사용처의 `.browserslistrc` 기준에 맞춰 최적화된 빌드를 자동으로 수행합니다.
- browserslist를 기반으로 트랜스파일링을 수행하여, 사용처에서 지정한 브라우저 환경에 맞는 코드로 변환합니다.
- 별도 설정이 없는 경우, 기본적으로 `@naverpay/browserslist-config`를 기준으로 트랜스파일링을 수행합니다.

> 📦 [`@naverpay/browserslist-config`](https://github.com/NaverPayDev/browserslist-config#readme)  
>
> [네이버페이에서 지원하는 브라우저 환경 범위](https://browsersl.ist/#q=%3E0.2%25%2Cnot+dead%2Cnot+op_mini+all%2Cnot+ie%3E%3D0%2Cnot+ios_saf%3C15%2Cios_saf%3E%3D15%2Cnode%3E%3D18.18.0%2CChrome%3E%3D106&region=KR)를 Shareable Browserslist Config로 제공하는 패키지 입니다.

### `browserslist` 기반 폴리필 자동 판단 및 최적화

- 사용처에 `.browserslistrc`가 있다면 이를 기반으로 폴리필이 필요한 코드가 포함되어 있는지 자동으로 감지하고 안내합니다.
- 폴리필이 필요한 경우, [runtime](https://github.com/rollup/plugins/tree/master/packages/babel#babelhelpers) 방식을 주입하여 불필요한 코드 중복을 방지하고 패키지 크기를 최적화합니다.
- 전역 오염을 방지하기 위해 [core-js-pure (3.39.0)](https://github.com/babel/babel-polyfills/tree/main/packages/babel-plugin-polyfill-corejs3)를 지원하여 안전한 환경에서 폴리필을 적용할 수 있습니다.

### 라이브러리 빌드 Best Practice 제시

- 라이브러리의 Entry Path를 검사하여 최적의 디렉토리 구조를 안내하는 기능을 제공합니다.
- `preserveModules`와 `preserveDirectives`을 기본으로 지원합니다.
  - `preserveModules`: 원본 소스의 디렉토리 구조를 유지한 채 번들링할 수 있습니다. 개별 모듈을 직접 가져다 사용할 수 있어서 트리쉐이킹(Tree Shaking)에 도움을 줍니다.
  - `preserveDirectives`: `'use client'`와 같은 디렉티브를 번들링 과정에서 유지하여 특정 실행 환경에서의 동작을 보장합니다.
- `package.json`에서 `dependencies`, `peerDependencies` 등 외부 의존성을 기본적으로 제외 처리하여 불필요한 코드가 포함되지 않도록 합니다.
- 기본적으로 Best Practice를 제공하지만, 필요에 따라 설정을 자유롭게 조정할 수 있도록 유연한 빌드 옵션을 지원합니다. 이를 통해 프로젝트 요구사항에 맞게 최적화된 빌드 구성을 쉽게 변경할 수 있습니다.

### `publint`를 이용한 빌드 검증

- 빌드 전 `@naverpay/publint`의 `verifyPackageJSON`를 실행하여, 패키지 publishing과 관련된 `package.json`의 필드가 제대로 작성되었는지 검사합니다. (ex. `main`, `files` 등)
- 빌드 후 `publint` API를 실행하여, `package.json`의 `main`, `exports` 등의 필드가 올바르게 설정되었는지 확인하고, 누락된 파일 등을 검사하여 결과물의 정합성을 확인합니다.

> 📦 [`publint`](https://publint.dev/docs/)
>
> publint는 npm 패키지의 linter로, vite, rollup 등 다양한 환경에서 최적의 호환성을 보장하도록 검사를 수행합니다.
>
> 📦 [`@naverpay/publint`](https://github.com/NaverPayDev/cli/tree/main/packages/publint)  
>
> publint에 영감을 받아 만들어진 패키지로, 네이버페이 내부 모범 사례를 충족하도록 하는 rule이 작성되어 있습니다.

### 자체 `vite-tsup-plugin`

- 사용처에서 별도의 tsup 설정 없이 빌드 환경을 구성할 수 있습니다.
- ESM과 CJS 각각 선언 파일(`.d.ts`)을 생성하여 다양한 환경에서 일관된 타입 정보를 제공합니다.
- [`vite-plugin-dts` 사용시 module resolution 이슈](https://github.com/NaverPayDev/pite/issues/27)를 해결하기 위해 tsup 실행 커맨드를 plugin으로 만들어 안정적인 타입 선언파일 생성을 지원합니다.
- tsup 단독으로 사용할 경우 Rollup 플러그인을 적용할 수 없지만, pite 사용시 풍부한 rollup-plugin 생태계를 그대로 이용할 수 있습니다.

## Install

아래 명령어를 실행하여 `devDependencies`로 설치하세요.

```sh
npm install --save-dev @naverpay/pite
```

또는 `pnpm`을 사용할 경우:

```sh
pnpm add -D @naverpay/pite
```

## Requirement

?

## How to use

### 1️⃣ Vite 설정 파일 생성

`vite.config.ts` 파일에서 `createViteConfig`를 불러와 설정합니다.

```ts
import { createViteConfig } from '@naverpay/pite'

export default createViteConfig({
    cwd: process.cwd(), 
    entry: ['src/index.ts'], 
    outputs: [
        { format: 'es', dist: 'dist/es' }, 
        { format: 'cjs', dist: 'dist/cjs' }, 
    ],
    cssFileName: 'style.css', 
    visualize: true,
    publint: {severity: 'error'}
    includeRequiredPolyfill: ['fetch', 'Promise'], 
    skipRequiredPolyfillCheck: ['Symbol'], 
    options: {
        minify: true, 
        sourcemap: true, 
    },
})
```

### 2️⃣ 라이브러리 빌드 실행

아래 명령어를 실행하여 라이브러리를 번들링할 수 있습니다.

```sh
vite build
```

빌드가 완료되면, `dist/es`, `dist/cjs` 디렉토리에 번들된 파일이 생성됩니다.

## Options

| 옵션명                     | 타입                                                    | 설명                                             |
|----------------------------|---------------------------------------------------------|--------------------------------------------------|
| *`entry`                    | `string` \| `string[]` \| `Record<string, string>`      | 엔트리 파일 경로 (glob 패턴 허용)                |
| `cwd`                      | `string`                                                | 현재 작업 디렉토리 (기본값: `'.'`)               |
| `outputs`                  | `{ format: 'es' \| 'cjs'; dist: string }[]`             | 출력할 모듈 포맷 및 디렉토리 지정                |
| `cssFileName`              | `string`                                                | 출력될 CSS 파일 이름                             |
| `visualize`                | `boolean` \| [`PluginVisualizerOptions`](https://github.com/btd/rollup-plugin-visualizer?tab=readme-ov-file#options) | [rollup-plugin-visualizer](https://github.com/btd/rollup-plugin-visualizer) 활성화 옵션 |
| `publint`                  | `{ severity?: 'error' \| 'warn' \| 'off' }`             | publint 검사의 심각도 지정<br />(`error`: 코드1로 종료, `warn`: 경고만 출력, `off`: 검사 끄기) |
| `includeRequiredPolyfill`  | `string[]`                                              | 주입이 필요한 폴리필 목록                        |
| `skipRequiredPolyfillCheck`| `string[]`                                              | 폴리필 검사를 건너뛰고 주입하지 않을 폴리필 목록 |
| `options`                  | [`BuildOptions`](https://ko.vite.dev/config/build-options) | 추가적인 Vite 빌드 옵션                          |

### `includeRequiredPolyfill` vs `skipRequiredPolyfillCheck`

pite는 기본적으로 현재 프로젝트의 `browserslist` 기준에 따라 폴리필이 필요한 코드가 감지되면 오류를 발생시킵니다.  
이를 통해 라이브러리가 예상치 못한 환경에서 정상적으로 동작하지 않는 문제를 사전에 방지할 수 있으며, 불필요한 폴리필이 포함되는 것을 막아 빌드 크기를 최적화할 수 있습니다.

`includeRequiredPolyfill`과 `skipRequiredPolyfillCheck` 옵션은 폴리필 검사 기준을 조정하고, 필요한 폴리필을 어떻게 처리할지 선택할 수 있도록 합니다. 이를 활용하면 프로젝트 요구 사항에 맞게 폴리필 적용 방식을 유연하게 조정할 수 있습니다.

- `includeRequiredPolyfill`은 특정 폴리필이 실제로 라이브러리 구동에 필요하다고 판단될 경우, 원하는 폴리필을 명시적으로 추가할 수 있도록 지원합니다. 옵션 값으로 주입할 폴리필 목록을 지정하면, 해당 기능이 원활하게 동작할 수 있도록 필요한 폴리필을 자동으로 포함합니다.  
폴리필은 runtime 방식으로 적용되며, 라이브러리 번들에 직접 포함되지 않습니다. 따라서, 사용처의 dependencies에 `core-js-pure@3.x`가 설치되어 있어야 정상적으로 동작합니다.
- `skipRequiredPolyfillCheck`은 특정 폴리필이 필요한 경우라도 오류를 발생시키지 않도록 설정할 수 있습니다. 라이브러리가 해당 폴리필이 필요하지 않다고 판단된다면 이 옵션을 활용할 수 있습니다.  
`core-js`는 지정된 브라우저 환경에 없는 기능을 감지하여 폴리필을 추가할 뿐만 아니라, proposal 단계의 기능, 브라우저에서 버그가 보고된 기능, 기존 기능에 새롭게 추가된 확장 기능 등에 대해서도 폴리필을 적용할 수 있습니다. 따라서, 직접 사용하지 않는 기능이라도 폴리필이 필요하다고 감지되어 오류가 발생할 수 있습니다.  

## 📜 라이선스

MIT License © 2025 NaverPay
