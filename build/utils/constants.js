"use strict";
var PYTHON_SERVER_URL = 'http://127.0.0.1:5000';
var INSERT_USER_DATA = "INSERT INTO Users (Id,UserName, FbUrl, TechTxt,AddTxt) VALUES ('IdValue','UserNameValue', 'FbUrlValue', 'TechTxtValue', 'AddTxtValue')";
var USER_FIND = "SELECT * FROM Users WHERE Id='IdValue'";
var INSERT_ARTICLE = "INSERT INTO Articles (Id, Author, Title, Content, Topic,SubmitDate, ImageUrl,Brief) VALUES ('IdValue',N'AuthorValue',N'TitleValue',N'ContentValue','TopicValue','SubmitDateValue','ImageValue',N'BriefValue')";
var GET_MAIN_ARTICLE = 'SELECT TOP 1 Id,Author,Title,Brief,ImageUrl,SubmitDate FROM Articles ORDER BY SubmitDate DESC';
var GET_FEATURED_ARTICLE = "SELECT TOP 1 Id,Author,Title,Brief,Topic,ImageUrl,SubmitDate FROM Articles WHERE Articles.Topic='LabelValue' ORDER BY SubmitDate DESC";
var GET_ARTICLE_AS_PAGE = 'SELECT Id,Author,Title,Brief,Topic,ImageUrl, SubmitDate FROM Articles ORDER BY orderByValue orderTypeValue OFFSET startValue ROWS FETCH NEXT pageSizeValue ROWS ONLY';
var GET_ARTICLE_AS_PAGE_AUTHOR = 'SELECT Id,Author,Title,Brief,Topic,ImageUrl, SubmitDate FROM Articles WHERE Author In (authorValues) ORDER BY orderByValue orderTypeValue OFFSET startValue ROWS FETCH NEXT pageSizeValue ROWS ONLY';
var GET_ARTICLE_AS_PAGE_TOPIC = 'SELECT Id,Author,Title,Brief,Topic,ImageUrl, SubmitDate FROM Articles WHERE Topic IN (topicValues) ORDER BY orderByValue orderTypeValue OFFSET startValue ROWS FETCH NEXT pageSizeValue ROWS ONLY';
var GET_ARTICLE_AS_PAGE_AUTHOR_TOPIC = 'SELECT Id,Author,Title,Brief,Topic,ImageUrl, SubmitDate FROM Articles WHERE Author In (authorValues) and Topic IN (topicValues) ORDER BY orderByValue orderTypeValue OFFSET startValue ROWS FETCH NEXT pageSizeValue ROWS ONLY';
var COUNT_TOTAL_ARTICLE = 'SELECT COUNT(*) FROM Articles';
var COUNT_TOTAL_ARTICLE_AUTHOR = 'SELECT COUNT(*) FROM Articles WHERE Author In (authorValues)';
var COUNT_TOTAL_ARTICLE_TOPIC = 'SELECT COUNT(*) FROM Articles WHERE Topic IN (topicValues)';
var COUNT_TOTAL_ARTICLE_AUTHOR_TOPIC = 'SELECT COUNT(*) FROM Articles WHERE Author In (authorValues) and Topic IN (topicValues)';
var INSERT_PERSONALIZED_INFORMS = "INSERT INTO PersonalizedInforms (UserId,TechList,AddList) VALUES ('UserIdValue','TechListValue','AddListValue')";
var COUNT_USERNAME_OR_FBURL = "SELECT COUNT(*) AS TOTAL FROM Users WHERE Users.UserName='UserNameValue' OR Users.FbUrl='FbUrlValue'";
var DELETE_ARTICLES = 'DELETE FROM Articles WHERE Id IN (LIST_ID)';
var UPDATE_ARTICLES = "UPDATE Articles SET Author=N'AuthorValue',Title=N'TitleValue',Content=N'ContentValue',Topic='TopicValue',SubmitDate='SubmitDateValue',ImageUrl='ImageUrlValue',Brief=N'BriefValue'  WHERE Id=IdValue";
var GET_DETAIL_POST = "SELECT Content FROM Articles WHERE Id='IdValue'";
var GET_FULL_DETAIL_POST = "SELECT * FROM Articles WHERE Id='IdValue'";
var GET_ALL_TOPIC = 'SELECT Topic FROM Articles';
var GET_ALL_AUTHOR = 'SELECT Author FROM Articles';
var FIND_ARTICLE_AS_TOPIC = "SELECT Id,Author,Title,Brief,Topic,ImageUrl, SubmitDate FROM Articles WHERE Articles.Topic='LabelValue'";
var SEARCH_ARTICLES = "SELECT Id,Author,Title,Brief,Topic,ImageUrl, SubmitDate FROM Articles WHERE Title LIKE '%titleValue%' OR Author LIKE '%authorValue%' OR Content LIKE '%contentValue%'";
var FIND_ARTICLES_BELONG_IN_LIST_ID = 'SELECT Id,Author,Title,Brief,Topic,ImageUrl, SubmitDate FROM Articles WHERE Id IN (LIST_ID)';
var FIND_ALL_ARTICLES_CRAWL = 'SELECT * FROM CRAWLER_ARTICLE ORDER BY orderByValue orderTypeValue OFFSET startValue ROWS FETCH NEXT pageSizeValue ROWS ONLY';
var COUNT_TOTAL_ARTICLE_CRAWL = 'SELECT COUNT(*) FROM CRAWLER_ARTICLE';
var INSER_ARTICLE_CRAWL = "INSERT INTO CRAWLER_AUDIO (ArticleId, AudioUrl) VALUES ('ArticleIdValue','AudioUrlValue')";
var FIND_AUDIO_ARTICLE_CRAWL = "SELECT AudioUrl FROM CRAWLER_AUDIO WHERE ArticleId='IdValue'";
var INSERT_AUDIO = "INSERT INTO Audio (FileId,FolderId,VideoId,RelatedVideos) VALUES ('fileIdValue','folderIdValue','videoIdValue', 'relatedVideosValue')";
var GET_THUMB = 'SELECT * FROM Audio';
var SEARCH_THUMB = "SELECT * FROM Audio WHERE parent='parentValue'";
var COUNT_AUDIO = "SELECT COUNT(*) from Audio where VideoId = 'videoIdValue'";
var GET_RELATED_VIDEOS = "SELECT FolderId,RelatedVideos FROM Audio WHERE FileId='fileIdValue'";
var GET_EXISTED_VIDEOS = 'SELECT VideoId FROM Audio';
var ERROR_CODE = {
    200: 'Success.',
    201: 'Success.',
    202: 'Success.',
    204: 'Delete Sucess.',
    400: 'Request Error.',
    401: 'UnAuthorized。',
    403: 'Access Forbidden',
    404: 'Not Found.',
    406: 'Format unavaiable.',
    410: 'Resource not exist.',
    422: 'Validation error.',
    500: 'Server error.',
    502: 'Gateway error.',
    503: 'Service unavaiable.',
    504: 'Timeout.',
};
/**
 * Notification
 */
var GET_ALL_SUBSCRITION = 'SELECT Subscription FROM Subscription';
var INSERT_SUBSCRITION = "INSERT INTO Subscription (id, subscription) VALUES ('idValue','subscriptionValue')";
var DELETE_SUBSCRIPTION = "DELETE FROM Subscription WHERE id='idValue'";
module.exports = {
    PYTHON_SERVER_URL: PYTHON_SERVER_URL,
    INSERT_USER_DATA: INSERT_USER_DATA,
    USER_FIND: USER_FIND,
    INSERT_ARTICLE: INSERT_ARTICLE,
    GET_MAIN_ARTICLE: GET_MAIN_ARTICLE,
    GET_FEATURED_ARTICLE: GET_FEATURED_ARTICLE,
    INSERT_PERSONALIZED_INFORMS: INSERT_PERSONALIZED_INFORMS,
    COUNT_USERNAME_OR_FBURL: COUNT_USERNAME_OR_FBURL,
    COUNT_TOTAL_ARTICLE: COUNT_TOTAL_ARTICLE,
    COUNT_TOTAL_ARTICLE_TOPIC: COUNT_TOTAL_ARTICLE_TOPIC,
    COUNT_TOTAL_ARTICLE_AUTHOR: COUNT_TOTAL_ARTICLE_AUTHOR,
    COUNT_TOTAL_ARTICLE_AUTHOR_TOPIC: COUNT_TOTAL_ARTICLE_AUTHOR_TOPIC,
    GET_ARTICLE_AS_PAGE: GET_ARTICLE_AS_PAGE,
    GET_ARTICLE_AS_PAGE_AUTHOR: GET_ARTICLE_AS_PAGE_AUTHOR,
    GET_ARTICLE_AS_PAGE_TOPIC: GET_ARTICLE_AS_PAGE_TOPIC,
    GET_ARTICLE_AS_PAGE_AUTHOR_TOPIC: GET_ARTICLE_AS_PAGE_AUTHOR_TOPIC,
    DELETE_ARTICLES: DELETE_ARTICLES,
    UPDATE_ARTICLES: UPDATE_ARTICLES,
    GET_DETAIL_POST: GET_DETAIL_POST,
    GET_FULL_DETAIL_POST: GET_FULL_DETAIL_POST,
    GET_ALL_TOPIC: GET_ALL_TOPIC,
    FIND_ARTICLE_AS_TOPIC: FIND_ARTICLE_AS_TOPIC,
    SEARCH_ARTICLES: SEARCH_ARTICLES,
    FIND_ARTICLES_BELONG_IN_LIST_ID: FIND_ARTICLES_BELONG_IN_LIST_ID,
    FIND_ALL_ARTICLES_CRAWL: FIND_ALL_ARTICLES_CRAWL,
    COUNT_TOTAL_ARTICLE_CRAWL: COUNT_TOTAL_ARTICLE_CRAWL,
    INSER_ARTICLE_CRAWL: INSER_ARTICLE_CRAWL,
    FIND_AUDIO_ARTICLE_CRAWL: FIND_AUDIO_ARTICLE_CRAWL,
    ERROR_CODE: ERROR_CODE,
    GET_ALL_SUBSCRITION: GET_ALL_SUBSCRITION,
    INSERT_SUBSCRITION: INSERT_SUBSCRITION,
    DELETE_SUBSCRIPTION: DELETE_SUBSCRIPTION,
    INSERT_AUDIO: INSERT_AUDIO,
    SEARCH_THUMB: SEARCH_THUMB,
    GET_THUMB: GET_THUMB,
    GET_ALL_AUTHOR: GET_ALL_AUTHOR,
    COUNT_AUDIO: COUNT_AUDIO,
    GET_RELATED_VIDEOS: GET_RELATED_VIDEOS,
    GET_EXISTED_VIDEOS: GET_EXISTED_VIDEOS,
};
