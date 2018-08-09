/**
packInfo editable input.
Internally value stored as {city: "Moscow", street: "Lenina", building: "15"}

@class mavonEdit
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
import Vue from 'vue'
import { mavonEditor } from 'mavon-editor'
var app

(function ($) {
  'use strict'

  let mavonEdit = function (options) {
    this.init('mavonEdit', options, mavonEdit.defaults)
  }

  // inherit from Abstract input
  $.fn.editableutils.inherit(mavonEdit, $.fn.editabletypes.abstractinput)

  $.extend(mavonEdit.prototype, {
    /**
    Renders input from tpl

    @method render()
    **/
    render: function () {
      app = new Vue({
        el: '#editormain',
        components: {
          mavonEditor
          // or 'mavon-editor': mavonEditor
        },
        data: function () {
          return {
            mdvalue: ''
          }
        }
      })
      // this.$select = this.$tpl.find('select')
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
    value2html: function (value, element) {
      var showText = '详情'
      $(element).html(showText)
      return true
    },

    /**
    Gets value from element's html

    @method html2value(html)
    **/
    html2value: function (html) {
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
      return null
    },

    /**
     Converts value to string.
     It is used in internal comparing (not for sending to server).

     @method value2str(value)
    **/
    value2str: function (value) {
      return value
    },

    /*
     Converts string to value. Used for reading value from 'data-value' attribute.

     @method str2value(str)
    */
    str2value: function (str) {
      /*
      this is mainly for parsing value defined in data-value attribute.
      If you will always set value by javascript, no need to overwrite it
      */
      return str
    },

    /**
     Sets value of input.

     @method value2input(value)
     @param {mixed} value
    **/
    value2input: function (value) {
      // var value = this.options.source.data
      app.mdvalue = value
    },

    /**
     Returns value of input.

     @method input2value()
    **/
    input2value: function () {
      return app.mdvalue
    },

    /**
        Activates input: sets focus on the first field.

        @method activate()
       **/
    activate: function () {
      // this.$input.filter('[name="city"]').focus();
    },

    /**
     Attaches handler to submit form in case of 'showbuttons=false' mode

     @method autosubmit()
    **/
    autosubmit: function () {
      this.$input.keydown(function (e) {
        if (e.which === 13) {
          $(this).closest('form').submit()
        }
      })
    }
  })

  mavonEdit.defaults = $.extend({}, $.fn.editabletypes.select.defaults, {
    tpl: '<div id="editormain" style="width: 800px;">' +
         '<mavon-editor ref=me v-model="mdvalue"></mavon-editor>' +
         '</div>',
    inputclass: ''
  })

  $.fn.editabletypes.mavonEdit = mavonEdit
}(window.jQuery))
