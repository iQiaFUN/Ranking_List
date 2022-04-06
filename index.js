const cron = require('node-cron');
const path = require('path');
const cmd = '/排行榜';
const Day = '日榜';
const Week = '周榜';
const Month = '月榜';

function getText(e) {
    var rt = '';
    for (i in e.message) {
        switch (e.message[i].type) {
            case "text":
                rt += e.message[i].text;
                break;
        }
    }
    return rt;
}

function onStart(api){
	api.logger.info('排行榜插件启动成功');
	cron.schedule('0 0 0 * * * ', () => {
		api.logger.info('日排行榜数据更新中');
		Top_data('D_Top.json','YD_playerdata.json');
		api.logger.info('日排行榜数据更新完成');
	});
	cron.schedule('0 0 4 * * 0 ', () => {
		api.logger.info('周排行榜数据更新中');
		Top_data('W_Top.json','LW_playerdata.json');
		api.logger.info('周排行榜数据更新完成');
	});
	cron.schedule('0 0 5 1 * * ', () => {
		api.logger.info('月排行榜数据更新中');
		Top_data('M_Top.json','LM_playerdata.json');
		api.logger.info('月排行榜数据更新完成');
	});
	api.listen('onMainMessageReceived',(e)=>{
		let text = getText(e);
		let pt = text.split(' ');
		if(pt[0]==cmd){
			if(pt.length = 2){
				switch(pt[1]){
					case Day:
						Top_reply(e,'D_Top.json',Day);
						break;
					case Week:
						Top_reply(e,'W_Top.json',Week);
						break;
					case Month:
						Top_reply(e,'M_Top.json',Month);
						break;
					default:
						e.reply(`参数错误`);
				}
			}
		}
	});
}

function Top_data(top_data_files,old_data_files){
	let now_data = NIL._vanilla.get_all();
	if (NIL.IO.exists(path.join(__dirname, old_data_files)) == false) {
        NIL.IO.WriteTo(path.join(__dirname, old_data_files), JSON.stringify(now_data, null, '\t'));
    }
	let old_data = JSON.parse(NIL.IO.readFrom(path.join(__dirname, old_data_files)));
	let top_data = now_data;
	for(let om in now_data){
		let tmp_o = old_data[om];
		let tmp_n = now_data[om];
		if(tmp_o==undefined){	
			tmp_o = tmp_n;
		}
		tmp_n.period = tmp_n.period - tmp_o.period;
		tmp_n.join = tmp_n.join - tmp_o.join;
		top_data[m] = tmp_n;
	}
	NIL.IO.delete(path.join(__dirname,old_data_files));
	if (NIL.IO.exists(path.join(__dirname, top_data_files)) == true){
		NIL.IO.delete(path.join(__dirname, top_data_files));
	}
	old_data = now_data;
	NIL.IO.WriteTo(path.join(__dirname, old_data_files), JSON.stringify(old_data, null, '\t'));
	NIL.IO.WriteTo(path.join(__dirname, top_data_files), JSON.stringify(top_data, null, '\t'));
}

function Top_reply(e,files,pm){
	let p_data = {};
	if(NIL.IO.exists(path.join(__dirname, files)) == true){
        p_data = JSON.parse(NIL.IO.readFrom(path.join(__dirname, files)));
		let p_arr = [];
		var i = 0;
		for(let mem in p_data){
			let tmp = p_data[mem];
			p_arr[i] = {xboxid:tmp.xboxid,period:tmp.period};
			i++;
		}	
		p_arr.sort(compare('period'));
		p_arr.reverse();
		
		e.reply([`在线排行榜\t\t${pm}\n\n`,
		`${timeFormat(p_arr[0].period)}h\t${p_arr[0].xboxid}\n`,
		`${timeFormat(p_arr[1].period)}h\t${p_arr[1].xboxid}\n`,
		`${timeFormat(p_arr[2].period)}h\t${p_arr[2].xboxid}\n`,
		`${timeFormat(p_arr[3].period)}h\t${p_arr[3].xboxid}\n`,
		`${timeFormat(p_arr[4].period)}h\t${p_arr[4].xboxid}\n`,
		`${timeFormat(p_arr[5].period)}h\t${p_arr[5].xboxid}\n`,
		`${timeFormat(p_arr[6].period)}h\t${p_arr[6].xboxid}\n`,
		`${timeFormat(p_arr[7].period)}h\t${p_arr[7].xboxid}\n`,
		`${timeFormat(p_arr[8].period)}h\t${p_arr[8].xboxid}\n`,
		`${timeFormat(p_arr[9].period)}h\t${p_arr[9].xboxid}`]);
    }else{
		e.reply(`${pm}数据未更新`);
	}
}

function compare(prop){
	return function(a,b) {
		var value1 = a[prop];
		var value2 = b[prop];
		return value1-value2
	}
}

function timeFormat(dur){
    if (dur!==0){
        let hour=3600*1000;
        return (dur/hour).toFixed(2);
    }
    return 0;
}



module.exports = {
    onStart,
    onStop(){}
}
