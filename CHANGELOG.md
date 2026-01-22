# @naverpay/pite

## 2.3.0

### Minor Changes

-   b46705d: [공통] viteConfig 를 받을 수 있도록 수정하고, 기존 옵션들은 deprecated 처리합니다

    PR: [[공통] viteConfig 를 받을 수 있도록 수정하고, 기존 옵션들은 deprecated 처리합니다](https://github.com/NaverPayDev/pite/pull/91)

### Patch Changes

-   0812621: 🔧 Update rollup plugin dependencies to rollup-preserve-directives

    PR: [🔧 Update rollup plugin dependencies to rollup-preserve-directives](https://github.com/NaverPayDev/pite/pull/86)

## 2.2.0

### Minor Changes

-   d79b6e8: Add support for custom Vite plugins in config creation

    PR: [Add support for custom Vite plugins in config creation](https://github.com/NaverPayDev/pite/pull/82)

## 2.1.0

### Minor Changes

-   cec8464: publint severity 옵션 추가

## 2.0.0

### Major Changes

-   d7629d6: [공통] polyfill option 및 문구 수정

    PR: [[공통] polyfill option 및 문구 수정](https://github.com/NaverPayDev/pite/pull/72)

### Patch Changes

-   f569d00: [공통] rollup-plugin-visualizer 를 설치하고 옵션을 추가합니다.

    PR: [[공통] rollup-plugin-visualizer 를 설치하고 옵션을 추가합니다.](https://github.com/NaverPayDev/pite/pull/66)

## 1.1.4

### Patch Changes

-   eba3160: pite기본 external에 builtins를 적용합니다

    PR: [pite기본 external에 builtins를 적용합니다](https://github.com/NaverPayDev/pite/pull/62)

## 1.1.3

### Patch Changes

-   e5b82f0: [공통] entry 를 확장할 수 있도록 수정합니다.

    PR: [[공통] entry 를 확장할 수 있도록 수정합니다.](https://github.com/NaverPayDev/pite/pull/59)

## 1.1.2

### Patch Changes

-   1fdb575: tsup log에 색상 반영

    PR: [tsup log에 색상 반영](https://github.com/NaverPayDev/pite/pull/55)

## 1.1.1

### Patch Changes

-   8366e36: [#52] .js, .jsx만 entry에 있는경우 tsup이 수행되지 않도록 막습니다

    PR: [[#52] .js, .jsx만 entry에 있는경우 tsup이 수행되지 않도록 막습니다](https://github.com/NaverPayDev/pite/pull/53)

## 1.1.0

### Minor Changes

-   d9bcad0: publint 추가

    PR: [publint 추가](https://github.com/NaverPayDev/pite/pull/48)

## 1.0.0

### Major Changes

-   9c1ce2f: [공통] 초기버전 개발 완료로 monorepo를 제거합니다.

    PR: [[공통] 초기버전 개발 완료로 monorepo를 제거합니다.](https://github.com/NaverPayDev/pite/pull/43)

### Patch Changes

-   0a93b21: directive 플러그인 추가

    PR: [directive 플러그인 추가](https://github.com/NaverPayDev/pite/pull/46)

## 0.0.11

### Patch Changes

-   eebd5b4: cwd에 기본값을 주입합니다

    PR: [cwd에 기본값을 주입합니다](https://github.com/NaverPayDev/pite/pull/39)

## 0.0.10

### Patch Changes

-   rollup plugin option 병합 로직 수정

## 0.0.9

### Patch Changes

-   cssFileName도 옵션 적용

    PR: [cssFileName도 옵션 적용](https://github.com/NaverPayDev/pite/pull/33)

## 0.0.8

### Patch Changes

-   7d9a5df: scss를 단일 css로 묶어서 빌드하는 기능을 추가합니다

    PR: [scss를 단일 css로 묶어서 빌드하는 기능을 추가합니다](https://github.com/NaverPayDev/pite/pull/31)

-   94ed000: TSUP을 사용해 dts를 생성하도록 수정합니다

    PR: [TSUP을 사용해 dts를 생성하도록 수정합니다](https://github.com/NaverPayDev/pite/pull/29)

## 0.0.7

### Patch Changes

-   94ed000: TSUP을 사용해 dts를 생성하도록 수정합니다

    PR: [TSUP을 사용해 dts를 생성하도록 수정합니다](https://github.com/NaverPayDev/pite/pull/29)

## 0.0.6

### Patch Changes

-   5ac37dc: deps, peerDeps를 기본 external로 지정합니다

    PR: [deps, peerDeps를 기본 external로 지정합니다](https://github.com/NaverPayDev/pite/pull/23)

## 0.0.5

### Patch Changes

-   20adbe6: outdir이 없는데 .d.ts, .d.mts 모두 필요한 경우 대응

    PR: [outdir이 없는데 .d.ts, .d.mts 모두 필요한 경우 대응](https://github.com/NaverPayDev/pite/pull/21)

## 0.0.4

### Patch Changes

-   bd756c9: .browserslistrc가 없을 때 browserslist에서 발생하는 에러를 해결합니다

    PR: [.browserslistrc가 없을 때 browserslist에서 발생하는 에러를 해결합니다](https://github.com/NaverPayDev/pite/pull/18)

-   da5c303: outDir 옵션을 추가합니다

    PR: [outDir 옵션을 추가합니다](https://github.com/NaverPayDev/pite/pull/20)

## 0.0.3

### Patch Changes

-   194c192: 허용 폴리필 목록 파라미터 추가, 불필요한 타입파일 생성 방지 옵션 추가

    PR: [허용 폴리필 목록 파라미터 추가, 불필요한 타입파일 생성 방지 옵션 추가](https://github.com/NaverPayDev/pite/pull/16)

## 0.0.2

### Patch Changes

-   e741f3c: pite 빌드 결과물 dist를 업로드 하도록 수정

    PR: [pite 빌드 결과물 dist를 업로드 하도록 수정](https://github.com/NaverPayDev/pite/pull/3)

-   af9ad02: browserslist config 파싱

    PR: [browserslist config 파싱](https://github.com/NaverPayDev/pite/pull/10)
