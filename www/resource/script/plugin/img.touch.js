define(function(require,exports,module){
    var $ = require('jquery');

    return (function($){

        /* Private variables */
        var overlay = $('<div id="galleryOverlay">'),
            slider = $('<div id="gallerySlider">'),
            overlayVisible = false;
        /* Creating the plugin */

        $.fn.touchTouch = function(){

            var placeholders = $([]),
                index = 0,
                allitems = this,
                items = allitems;
            // Appending the markup to the page
            overlay.hide().appendTo('body');
            slider.appendTo(overlay);
            // Creating a placeholder for each image
            items.each(function(){
                placeholders = placeholders.add($('<div class="placeholder relative">'));
            });

            // Hide the gallery if the background is touched / clicked
            slider.append(placeholders).on('click',function(e){

                if(!$(e.target).is('a.pull-right,i,.pic-comment')){
                    hideOverlay();
                }
            });

            // Listen for touch events on the body and check if they
            // originated in #gallerySlider img - the images in the slider.
            $('body').on('touchstart', '#gallerySlider img', function(e){

                var touch = e.originalEvent,
                    startX = touch.changedTouches[0].pageX;
                slider.on('touchmove',function(e){
                    e.preventDefault();
                    touch = e.originalEvent.touches[0] ||e.originalEvent.changedTouches[0];
                    if(touch.pageX - startX > 10){
                        slider.off('touchmove');
                        showPrevious();
                    }else if (touch.pageX - startX < -10){
                        slider.off('touchmove');
                        showNext();
                    }
                });


            }).on('touchend',function(e){
                var $target = $(e.target),
                    $span,
                    praiseCount,
                    id;
                //点赞
                if($target.hasClass('praise') || $target.parents('.praise')[0]){//只有点击到点赞区域,才会触发下面的事件
                    //如果是点赞区域子项,定位到父级
                    if($target.parents('.praise')[0]){
                        $target = $target.parents('.praise');
                    }
                    //如果是已经赞过,返回之
                    if($target.find('i').hasClass('praised')){
                        return false;
                    }
                    id = $target.data('id');
                    $span = $target.find('span');
                    //取得当前点赞值
                    if($span[0]){
                        praiseCount = parseInt($span.text(),10);
                    }
                    if(typeof praiseCount === 'number'){
                        //点赞+1
                        praiseCount = praiseCount + 1;
                        //尝试本地存储.为了防止部分手机浏览器本地存储功能异常,try catch一下
                        try{
                            window.localStorage.setItem('praise'+id,praiseCount);
                        } catch (e){
                            //如果异常,弹个窗让检查手机
                            if(e.toLowerCase().indexOf('quotaexceedederror') >= 0){
                                alert('点赞失败.您的手机似乎不支持本地存储,请检查是否本地存储已满或者浏览器关闭了本地存储功能.');
                            }
                            return false;
                        }
                        //点赞+1写入dom
                        $span.html(praiseCount);
                        //点赞按钮加入已经点赞样式
                        $target.find('i').addClass('praised');
                        //后台点赞数+1请求
                        require('global/praise')(id);
                    }
                    return false;
                }
                slider.off('touchmove');
            });
            // Listening for clicks on the thumbnails
            items.on('click', function(e){

                e.preventDefault();

                var $this = $(this),
                    galleryName,
                    selectorType,
                    $closestGallery = $this.parent().closest('[data-gallery]');

                // Find gallery name and change items object to only have
                // that gallery

                //If gallery name given to each item
                if ($this.attr('data-gallery')) {
                    galleryName = $this.attr('data-gallery');
                    selectorType = 'item';
                    //If gallery name given to some ancestor
                } else if ($closestGallery.length) {
                    galleryName = $closestGallery.attr('data-gallery');
                    selectorType = 'ancestor';
                }

                //These statements kept seperate in case elements have data-gallery on both
                //items and ancestor. Ancestor will always win because of above statments.
                if (galleryName && selectorType == 'item') {
                    items = $('[data-gallery='+galleryName+']');
                } else if (galleryName && selectorType == 'ancestor') {
                    //Filter to check if item has an ancestory with data-gallery attribute
                    items = items.filter(function(){
                        return $(this).parent().closest('[data-gallery]').length;
                    });

                }

                // Find the position of this image
                // in the collection
                index = items.index(this);
                showOverlay(index);
                showImage(index);

                // Preload the next image
                preload(index+1);

                // Preload the previous
                preload(index-1);
                return false;
            });

            // Listen for arrow keys
            $(window).bind('keydown', function(e){

                if (e.keyCode == 37) {
                    showPrevious();
                }

                else if (e.keyCode==39) {
                    showNext();
                }

                else if (e.keyCode==27) { //esc
                    hideOverlay();
                }

            });


            /* Private functions */
            function showOverlay(index){
                // If the overlay is already shown, exit
                if (overlayVisible){
                    return false;
                }

                // Show the overlay
                overlay.show();

                setTimeout(function(){
                    // Trigger the opacity CSS transition
                    overlay.addClass('visible');
                }, 100);

                // Move the slider to the correct image
                offsetSlider(index);

                // Raise the visible pull-leftag
                overlayVisible = true;
            }

            function hideOverlay(){

                // If the overlay is not shown, exit
                if(!overlayVisible){
                    return false;
                }

                // Hide the overlay
                overlay.hide().removeClass('visible');
                overlayVisible = false;

                //Clear preloaded items
                $('.placeholder').empty();

                //Reset possibly filtered items
                items = allitems;
            }

            function offsetSlider(index){
                // This will trigger a smooth css transition
                slider.css('left',(-index*100)+'%');
            }

            // Preload an image by its index in the items array
            function preload(index){
                setTimeout(function(){
                    showImage(index);
                }, 1000);
            }

            // Show image in the slider
            function showImage(index){
                // If the index is outside the bonds of the array
                if(index < 0 || index >= items.length){
                    return false;
                }

                // Call the load function with the href attribute of the item
                loadImage(items.eq(index).find('img').attr('src'), function(){
                    // //console.log()
                    // var picView='<img src="'++'">'
                    var comments="<div class='praise'  data-id='"+items.eq(index).data("id")+"'><i class='fa fa-thumbs-up' ></i><span> "+items.eq(index).data("praise")+"</span></div></div>",
                        storage = window.localStorage,
                        commentscon = "<div class='pic-comment pull-right'>";
                    if($.type(parseInt(items.eq(index).data("comments"),10)) === 'number'){
                        commentscon = "<div class='pic-comment pull-right'><a class='pull-right' href='" + items.eq(index).data("counturl") + "'><i class='fa fa-comment'></i>" + items.eq(index).data("count") + "</a>";
                    }


                    var picTitle = "<div class='pic-title clearfix'><div class='pull-left pic-title-name'><h4>" + items.eq(index).data("name") + "</h4>" + (items.eq(index).data("summary") ? "<h5>" + items.eq(index).data("summary") + "</h5>" : "") + "<p>" + items.eq(index).data("date") + "</p></div>" + commentscon + comments + "</div>"
                    placeholders.eq(index).html(this);
                    placeholders.eq(index).append(picTitle);
                    placeholders.each(function() {
                        if (window.localStorage.getItem("praise" + $(this).find(".praise").data("id"))) {
                            $(this).find(".praise i").addClass("praised");
                            if (parseInt(window.localStorage.getItem("praise" + $(this).find(".praise").data("id"))) > parseInt($(this).find(".praise span").text())) {
                                $(this).find(".praise span").text(window.localStorage.getItem("praise" + $(this).find(".praise").data("id")));
                            }

                        }
                    });

                });
            }

            // Load the image and execute a callback function.
            // Returns a jQuery object

            function loadImage(src, callback){
                var img = $('<img>').on('load', function(){
                    callback.call(img);
                });
                img.attr({
                    'src':src,
                });
                // img.attr('id',id);
            }

            function showNext(){

                // If this is not the last image
                if(index+1 < items.length){
                    index++;
                    offsetSlider(index);
                    preload(index+1);
                }

                else{
                    // Trigger the spring animation
                    slider.addClass('rightSpring');
                    setTimeout(function(){
                        slider.removeClass('rightSpring');
                    },500);
                }
            }

            function showPrevious(){

                // If this is not the first image
                if(index>0){
                    index--;
                    offsetSlider(index);
                    preload(index-1);
                }

                else{
                    // Trigger the spring animation
                    slider.addClass('leftSpring');
                    setTimeout(function(){
                        slider.removeClass('leftSpring');
                    },500);
                }
            }
        };

    })($);
});