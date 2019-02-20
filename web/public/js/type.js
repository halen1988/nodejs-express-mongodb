(function() {
	const init = () => {
		selectCheck();
		selectChange();
		submit();
	}
	const selectCallback = (e) => {
			const target = (e || window).target;
			const className = target.className;
			const tagname = target.tagName;
			const isChecked = className.indexOf('checked') >= 0;
			if(tagname === 'SPAN' && target.className.indexOf('check') >= 0){
				if(isChecked){
					e.target.className = 'check';
					e.srcElement.parentElement.getElementsByTagName('input')[1].value = '';
				}else{
					e.target.className = 'check checked';
					e.srcElement.parentElement.getElementsByTagName('input')[1].value = true;
				}
			}
	}
	/**
	 * 选择答案方法
	 */
	const selectCheck = () => {
		let check = document.getElementsByClassName('type-wrap')[0];
		check.addEventListener('click', selectCallback, false);
	}
	
	const selectChangeCallback = (e) => {
		const target = (e || window).target;
		const jsAnswer = document.getElementById('jsAnswer');
		const jsAnswer2 = document.getElementById('jsAnswer2');
		
		if(target.value === ANSWER){
			jsAnswer.className = 'dn';
			jsAnswer2.className = '';
		}else{
			jsAnswer.className = '';
			jsAnswer2.className = 'dn'
		}
		
	}
	
	/**
	 *下拉选择交互
	 */
	const selectChange = () => {
		const selectType = document.getElementsByTagName("select")[0];
		
		selectType.addEventListener('change', selectChangeCallback, false);
	}
	
	const submitCallback = (e) => {
		const checkedLen = document.querySelectorAll('.checked').length;
		const typeName = document.querySelector('input[name=typeName]');
		const selectType = document.getElementsByTagName("select")[0].value;
		const textareaTag = document.getElementById('jsAnswer2').getElementsByTagName('textarea');
		
		if(selectType === RADIO || selectType === CHECKBOX){
			if(typeName.value === ''){
				console.log('题目不能为空！');
				return false;
			}else if(selectType === RADIO && checkedLen === 0){
				alert('单选题必须选择一个正确答案!');
				return false;
			}else if(selectType === CHECKBOX && checkedLen < 2){
				alert('多选题最少选择两个正确答案!');
				return false;
			}
		}else {
		 if(selectType === ANSWER){
				if(textareaTag[0].value === '' || textareaTag[1].value === ''){
					alert('问答题的问题内容和答案都不能为空！');
					return false;
				}
			}
		}
		
		document.getElementById('jsForm').submit();
		
	}
	
	const submit = () => {
		const jsSubmit = document.getElementById('jsSubmit');
		
		jsSubmit.addEventListener('click', submitCallback, false);
	}
	
	
	init();
})();

