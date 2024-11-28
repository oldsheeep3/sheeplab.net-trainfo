let station = '鶴舞';
let s2 = null,cacheds1 = null,cacheds2 = null,dt=0,trans = false,loadingJsonDatas = [],loadedJsonDatas = [],onStationTime=null;
const norikaeTime = 1;
let routeElements = document.querySelectorAll('.route');
const days = [
    '日', '月', '火', '水', '木', '金', '土'
];
loadJson(null, 'typecolor').then(data => {
    loadedJsonDatas.push('typecolor');
    typeColor = data.data;
    addTypeCss();
});
function preventScroll(event) {
    event.preventDefault(); // デフォルトのスクロールを防ぐ
}

function overlay(type=null){
    const container = document.querySelector('.ovr');
    if (type === null) {
        if(container && container.innerHTML){
            container.innerHTML = '';
            console.log('loaded');
            window.removeEventListener('scroll', preventScroll);
        }
    }else{
        window.addEventListener('scroll', preventScroll, { passive: false });
        if(type!=='loading'){
        }else{
            container.innerHTML = '<div class="overlay"><div class="overlay-inner"><div class="loader"></div></div></div>';
        }
    }
}

function setOverlay(){
    const intervalId = setInterval(() => {
        let loadedCheck = () => {
            if (loadedJsonDatas.length !== loadingJsonDatas.length) {
                    return false;
            }
            var sortedArr1 = loadedJsonDatas.slice().sort();
            var sortedArr2 = loadingJsonDatas.slice().sort();
    
            for (let i = 0; i < sortedArr1.length; i++) {
                if (sortedArr1[i] !== sortedArr2[i]) {
                    return false; // 一致しない要素が見つかった場合
                }
            }
            return true;
        }
        if(loadedCheck()) {
            clearInterval(intervalId);
            overlay();
            loadedJsonDatas = [];
            loadingJsonDatas = [];
        }else{
            overlay('loading');
        }
    }, 1000);
}

function checkOverflow(routeElement, innerElement) {
    return innerElement.scrollWidth > routeElement.clientWidth;
}

function applyAnimationIfOverflow(routeElement) {
    let innerElement = routeElement.querySelector('.route-inner');
    if (checkOverflow(routeElement, innerElement)) {
        let containerWidth = routeElement.scrollWidth;
        document.documentElement.style.setProperty('--item-width', `${containerWidth}px`);
        innerElement.classList.add('scranm');
    } else {
        innerElement.classList.remove('scranm');
    }
}

function checkAllRoutes() {
    routeElements = document.querySelectorAll('.route');
    routeElements.forEach(route => applyAnimationIfOverflow(route));
}

function getQ() {
    const queryStr = decodeURI(window.location.search.slice(1));
    const queries = {};

    if (queryStr) {
        queryStr.split('&').forEach(function(queryStr) {
            const queryArr = queryStr.split('=');
            queries[queryArr[0]] = queryArr[1];
        });
    }
    return queries;
}

function twoDigit(num) {
    return num < 10 ? '0' + num : num;
}

// ここから


function timeDifference(start, end) {
    // 基準時刻
    const baseHour = 3;

    // 時刻を分に変換するヘルパー関数
    const convertToMinutes = (time) => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    };

    // 開始時刻と終了時刻を分に変換
    let startMinutes = convertToMinutes(start);
    let endMinutes = convertToMinutes(end);

    // 4:00（240分）を基準に調整
    if (startMinutes < baseHour * 60) {
        startMinutes += 24 * 60; // 26:59までの補正
    }

    if (endMinutes < baseHour * 60) {
        endMinutes += 24 * 60; // 26:59までの補正
    }

    // 時刻の差を計算
    let difference = endMinutes - startMinutes;

    return(difference);
}

function sName() {
    const query = getQ();
    station = query['station'] || '鶴舞';
    if(query['s2'] && query['dt']){
        s2 = query['s2'];
        dt = parseInt(query['dt'],10);
        document.querySelector('#s-name').innerHTML = `${station} - ${s2} 乗換案内`;
        return true;
    }else{
        document.querySelector('#s-name').innerHTML = `${station} 駅 列車状況`;
        return false;
    } 
}

function loadJson(dataName, fileName) {
    if (loadingJsonDatas.includes(fileName)){
        return new Promise((resolve) => {
            resolve({ data: dataName, updated: false }); // 既存のデータと更新フラグを返す
        })
    }else{
        return new Promise((resolve, reject) => { // Promiseを返すようにする
            let dataNames;
            if (!dataName) {
                loadingJsonDatas.push(fileName);
                const xhr = new XMLHttpRequest();
                xhr.open('GET', `/tt/${fileName}.json`);
                xhr.onload = () => {
                    if (xhr.status === 200) {
                        dataNames = JSON.parse(xhr.response);
                        resolve({ data: dataNames, updated: true });
                    } else {
                        reject(`Error: ${xhr.status}`); // エラー時にはreject
                    }
                };
                xhr.onerror = () => {
                    reject('Request failed'); // リクエスト失敗時にはreject
                };
                xhr.send();
            } else {
                resolve({ data: dataName, updated: false });
            }
        })
    }
}


function times(routeArr, nowtime,nowD,cached=cacheds1,dts=0) {
    let route = routeArr.route;
    let routeColor = routeArr.color;
    let routeId = routeArr.id;
    let routeCompany = routeId.slice(0,2);
    let availableDatas = [];
    let ulName=null,delay=false,delay1=null,delay2=null,time1=null,time2=null,msg=null;
    
    if(onStationTime && dts != 0){
        [dhours, dminutes] = onStationTime.split(':').map(Number);
        hhmm = dhours*60 + dminutes;
        if (dts != 0){
            hhmm += dts;
        }
        dminute = twoDigit(hhmm%60);
        dhour = twoDigit((hhmm/60 | 0)%24);
        nowtime = `${dhour}:${dminute}`;
    }
    // 駅のデータを取得
    if (timeDifference('00:00',nowtime) < 180 && timeDifference('00:00',nowtime) >= 0){
        nowD = (nowD-1)%7;
    }
    
    if (nowD == 0 || nowD == 6) {
        weekdaySet = cached.w[route];
        document.querySelector('#day').innerHTML = '<span class="yellow">休日ダイヤ</span>';
    }else{
        weekdaySet = cached.d[route];
        document.querySelector('#day').innerHTML = '平日ダイヤ';
    }


    if (cached && weekdaySet) {
        weekdaySet.forEach(item => {
            if (timeDifference(nowtime,item.time) > 0 && (nowtime < item.time || item.time < '04:00')) {
                typeCode = (typeColor[routeCompany] && typeColor[routeCompany][item.type] && typeColor[routeCompany][item.type].code) || null;
                addCode = typeCode ? `${routeCompany}-${typeCode}` : null;
                if(item.last.endsWith('回り')){
                    linetype = "loopline";
                }else{
                    linetype = "destination";
                }
                availableDatas.push({
                    time: item.time,
                    type: item.type,
                    last: item.last,
                    code: addCode,
                    litp: linetype
                });
            }
        });
    }
    
    // 最も早い時間を見つける
    if (availableDatas.length > 0) {
        // timeを基準にソート
        const sortedDatas = availableDatas.sort((a, b) => {
            return timeDifference(nowtime, a.time) - timeDifference(nowtime, b.time);
        });

        if(delay) {
            delay1 = 'class="delay"';
            delay2 = 'class="delay"';
        }else{
            delay1 = '';
            delay2 = '';
        }
        
        time1 = sortedDatas[0]; // 最初の要素を取得
        time2 = sortedDatas[1]; // 2番目の要素を取得
        msg = (time) => {
            tdf = timeDifference(nowtime,time);
            if (dts == 0){
                if(tdf <= 7){
                    return(`<span class="red">あと 約 <span class="tdf">${tdf}</span> 分 あきらめよう。</span>`);
                }else if(tdf <= 13){
                    return(`<span class="yellow">あと 約 <span class="tdf">${tdf}</span> 分 走れば間に合う？</span>`);
                }
                return(`あと 約 <span class="tdf">${tdf}</span> 分`);
            }else{
                return(`乗換時間 約 <span class="tdf">${tdf}</span> 分`);
            }
        };

        let itemCont1,itemCont2;
        let time1SpanCode='',time1SpanCodeAfter='',time2SpanCode='',time2SpanCodeAfter='';
        if(time1 && time1.code){
            time1SpanCode = `<span class="${time1.code} tCC">`;
            time1SpanCodeAfter = '</span>';
        }
        if(time2 && time2.code){
            time2SpanCode = `<span class="${time2.code} tCC">`;
            time2SpanCodeAfter = '</span>';
        }

        if(time1){
            itemCont1 =`<div class="route"><h2 class="route-inner" style="color:${routeColor};">${route}</h2></div><div class="first"><p class="next">${time1.time}</p><p class="last">${time1SpanCode}${time1.type}${time1SpanCodeAfter} <span class="${time2.litp}">${time1.last}</span></p><p class="limit">${msg(time1.time)}</p></div>`;
        }else{
            itemCont1 =`<div class="route"><h2 class="route-inner">${route}</h2></div><p class="fin">☆日本は終了しました☆</p>`;
        }
        if(time2){
            itemCont2 = `<div class="second"><p ${delay2}><span class="next2">${time2.time}</span><span class="last2"> ${time2SpanCode}${time2.type}${time2SpanCodeAfter} <span class="${time2.litp}">${time2.last}</span></span></p><p class="limit2">${msg(time2.time)}</p></div>`;
        }else{
            itemCont2 = '<p class="fin yellow">☆これが終電です☆</p>';
        }
        itemContent = itemCont1 + itemCont2;
    } else {
        itemContent =`<div class="route"><h2 class="route-inner">${route}</h2></div><p class="fin">☆日本は終了しました☆</p>`;
    }
    
    if(dts==0){
        onStationTime = time1.time;
        ulName = 'time-data';
    }else{
        ulName = 'time-data-2';
    }

    const ul = document.getElementById(ulName);
    // 指定されたIDのli要素を取得
    let li = document.getElementById(route);
    if (li) {
        if(itemContent.replace(/\s+/g, '').replace('"',"'").trim() != li.innerHTML.replace('scranm','').replace(/\s+/g, '').replace('"',"'").trim()){
            li.innerHTML = itemContent;
            applyAnimationIfOverflow(li.querySelector('.route'));
        }
    } else {
        // IDが存在しない場合、新しいli要素を作成
        li = document.createElement('li');
        li.id = route;
        li.className = `${ulName}-li`;
        li.innerHTML = itemContent;
        // ulに新しいli要素を追加
        ul.appendChild(li);
        applyAnimationIfOverflow(li.querySelector('.route'));
    }
    
}

function addTypeCss(){
    let styles = '.tCC{border-radius: 0.7rem;padding: 0 0.5rem;}';
    Object.keys(typeColor).forEach(comp => {
        Object.keys(typeColor[comp]).forEach(w => {
            const cType = typeColor[comp][w];
            // スタイルを文字列に追加
            styles += `.${comp}-${cType.code}{color:${cType.color};background-color:${cType.bgcolor};}`;
        });
    });

    // 一つのstyle要素を作成
    const newStyle = document.createElement('style');
    newStyle.textContent = styles;
    // headに追加
    document.head.appendChild(newStyle);
}

function norikaeFunc(onStation,transStation) {
    if (!transStation || !transStation.station) {
        return false; // または適切なエラーハンドリング
    }
    routes = [];
    Object.keys(transStation.station.no).forEach(v => {
        tN = transStation.station.no[v];
        oN = onStation.station.no[v] || null;
        if(oN){
            transRoute = v;
            if(oN - tN > 0){
                oS1 = '-u';
                oS2 = '-d';
            }else{
                oS1 = '-d';
                oS2 = '-u';
            }
        }
    });
    if(transRoute){
        return({'onRoute':transRoute+oS1,'delRoute':[`${transRoute}-u`,`${transRoute}-d`]});
    }else{
        return(false);
    }
}

function noTranslate(){
    console.log('no translate');
}

function clock() {
    let nowtime = new Date();
    let nowYe = nowtime.getFullYear();
    let nowMo = nowtime.getMonth() + 1;
    let nowDa = nowtime.getDate();
    let nowD = nowtime.getDay();
    let nowH = twoDigit(nowtime.getHours());
    let nowM = twoDigit(nowtime.getMinutes());
    let nowS = twoDigit(nowtime.getSeconds());

    let realDate = nowYe + '年' + nowMo + '月' + nowDa + '日 (' + days[nowD] + ')';
    let realTime = '現在時刻:' + nowH + ':' + nowM + ':' + nowS;

    document.querySelector('#realTime').innerHTML = realTime;
    document.querySelector('#realDate').innerHTML = realDate;

    loadJson(cacheds1, station).then(data => {
        if(data.updated){
            loadedJsonDatas.push(station);
            cacheds1 = data.data;
        }
        updateTimes(nowD);
    });

    if (trans) {
        loadJson(cacheds2, s2).then(data => {
            if(data.updated){
                loadedJsonDatas.push(s2);
                cacheds2 = data.data;
            }
            updateTimes(nowD);
        });
    }
}

function updateTimes(nowD) {
    let nt = twoDigit(new Date().getHours()) + ':' + twoDigit(new Date().getMinutes());
    if (trans) {
        transInfo = norikaeFunc(cacheds1, cacheds2);
        if (transInfo) {
            times(cacheds1.data.find(route => route.id === transInfo.onRoute), nt, nowD);
            cacheds2.data.forEach(function(i) {
                if(transInfo.delRoute.includes(i.id) === false){
                    if(onStationTime){nt = onStationTime;}
                    times(i, nt, nowD, cacheds2, dt);
                }
            });
        }
    } else {
        cacheds1.data.forEach(function(i) {
            times(i, nt, nowD);
        });
    }
}

window.onload = function() {
    cacheds1 = null;
    cacheds2 = null;
    trans = sName();
    checkAllRoutes();
}
// サイズ変更を監視（例: ウィンドウリサイズイベント）
window.addEventListener('resize', checkAllRoutes);
window.onresize = checkAllRoutes;

overlay('loading');
setInterval('clock()',1000);
setTimeout(setOverlay(),500);