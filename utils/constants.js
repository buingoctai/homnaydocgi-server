const PYTHON_SERVER_URL = 'http://127.0.0.1:5000';
const INSERT_USER_DATA =
	"INSERT INTO Users (Id,UserName, FbUrl, TechTxt,AddTxt) VALUES ('IdValue','UserNameValue', 'FbUrlValue', 'TechTxtValue', 'AddTxtValue')";
const USER_FIND = "SELECT * FROM Users WHERE Id='IdValue'";
const INSERT_ARTICLE =
	"INSERT INTO Articles (Id, Author, Title, Content, Topic,SubmitDate, ImageUrl,Brief) VALUES ('IdValue',N'AuthorValue',N'TitleValue',N'ContentValue','TopicValue','SubmitDateValue','ImageValue',N'BriefValue')";
const GET_MAIN_ARTICLE = 'SELECT TOP 1 Id,Author,Title,Brief,ImageUrl,SubmitDate FROM Articles ORDER BY SubmitDate DESC';
const GET_FEATURED_ARTICLE =
	"SELECT TOP 1 Id,Author,Title,Brief,Topic,ImageUrl,SubmitDate FROM Articles WHERE Articles.Topic='LabelValue' ORDER BY SubmitDate DESC";
const GET_ARTICLE_AS_PAGE =
	'SELECT Id,Author,Title,Brief,Topic,ImageUrl, SubmitDate FROM Articles ORDER BY orderByValue orderTypeValue OFFSET startValue ROWS FETCH NEXT pageSizeValue ROWS ONLY';
const COUNT_TOTAL_ARTICLE = 'SELECT COUNT(*) FROM Articles';
const INSERT_PERSONALIZED_INFORMS = "INSERT INTO PersonalizedInforms (UserId,TechList,AddList) VALUES ('UserIdValue','TechListValue','AddListValue')";
const COUNT_USERNAME_OR_FBURL = "SELECT COUNT(*) AS TOTAL FROM Users WHERE Users.UserName='UserNameValue' OR Users.FbUrl='FbUrlValue'";
const DELETE_ARTICLES = 'DELETE FROM Articles WHERE Id IN (LIST_ID)';
const UPDATE_ARTICLES =
	"UPDATE Articles SET Author=N'AuthorValue',Title=N'TitleValue',Content=N'ContentValue',Topic='TopicValue',SubmitDate='SubmitDateValue',ImageUrl='ImageUrlValue',Brief=N'BriefValue'  WHERE Id=IdValue";
const FIND_DETAIL_POST = "SELECT Content FROM Articles WHERE Id='IdValue'";
const GET_FULL_DETAIL_POST = "SELECT * FROM Articles WHERE Id='IdValue'";

const FIND_ALL_TOPIC = 'SELECT Topic FROM Articles';
const FIND_ARTICLE_AS_TOPIC = "SELECT Id,Author,Title,Brief,Topic,ImageUrl, SubmitDate FROM Articles WHERE Articles.Topic='LabelValue'";
const SEARCH_ARTICLES =
	"SELECT Id,Author,Title,Brief,Topic,ImageUrl, SubmitDate FROM Articles WHERE Title LIKE '%titleValue%' OR Author LIKE '%authorValue%' OR Content LIKE '%contentValue%'";
const FIND_ARTICLES_BELONG_IN_LIST_ID = 'SELECT Id,Author,Title,Brief,Topic,ImageUrl, SubmitDate FROM Articles WHERE Id IN (LIST_ID)';
const FIND_ALL_ARTICLES_CRAWL =
	'SELECT * FROM CRAWLER_ARTICLE ORDER BY orderByValue orderTypeValue OFFSET startValue ROWS FETCH NEXT pageSizeValue ROWS ONLY';
const COUNT_TOTAL_ARTICLE_CRAWL = 'SELECT COUNT(*) FROM CRAWLER_ARTICLE';
const INSER_ARTICLE_CRAWL = "INSERT INTO CRAWLER_AUDIO (ArticleId, AudioUrl) VALUES ('ArticleIdValue','AudioUrlValue')";
const FIND_AUDIO_ARTICLE_CRAWL = "SELECT AudioUrl FROM CRAWLER_AUDIO WHERE ArticleId='IdValue'";
const INSERT_AUDIO = "INSERT INTO Audio (id,parent,videoId) VALUES ('idValue','parentValue','videoIdValue')";
const SEARCH_THUMB = "SELECT * FROM Audio WHERE parent='parentValue'";

const ERROR_CODE = {
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
const GET_ALL_SUBSCRITION = 'SELECT Subscription FROM Subscription';
const INSERT_SUBSCRITION = "INSERT INTO Subscription (id, subscription) VALUES ('idValue','subscriptionValue')";
const DELETE_SUBSCRIPTION = "DELETE FROM Subscription WHERE id='idValue'";

module.exports = {
	PYTHON_SERVER_URL,
	INSERT_USER_DATA,
	USER_FIND,
	INSERT_ARTICLE,
	GET_MAIN_ARTICLE,
	GET_FEATURED_ARTICLE,
	INSERT_PERSONALIZED_INFORMS,
	COUNT_USERNAME_OR_FBURL,
	COUNT_TOTAL_ARTICLE,
	GET_ARTICLE_AS_PAGE,
	DELETE_ARTICLES,
	UPDATE_ARTICLES,
	FIND_DETAIL_POST,
	GET_FULL_DETAIL_POST,
	FIND_ALL_TOPIC,
	FIND_ARTICLE_AS_TOPIC,
	SEARCH_ARTICLES,
	FIND_ARTICLES_BELONG_IN_LIST_ID,
	FIND_ALL_ARTICLES_CRAWL,
	COUNT_TOTAL_ARTICLE_CRAWL,
	INSER_ARTICLE_CRAWL,
	FIND_AUDIO_ARTICLE_CRAWL,
	ERROR_CODE,
	GET_ALL_SUBSCRITION,
	INSERT_SUBSCRITION,
	DELETE_SUBSCRIPTION,
	INSERT_AUDIO,
	SEARCH_THUMB,
};
