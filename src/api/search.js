import request from '@/utils/request'

/**
 * 获取搜索联想建议
 */
export const getSearchSuggestions = q => {
  return request({
    methods: 'GET',
    url: '/v1_0/suggestion',
    params: {
      q
    }
  })
}

/**
 * 获取搜索结果/v1_0/search
 */
export const getSearchResult = params => {
  return request({
    methods: 'GET',
    url: '/v1_0/search',
    params
  })
}
