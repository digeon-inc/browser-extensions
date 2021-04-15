# Safari-extensions

## Safari 開発方法

### 拡張機能の実行手順

1. safari-extension下の`safari-extension.xcodeproj`をxcodeで開く
2. 左上の三角ボタンを押下し、buildしwindowが表示されたら`Quit and Open Safari Extensions Preferences...`をクリック
3. Safariが起動するので`Safariメニュー -> 開発 -> 未署名の機能拡張を許可`
4. `Safariメニュー -> Safari -> 環境設定`から機能拡張が追加さているのを確認できれば成功。

### デバッグ方法

1. `Safariメニュー -> 開発 -> Webインスペクタを表示`
から DevTools を起動する。