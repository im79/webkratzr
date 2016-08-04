module.exports = function (main, topnavi, sidebar) {
	var fs = require('fs'),
	mustache = require('mustache');

	this.main = main;
	this.topnavi = topnavi;
	this.sidebar = sidebar;

	this.setPath = function (path) {
		this.path = path;
	};

	this.getHeading = function () {
		if(this.path == 'login')return 'Please sign in';
		if(this.path == 'front')return 'Welcome to front page';
	};

  this.merge = function (middlepart) {
		var output, mastercontent, topnavicontent, sidebarcontent,middlepartcontent;

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
			 sidebarcontent = fs.readFileSync(this.sidebar, 'utf8');
		 } catch (e) {
			 sidebarcontent = '';
		 }

		 try {
			 middlepartcontent = fs.readFileSync(middlepart, 'utf8');
		 } catch (e) {
			 middlepartcontent = middlepart;
		 }


		// template engine
		var view = {
			topnavi: topnavicontent,
			sidebar: sidebarcontent,
			title: '{{title}}',
			heading: this.getHeading(),
			content: middlepartcontent
		};

		output = mustache.render(mastercontent, view);

		return output;
    }
}
