import { getAccessToken } from '../utils/authority.js'

const ACCESS_TOKEN_KEY = "lGVSWkkXf8AMCWs8NxIsFHFjIKBrZzUq";

export const useFetchGet = (url) => {
    console.log(process.env.ACCESS_TOKEN_KEY)
    return fetch(url,
        {
            headers: {Authorization: `Bearer ${getAccessToken(process.env.ACCESS_TOKEN_KEY)}`}
        })
        .then(async (res) => {
            const {data, total} = await res.json()
            return { data, total, error: null}
        })
        .catch(err => {
            return { data: null, total: 0, error: err}
        })
}

export default {useFetchGet}