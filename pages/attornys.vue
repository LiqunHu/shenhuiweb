<template>
  <!-- begin #page-container -->
    <div>
        <common-header></common-header>
        <div class="container">
          <div class="vertical-box color-salve">
            <div class="vertical-box-column width-250 color-gray show-pannel">
              <p><b>律师介绍</b></p>
              <div class="media">
                <img src="/gallery-2.jpg" alt="" class="media-object">
              </div>
            </div>
            <div class="vertical-box-column">
              <ul class="map">
                  <li v-for="a in data.attornys" :key="a.article_id">
                      <nuxt-link :to="'/attornydetail/'+a.article_id">
                        <img class="header-img" :src="a.article_img">
                        <p class="name"> 姓名: {{a.article_title}}</p>
                      </nuxt-link>
                  </li>
              </ul> 
            </div>
           </div>
        </div>
        <page-footer></page-footer>
    </div>
    <!-- end #page-container -->
</template>

<script>
import request from '~/plugins/request'
import CommonHeader from '~/components/CommonHeader.vue'
import PageFooter from '~/components/PageFooter.vue'

const apiUrl = '/api/shenhui/shenhuiControl?method='

export default {
  async asyncData({ params }) {
    let { data } = await request.post(apiUrl + 'getAttornys', {})
    return { data: data.info.data }
  },
  head () {
    return {
      title: '上海市申汇律师事务所律师',
    }
  },
  components: {
    CommonHeader,
    PageFooter
  },
  mounted() {
  },
}
</script>
<style scoped>
.vertical-box {
  display: table;
  table-layout: fixed;
  border-spacing: 0;
  height: 100%;
  width: 100%;
}
.vertical-box-column {
  display: table-cell;
  vertical-align: top;
  height: 100%;
}
.width-250 {
  width: 250px !important;
}
.color-salve {
  background: #f0f3f4 !important;
}
.color-gray {
  background: #d9e0e7;
}
.show-pannel {
  border-radius: 3px;
  min-height: 400px;
  padding: 15px !important;
}
.show-pannel p {
  font-size: 17px;
}
.media-object {
  width: 230px;
}

.map {
  position: unset;
  padding: 20px 10px;
}

.map li {
  border: 1px solid #ccd0d4;
  width: 200px;
  height: 240px;
  overflow: hidden;
  float: left;
  margin-left: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  position: relative;
}

.map li p {
  margin-left: 10px;
  color: #999;
  line-height: 22px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.map sup {
  font-size: smaller;
}

.map li div.result_i {
  position: absolute;
  top:0;
}

.map li img {
  width: 100%;
  height: 200px;
  transition: all 1s;
  -webkit-transition: all 1s;
  -moz-transition: all 1s;
  -ms-transition: all 1s;
  -o-transition: all 1s;
}

.map li:hover div.result_i {
  z-index: 2;
  background: rgba(189, 188, 188, 0.3);
  filter: alpha(Opacity=80);
  -moz-opacity: 0.8;
  opacity: 0.8;
}

.map .header-img {
  position: absolute;
  width:100%;
  height:200px;
}

.map .name {
  position: absolute;
  bottom:-3px;
  font-size: 17px;
}
</style>

