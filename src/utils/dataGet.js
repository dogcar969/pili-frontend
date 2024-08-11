// 所有的脚本都应用于浏览器F12 控制台

// 获取已经加载出来的评论
let comments = document.querySelectorAll(".reply-content")
comments =[...comments]
comments.map(item=>item.innerText)


// 获得弹幕
let bulletchat = document.querySelectorAll('.dm-info-row')
bulletchat = [...bulletchat]
bulletchat = bulletchat.map(item=>item.children)
bulletchat = bulletchat.map(item=>[...item])
bulletchat = bulletchat.map(item=>item.slice(0,3))
bulletchat.map(item=>item.map(i=>i.innerText))