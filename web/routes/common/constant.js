/**
 * Created by admin on 2018/7/30.
 */

const ANSWER = '3';
const RADIO = '1';
const CHECKBOX = '2';

const QUESTIONTYPE = [
	{
		'type':1,
		'name':'单选'
	},
	{
		'type':2,
		'name':'多选'
	},
	{
		'type':3,
		'name':'问答'
	}
];

const SELECTTYPE = [
	{
		'type':4,
		'name':'css样式'
	},
	{
		'type':5,
		'name':'js'
	},
	{
		'type':6,
		'name':'网络'
	},
	{
		'type':7,
		'name':'缓存'
	},
	{
		'type':8,
		'name':'架构'
	},
	{
		'type':9,
		'name':'框架'
	},
];


exports.ANSWER = ANSWER;
exports.RADIO = RADIO;
exports.CHECKBOX = CHECKBOX;

exports.QUESTIONTYPE = QUESTIONTYPE;
exports.SELECTTYPE = SELECTTYPE;