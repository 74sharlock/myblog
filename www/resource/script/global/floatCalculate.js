define(function(require,exports,module){
    function floatCalculate() {
    }

   floatCalculate.prototype.floatMul = function (arg1, arg2) {
        //乘法运行
        var m = 0, s1 = arg1.toString(), s2 = arg2.toString(),self=this;
        try {
            m += s1.split(".")[1].length;
        } catch (e) {
        }
        try {
            m += s2.split(".")[1].length;
        } catch (e) {
        }
        return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
    };

   floatCalculate.prototype.floatAdd =function(arg1, arg2) {
            //加法运行
            var r1, r2, that = this;
            try {
                r1 = arg1.toString().split(".")[1].length;
            } catch (e) {
                r1 = 0;
            }
            try {
                r2 = arg2.toString().split(".")[1].length;
            } catch (e) {
                r2 = 0;
            }
            var m = Math.pow(10, Math.max(r1, r2));
       //动态控制精度长度  
            //var n = (r1 >= r2) ? r1 : r2;
            //return (arg1*m+arg2*m)/m
            return ((that.floatMul(arg1, m) + that.floatMul(arg2, m)) / m).toFixed(2);
        };

   floatCalculate.prototype.floatSub =function(arg1, arg2) {
           //减法运行
           var r1, r2,self=this;
           try {
               r1 = arg1.toString().split(".")[1].length;
           } catch (e) {
               r1 = 0;
           }
           try {
               r2 = arg2.toString().split(".")[1].length;
           } catch (e) {
               r2 = 0;
           }
           var m = Math.pow(10, Math.max(r1, r2));
           //动态控制精度长度  
          // var n = (r1 >= r2) ? r1 : r2;
           //return ((arg1*m-arg2*m)/m).toFixed(n);
           return ((self.floatMul(arg1, m) - self.floatMul(arg2, m)) / m).toFixed(2);
   };
  
   floatCalculate.prototype.floatDiv = function (arg1, arg2) {
        //除法运行
       var t1 = 0, t2 = 0, r1, r2, self=this;
        try {
            t1 = arg1.toString().split(".")[1].length;
        } catch (e) {
        }
        try {
            t2 = arg2.toString().split(".")[1].length;
        } catch (e) {
        }
        with (Math) {
            r1 = Number(arg1.toString().replace(".", ""));
            r2 = Number(arg2.toString().replace(".", ""));
            return self.floatMul((r1 / r2), pow(10, t2 - t1));
        }
   };

   floatCalculate.prototype.intTofloat = function (arg1) {
       var self = this;
       return self.floatFormat(self.floatDiv(arg1, 100));
   };

    //动态控制精度长度为两位小数
   floatCalculate.prototype.floatFormat = function(num) {
       var r1 = 0, r2 = 0;
       try {
           r1 = num.toString().split(".")[0];
           r2 = num.toString().split(".")[1].length;
           if (r2 === 1) {//num为一位小数
               num = r1 + '.' + num.toString().split(".")[1] + '0';
           } else if(r2 === 2) {//num为两位小数
           }else if(r2>2)//num为三位或者以上小数
           {
               num = r1 + '.' + num.toString().split(".")[1].substr(0,2);
           }
       } catch (e) {
           num = r1 + '.00';
       }
       return num;
   }

   return new floatCalculate();
});