import React, { useEffect, useState } from 'react';

export default (props) => {
    const [article, setArticle] = useState({
        title: 'title111',
        content: 'content222',
        name: 'name333'
    })
    useEffect(() => {
        setTimeout(() => {
            setArticle({ // 这样set name就丢了
                title: 'title222',
                content: 'content222'
            })
        }, 1000);
    }, [])

    return (
        <div>
            {article.title}
            {article.content}
            {article.name}
        </div>
    )
}