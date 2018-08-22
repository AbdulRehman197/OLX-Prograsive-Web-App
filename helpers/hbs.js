module.exports = {
    editFunction : function(storyUser,logedUser,storyId,visible = true)  {
        if(storyUser == logedUser){
            if(visible){
            
               return `<a href="/catagery/edit/${{storyId}}" class="btn btn-dark  mb-2">Edit</a>`
            }else {
                return `<a href="/catagery/edit/${{storyId}}"></a>`
            }
        } else {
            return '';
        }
    }
}