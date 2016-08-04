module.exports = function (main, topnavi, sidebar) {
	var fs = require('fs'),
	mustache = require('mustache');
	
	this.main = main;
	this.topnavi = topnavi;
	this.sidebar = sidebar;

  this.merge = function (middlepart) {
		var output, mastercontent, topnavicontent, sidebarcontent;

		 // read files
		 try {
			 mastercontent = fs.readFileSync(this.main, 'utf8');
		 } catch (e) {
			 mastercontent = '';
		 }

		 try {
			 topnavicontent = fs.readFileSync(this.topnavi, 'utf8');
		 } catch (e) {
			 topnavicontent = '';
		 }

		 try {
			 sidebarcontent = fs.readFileSync(this.idebar, 'utf8');
		 } catch (e) {
			 sidebarcontent = '';
		 }


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
}
