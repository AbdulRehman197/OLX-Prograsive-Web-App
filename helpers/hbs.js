module.exports = {
    editFunction : function(productUser,logedUser,productId,visible = true)  {
        if(productUser == logedUser){
    
             if(visible){
            
                return '<a style="float:right" href="/catagery/edit/'+productId+'"><i class="fas fa-pen fa-lg"></i></a>'
             }else {
                return '<a  href="/catagery/edit/'+productId+'"></a>'
             }
         } else {
            return '';
         }
    },
    deleteFunction : function(productUser,logedUser,visible = true)  {
        if(productUser == logedUser){
    
             if(visible){
            
                return '<i class="fas fa-trash"></i>'
                
             }else {
                return '';
             }
         } else {
            return '';
         }
    }
}