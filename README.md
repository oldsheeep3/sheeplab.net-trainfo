# sheeplab.net-trainfo  
## 概要

#### プロジェクト名

trainfo

#### どんなサイト？

弊学最寄り駅の鶴舞駅の発車時刻をいい感じに見れるようにしたWebサイトです。  
完全オフライン、最低限の構成でも動作をさせるため、html,js,cssで作っています。また、外部APIを使わず、駅時刻等はjsonにまとめることで完全にオフラインの環境でも使えるようにしています。  
Webブラウザが使える環境であれば、場所を選ばす使用できます！

#### 使い方

https://sheeplab.net/trainfo.html  
にアクセス

または このプロジェクトをWebサーバーにアップロード

または trainfo.htmlにjs,cssをすべて書き込み、trainfo.htmlをブラウザで開く。  
この際、jsに駅時刻のjsonファイルも含めることを推奨します。  
※詳細は別記します。

###### おまけ

信用しないでください。完全に自分用です。

tt/test/combine.py -> 路線名.txtをまとめてjsonを作るやつ

tt/test/meitetsu/maketxt.py -> 名鉄のWebサイトから時刻を持ってきて路線名.txtを作るやつ

## 開発環境

|言語・フレームワーク｜バージョン｜  
| ------------------ | -------- |  
| Apache             | 2.4.58   |  
| Python             | 3.12.3   |

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

.  
|-- norikae-large.html  
|-- README.md  
|-- station.json  
|-- trainfo.html  
|-- tt  
|   |-- test  
|   |   |-- combine.py  
|   |   |-- d-あおなみ線.txt  
|   |   |-- d-中央本線-中津川・多治見.txt  
|   |   |-- d-名鉄-一宮・岐阜.txt  
|   |   |-- d-名鉄-中部国際空港・河和・内海.txt  
|   |   |-- d-名鉄-岩倉・犬山.txt  
|   |   |-- d-名鉄-東岡崎・豊橋.txt  
|   |   |-- d-名鉄-津島.txt  
|   |   |-- d-東山線-藤が丘.txt  
|   |   |-- d-東山線-高畑.txt  
|   |   |-- d-東海道線-岐阜・米原.txt  
|   |   |-- d-東海道線-豊橋・熱海.txt  
|   |   |-- d-桜通線-今池・徳重.txt  
|   |   |-- d-桜通線-太閤通.txt  
|   |   |-- d-近鉄-四日市・伊勢中川.txt  
|   |   |-- d-関西本線-亀山.txt  
|   |   |-- meitetsu  
|   |   |   |-- maketxt.py  
|   |   |   `-- test.py  
|   |   |-- w-あおなみ線.txt  
|   |   |-- w-中央本線-中津川・多治見.txt  
|   |   |-- w-名鉄-一宮・岐阜.txt  
|   |   |-- w-名鉄-中部国際空港・河和・内海.txt  
|   |   |-- w-名鉄-岩倉・犬山.txt  
|   |   |-- w-名鉄-東岡崎・豊橋.txt  
|   |   |-- w-名鉄-津島.txt  
|   |   |-- w-東山線-藤が丘.txt  
|   |   |-- w-東山線-高畑.txt  
|   |   |-- w-東海道線-岐阜・米原.txt  
|   |   |-- w-東海道線-豊橋・熱海.txt  
|   |   |-- w-桜通線-今池・徳重.txt  
|   |   |-- w-桜通線-太閤通.txt  
|   |   |-- w-近鉄-四日市・伊勢中川.txt  
|   |   |-- w-関西本線-亀山.txt  
|   |   `-- 名古屋-large.json  
|   |-- test.json  
|   |-- typecolor.json  
|   |-- typecolor-large.json  
|   |-- 名古屋.json  
|   |-- 名古屋-large copy.json  
|   |-- 吹上.json  
|   |-- 吹上-large.json  
|   |-- 熱田神宮伝馬町.json  
|   |-- 熱田神宮伝馬町-large.json  
|   |-- 金山.json  
|   |-- 金山-large.json  
|   |-- 鶴舞.json  
|   `-- 鶴舞-large.json  
|-- ttcom  
|   |-- ttscript.min.js  
|   `-- ttstyle.min.css  
|-- ttscript.js  
`-- ttstyle.css

## 不具合報告等

githubのIssuesに投稿してください。  
その他ご連絡はX(旧Twitter) @oldsheeep まで

## 更新

2024/11/28 GitHubにcommit