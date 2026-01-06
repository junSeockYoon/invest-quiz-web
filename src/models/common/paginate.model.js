const logger = require("../../config/logger");

class Paginate {
    constructor() {
        this.currentPage = 1;        // 현재 페이지 번호
        this.countPerPage = 20;      // 한 페이지당 게시되는 게시물 건 수
        this.pageSize = 10;          // 페이지 리스트에 게시되는 페이지 건 수
        this.fetchRecordCount = 0;   // 쿼리 결과 리스트의 게시물 건 수
        this.totalRecordCount = 0;   // 전체 게시물 건 수
    
        this.startPage = 0;          // 나열되는 시작 페이지 번호
        this.endPage = 0;            // 나열되는 마지막 페이지 번호
        this.prevPage = 0;           // 시작 페이지 이전페이지 번호
        this.nextPage = 0;           // 마지막 페이지 다음페이지 번호
        this.totalPageCount = 0;     // 총 페이지 수
    }

    Paging(currentPage, countPerPage) {
        if (currentPage <= 0)
            currentPage = 1;
        if (countPerPage <= 0)
            countPerPage = 20;

        this.currentPage = currentPage;
        this.countPerPage = countPerPage;
    }

    Paging(currentPage, countPerPage, pageSize) {
        if(currentPage === undefined) currentPage = 0;
        if (currentPage <= 0)
            currentPage = 1;
        if (countPerPage <= 0)
            countPerPage = 20;
        if (pageSize <= 0)
            pageSize = 10;

        this.currentPage = currentPage;
        this.countPerPage = countPerPage;
        this.pageSize = pageSize;
    }

    // 페이징 처리 시작 카운트
    getStartRowNum() {
        try {
            let result = 0;
            result = (this.currentPage - 1) * this.countPerPage + 1;
            return result;
        } catch (e) {
            logger.error(e);
            return 0;
        }
    }

    // 페이징 처리 종료 카운트
    getEndRowNum() {
        try {
            let result = 0;
            result = (this.currentPage * this.countPerPage);
            return result;
        } catch (e) {
            logger.error(e);
            return 0;
        }
    }

    // 시작 페이지 번호
    getStartPage() {
        try {
            let startPage = Math.floor(((this.currentPage - 1) / this.pageSize)) * this.pageSize + 1;
            this.startPage = startPage;
            return this.startPage;
        } catch (e) {
            logger.error(e);
            return 0;
        }
    }

    // 마지막 페이지 번호
    getEndPage() {
        try {
            let endPage = this.getStartPage() + this.pageSize - 1;
            if (endPage > this.getTotalPageCount())
                endPage = this.getTotalPageCount();
            this.endPage = endPage;
            return this.endPage;
        } catch (e) {
            logger.error(e);
            return 0;
        }
    }

    // 이전 페이지 번호 (PREV)
    getPrevPage() {
        try {
            let prevPage = this.getStartPage() - 1;
            if (prevPage < 1)
                prevPage = 1;
            this.prevPage = prevPage;
            return this.prevPage;
        } catch (e) {
            logger.error(e);
            return 0;
        }
    }

    // 다음 페이지 번호 (NEXT)
    getNextPage() {
        try {
            let nextPage = this.getEndPage() + 1;
            if (nextPage > this.getTotalPageCount())
                nextPage = this.getTotalPageCount();
            this.nextPage = nextPage;
            return this.nextPage;
        } catch (e) {
            logger.error(e);
            return 0;
        }
    }

    // 전체 페이지 수
    getTotalPageCount() {
        let totalPageCount = Math.ceil(this.totalRecordCount / this.countPerPage);
        this.totalPageCount = totalPageCount;
        return this.totalPageCount;
    }
    
    toString() {
        return "{\"currentPage\":\"" + this.currentPage + "\"" + ",\"countPerPage\":\"" + this.countPerPage + "\""
                + ",\"pageSize\":\"" + this.pageSize + "\"" + ",\"fetchRecordCount\":\"" + this.fetchRecordCount + "\""
                + ",\"totalRecordCount\":\"" + this.totalRecordCount + "\"" + ",\"startPage\":\"" + this.getStartPage() + "\""
                + ",\"endPage\":\"" + this.getEndPage() + "\"" + ",\"prevPage\":\"" + this.getPrevPage() + "\""
                + ",\"nextPage\":\"" + this.getNextPage() + "\"" + ",\"totalPageCount\":\"" + this.getTotalPageCount() + "\""
                + "}";
    }

    getCurrentPage() {
        return this.currentPage;
    }

    setCurrentPage(currentPage) {
        if (currentPage <= 0)
            currentPage = 1;
        this.currentPage = currentPage;
    }

    getCountPerPage() {
        return this.countPerPage;
    }

    setCountPerPage(countPerPage) {
        this.countPerPage = countPerPage;
    }

    getPageSize() {
        return this.pageSize;
    }

    setPageSize(pageSize) {
        this.pageSize = pageSize;
    }

    getFetchRecordCount() {
        return this.fetchRecordCount;
    }

    setFetchRecordCount(fetchRecordCount) {
        this.fetchRecordCount = fetchRecordCount;
    }

    getTotalRecordCount() {
        return this.totalRecordCount;
    }

    setTotalRecordCount(totalRecordCount) {
        this.totalRecordCount = totalRecordCount;
        this.computePaging();
    }

    computePaging() {
        this.getStartPage();
        this.getEndPage();
        this.getPrevPage();
        this.getNextPage();
        this.getTotalPageCount();
    }

}

module.exports = Paginate;