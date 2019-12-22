import request from '@/utils/request2'

export function fetchAllUser(query) {
  return request({
    url: '/User',
    method: 'get',
    params: query
  })
}

export function fetchHaveNoChecker() {
  return request({
    url: '/article',
    method: 'get',
    params: { 'Article.status': 0 }
  })
}

export function fetchAllChecker() {
  return request({
    url: '/User',
    method: 'get',
    params: { 'User.permission': 1 }
  })
}

export function distributeChecker(query) {
  return request({
    url: '/Check',
    method: 'post',
    data: query
  })
}

export function changeArticleStatus(articleID, query) {
  return request({
    url: '/article/' + articleID.toString(),
    method: 'put',
    data: query
  })
}

export function fetchAllPassedArticle() {
  return request({
    url: '/article',
    method: 'get',
    params: { 'Article.status': 3 }
  })
}

export function fetchAllTopArticle() {
  return request({
    url: '/article',
    method: 'get',
    params: { 'Article.status': 4 }
  })
}

export function fetchArticle(articleid) {
  return request({
    url: '/article/' + articleid.toString(),
    method: 'get'
  })
}
export function deleteArticle(articleid) {
  return request({
    url: '/article/' + articleid.toString(),
    method: 'delete'
  })
}
export function fetchComment(articleid) {
  return request({
    url: '/comment',
    method: 'get',
    params: { 'Comment.articleid': articleid.toString() }
  })
}
export function fetchAllArticle() {
  return request({
    url: '/article',
    method: 'get'
  })
}

export function updateUser(userid, query) {
  return request({
    url: '/User/' + userid.toString(),
    method: 'put',
    data: query
  })
}

export function fetchAllCheck(checkerid = null) {
  if (checkerid === null) {
    return request({
      url: '/check',
      method: 'get'
    })
  } else {
    return request({
      url: '/check?Check.checkerid=' + checkerid.toString(),
      method: 'get'
    })
  }
}

export function updateCheck(checkid, query) {
  return request({
    url: '/Check/' + checkid.toString(),
    method: 'put',
    data: query
  })
}
