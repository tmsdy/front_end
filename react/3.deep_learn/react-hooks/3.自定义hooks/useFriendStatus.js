import { useState, useEffect } from 'react';

function useFriendStatus(friendID) { // 判断好友是否在线
    const [isOnline, setIsOnline] = useState(null);

    function handleStatusChange(status) {
        setIsOnline(status.isOnline);
    }

    useEffect(() => {
        ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
        return () => { // 如果是componentWillUnmount当friendID改变时就gg了
            ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
        };
    });

    return isOnline;
}
// 这时候FriendStatus组件就可以简写为：
function FriendStatus(props) {
    const isOnline = useFriendStatus(props.friend.id);

    if (isOnline === null) {
        return 'Loading...';
    }
    return isOnline ? 'Online' : 'Offline';
}
// 简直Perfect！假如这个时候我们又有一个朋友列表也需要显示是否在线的信息：
function FriendListItem(props) {
    const isOnline = useFriendStatus(props.friend.id);

    return (
        <li style={{ color: isOnline ? 'green' : 'black' }}>
            {props.friend.name}
        </li>
    );
}