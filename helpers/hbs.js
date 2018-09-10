module.exports = {
    editFunction : function(productUser,logedUser,productId,visible = true)  {
        if(productUser == logedUser){
    
             if(visible){
            
                return '<a style="float:right" href="api/catagery/edit/'+productId+'"><i class="fas fa-pen fa-lg"></i></a>'
             }else {
                return '<a  href="/api/catagery/edit/'+productId+'"></a>'
             }
         } else {
            return '';
         }
    },
    getFavorite:function(items, adId){

console.log('checking')
        return items.map(function(item){
            return item.toHexString()
        }).indexOf(adId) == -1 ? "heart" : "'heart favorited'";

    },
    deleteFunction : function(productUser,logedUser,visible = true)  {
        if(productUser == logedUser){
    
             if(visible){
            
                return '<button type="submit" style="border:none"><i class="fas fa-trash"></i></button>'
                
             }else {
                return '';
             }
         } else {
            return '';
         }
    }
}