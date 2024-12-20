# sheeplab.net-trainfo  
## 概要

### プロジェクト名

trainfo

### どんなサイト？

弊学最寄り駅の鶴舞駅の発車時刻をいい感じに見れるようにしたWebサイトです。  
完全オフライン、最低限の構成でも動作をさせるため、html,js,cssで作っています。また、外部APIを使わず、駅時刻等はjsonにまとめることで完全にオフラインの環境でも使えるようにしています。  
Webブラウザが使える環境であれば、場所を選ばす使用できます！

### 使い方

https://sheeplab.net/trainfo.html  
にアクセス

または このプロジェクトをWebサーバーにアップロード

または trainfo.htmlにjs,cssをすべて書き込み、trainfo.htmlをブラウザで開く。  
この際、jsに駅時刻のjsonファイルも含めることを推奨します。  
※詳細は別記します。

##### おまけ

信用しないでください。完全に自分用です。

tt/test/combine.py -> 路線名.txtをまとめてjsonを作るやつ

tt/test/meitetsu/maketxt.py -> 名鉄のWebサイトから時刻を持ってきて路線名.txtを作るやつ

## 開発環境

言語・フレームワーク｜バージョン｜  
------------------- | -------- |  
Apache              | 2.4.58   |  
Python              | 3.12.3   |

## コマンド(?)

urlに次のクエリをつけると各機能が使えます。

駅を指定する  
```  
{URL}?station={駅名}  
```

乗り換え案内に変更する  
```  
{URL}?s2={乗換駅}&dt={最寄りから乗換駅までの所要時間}  
```  
## ディレクトリ構成
<pre>
.  
├── norikae-large.html  
├── README.md  
├── station.json  
├── trainfo.html  
├── tt  
|   ├── test  
|   |   ├── combine.py  
|   |   ├── {路線名}.txt (省略)
|   |   └── meitetsu  
|   |       ├── maketxt.py  
|   |       └── test.py
|   ├── test.json  
|   ├── typecolor.json  
|   ├── typecolor-large.json  
|   ├── 名古屋.json  
|   ├── 名古屋-large copy.json  
|   ├── 吹上.json  
|   ├── 吹上-large.json  
|   ├── 熱田神宮伝馬町.json  
|   ├── 熱田神宮伝馬町-large.json  
|   ├── 金山.json  
|   ├── 金山-large.json  
|   ├── 鶴舞.json  
|   └── 鶴舞-large.json  
├── ttcom  
|   ├── ttscript.min.js  
|   └── ttstyle.min.css  
├── ttscript.js  
└── ttstyle.css

</pre>

## 不具合報告等

githubのIssuesに投稿してください。  
その他ご連絡は[X(旧Twitter) @oldsheeep](https://x.com/oldsheep) まで

## 更新

2024/11/28 GitHubにcommit