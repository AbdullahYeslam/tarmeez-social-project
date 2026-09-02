const urlParam = new URLSearchParams(window.location.search)
const postID = urlParam.get("postID")



postDetails(postID)
setupUI()

function postDetails(postId){
    loader()
    axios.get(`https://tarmeezacademy.com/api/v1/posts/${postId}`)
    .then((response)=>{
        const postDetails = response.data.data
    
        const profileImg = Object.keys(postDetails.author.profile_image).length === 0 ? "profile.png" : postDetails.author.profile_image // check if user has a profile image
        const theTitle = postDetails.title != null ? postDetails.title : ''

        let editContent='';
        if (currenUser()!=null && postDetails.author.id == JSON.parse(localStorage.getItem("user")).id){
            editContent = `
            <div style="float: right; display:flex">
                <button class="editBtn btn btn-secondary mx-1" onclick="editingPostModal('${encodeURIComponent(JSON.stringify(postDetails))}')">✎</button>
                <button class="deleteBtn btn btn-danger mx-1" onclick="deletePostModal(${postDetails.id})" >🗑️</button>
            </div> `
        }

        let tagContent = '' 
        for (let tag of postDetails.tags){
            tagContent += 
            `<button type="" class="text-white bg-secondary fs-6 rounded-pill px-2 mx-1">${tag.name}</button>`
        }
        
        let commentContent = ''
        for (let comment of postDetails.comments){
            let profileImgCommenter = Object.keys(comment.author.profile_image).length === 0 ? "profile.png" : comment.author.profile_image // check if commenter has a profile image
            commentContent += `
            <div style="background: #D6D6D6; padding:2px">
                <img class="rounded-circle" src="${profileImgCommenter}" alt="" style="width: 35px; height: 35px;">
                <b>@${comment.author.username}</b> <br>
                <p>${comment.body}</p> 
            </div>
            `
        }
        
        document.getElementById("cards-posts").innerHTML = `
                    <div class="card mb-1" style="width: 100%; margin: auto; max-width: 700px; border: none; background: none;">
                         <h2>Post Details</h2> 
                    </div>
                    <div class="card bg-primary-subtle mb-3 shadow" id="${postId}" style="width: 100%; margin: auto; max-width: 700px; max-height: 650px;">
                        <div class="card-header d-flex" style="justify-content: space-between"; >
                            <div onclick="openRandomProfile(${postDetails.author.id})" style='margin-top: auto; cursor: pointer'>
                                <img class="rounded-circle" src="${profileImg}" alt="" style="width: 40px; height: 40px;">
                                <b style="font-size:15px;">${postDetails.author.username}</b>
                            </div>
                             ${editContent}
                        </div>    
                        <div class="card-body" style = "overflow:scroll;">
                            <img src="${postDetails.image}"  class="w-100">
                            <p style="color: rgb(191, 189, 189);">${postDetails.created_at}</p>
                            <h5 class="card-title">${theTitle}</h5>
                            <p class="card-text" style="overflow: scroll; max-height: 50px;">${postDetails.body}</p>
                            <hr>
                            <div id="commentBody">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                                    <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                                </svg>
                                <span>(${postDetails.comments_count}) Comments</span>
                                <span >
                                    ${tagContent}
                                </span>
                                <hr> 
                                <div id="add-comment-div" style="display: flex; justify-content: space-between; border-radius: 8px; ;">
                                    <input type="text" placeholder="Add your comment" id="inputComment" class="bg-primary-subtle" style="width: 100%; height: 30px; border: none;">
                                    <button class="btn btn-outline-primary" onclick="addComment()" style="width: auto; height: 30px; border:none;">send</button>
                                </div>
                            </div> 
                           
                            <div style="width: 100%;" id="comments-div"> 
                                <hr>
                                ${commentContent}
                            </div>
                            
                        </div>
                    </div>
    `
    })
    .catch((e)=>{
        showAlert(`${e.response.data.message}`,"danger")
    })
    .finally(()=>{
        loader(false)
    })
}

function addComment(){
    loader()
    const comment = document.getElementById("inputComment").value
    const url = `https://tarmeezacademy.com/api/v1/posts/${postID}/comments`
    const token = localStorage.getItem("token")

    const params = {"body": comment}
    const headers = {
        "Authorization" : `Bearer ${token}`
    }

    axios.post(url, params, {headers : headers})
    .then((response)=>{
        postDetails(postID)//to reload the page
        setupUI()
        showAlert("Comment Sent!")
    })
    .catch((er)=>{
        showAlert(er.response.data.message,"danger")
    })
    .finally(()=>{
        loader(false)
    })
}



