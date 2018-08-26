module.exports = {
    editFunction : function(productUser,logedUser,productId,visible = true)  {
        if(productUser == logedUser){
            if(visible){
            
               return `<a href="/catagery/edit/${{productId}}" class="btn btn-dark  mb-2">Edit</a>`
            }else {
                return `<a href="/catagery/edit/${{productId}}"></a>`
            }
        } else {
            return 'Abdulrehman';
        }

    }
}