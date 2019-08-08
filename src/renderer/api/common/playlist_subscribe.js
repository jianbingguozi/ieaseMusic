import { post } from 'utils/request';
// 收藏与取消收藏歌单
export default query => {
    const path = `/weapi/playlist/${query.t}`;
    query.t = query.t == 1 ? 'subscribe' : 'unsubscribe';
    const data = {
        id: query.id
    };
    return post(path, data);
};
