import json
import os

data =[
        {
            "route":"東海道線-豊橋・熱海",
            "color":"#ed6d00",
            "id":"jr-ca-u"
        },
        {
            "route":"東海道線-岐阜・米原",
            "color":"#ed6d00",
            "id":"jr-ca-d"
        },
        {
            "route":"中央本線-中津川・多治見",
            "color":"#ed6d00",
            "id":"jr-cf-d"
        },
        {
            "route":"関西本線-亀山",
            "color":"#ed6d00",
            "id":"jr-cj-d"
        },
        {
            "route":"名鉄-一宮・岐阜",
            "color":"#C00029",
            "id":"mn-nh-u"
        },
        {
            "route":"名鉄-津島",
            "color":"#C00029",
            "id":"mn-nh-u"
        },
        {
            "route":"名鉄-東岡崎・豊橋",
            "color":"#C00029",
            "id":"mn-nh-d"
        },
        {
            "route":"名鉄-中部国際空港・河和・内海",
            "color":"#C00029",
            "id":"mn-nh-d"
        },
        {
            "route":"名鉄-岩倉・犬山",
            "color":"#C00029",
            "id":"mn-nh-u"
        },
        {
            "route":"近鉄-四日市・伊勢中川",
            "color":"#6b1116",
            "id":"kt-xe-d"
        },
        {
            "route":"あおなみ線",
            "color":"#0000ff",
            "id":"an-an-d"
        },
        {
            "route":"東山線-高畑",
            "color":"#FAB123",
            "id":"ns-sh-u"
        },
        {
            "route":"東山線-藤が丘",
            "color":"#FAB123",
            "id":"ns-sh-d"
        },
        {
            "route":"桜通線-太閤通",
            "color":"#C92F44",
            "id":"ns-ss-u"
        },
        {
            "route":"桜通線-今池・徳重",
            "color":"#C92F44",
            "id":"ns-ss-d"
        }
    ]

station = input("駅名を入力してください: ")
dictJson = {}

output_file_path = f"./tt/test/{station}-large.json"

# 既存のJSONファイルを読み込む
if os.path.exists(output_file_path):
    with open(output_file_path, "r", encoding="utf-8") as existing_json:
        dictJson = json.load(existing_json)
        data = dictJson["data"]
for day in ["d", "w"]:
    if day not in dictJson:
        dictJson[day] = {}
    
    for u in data:
        v = u["route"]
        if v not in dictJson[day]:
            dictJson[day][v] = []
        
        # ファイルパスを作成
        file_path = f"./tt/test/{day}-{v}.txt"
        
        # ファイルの存在を確認
        if os.path.exists(file_path):
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    for line in f:
                        lines = list(map(str, line.strip().split()))
                        if len(lines) >= 3:
                            dictJson[day][v].append({
                                "time": lines[0],
                                "type": lines[1],
                                "last": lines[2].replace("行き","")
                            })
            except Exception as e:
                print(f"ファイル {file_path} を読み込む際にエラーが発生しました: {e}")
        else:
            print(f"ファイル {file_path} は存在しません。")

# JSONファイルに書き出す（Unicodeをエスケープしない）
with open(output_file_path, "w", encoding="utf-8") as newJson:
    json.dump(dictJson, newJson, ensure_ascii=False, indent=4)

print("くっつけました")
