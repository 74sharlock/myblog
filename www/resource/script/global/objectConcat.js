define(function(){
    return function(target, source){

        var toString = Object.prototype.toString,
            key;
        if(toString.call(target) === '[object Object]' && toString.call(source) === '[object Object]'){
            for (key in source){
                if(key in target) {
                    target[ key ] += source[ key ];
                } else {
                    target[ key ] = source[ key ];
                }
            }
        }
        return target;
    };
});