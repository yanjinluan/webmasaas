function sign (obj, token, appId){
	let url = signUrl(obj.url);
	let header = '';
	let params = '';
	let values = '';
	//请求头参数
	if (appId || appId === 0) {
		header = '?Application-Id=' + appId + '&Token=' + token 
	}else {
		header = '?Token=' + token
	}
	//参数
	if(obj.method === 'get' || obj.method ==='delete'){
		if ( obj.params ) {
			params = signGet(obj.params)
		}
	}else{
		let params = '';
		let num = obj.url.lastIndexOf('?');
		if (num !== -1) {
			params = '&' +  obj.url.substr(num+1)
		};
		if ( obj.data ) {
			values =params +  '&values=' + signPost(obj.data)
		}
	}

	let str = url + header + params + values;
	return str;
};
function signUrl (url) {
	let str = '';
	let num = url.lastIndexOf('?');
	if (num === -1){
		str = url;
	} else {
		str = url.substring(0, num);
	}
	return str;
};

function signGet (obj) {
	let str = '';
	let arr = [];
	for ( let i in obj) {
		if ( obj[i] === 0 ||obj[i] ){
			arr.push(i + '=' + obj[i])
		}
	};
	let newArr = lineupStudents(arr);
	for ( let i = 0; i <newArr.length; i++) {
		str = str + '&' + newArr[i];
	};
	return str;
};

function signPost (obj) {
	let str = '';
	let arr = [];
	for ( let i in obj) {
		if (obj[i] === 0 || obj[i]){
			arr.push(i + '=' + JSON.stringify(obj[i]))
		}
	};
	let newArr = lineupStudents(arr);
	for ( let i = 0; i <newArr.length; i++) {
		str = str + ',' + newArr[i];
	};
	let newStr = '[' +  str.substr(1) + ']';
	return newStr;
};

//参数升序排列
function lineupStudents(arr){
    arr.sort(function(a, b){
    	return (a + '').localeCompare(b + '')
    });
	return arr;
};
export default sign;