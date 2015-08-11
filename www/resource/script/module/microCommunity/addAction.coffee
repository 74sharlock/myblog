define (require,exports,module) ->
  maxImageLength = 9
  forumCommentImageList = document.getElementById 'forumCommentImageList'
  li = forumCommentImageList.getElementsByTagName('li')[0]
  leftCount = document.getElementById('leftCount')
  looksBtn = document.getElementById('looksBtn')
  Alert = require('global/alert.js')
  forumCommentImageList.removeChild li

  window.imageUploadList = []

  #更新剩余图片数量
  updateLeftCount = ->
    em = leftCount.querySelector('em')
    count = maxImageLength - forumCommentImageList.getElementsByTagName('li').length
    #如果大于0张则显示剩余数量提示,否则隐藏
    if count == maxImageLength then leftCount.classList.add('hidden') else leftCount.classList.remove('hidden')
    em.innerHTML = count

  #生成Li副本
  getDomClone = (dom, callback) ->
    if Object.prototype.toString.call(dom).indexOf('Element') > 0
      node = dom.nodeName.toLowerCase()
      domClone = document.createElement node
      domClone.innerHTML = dom.innerHTML
      callback(domClone) if callback
      domClone
  ->
    imgUpload = document.getElementById 'imgUpload'
    addImgBtn = document.getElementById 'addImgBtn'

    #上传限制
    addImgBtn.addEventListener 'click', ->
      if window.imageUploadList.length > maxImageLength - 1
        alert('抱歉，最多只能上传' + maxImageLength + '张图片.')
        false
    ,false

    $ = require('$')
    communityId = $("#wsqid").val()
    api = require('api')
    global = require('global')

    $(".looks-block .list-unstyled a").click ->
      require('global/insertAtCursor.js')
      $this = $ this
      $("#content").insertAtCursor($this.data("icon"))

    $("#submitBtn").click ->
      if $.trim($("#content").val()) != ''
        $.post(
          api.wsqTopicAdd(communityId)
          "labels": ""
          "communityId": communityId
          "content": global.htmlEncode($("#content").val())
          "images": window.imageUploadList.join(',')
          (data) ->
            data = JSON.parse(data)
            if not data.ResponseID
              location.href = api.wsqDetailUrl(data.Data.Id)
            else
              alert(data['Message'])
            null
        )
      else
        Alert('主题内容不能为空',2000,true,true);
    #上传图片
    imgUpload.addEventListener 'change',(e)->
      #提取file文件
      file = e.target.files[0]
      fr = new FileReader()
      fr.onload = ->
        #使用上传图片方法
        upLoadImg(file,this.result)
        null
      fr.readAsDataURL file
    ,false

    #载入表情
    looksBtn.addEventListener 'click', ->
      #表情输入框切换class
      looksBlock = document.querySelector('.looks-block');
      looksBlock.classList.toggle('active');
      null
    ,false

    #上传图片方法
    upLoadImg = (file,localSource)->
      imgLi = getDomClone(li)
      bar = imgLi.querySelector('.progress-bar')
      mask = imgLi.querySelector('.mask')
      i = imgLi.querySelector('i')
      url = require('api').imageUploadUrl('user')
      require('global/fileUpload.js')
        url:url
        file:file
        fileSize:3145728
        outOfSize:->
          require('global/alert.js')('您上传的图片太大!', 2000 , true ,true)
        beforeUpload : ->
          #如果是最后一张,隐藏图片选择按钮
          addImgBtn.style.display = 'none' if forumCommentImageList.getElementsByTagName('li').length == maxImageLength - 1
          #图片本地预览列表插入项
          forumCommentImageList.appendChild(imgLi)
          #改变当前预览项的一系列属性
          imgLi.querySelector('img').src = localSource
          imgLi.querySelector('i').classList.add('hidden')
          #更新剩余数量区域
          updateLeftCount()
          #预览项移除按钮事件监听
          imgLi.querySelector('i').addEventListener 'click', ->
            x = 0
            index = x for list in forumCommentImageList.getElementsByTagName('li') when imgLi == forumCommentImageList.getElementsByTagName('li')[x]
            #移除项
            imgLi.parentNode.removeChild(imgLi)
            #更新上传图片队列
            window.imageUploadList.splice(index,1);
            #更新剩余数量区域
            updateLeftCount();
            #如果不是最大长度,让图片选择按钮重现
            addImgBtn.style.display = 'inline-block' if window.imageUploadList.length < maxImageLength
          ,false
          #清空上传表单值,使得允许上传同一张图片
          imgUpload.value = ''
        onSuccess : (data)->
          #列表项进度条的一系列过渡
          barCon = bar.parentNode
          barCon.style.opacity = '1'
          barCon.style.transition = 'opacity 1s ease-in-out'
          barCon.style.webkitTransitionProperty = 'opacity'
          barCon.style.webkitTransitionDuration = '1s'
          barCon.style.webkitTransitionTimingFunction = 'ease-in-out'
          barCon.style.opacity = '0'
          #移除进度条,隐藏遮罩
          barCon.addEventListener 'transitionend', ->
            barCon.parentNode.removeChild(barCon)
            mask.style.display = 'none'
          false
          barCon.addEventListener 'webkitTransitionEnd', ->
            barCon.parentNode.removeChild(barCon);
            mask.style.display = 'none'
          false
          #更新图片上传队列
          window.imageUploadList.push(data['path'])
          #更新上传图片队列
          updateLeftCount()
          #显示移除按钮
          i.classList.remove('hidden')
        onProgress : (num)->
          #进度条过渡应用
          bar.setAttribute('aria-valuenow',num)
          bar.style.width = num + '%'
          bar.querySelector('.sr-only').innerHTML = num + '% 完成'
        onError:->
          Alert('上传失败,请稍后再试.',2000,true,true);
          i.classList.remove('hidden')

    null