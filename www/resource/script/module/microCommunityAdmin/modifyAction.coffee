define (require,exports,module) ->
  ->
    #require 'unobtrusive'
    #$.validator.unobtrusive.parse document

    iconBtn = document.getElementById('icon')
    iconFile = document.getElementById('iconFile')
    delBtn = iconBtn.querySelector('i')
    mask = iconBtn.querySelector('.mask')
    bar = iconBtn.querySelector('.progress')
    barCon = bar.querySelector('.progress-bar')
    fileSrc = document.getElementById('fileSrc');
    img = iconBtn.querySelector('img')
    submit = document.getElementById('submit')

    iconBtn.addEventListener 'click', (e)->
      target = e.target
      self = this
      iconFile.click() if target == self.querySelector('img') or target == self
    ,false

    delBtn.addEventListener 'click', ->
      img.src = '';
      mask.classList.add('hidden')
      bar.classList.add('hidden')
      delBtn.classList.add('hidden')
      bar.removeAttribute('style')
    ,false

    iconFile.addEventListener 'change',(e) ->
      #提取file文件
      file = e.target.files[0]
      fr = new FileReader()
      if file
        fr.onload = ->
          #使用上传图片方法
          uploadImg(file,this.result)
          null
        fr.readAsDataURL file
    ,false


    submit.addEventListener 'click', ->
      $ = require('$')
      form = document.querySelector('form')
      $[form.method || 'post'](require('api')['MicroCommunityAdminModify'],
        {
          Id:$('[name="Id"]').val()
          CommunityName:$('[name="CommunityName"]').val()
          Icon:$('[name="Icon"]').val()
          BaseViewCount:$('[name="BaseViewCount"]').val()
          ViewCount:$('[name="ViewCount"]').val()
          IsAnonymous:$('[name="IsAnonymous"]:checked').val()
        }
      ,(data)->
        require('alert')(data['message'],1000,true,true);
        if data['statusCode'] == 200
          $('[name="Id"]').val(data['data']['Id'])
      )
      null
    ,false

    uploadImg = (file,localSource) ->
      require('fileUpload')
        url:require('api').imageUploadUrl('user')
        file:file
        beforeUpload : ->
          img.src = localSource
          mask.classList.remove('hidden');
          bar.classList.remove('hidden');
          #清空上传表单值,使得允许上传同一张图片
          iconFile.value = ''
        onSuccess : (data)->
          fileSrc.value = data['path']
          #列表项进度条的一系列过渡
          bar.style.opacity = '1'
          bar.style.transition = 'opacity 1s ease-in-out'
          bar.style.webkitTransitionProperty = 'opacity'
          bar.style.webkitTransitionDuration = '1s'
          bar.style.webkitTransitionTimingFunction = 'ease-in-out'
          bar.style.opacity = '0'
          #移除进度条,隐藏遮罩
          bar.addEventListener 'transitionend', ->
            bar.classList.add('hidden')
            bar.removeAttribute('style')
            mask.classList.add('hidden')
            #进度条过渡应用
            barCon.setAttribute('aria-valuenow',0)
            barCon.style.width = 0 + '%'
            barCon.querySelector('.sr-only').innerHTML = 0 + '% 完成'
          false
          bar.addEventListener 'webkitTransitionEnd', ->
            bar.classList.add('hidden')
            bar.removeAttribute('style')
            mask.classList.add('hidden')
            #进度条过渡应用
            barCon.setAttribute('aria-valuenow',0)
            barCon.style.width = 0 + '%'
            barCon.querySelector('.sr-only').innerHTML = 0 + '% 完成'
          false
          #delBtn.classList.remove('hidden')
        onProgress : (num)->
          #进度条过渡应用
          barCon.setAttribute('aria-valuenow',num)
          barCon.style.width = num + '%'
          barCon.querySelector('.sr-only').innerHTML = num + '% 完成'
    null