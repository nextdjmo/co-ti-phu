'use strict';
function balanced() { return S?.balance === 'balanced'; }
function houseLimit() { return balanced() ? Math.max(64,tiles.filter(t=>t.type==='land').length*3) : 32; }
function hotelLimit() { return balanced() ? Math.max(12,S.players.length*2) : 12; }
function packageAllowed(t,h,id) {
  if(!balanced() || h===0) return true;
  const a=set(t).filter(x=>x.i!==t.i);
  if(!a.every(x=>x.owner===id&&!x.m)) return h<=1;
  return h<=Math.min(...a.map(x=>x.h))+1;
}
function markBuild(t) { t.lastBuildTurn = S.turnSerial||0; }
function balancedBuild(t) {
  const group=set(t);
  return (cur().pos===t.i || (group.every(x=>x.owner===S.turn&&!x.m) && t.h===Math.min(...group.map(x=>x.h)))) && (t.lastBuildTurn??-1)!==(S.turnSerial||0);
}
function developmentRules() {
  return balanced()?'Luật cân bằng: chưa đủ bộ màu chỉ mua tối đa 1 nhà. Ghé lại đất của mình được nâng cấp dù chưa đủ bộ màu. Đủ bộ vẫn được xây đều từ mục Tài sản ở cuối lượt, không cần đứng trên đất. Mỗi đất tăng tối đa một cấp mỗi lượt. Ngân hàng có '+houseLimit()+' nhà và '+hotelLimit()+' khách sạn.':'Luật cũ: mua 0–3 nhà; ghé lại đất ở lượt sau để mở 4 nhà, rồi khách sạn. Chỉ xây khi đứng trên đất.';
}
function aiAssetValue(t,id) {
  let value=t.price;
  if(t.type==='land') {
    const mine=set(t).filter(x=>x.owner===id).length;
    value*=1+mine*.4+(mine===set(t).length-1?.8:0);
  } else if(t.type==='rail') value*=1+tiles.filter(x=>x.type==='rail'&&x.owner===id).length*.25;
  return value;
}
function tryAiTrade(p) {
  if(!balanced() || S.level==='easy' || p.lastTradeRound===S.round) return false;
  p.lastTradeRound=S.round;
  const target=tiles.filter(t=>t.type==='land'&&t.owner!==null&&t.owner!==p.id&&!t.h&&!t.m&&!S.players[t.owner].out).find(t=>set(t).filter(x=>x.owner===p.id).length===set(t).length-1);
  if(!target || !S.players[target.owner].ai) return false;
  const seller=S.players[target.owner],price=Math.ceil(aiAssetValue(target,seller.id)*1.35);
  if(p.cash-price<250 || set(target).filter(x=>x.owner===seller.id).length>1) return false;
  p.cash-=price; seller.cash+=price; target.owner=p.id; resetVisits(target,p.id);
  log(p.name+' thương lượng mua '+target.name+' từ '+seller.name+' với '+fmt(price)+'.');
  return true;
}

function explorationTarget(){return balanced()?{laps:6,tiles:16}:{laps:4,tiles:12};}

function canSellBuilding(t){return t.h>0&&(!balanced()||t.h===Math.max(...set(t).filter(x=>x.owner===t.owner).map(x=>x.h)));}

function initializeRentBoosts() {
  migrateCurrentCardDecks();
  S.parking=false;S.pot=0;for(const t of tiles){if(t.role==='parking'||t.baseId===20){t.role='stationHub';t.name='Nhà ga';}if(t.role==='gojail'||t.baseId===30){t.role='event';t.name='Sự kiện';}}
  if(!Number.isSafeInteger(S.eventCount)||S.eventCount<0)S.eventCount=0;if(!Object.prototype.hasOwnProperty.call(S,'eventSite')){const old=Object.entries(S.eventSites||{}).filter(([id,i])=>tiles[i]?.owner===Number(id)&&tiles[i]?.type==='land'&&tiles[i]?.h>0).pop();S.eventSite=old?{owner:Number(old[0]),tile:old[1]}:null;}delete S.eventSites;if(S.eventSite&&(!Number.isInteger(S.eventSite.tile)||!Number.isInteger(S.eventSite.owner)||tiles[S.eventSite.tile]?.owner!==S.eventSite.owner))S.eventSite=null;
  if(!S.rivalCardsVersion){for(const key of ["chance","chest"]){if(Array.isArray(S.decks?.[key]))S.decks[key].push(...rivalCards(key));}S.rivalCardsVersion=1;}
  const land=tiles.filter(t=>t.type==='land');
  let ids=S.hotRentTiles;
  if(!Array.isArray(ids)||ids.length!==2||new Set(ids).size!==2||!ids.every(i=>tiles[i]?.type==='land')) {
    const pool=land.map(t=>t.i);
    for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
    ids=pool.slice(0,2);S.hotRentTiles=ids;
  }
  for(const t of tiles){t.m=false;t.rentMultiplier=ids.includes(t.i)?2:1;}
  if(S.decks)for(const key of Object.keys(S.decks)){if(Array.isArray(S.decks[key]))S.decks[key]=S.decks[key].map(c=>c.effect==='mortgageReward'?cardDeck('chest').find(x=>x.id==='k-recovery'):c);}
}
function landRentAt(t,h,fullSet=false) {
  const base=h?rentTable.find(r=>r[0]===t.base)[h]:t.base;
  const groupFactor=fullSet?(h?1.5:2):1;
  return Math.round(base*groupFactor*(t.rentMultiplier||1)*eventRentFactor(t)*10000)/10000;
}
