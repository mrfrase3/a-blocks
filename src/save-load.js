const FileSaver = require('file-saver');
const version = '1.0.0';


$(function(){
	$('.save-load.save').click(e=>{
		e.preventDefault();
		let fileText = `<!-- {"version":"${version}", "program":"a-blocks"} -->\n`;
		$('*[scene-panel]').each(function(){
			let el = $(this).get(0);
			if(el.components.blockly) el.components.blockly.saveToDom();
			el.flushToDOM();
			fileText += el.outerHTML + '\n';
		});
		let fileblob = new Blob([fileText], {type: "text/plain;charset=utf-8"});
		let fdate = new Date();
		FileSaver.saveAs(fileblob, `Project_${fdate.getFullYear()}-${fdate.getMonth()}-${fdate.getDate()}_${fdate.getHours()}-${fdate.getMinutes()}.ablock`);
	});

	let $fileInput = $('#file-input');

	$('.save-load.load').click(e=>{
		e.preventDefault();
		$fileInput.click();
	});

	let handleFiles = files => {
		if(!files[0]) return;
		if(!confirm("Are you sure you wish to load a new file?\n\nAll current progress will be lost!")) return;
		let reader = new FileReader();
		reader.onload = ()=>{
			let lines = reader.result.split('\n');
			let info  = lines.shift().replace(/(<!|-)-(-|>)/g, '').trim();
			try {
				info = JSON.parse(info);
			} catch(err) {
				console.error('invalid file given!');
				return;
			}
			if(info.program !== 'a-blocks') return console.error('invalid file given!');
			$('*[scene-panel]').remove();
			$('a-scene').prepend(lines.join('\n'));
		}
		reader.readAsText(files[0]);
	}

	$fileInput.change(e => {
		let el = $fileInput.get(0);
		handleFiles(el.files)
	});
});