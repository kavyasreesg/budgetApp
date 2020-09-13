//Refer PDF at Video-77
//budgetManager (IIFE) hidden from other codes
//Module pattern returns all the pattern (object) that can be public.
//so only publicTest is only accessible from outside.
//Also publicTest can access because of closures since inner Function has access to outer function even though outer function variables and properties has returned.
var budgetController = (function(){
    var x = 30;
    var add = function(a)//first class functions
    {
        return x+a;
    }
    return {
        publicTest : function(b){
            return add(b);
        }
    }
})();

var UIController = (function(){

})();

var appController = (function(budgetCtrl,UICtrl){
    var z = budgetCtrl.publicTest(5);
    return {
            anotherPublic : function(){
                console.log(z);
            }
    }
    
})(budgetController,UIController);

appController.anotherPublic();