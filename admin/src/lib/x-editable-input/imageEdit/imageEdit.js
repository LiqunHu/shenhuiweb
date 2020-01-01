/**
packInfo editable input.
Internally value stored as {city: "Moscow", street: "Lenina", building: "15"}

@class imageEdit
@extends abstractinput
@final
@example
<a href="#" id="address" data-type="shpackInfoipv" data-pk="1">awesome</a>
<script>
$(function(){
    $('#address').editable({
        url: '/post',
        title: 'Enter city, street and building #',
        value: {
            city: "Moscow",
            street: "Lenina",
            building: "15"
        }
    });
});
</script>
**/
var app;

(function($) {
  "use strict";

  let imageEdit = function(options) {
    this.init("imageEdit", options, imageEdit.defaults);
  };

  // inherit from Abstract input
  $.fn.editableutils.inherit(imageEdit, $.fn.editabletypes.abstractinput);

  $.extend(imageEdit.prototype, {
    /**
    Renders input from tpl

    @method render()
    **/
    render: function() {
      this.$fileinput = this.$tpl.find('input[id="imagefile"]');
      let image = this.$tpl.find('img[id="avatarimg"]');
      this.$fileinput.change(function() {
        let maxsize = 2 * 1024 * 1024; // 2M
        let files = this.files;
        let fileTypes = ["jpg", "jpeg", "png", "gif", "bmp"];
        if (files.length > 0) {
          for (let i = 0; i < files.length; i++) {
            let filename = files[i].name;
            let nameSplit = filename.split(".");
            let postfix = nameSplit[nameSplit.length - 1];
            let fileTypeFlag = "0";
            for (let idx = 0; idx < fileTypes.length; idx++) {
              if (fileTypes[idx] === postfix) {
                fileTypeFlag = "1";
              }
            }
            if (fileTypeFlag === "0") {
              alert("图片文件必须是jpg、jpeg、png、gif、bmp");
              return;
            }
            if (files[i].size > maxsize) {
              alert("最大只允许上传2M的文件");
              return;
            }
            let formData = new FormData();
            formData.append("file", files[i]);

            $.ajax({
              url: "/api/shenhui/shenhuiControl?method=mdupload",
              dataType: "json",
              type: "POST",
              async: false,
              data: formData,
              processData: false, // 使数据不做处理
              contentType: false, // 不要设置Content-Type请求头
              success: function(data) {
                image.attr("src", data.info.uploadurl);
              },
              error: function(response) {
                console.log(response);
              }
            });
          }
        }
      });
      // this.$input = this.$tpl.find('input')

      // this.$tab1 = this.$tpl.find('div[id="dischargePortSel"]')
      // this.$tab2 = this.$tpl.find('div[id="dischargePortInput"]')

      // var dischargePortSel = this.$select.filter('[name="dischargePortSel"]')
      // var data = this.options.source.paras
      // dischargePortSel.select2({
      //   language: 'zh-CN',
      //   tags: false,
      //   width: '240px',
      //   data: data
      // })
    },

    /**
    Default method to show value in element. Can be overwritten by display option.

    @method value2html(value, element)
    **/
    value2html: function(value, element) {
      var showText =
        '<div style="height:30px;"><img style="height:30px;" src="' + value + '"/></div>';
      $(element).html(showText);
      return true;
    },

    /**
    Gets value from element's html

    @method html2value(html)
    **/
    html2value: function(html) {
      /*
        you may write parsing method to get value by element's html
        e.g. "Moscow, st. Lenina, bld. 15" => {city: "Moscow", street: "Lenina", building: "15"}
        but for complex structures it's not recommended.
        Better set value directly via javascript, e.g.
        editable({
            value: {
                city: "Moscow",
                street: "Lenina",
                building: "15"
            }
        });
      */
      return null;
    },

    /**
     Converts value to string.
     It is used in internal comparing (not for sending to server).

     @method value2str(value)
    **/
    value2str: function(value) {
      return value;
    },

    /*
     Converts string to value. Used for reading value from 'data-value' attribute.

     @method str2value(str)
    */
    str2value: function(str) {
      /*
      this is mainly for parsing value defined in data-value attribute.
      If you will always set value by javascript, no need to overwrite it
      */
      return str;
    },

    /**
     Sets value of input.

     @method value2input(value)
     @param {mixed} value
    **/
    value2input: function(value) {
      // var value = this.options.source.data
      // app.mdvalue = value;
      // this.$tpl.find('div[id="avatarimg"]').attr("src", value)
    },

    /**
     Returns value of input.

     @method input2value()
    **/
    input2value: function() {
      let image = this.$tpl.find('img[id="avatarimg"]');
      let url = image.attr("src")
      if(url!='/static/images/base/head.jpg') {
        return url
      } else {
        return ''
      }
      // return app.mdvalue;
    },

    /**
        Activates input: sets focus on the first field.

        @method activate()
       **/
    activate: function() {
      // this.$input.filter('[name="city"]').focus();
    },

    /**
     Attaches handler to submit form in case of 'showbuttons=false' mode

     @method autosubmit()
    **/
    autosubmit: function() {
      this.$input.keydown(function(e) {
        if (e.which === 13) {
          $(this)
            .closest("form")
            .submit();
        }
      });
    }
  });

  imageEdit.defaults = $.extend({}, $.fn.editabletypes.select.defaults, {
    tpl: `<div style="padding-left: 0; height: 60px;">
    <span class="form-group fileupload-button">
        <div style="width: 60px; height: 60px;">
        <img id="avatarimg" src="/static/images/base/head.jpg" style="width: 60px; height: 60px;" alt="Avatar">
        <input id="imagefile" type="file" name="file">
        </div>
    </span>
</div>`,
    inputclass: ""
  });

  $.fn.editabletypes.imageEdit = imageEdit;
})(window.jQuery);
