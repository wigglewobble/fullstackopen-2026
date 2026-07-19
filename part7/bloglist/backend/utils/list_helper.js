const dummy=(blogs)=>{
    return 1
}
const totalLikes=(blogs)=>{
    return blogs.reduce((sum,blog)=>sum+blog.likes,0)
}
const favoriteBlog=(blogs)=>{
    return blogs.reduce((favorite,blog)=>{
        return blog.likes>favorite.likes ? blog:favorite
    })
}
const mostBlogs = (blogs) => {

  if (blogs.length === 0) {
    return null
  }

  const authorCounts = {}

  blogs.forEach(blog => {
    const author = blog.author

    authorCounts[author] = (authorCounts[author] || 0) + 1
  })

  let maxAuthor = ''
  let maxBlogs = 0

  for (const author in authorCounts) {
    if (authorCounts[author] > maxBlogs) {
      maxBlogs = authorCounts[author]
      maxAuthor = author
    }
  }

  return {
    author: maxAuthor,
    blogs: maxBlogs
  }
}
const mostLikes=(blogs)=>{
    if(blogs.length===0){
        return null
    }
    const authorLikes={}
    blogs.forEach(blog=>{
        const author=blog.author
        authorLikes[author]=
            (authorLikes[author]||0)+blog.likes
    })
    let maxAuthor=''
    let maxLikes=0
    for(const author in authorLikes){
        if(authorLikes[author]>maxLikes){
            maxLikes=authorLikes[author]
            maxAuthor=author
        }
    }
    return {
        author: maxAuthor,
        likes:maxLikes
    }
}
module.exports={
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}