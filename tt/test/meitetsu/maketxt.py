import requests
from bs4 import BeautifulSoup
import re

# ウェブサイトのURL
url = "https://trainbus.meitetsu.co.jp/meitetsu-transfer/pc/diagram/TrainDiagram?startId=00004372&linkId=00000885&direction=down&rule=a"
route = "名鉄-一宮・岐阜"
# Webページをリクエスト
response = requests.get(url)

# レスポンスをBeautifulSoupで解析
soup = BeautifulSoup(response.text, 'html.parser')

# 結果を格納するリスト
result = {
    "wkd" : [],
    "snd" : []
}

# 1. 種別表示を取得
type_dict = {}
color_legend = soup.find('div', class_='colorLegend')

for span in color_legend.find_all('span'):
    class_name = span['class'][0]  # クラス名を取得
    type_name = span.next_sibling.strip().split(':')[-1]  # 種別を取得
    type_dict[class_name] = type_name

# 2. 行先表示を取得
note_element = soup.find('div', class_='note')
p_elements = note_element.find_all('p', class_='small')

# テキストを取得し、行先情報を抽出
for p_element in p_elements:
    if p_element and "行先" in p_element.get_text():
        dds = re.findall(r'([^&nbsp;\s]+) : +([^&nbsp;\s]+)',p_element.get_text())
        destination_dict = {a : b for a,b in dds}

for l2elm in soup.find_all('tr', class_="l2"):
    hour_row = l2elm.find('th', class_='hour')
    if hour_row:
        hour = hour_row.text.strip()
    else:
        hour = "N/A"
    for days in ["wkd","snd"]:
        for day in l2elm.find_all('td', class_=days):
            # diagram-itemクラスのdiv要素をすべて取得
            for diagram_item in day.find_all('div', class_='diagram-item'):
                # 内部のdiv要素のクラス名を取得
                inner_div_classes = [div['class'] for div in diagram_item.find_all('div') if 'class' in div.attrs]
                
                # markクラスの中のclass topの値を取得
                mark_class_top = diagram_item.find('div', class_='mark')
                class_top_value = mark_class_top.find(class_='top').text.strip() if mark_class_top else None

                # hourの値を取得
                hour_value = diagram_item.find('span', {'aria-hidden': 'true'})
                hour_text = hour_value.text.strip() if hour_value else None

                # tipの値を取得
                tip_value = diagram_item.get('tip', None)  # tip属性がある場合に取得

                # データを配列に格納
                result[days].append({
                    'hour': f'{hour}:{hour_text}',
                    'inner_classes': inner_div_classes,
                    'class_top': class_top_value,
                    'tip': tip_value
                })

# 結果を出力
with open(f"./tt/test/d-{route}.txt","w",encoding="utf-8") as f:
    for data in result["wkd"]:
        time = data["hour"]
        type = type_dict[data["inner_classes"][0][1]]
        last = destination_dict[data["class_top"]]
        print(f"{time} {type} {last}",end="\n", file=f)

with open(f"./tt/test/w-{route}.txt","w",encoding="utf-8") as f:
    for data in result["snd"]:
        time = data["hour"]
        type = type_dict[data["inner_classes"][0][1]]
        last = destination_dict[data["class_top"]]
        print(f"{time} {type} {last}",end="\n", file=f)

print("fin")