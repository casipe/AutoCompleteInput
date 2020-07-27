var datas = [
		{key:1, value:"Ana", description:"ID:0001 - Ana"},
		{key:2, value:"Bruno", description:"ID:0002 - Bruno"},
		{key:3, value:"Carlos", description:"ID:0003 - Carlos"},
		{key:4, value:"Catarina", description:"ID:0004 - Catarina"},
		{key:5, value:"Bianca", description:"ID:0005 - Bianca"},
];

	
	 
    AutoCompleteInput('#name', {
        datas,
		/*
		source: {
            method: 'POST',
            url: 'ajax.php',
            data: {foo: 'param},
        },
		*/
		minCharSearch:1,
        onComplete: (res) => {
			//request ajax complete
        },
		onSelect: (item) => {
			document.getElementById('result').innerHTML = '<span>'+item.description+'<span>';
            console.log('Item selected:', item);        
        }
    });