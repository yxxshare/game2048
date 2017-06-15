var app = getApp()
console.log('app : ', app);

var eventBak = {};
var level = 4;
var iArr = [];//二维数组
var traceKey = 1;
var space = 2;

var AllItemArr = [];
for (var i = 0; i<level; i++) {
    var jArr = [];
    for (var j=0; j<level; j++) {
        var _item = {value: 0, pk:traceKey};
        jArr.push(_item);
        AllItemArr.push(_item);
        traceKey++;
    }
    iArr.push( jArr );   
}
// AllItemArr[0].value = 2;//第一个元素
console.log('first item : ',AllItemArr[0]);

var removeOldValue = function(){
    for (var i=0,len=AllItemArr.length; i<len; i++) {
        delete AllItemArr[i].oldValue;
    }
}
var getZeroList = function() {
    var zeroList = [];
    for (var i=0,len=AllItemArr.length; i<len; i++) {
        var _item = AllItemArr[i]; 
        if ( 0 == _item.value) {
            zeroList.push(_item);
        }
    }
    return zeroList;
}
var sort = function(list, rule){
	var t = 0;
	var times = 1;
	for (var i=0, iLen=list.length-1; i<iLen; i++) {
		for (var j=0, jLen=list.length-times; j<jLen; j++) {
			t++;
			var a = list[j];
			var b = list[j+1];
			var result = rule.call(rule, a, b);
			if ( result ) {
				list[j] = b;
				list[j+1] = a;
			}
			
		}
		times++;
	}
	//console.log( 't : ', t );遍历次数
	return list;
}
var upAndDownSort = function(rule){
    for(var i=0; i<level; i++){
        var list = [];  
        for (var j=0; j<level; j++) {
            var eItem = iArr[j][i];
            list.push(eItem);
        }
        list = sort(list, rule);
        for (var j=0; j<level; j++) {
            iArr[j][i] = list[j];                
        }

    }
}
var leftAndRightSort = function(rule){
    for (var i=0; i<level; i++) {
        var list = iArr[i];
        list = sort(list, rule);
        iArr[i] = list;
    }
}
var aceSort = function( a, b){
    if ( a.value == b.value && 0 != a.value && !a.oldValue && !b.oldValue) {
        b.oldValue = b.value;
        b.value = b.value *2;
        a.value = 0;
    }

    if ( 0 != a.value && 0 == b.value) {
        return true;
    } else if (b.value == a.oldValue) {
        return true;
    }
};
var descSort = function( a, b){

    if ( a.value == b.value && 0 != a.value && !a.oldValue && !b.oldValue) {
        a.oldValue = a.value;
        a.value = a.value *2;
        b.value = 0;
    }

    if ( 0 == a.value && 0 != b.value) {
        return true;
    } else if (a.value == b.oldValue) {
        return true;
    }
};
var mpSet = {
    up : function(){
        upAndDownSort(descSort);
    },
    down : function() {
        upAndDownSort(aceSort);
    },
    left : function() {
        leftAndRightSort(descSort);
    },
    right : function() {
        leftAndRightSort(aceSort);
    }
}
var pageObj = {
    data : {
        iArr : iArr
    },
    onReady : function () {
      this.addPiece();
    },
    addPiece : function (direction) {
        var win = this;
        
        var zeroList = getZeroList();        
        var maxNum = zeroList.length;
        if ( maxNum > 0 ) {
            var _index = Math.floor( Math.random()*maxNum );
            var eItem = zeroList[_index];
            eItem.value += space;
            this.setData({
                iArr : iArr
            });
        } else {
            console.log('游戏结束');
        }        
    },
    myTouchmove:function(e){
        console.log('--------myTouchmove : ',e);
    },
    myTap:function(e){
        console.log('----------myTap : ',e);
    },
    myLongTap:function(e){
        console.log('-----------myLongTap : ',e);
    },
    tapName : function(e) {
        console.log('----------tapName : ',e);
    },
    mylong : function (e) {
        console.log('------------mylong : ',e);
    },
    touchmoveHandler : function ( ev ) {
        eventBak.em = true;
    },
    touchstartHandler : function (e) {
        var touchItem = e.changedTouches[0];        
        eventBak = touchItem;
        eventBak.em = false;
    },
    touchendHandler : function (e) {
        if ( eventBak.em ) {
            var touchItem = e.changedTouches[0];
            var xm = touchItem.pageX - eventBak.pageX;
            var ym = touchItem.pageY - eventBak.pageY;

            var absXm = Math.abs( xm );
            var absYm = Math.abs( ym );  

            var actionType = 'up';
            if ( absXm > absYm ) {
                if ( xm > 0 ) {
                    actionType = 'right';
                } else {
                    actionType = 'left';
                }
            } else {
                if ( ym > 0 ) {
                    actionType = 'down';
                } 
            }
            mpSet[actionType]();
            removeOldValue();

            //this.setData({
                //iArr : iArr
           //}); 
            var win = this;
            setTimeout(function(){
                win.addPiece('down');
            },50);
        }
    }
};
Page(pageObj);
// pageObj.addPiece();//默认添加一个