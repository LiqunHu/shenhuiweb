<template>
  <!-- begin #page-container -->
    <div>
        <common-header></common-header>
        <div class="container">
          <div class="vertical-box color-salve">
            <div class="vertical-box-column width-250 color-gray show-pannel">
              <p><b>律所动态</b></p>
              <div class="media">
                <img src="/gallery-2.jpg" alt="" class="media-object">
              </div>
            </div>
            <div class="vertical-box-column">
              <ul class="list-group list-group-lg no-radius list-info">
                  <li v-for="d in data.dynamic" :key="d.article_id" :class="'list-group-item style'+d.article_id%5">
                      <div class="info-data">
                          <span class="info-time">{{d.created_at}}</span>
                          <h5 class="info-title">
                              <nuxt-link :to="'/dynamicdetail/'+d.article_id">{{d.article_title}}</nuxt-link>
                          </h5>
                      </div>
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
    let { data } = await request.post(apiUrl + 'getDynamic', {})
    return { data: data.info.data }
  },
  head () {
    return {
      title: '上海市申汇律师事务所动态',
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

.list-info {
  margin-bottom: 0;
  border-top: 1px solid #e2e7eb;
  border-bottom: 1px solid #e2e7eb;
}
.list-info > li.list-group-item + li.list-group-item {
  border-top: 1px solid #e2e7eb;
}
.list-info > li.list-group-item {
  -webkit-border-radius: 0;
  -moz-border-radius: 0;
  border-radius: 0;
  border: none;
  padding: 15px 15px 15px 20px;
  position: relative;
}
.list-info > li.list-group-item.style0:before {
  background-color: #242a30;
}
.list-info > li.list-group-item.style1:before {
  background-color: #348fe2;
}
.list-info > li.list-group-item.style2:before {
  background: #00acac;
}
.list-info > li.list-group-item.style3:before {
  background-color: #f59c1a;
}
.list-info > li.list-group-item.style4:before {
  background-color: #ff5b57;
}
.list-info > li.list-group-item:before {
  content: '';
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 5px;
  background: #fff;
}
.list-info .info-time {
  float: right;
  font-size: 11px;
  color: #c8cccf;
  margin-left: 10px;
}
.list-info .info-title {
  margin-top: 3px;
  margin-bottom: 3px;
  line-height: 20px;
}
.list-info .info-title a {
  color: #242a30;
}
</style>

