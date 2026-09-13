버전 관리 방식

- APP_VERSION: 사람이 읽는 앱 버전입니다. 기능 추가/버그 수정 시 이 숫자만 변경합니다.
  예) 1.6.0 -> 1.7.0 (기능 추가), 1.6.0 -> 1.6.1 (버그 수정)
- version.json: GitHub Actions가 main 브랜치에 push될 때 자동으로 갱신합니다.
- 사이트 하단: v1.6.0 · Build abc1234 · 배포시각 형태로 표시됩니다.

최초 1회 확인
GitHub 저장소 Settings -> Actions -> General -> Workflow permissions에서
"Read and write permissions"가 허용되어 있어야 version.json 자동 커밋이 가능합니다.

GitHub Pages URL과 홈 화면 바로가기는 그대로 유지됩니다.
