---
"@naverpay/pite": patch
---

fix: publint 플러그인에서 process.exit(1) 대신 Rollup 에러 처리 메커니즘 사용

publint 플러그인이 `severity: 'error'` 설정 시 `process.exit(1)`을 호출하여 프로세스가 즉시 종료되는 문제를 수정합니다. 이로 인해 다른 플러그인의 에러가 출력되지 않는 문제가 있었습니다. `this.error()` 및 `throw new Error()`를 사용하는 Rollup 공식 에러 처리 방식으로 변경하여 모든 플러그인 에러가 정상적으로 출력되도록 수정합니다.
