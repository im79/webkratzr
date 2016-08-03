module.exports = {

	merge: function(main, topnavi, sidebar) {
			var output, mastercontent, topnavicontent, sidebarcontent,
			 fs = require('fs'),
			 mustache = require('mustache');

			 // read files
			 try {
				 mastercontent = fs.readFileSync(main, 'utf8');
			 } catch (e) {
				 mastercontent = '';
			 }

			 try {
				 topnavicontent = fs.readFileSync(topnavi, 'utf8');
			 } catch (e) {
				 topnavicontent = '';
			 }

			 try {
				 sidebarcontent = fs.readFileSync(sidebar, 'utf8');
			 } catch (e) {
				 sidebarcontent = '';
			 }

console.log(topnavicontent);
			// template engine
			var view = {
				topnavi: topnavicontent,
				sidebar: sidebarcontent,
				title: '{{title}}',
				heading: '{{heading}}',
				content: '{{{content}}}'
			};

			output = mustache.render(mastercontent, view);

			return output;
	}

};
