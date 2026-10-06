'use strict';
function cardDeck(type){if(type==='chance')return [
{id:'c-start',effect:'start',title:'Chuyến đi khởi nghiệp',description:'Tiến về Xuất phát, nhận '+fmt(200)+' nếu có di chuyển.'},
{id:'c-jail',effect:'jail',title:'Vi phạm giao thông',description:'Vào tù ngay, không thưởng Xuất phát và không gieo thêm.'},
{id:'c-release',effect:'release',title:'Giấy thông hành',description:'Giữ 1 thẻ ra tù miễn phí để dùng sau.'},
{id:'c-back',effect:'back',title:'Đường đang sửa',steps:3,description:'Lùi 3 ô, xử lý ô đến như bình thường; không thưởng Xuất phát.'},
{id:'c-forward',effect:'forward',steps:5,title:'Đường cao tốc',description:'Tiến 5 ô, xử lý ô đến; qua Xuất phát nhận '+fmt(200)+'.'},
{id:'c-destination',effect:'destination',destination:baseIndex(24),title:'Du lịch Đà Lạt',description:'Tiến đến Đà Lạt, xử lý ô đến; qua Xuất phát nhận '+fmt(200)+'.'},
{id:'c-capital',effect:'destination',destination:baseIndex(37),title:'Hội nghị tại Hà Nội',description:'Tiến đến Hà Nội, xử lý ô đến; qua Xuất phát nhận '+fmt(200)+'.'},
{id:'c-station',effect:'nearest',kind:'rail',title:'Chuyến tàu bất ngờ',description:'Tiến tới ga tàu tiếp theo, xử lý ô đến; qua Xuất phát nhận '+fmt(200)+'.'},
{id:'c-utility',effect:'nearest',kind:'utility',title:'Cơ hội hạ tầng',description:'Tiến tới công ty điện/nước tiếp theo, xử lý ô đến; qua Xuất phát nhận '+fmt(200)+'.'},
{id:'c-boom',effect:'percentReward',rate:.1,title:'Đầu tư tăng trưởng',description:'Nhận thêm 10% tiền mặt hiện có từ ngân hàng.'},
{id:'c-down',effect:'percentFee',rate:.08,title:'Thị trường điều chỉnh',description:'Trả ngân hàng 8% tiền mặt hiện có.'},
{id:'c-deal',effect:'reward',amount:150,title:'Chốt thương vụ',description:'Nhận '+fmt(150)+' từ ngân hàng.'},
{id:'c-project',effect:'fee',amount:75,title:'Dự án trễ tiến độ',description:'Trả ngân hàng '+fmt(75)+'.'},
{id:'c-repair',effect:'repair',house:25,hotel:100,title:'Nâng cấp công trình',description:'Trả '+fmt(25)+' mỗi nhà và '+fmt(100)+' mỗi khách sạn.'},
{id:'c-rent',effect:'shield',title:'Bảo hiểm tiền thuê',description:'Giữ 1 lượt miễn tiền thuê. Tự dùng ở lần tới đến tài sản đối thủ có tiền thuê.'},
{id:'c-extra',effect:'extra',title:'Nắm bắt thời cơ',description:'Được thêm 1 lượt gieo sau khi kết thúc lượt này; không tích lũy nhiều lượt.'},...extraCards('chance')
];return [
{id:'k-festival',effect:'reward',amount:50,title:'Quà ngày hội',description:'Nhận '+fmt(50)+' từ ngân hàng.'},
{id:'k-scholarship',effect:'reward',amount:100,title:'Học bổng gia đình',description:'Nhận '+fmt(100)+' từ ngân hàng.'},
{id:'k-inherit',effect:'reward',amount:250,title:'Thừa kế bất ngờ',description:'Nhận '+fmt(250)+' từ ngân hàng.'},
{id:'k-taxrefund',effect:'reward',amount:75,title:'Hoàn khoản nộp dư',description:'Nhận '+fmt(75)+' từ ngân hàng.'},
{id:'k-charity',effect:'percentFee',rate:.03,title:'Góp quỹ cộng đồng',description:'Góp 3% tiền mặt hiện có cho ngân hàng.'},
{id:'k-medical',effect:'fee',amount:40,title:'Chi phí khám sức khỏe',description:'Trả ngân hàng '+fmt(40)+'.'},
{id:'k-school',effect:'fee',amount:60,title:'Đóng học phí',description:'Trả ngân hàng '+fmt(60)+'.'},
{id:'k-service',effect:'fee',amount:30,title:'Phí dịch vụ gia đình',description:'Trả ngân hàng '+fmt(30)+'.'},
{id:'k-saving',effect:'percentReward',rate:.05,title:'Lãi tiền tiết kiệm',description:'Nhận 5% tiền mặt hiện có từ ngân hàng.'},
{id:'k-assist',effect:'catchup',threshold:500,low:200,high:50,title:'Quỹ hỗ trợ',description:'Có dưới '+fmt(500)+': nhận '+fmt(200)+'. Từ mức đó trở lên: nhận '+fmt(50)+'.'},
{id:'k-property',effect:'assetReward',per:20,title:'Chia cổ tức tài sản',description:'Nhận '+fmt(20)+' cho mỗi tài sản đang sở hữu.'},
{id:'k-clean',effect:'repair',house:10,hotel:40,title:'Vệ sinh khu phố',description:'Trả '+fmt(10)+' mỗi nhà và '+fmt(40)+' mỗi khách sạn.'},
{id:'k-taxshield',effect:'taxshield',title:'Phiếu miễn thuế',description:'Giữ 1 lượt miễn thuế. Tự dùng khi đến ô thuế tiếp theo.'},
{id:'k-feeshield',effect:'feeshield',title:'Bảo hiểm sự kiện',description:'Giữ 1 lượt miễn phí từ thẻ, gồm phí sửa chữa và phí tính theo tỷ lệ; không miễn thuế hoặc tiền thuê.'},
{id:'k-start',effect:'start',title:'Đoàn tụ tại Xuất phát',description:'Tiến về Xuất phát, nhận '+fmt(200)+' nếu có di chuyển.'},
{id:'k-release',effect:'release',title:'Ân xá',description:'Giữ 1 thẻ ra tù miễn phí để dùng sau.'},...extraCards('chest')
];}
function extraCards(type){if(type==='chance')return [
{id:'c-port',effect:'destination',destination:baseIndex(13),title:'Hợp đồng cảng biển',description:'Tiến đến Hải Phòng, xử lý ô đến; qua Xuất phát nhận '+fmt(200)+'.'},
{id:'c-resort',effect:'destination',destination:baseIndex(31),title:'Khảo sát đảo nghỉ dưỡng',description:'Tiến đến Phú Quốc, xử lý ô đến; qua Xuất phát nhận '+fmt(200)+'.'},
{id:'c-saigon',effect:'destination',destination:baseIndex(39),title:'Triển lãm bất động sản',description:'Tiến đến TP. Hồ Chí Minh, xử lý ô đến; qua Xuất phát nhận '+fmt(200)+'.'},
{id:'c-sprint',effect:'diceMove',direction:1,title:'Bứt tốc',description:'Gieo riêng một xúc xắc, tiến 1–6 ô. Xử lý ô đến; qua Xuất phát có thưởng.'},
{id:'c-detour',effect:'diceMove',direction:-1,title:'Lạc đường',description:'Gieo riêng một xúc xắc, lùi 1–6 ô, xử lý ô đến. Không thưởng Xuất phát.'},
{id:'c-jump',effect:'forward',steps:9,title:'Vé bay hạng thương gia',description:'Tiến 9 ô, xử lý ô đến; qua Xuất phát nhận '+fmt(200)+'.'},
{id:'c-missed',effect:'back',steps:5,title:'Lỡ chuyến',description:'Lùi 5 ô, xử lý ô đến. Không thưởng Xuất phát.'},
{id:'c-pause',effect:'parkingMove',title:'Nghỉ dưỡng cuối tuần',description:'Tiến tới Bãi đỗ xe, nhận quỹ nếu bật luật quỹ. Qua Xuất phát có thưởng.'},
{id:'c-risk',effect:'risk',win:300,rate:.06,title:'Đầu tư mạo hiểm',description:'Gieo riêng 1 xúc xắc: 4–6 nhận '+fmt(300)+'; 1–3 mất 6% tiền mặt.'},
{id:'c-order',effect:'diceReward',per:40,title:'Đơn hàng bất ngờ',description:'Gieo riêng 1 xúc xắc, nhận '+fmt(40)+' nhân số gieo được (1–6).'},
{id:'c-portfolio',effect:'assetFee',per:15,title:'Phí quản lý danh mục',description:'Trả '+fmt(15)+' cho mỗi tài sản sở hữu.'},
{id:'c-built',effect:'buildingReward',house:15,hotel:80,title:'Công trình hút khách',description:'Nhận '+fmt(15)+' mỗi nhà và '+fmt(80)+' mỗi khách sạn.'},
{id:'c-railprofit',effect:'typeReward',kind:'rail',per:100,title:'Cổ tức vận tải',description:'Nhận '+fmt(100)+' cho mỗi ga tàu sở hữu.'},
{id:'c-utilityprofit',effect:'typeReward',kind:'utility',per:120,title:'Lợi nhuận hạ tầng',description:'Nhận '+fmt(120)+' cho mỗi công ty điện/nước sở hữu.'},
{id:'c-losslimit',effect:'cappedFee',rate:.12,cap:150,title:'Giới hạn thua lỗ',description:'Trả 12% tiền mặt, nhưng tối đa '+fmt(150)+'.'},
{id:'c-defend',effect:'shield',qty:2,title:'Gói bảo vệ thương vụ',description:'Nhận 2 lượt miễn tiền thuê, tự dùng ở các lần tới đến tài sản đối thủ.'}
];return [
{id:'k-poorest',effect:'rankReward',amount:300,title:'Tiếp sức người về sau',description:'Nếu tiền mặt không lớn hơn bất kỳ người còn chơi nào khác, nhận '+fmt(300)+'. Nếu không thì không nhận.'},
{id:'k-rebuild',effect:'topup',fraction:.15,title:'Quỹ tái khởi nghiệp',description:'Nếu tiền mặt dưới 15% vốn khởi đầu của ván, ngân hàng bù lên mức đó.'},
{id:'k-empty',effect:'noAssetReward',empty:300,normal:30,title:'Hỗ trợ người chưa có đất',description:'Chưa có tài sản: nhận '+fmt(300)+'. Đã có tài sản: nhận '+fmt(30)+'.'},
{id:'k-recovery',effect:'rankReward',amount:100,title:'Tiếp sức cuối bảng',description:'Nếu có tiền mặt ít nhất, nhận '+fmt(100)+'.'},
{id:'k-landdividend',effect:'typeReward',kind:'land',per:25,title:'Vườn nhà được mùa',description:'Nhận '+fmt(25)+' cho mỗi ô đất sở hữu.'},
{id:'k-housegrant',effect:'buildingReward',house:10,hotel:50,title:'Thưởng khu phố văn minh',description:'Nhận '+fmt(10)+' mỗi nhà và '+fmt(50)+' mỗi khách sạn.'},
{id:'k-weather',effect:'repair',house:15,hotel:60,title:'Khắc phục sau mưa',description:'Trả '+fmt(15)+' mỗi nhà và '+fmt(60)+' mỗi khách sạn.'},
{id:'k-feecap',effect:'cappedFee',rate:.04,cap:100,title:'Đóng góp theo khả năng',description:'Trả 4% tiền mặt, tối đa '+fmt(100)+'.'},
{id:'k-lucky',effect:'diceReward',per:25,title:'Quà may mắn',description:'Gieo riêng 1 xúc xắc, nhận '+fmt(25)+' nhân số gieo được (1–6).'},
{id:'k-safety',effect:'taxshield',qty:2,title:'Ưu đãi an sinh',description:'Nhận 2 lượt miễn thuế, tự dùng ở các lần tới đến ô thuế.'},
{id:'k-insurance',effect:'feeshield',qty:2,title:'Bảo hiểm gia đình',description:'Nhận 2 lượt miễn phí từ thẻ; không miễn thuế hay tiền thuê.'},
{id:'k-return',effect:'parkingMove',title:'Lễ hội tại quảng trường',description:'Tiến tới Bãi đỗ xe; nhận quỹ nếu bật luật quỹ. Qua Xuất phát có thưởng.'},
{id:'k-bonus',effect:'reward',amount:180,title:'Thưởng cuối năm',description:'Nhận '+fmt(180)+' từ ngân hàng.'},
{id:'k-care',effect:'percentReward',rate:.02,title:'Khoản tiết kiệm nhỏ',description:'Nhận 2% tiền mặt hiện có từ ngân hàng.'},
{id:'k-familyfee',effect:'assetFee',per:5,title:'Phí vệ sinh địa phương',description:'Trả '+fmt(5)+' cho mỗi tài sản sở hữu.'},
{id:'k-aid',effect:'catchup',threshold:300,low:250,high:20,title:'Suất hỗ trợ khẩn cấp',description:'Tiền mặt dưới '+fmt(300)+': nhận '+fmt(250)+'. Nếu không thì nhận '+fmt(20)+'.'}
];}
function drawCard(type){S.decks??={};let key=type==='chance'?'chance':'chest';if(!S.decks[key]?.length){let deck=cardDeck(key);for(let i=deck.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[deck[i],deck[j]]=[deck[j],deck[i]]}S.decks[key]=deck;}return S.decks[key].pop();}
function eventFee(amount){let p=cur();if(amount>0&&p.feeShield){p.feeShield--;log(p.name+' dùng bảo hiểm sự kiện, miễn '+fmt(amount)+'.');return}charge(amount,null);}
async function card(type){let p=cur(),c=drawCard(type);log((type==='chance'?'Cơ hội':'Khí vận')+': '+c.title+' — '+c.description);S.lastCard={type,player:p.name,...c};if(c.effect==='start')await move((tiles.length-p.pos)%tiles.length,{resolve:false});else if(c.effect==='jail')jail();else if(c.effect==='release')p.card++;else if(c.effect==='repair'){let sum=own(p).reduce((a,t)=>a+(t.h===5?c.hotel:t.h*c.house),0);eventFee(sum)}else if(c.effect==='back')await move(-c.steps);else if(c.effect==='forward')await move(c.steps);else if(c.effect==='destination')await move((c.destination-p.pos+tiles.length)%tiles.length);else if(c.effect==='nearest'){let distance=1;while(distance<tiles.length&&tiles[(p.pos+distance)%tiles.length].type!==c.kind)distance++;await move(distance)}else if(c.effect==='reward')p.cash+=c.amount;else if(c.effect==='fee')eventFee(c.amount);else if(c.effect==='percentReward')p.cash+=Math.round(p.cash*c.rate*10000)/10000;else if(c.effect==='percentFee')eventFee(Math.round(p.cash*c.rate*10000)/10000);else if(c.effect==='catchup')p.cash+=p.cash<c.threshold?c.low:c.high;else if(c.effect==='assetReward')p.cash+=own(p).length*c.per;else if(c.effect==='shield')p.rentShield=(p.rentShield||0)+(c.qty||1);else if(c.effect==='taxshield')p.taxShield=(p.taxShield||0)+(c.qty||1);else if(c.effect==='feeshield')p.feeShield=(p.feeShield||0)+(c.qty||1);else if(c.effect==='extra'&&!p.jailed)S.extra=true;else if(c.effect==='parkingMove')await move((roleIndex('parking')-p.pos+tiles.length)%tiles.length);else if(c.effect==='diceMove'){let d=rand();log('Xúc xắc sự kiện: '+d+'.');await move(d*c.direction)}else if(c.effect==='diceReward'){let d=rand();p.cash+=d*c.per;log('Xúc xắc sự kiện: '+d+' — nhận '+fmt(d*c.per)+'.')}else if(c.effect==='risk'){let d=rand();log('Xúc xắc sự kiện: '+d+'.');if(d>=4)p.cash+=c.win;else eventFee(Math.round(p.cash*c.rate*10000)/10000)}else if(c.effect==='assetFee')eventFee(own(p).length*c.per);else if(c.effect==='buildingReward')p.cash+=own(p).reduce((a,t)=>a+(t.h===5?c.hotel:t.h*c.house),0);else if(c.effect==='typeReward')p.cash+=own(p).filter(t=>t.type===c.kind).length*c.per;else if(c.effect==='cappedFee')eventFee(Math.min(c.cap,Math.round(p.cash*c.rate*10000)/10000));else if(c.effect==='rankReward'){if(S.players.filter(x=>!x.out).every(x=>p.cash<=x.cash))p.cash+=c.amount;else log('Chưa đủ điều kiện nhận hỗ trợ.')}else if(c.effect==='topup')p.cash=Math.max(p.cash,Math.round((S.initialCash||1500)*c.fraction*10000)/10000);else if(c.effect==='noAssetReward')p.cash+=own(p).length?c.normal:c.empty;}
function cardCatalogue(type='chance'){if(!['chance','chest'].includes(type))return;let deck=cardDeck(type);modal(`<button class="close" onclick="closeModal()" aria-label="Đóng danh sách thẻ">✕</button><h2>Cơ hội & Khí vận</h2><p>Cơ hội: di chuyển, đầu tư và biến động thị trường. Khí vận: gia đình, cộng đồng và hỗ trợ tài chính. Mỗi bộ có ${deck.length} thẻ khác nhau, xáo riêng và rút hết bộ mới xáo lại để giảm lặp.</p><div class="buttonrow" role="group" aria-label="Chọn bộ thẻ"><button class="${type==='chance'?'primary':''}" onclick="cardCatalogue('chance')">? Cơ hội</button><button class="${type==='chest'?'primary':''}" onclick="cardCatalogue('chest')">◆ Khí vận</button></div><h3>${type==='chance'?'Cơ hội':'Khí vận'} · ${deck.length} thẻ</h3>${deck.map((c,i)=>`<div class="asset card-entry"><span class="tag">THẺ ${String(i+1).padStart(2,'0')}</span><h3>${c.title}</h3><p>${c.description}</p></div>`).join('')}<p>Thiếu tiền trả phí thì bán nhà hoặc thế chấp; không trả được sẽ phá sản. Khi bật quỹ bãi đỗ xe, phí trả ngân hàng được góp vào quỹ. Xem thẻ không dừng đồng hồ: hãy Tạm dừng ván trước nếu cần.</p>`)}

