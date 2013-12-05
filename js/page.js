/**
 * html5 magazine
 * author:peter
 * date:2012-02-27
 */
function Page() {
	this.prevPage = {};
	this.currentPage = {};
	this.currentPageNum = 0;
	this.nextPage = {};
}

Page.prototype.setCurrentPage = function(pageId) {
	currentPage = $(pageId);
	this.currentPage = currentPage;
	this.currentPageNum = parseInt(currentPage.dataset["page"]);//data attribute
	if(this.currentPageNum - 1 > 0) {
		this.prevPage = $("page_" + (this.currentPageNum - 1));
	} else {
		this.prevPage = false;
	}
	if(this.currentPageNum + 1 <= 6) {
		this.nextPage = $("page_" + (this.currentPageNum + 1));
	} else {
		this.nextPage = false;
	}
}