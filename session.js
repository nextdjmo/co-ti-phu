'use strict';
// Canonical balances are integer Vietnamese đồng. Compatibility accessors keep
// the original price tables in units of 10,000 đồng without floating drift.
let setupPreviousPaused = null;
let savingFailed = false;
const SAVE_KEY = 'co-ti-phu.review-v2';
function moneyAccessor(obj, key, backing) {
  if (!obj || Object.getOwnPropertyDescriptor(obj, key)?.get) return;
  const value = obj[backing] ?? Math.round((obj[key] || 0) * 10000);
  obj[backing] = value;
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    get() { return this[backing] / 10000; },
    set(amount) {
      const vnd = Math.round(amount * 10000);
      if (!Number.isSafeInteger(vnd)) throw new Error('Số tiền không hợp lệ');
      const previous=this[backing];this[backing] = vnd;
      if(key==='cash'&&typeof queueMoneyNotice==='function'&&S?.players?.includes(this))queueMoneyNotice(this,vnd-previous);
    }
  });
}
function installMoneyState() {
  if(S) S.buyoutRule="open";
  if (!S) return;
  S.players.forEach(p => moneyAccessor(p, 'cash', 'cashVnd'));
  moneyAccessor(S, 'pot', 'potVnd');
  moneyAccessor(S, 'initialCash', 'initialCashVnd');
  if (S.debt) moneyAccessor(S.debt, 'amount', 'amountVnd');
}
function notifyError(message) {
  if (typeof window === 'undefined') return;
  let box = document.getElementById('formerror');
  if (!box) {
    box = document.createElement('p');
    box.id = 'formerror'; box.className = 'form-error'; box.setAttribute('role','alert');
    ($('modal').open ? $('modalbody') : $('actions')).prepend(box);
  }
  box.textContent = message;
}
function onDialogClosed() {
  if (setupPreviousPaused !== null) {
    paused = setupPreviousPaused;
    setupPreviousPaused = null;
  }
  clockLast = performance.now();
  drive();
}
function saveGame() {
  if (typeof localStorage === 'undefined' || !S || busy) return;
  installMoneyState();
  try {
    const state = JSON.parse(JSON.stringify(S));
    localStorage.setItem(SAVE_KEY,JSON.stringify({schema:2,state,tiles,view:boardView,resumeJailMove:!!continuation,savedAt:Date.now()}));
    savingFailed = false;
  } catch {
    savingFailed = true;
    const status = $('savestatus');
    if (status) status.textContent = 'Không lưu được trên thiết bị này';
  }
}
function validateSavedGame(data) {
  const s=data?.state, ts=data?.tiles;
  if(data?.schema!==2 || !s || !Array.isArray(s.players) || s.players.length<2 || s.players.length>8 || !Array.isArray(ts) || ts.length!==boardSize(s.players.length)) return false;
  if(!['roll','end','buy','debt','auction','auctionDraw','auctionResult','auctionBuild'].includes(s.phase) || !Number.isInteger(s.turn) || !s.players[s.turn] || !s.players.some(p=>!p.out)) return false;
  if(!s.players.every((p,i)=>p.id===i && Number.isSafeInteger(p.cashVnd) && p.cashVnd>=0 && Number.isInteger(p.pos) && p.pos>=0 && p.pos<ts.length)) return false;
  if(!ts.every((t,i)=>t.i===i && (t.owner===null || Number.isInteger(t.owner)&&s.players[t.owner]) && Number.isInteger(t.h) && t.h>=0 && t.h<=5)) return false;
  if(s.phase==='debt' && (!s.debt || !Number.isSafeInteger(s.debt.amountVnd) || s.debt.amountVnd<0 || s.debt.to!==null&&!s.players[s.debt.to])) return false;
  if(s.phase.startsWith('auction') && (!s.auction || !ts[s.auction.tile] || !Array.isArray(s.auction.participants) || !s.auction.participants.every(id=>s.players[id]) || !s.players[s.auction.bidder] || !Object.values(s.auction.bidsVnd||{}).every(v=>Number.isSafeInteger(v)&&v>=0))) return false;
  return true;
}
function restoreGame() {
  if(typeof localStorage==='undefined') return false;
  try {
    const data=JSON.parse(localStorage.getItem(SAVE_KEY));
    if(!validateSavedGame(data)) return false;
    epoch++; resetAnnouncements();
    buildBoard(data.state.players.length);
    tiles=data.tiles;
    S=data.state;
    if(S.auction) S.auction.bids=Object.fromEntries(Object.entries(S.auction.bidsVnd||{}).map(([id,v])=>[id,v/10000]));
    installMoneyState();
    initializeRentBoosts();
    if(S.boardChoice&&(!['event','station'].includes(S.boardChoice.type)||S.boardChoice.player!==S.turn))S.boardChoice=null;
    busy=false; moving=null; movementDepth=0; paused=true;
    continuation=data.resumeJailMove?()=>{cur().jailed=false;cur().jail=0;move(S.dice[0]+S.dice[1]);}:null;
    migrateLegacyAuction();
    boardView=data.view==='fit'?'fit':'read';
    log('Đã khôi phục ván lưu. Nhấn Tiếp tục để chơi; thời gian đóng trang không bị tính.');
    startClock(); render(); setBoardView(boardView);
    return true;
  } catch { return false; }
}
function togglePause() {
  paused=!paused; render(); drive();
}
function migrateLegacyAuction() {
  if(!S.phase.startsWith('auction')) {S.auction=null;return;}
  const current=tiles[cur().pos];
  // An awarded property has already been paid for: preserve it. Unfinished
  // bids did not debit anyone, so cancel them without a money transfer.
  S.phase=current?.price&&current.owner===null?'buy':'end';
  S.auction=null;
  delete S.resumeAuctionDraw;
  log('Đã hủy đấu giá của ván cũ. Chỉ người đến đất được mua hoặc bỏ qua.');
}
function initializeSessionUI() {
  if(typeof window==='undefined') return;
  $('modal').addEventListener('close',onDialogClosed);
  window.addEventListener('pagehide',saveGame);
  restoreGame();
}

function setBoardZoom(value){const n=Number(value);if(![80,100,132].includes(n))return;$('mapviewport').style.setProperty('--tile-pixels',n+'px');setBoardView('read');focusCurrentTile();}
