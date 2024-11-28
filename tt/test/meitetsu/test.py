import requests
from bs4 import BeautifulSoup
import re
# サンプルHTMLを直接使用（実際のURLを使用する場合はrequestsを使用）
html = '''
<div class="note">

		
			<p class="small">
				[種別表示]<br>
				</p><div class="colorLegend">
					
						<span class="d_04">00</span>:普通&nbsp;&nbsp;
					
						<span class="d_18">00</span>:準急&nbsp;&nbsp;
					
						<span class="d_38">00</span>:急行&nbsp;&nbsp;
					
						<span class="d_51">00</span>:特急&nbsp;&nbsp;
					
						<span class="d_58">00</span>:快速特急&nbsp;&nbsp;
					
						<span class="d_98">00</span>:ミュースカイ&nbsp;&nbsp;
					
				</div>
				<br>
			<p></p>
		
		

		
			<p class="small">
				[行先表示]
                <br>
                    岐 : 名鉄岐阜&nbsp; &nbsp;&nbsp;
                    一 : 名鉄一宮&nbsp; &nbsp;&nbsp;
                    名 : 名鉄名古屋&nbsp; &nbsp;&nbsp;
                    須 : 須ケ口&nbsp; &nbsp;&nbsp;
                </p>
			<br>
		

		
			<p class="small">
				[記事表示]<br>
				
					一般 : 全車一般車&nbsp;&nbsp;
				
					ア : 二ツ杁停車&nbsp;&nbsp;
				
					イ : 須ケ口停車&nbsp;&nbsp;
				
					ウ : 大里停車&nbsp;&nbsp;
				
			</p>
		
	</div>
'''

# BeautifulSoupで解析
soup = BeautifulSoup(html, 'html.parser')

# 1. 種別表示を取得
type_dict = {}
color_legend = soup.find('div', class_='colorLegend')

for span in color_legend.find_all('span'):
    class_name = span['class'][0]  # クラス名を取得
    type_name = span.next_sibling.strip().split(':')[-1]  # 種別を取得
    type_dict[class_name] = type_name

print("種別表示:")
print(type_dict)

# 2. 行先表示を取得
# <p>要素を取得
note_element = soup.find('div', class_='note')
p_elements = note_element.find_all('p', class_='small')

# テキストを取得し、行先情報を抽出
for p_element in p_elements:
    if p_element and "行先" in p_element.get_text():
        print(p_element)
        print(2)
        dds = re.findall(r'([^&nbsp;\s]+) : +([^&nbsp;\s]+)',p_element.get_text())
        destination_dict = {a : b for a,b in dds}
# 結果を出力
print("行先表示:")
print(destination_dict)